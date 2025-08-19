import { Router } from 'express';
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerController,
} from '../controllers/authController';

const authRouter = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginHandler);
authRouter.get('/logout', logoutHandler);
authRouter.get('/refresh', refreshHandler);

export default authRouter;
