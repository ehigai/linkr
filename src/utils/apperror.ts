import assert from 'node:assert';
import type { HttpStatusCode } from '../constants/httpStatusCode';

export const enum ErrorCode {
  InvalidAccessToken = 'InvalidAccessToken',
}

type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  errorCode?: ErrorCode
) => asserts condition;

export class AppError extends Error {
  constructor(
    public httpStatusCode: HttpStatusCode,
    public message: string,
    public errorCode?: ErrorCode
  ) {
    super(message);
  }
}

export const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  errorCode
) => assert(condition, new AppError(httpStatusCode, message, errorCode));
