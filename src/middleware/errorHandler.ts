import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/apperror';
import { MongooseError } from 'mongoose';
import { ZodError } from 'zod';

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.error(`[ERROR]: ${error}`);

  if (error instanceof AppError) {
    const { httpStatusCode, message, errorCode } = error;
    response.status(httpStatusCode).json({
      message,
      errorCode,
    });
  }

  if (error instanceof MongooseError) {
    console.log('mongoose error: ', error);
  }

  if (error instanceof ZodError) {
    console.log('Handle zod error:', error);
  }
};

export default errorHandler;
