import type { Response, CookieOptions } from 'express';
import { fiveDaysFromNow, fiveMinutesFromNow } from './date.util';

const isProd = process.env.NODE_ENV === 'production';

const defaults: CookieOptions = {
  sameSite: isProd ? 'none' : 'lax',
  secure: isProd,
  httpOnly: true,
};

export const accessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fiveMinutesFromNow(),
});

export const refreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fiveDaysFromNow(),
  path: '/api/v1/auth/refresh',
});

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) =>
  res
    .cookie('accessToken', accessToken, accessTokenCookieOptions())
    .cookie('refreshToken', refreshToken, refreshTokenCookieOptions());

export const clearAuthCookies = (res: Response) =>
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
