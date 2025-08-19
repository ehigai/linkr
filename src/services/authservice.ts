import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from '../constants/httpStatusCode';
import User, { type UserDocument } from '../models/User';
import type { CreateAccountPayload, LoginPayload } from '../types';
import { appAssert } from '../utils/apperror';
import bcrypt from 'bcrypt';
import Session from '../models/Session';
import { fiveDaysFromNow } from '../utils/date';
import { refreshTokenSignOptions, signToken, verifyToken } from '../utils/jwt';
import { shouldExtendSession } from '../utils/utils';

export const createAccount = async (
  payload: CreateAccountPayload
): Promise<UserDocument> => {
  const { email, password, firstName, lastName } = payload;

  const existingUser = await User.findOne({ email });
  appAssert(!existingUser, CONFLICT, 'User Already exists');

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // create account
  return await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
};

export const login = async ({ password, email, userAgent }: LoginPayload) => {
  // validate password
  const user = await User.findOne({ email });
  appAssert(user, UNAUTHORIZED, 'Invalid email or password');
  const isValid = await bcrypt.compare(password, user.password);
  appAssert(isValid, UNAUTHORIZED, 'Invalid email or password');

  // create session
  const session = await Session.create({
    userAgent,
    expiresAt: fiveDaysFromNow(),
    userId: user._id,
  });
  appAssert(session, INTERNAL_SERVER_ERROR, 'An error occured');

  // sign tokens
  const refreshToken = signToken(
    { sessionId: session._id, tokenType: 'refresh' },
    refreshTokenSignOptions
  );
  const accessToken = signToken({
    userId: user._id,
    sessionId: session._id,
    tokenType: 'access',
  });

  return { accessToken, refreshToken };
};

export const logout = async (accessToken: string) => {
  const result = verifyToken(accessToken);
  if ('error' in result) {
    appAssert(false, UNAUTHORIZED, 'Logout error');
  }
  await Session.findOneAndDelete({ _id: result.payload.sessionId });
};

export const refresh = async (refreshToken: string) => {
  const result = verifyToken(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });

  if ('error' in result) {
    appAssert(false, UNAUTHORIZED, 'Invalid refresh token');
  }
  const { payload } = result;

  const session = await Session.findOne({ _id: payload.sessionId });
  appAssert(
    session && session.expiresAt.getTime() > Date.now(),
    UNAUTHORIZED,
    'Session expired or not found'
  );

  if (shouldExtendSession(session.expiresAt)) {
    await Session.findByIdAndUpdate(
      { _id: session._id },
      { expiresAt: fiveDaysFromNow() }
    );
  }

  // Update refresh token span along with session span
  const newRefreshToken = shouldExtendSession(session.expiresAt)
    ? signToken({ sessionId: session._id, tokenType: 'refresh' })
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
    tokenType: 'access',
  });

  return { accessToken, newRefreshToken };
};
