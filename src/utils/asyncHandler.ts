import type { NextFunction, Request, Response } from 'express';

type Controller = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (controller: Controller): Controller => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncHandler;
