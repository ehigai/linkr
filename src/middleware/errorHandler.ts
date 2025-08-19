import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/apperror';
import { MongooseError } from 'mongoose';

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
};

export default errorHandler;
