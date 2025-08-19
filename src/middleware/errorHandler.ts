import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/apperror';

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.error(`[ERROR]: ${error}`);

  if (error instanceof AppError) {
    const { httpStatusCode, message, errorCode } = error;
    response.status(httpStatusCode).json({
      message,
      errorCode,
    });
  }
};

export default errorHandler;
