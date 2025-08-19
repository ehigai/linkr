import type { Response, CookieOptions } from 'express';
import { NODE_ENV } from '../constants/env';
import { fiveDaysFromNow, fiveMinutesFromNow } from './date';

const defaults: CookieOptions = {
  sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
  secure: NODE_ENV === 'production',
  httpOnly: true,
};

export const accessTokenCookieOptions = () => ({
  ...defaults,
  expires: fiveMinutesFromNow(),
});

export const refreshTokenCookieOptions = () => ({
  ...defaults,
  expires: fiveDaysFromNow(),
  path: '/api/v1/auth/refresh',
});

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) =>
  res
    .cookie('accessToken', accessToken, accessTokenCookieOptions())
    .cookie('refreshToken', refreshToken, refreshTokenCookieOptions());

export const clearAuthCookies = (res: Response) =>
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
