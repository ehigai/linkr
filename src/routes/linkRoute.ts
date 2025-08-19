import { Router } from 'express';
import {
  createLink,
  createRedirection,
  links,
} from '../controllers/linkController';

const linkRouter = Router();

linkRouter.post('/', createLink);
linkRouter.post('/:linkId', createRedirection);
linkRouter.get('/', links);
export default linkRouter;
