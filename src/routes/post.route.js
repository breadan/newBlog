import express from 'express';
import { createPost } from '../controller/post.controller.js';
import { verifyToken, verifyUserAccess } from '../middlewares/verifyToken.js';
import { multerMiddle } from '../middlewares/photoUpload.js';

const postRouter = express.Router();

postRouter.post(
  '/createPost',
  verifyToken,
  multerMiddle().single('image'),
  createPost
);

export default postRouter;
