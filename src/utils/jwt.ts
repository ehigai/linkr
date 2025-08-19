import type { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { JWT_SECRET } from '../constants/env';
import jwt from 'jsonwebtoken';
import type { UserDocument } from '../models/User';
import type { SessionDocument } from '../models/Session';

type AccessTokenPayload = {
  userId: UserDocument['_id'];
  sessionId: SessionDocument['_id'];
  tokenType: 'access' | 'refresh';
};

type RefreshTokenPayload = {
  sessionId: SessionDocument['_id'];
  tokenType: 'access' | 'refresh';
};

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: ['user'],
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: '5d',
  secret: JWT_SECRET,
};

export const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: '5m',
  secret: JWT_SECRET,
};

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret
) => {
  const { secret, ...opts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, { ...opts, ...defaults });
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};

  try {
    const payload = jwt.verify(token, secret, {
      audience: ['user'], // ... defaults
      ...verifyOpts,
    }) as TPayload;

    return {
      payload,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
