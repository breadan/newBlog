import express from 'express';
import {
  deleteUserProfile,
  getAllUsers,
  getUserProfile,
  getUsersCount,
  profilePhoto,
  updateUserProfile,
} from '../controller/user.controller.js';
import {
  verifyAdminAccess,
  verifyToken,
  verifyUserAccess,
  verifyUserAndAdmin,
} from '../middlewares/verifyToken.js';
import { validateId } from '../middlewares/validateId.js';
import { multerMiddle } from '../middlewares/photoUpload.js';
import { validateUpdateUser } from '../models/user.model.js';

const userRouter = express.Router();

userRouter.get('/api/users/profile', [verifyAdminAccess], getAllUsers);
userRouter.get('/api/users/count', [verifyAdminAccess], getUsersCount);
userRouter.get('/api/users/profile/:id', [validateId], getUserProfile);
userRouter.put(
  '/api/users/profile/:id',
  [validateId, verifyUserAccess, validateUpdateUser],
  updateUserProfile
);
userRouter.post(
  '/api/users/profile/profile-Photo/:id',
  [verifyUserAccess, multerMiddle().single('image')],
  profilePhoto
);
userRouter.delete(
  '/api/users/profile/:id',
  [validateId, verifyUserAndAdmin],
  deleteUserProfile
);

export default userRouter;
