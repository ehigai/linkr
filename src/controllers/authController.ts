import {
  INTERNAL_SERVER_ERROR,
  OK,
  UNAUTHORIZED,
} from '../constants/httpStatusCode';
import { createAccount, login, logout, refresh } from '../services/authservice';
import { appAssert } from '../utils/apperror';
import asyncHandler from '../utils/asyncHandler';
import {
  accessTokenCookieOptions,
  clearAuthCookies,
  refreshTokenCookieOptions,
  setAuthCookies,
} from '../utils/cookie';
import { loginSchema, registerSchema } from '../utils/schema';

export const registerController = asyncHandler(async (req, res, next) => {
  const { email, firstName, lastName, userAgent, password } =
    registerSchema().parse({
      ...req.body,
      userAgent: req.headers['user-agent'],
    });

  // create account
  const user = await createAccount({
    email,
    firstName,
    lastName,
    password,
  });
  appAssert(user, INTERNAL_SERVER_ERROR, 'Account creation error');

  // sign in user
  const { accessToken, refreshToken } = await login({
    email,
    password,
    userAgent,
  });

  return setAuthCookies(res, accessToken, refreshToken)
    .status(OK)
    .json({ message: 'Login successful' });
});

export const loginHandler = asyncHandler(async (req, res, next) => {
  const { email, password, userAgent } = loginSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent'],
  });

  // sign in user
  const { accessToken, refreshToken } = await login({
    email,
    password,
    userAgent,
  });

  return setAuthCookies(res, accessToken, refreshToken)
    .status(OK)
    .json({ message: 'Login successful' });
});

export const logoutHandler = asyncHandler(async (req, res, next) => {
  const accessToken: string = req.cookies['accessToken'];

  await logout(accessToken);

  return clearAuthCookies(res).status(OK).json({ message: 'Logged out' });
});

export const refreshHandler = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies['refreshToken'];
  appAssert(refreshToken, UNAUTHORIZED, 'Invalid refresh token');

  const { accessToken, newRefreshToken } = await refresh(refreshToken);

  if (newRefreshToken) {
    res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions());
  }

  return res
    .cookie('accessToken', accessToken, accessTokenCookieOptions())
    .status(OK)
    .json({ message: 'Token refreshed' });
});
