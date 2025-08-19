import { UNAUTHORIZED } from '../constants/httpStatusCode';
import Session from '../models/Session';
import { appAssert, AppError, ErrorCode } from '../utils/apperror';
import asyncHandler from '../utils/asyncHandler';
import { clearAuthCookies } from '../utils/cookie';
import { verifyToken } from '../utils/jwt';

export const authenticate = asyncHandler(async (req, res, next) => {
  const accessToken: string = req.cookies.accessToken;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    'Unauthorized',
    ErrorCode.InvalidAccessToken
  );
  const result = verifyToken(accessToken);

  appAssert(
    result.payload,
    UNAUTHORIZED,
    result.error === 'jwt expired' ? 'Token expired' : 'Invalid token',
    ErrorCode.InvalidAccessToken
  );

  const { userId, sessionId } = result.payload;

  const session = await Session.exists({ id: sessionId });
  if (!session) {
    clearAuthCookies(res);
    throw new AppError(
      UNAUTHORIZED,
      'Invalid session',
      ErrorCode.InvalidAccessToken
    );
  }

  appAssert(
    result.payload.tokenType === 'access',
    UNAUTHORIZED,
    'Invalid token type'
  );

  req.userId = userId as string;
  req.sessionId = sessionId as string;

  next();
});
