import { Router } from 'express';
import {
  createLink,
  createRedirection,
  deleteLink,
  deleteRedirection,
  links,
  toggleActiveLink,
} from '../controllers/linkController';

const linkRouter = Router();

linkRouter.post('/', createLink);
linkRouter.post('/r/:linkId', createRedirection);
linkRouter.get('/', links);
linkRouter.get('/toggle/:linkId/:toggleLinkId', toggleActiveLink);
linkRouter.delete('/:linkId', deleteLink); // Delete parent link
linkRouter.delete('/r/:redirectionLinkId', deleteRedirection); // Delete child link

export default linkRouter;
