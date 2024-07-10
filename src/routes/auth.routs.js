import { verify } from 'crypto';
import { loginUser, registerUser } from '../controller/auth.controller.js';
import express from 'express';
import { verifyMailer } from '../middlewares/verifyToken.js';
import { validateLogin, validateUser } from '../models/user.model.js';

const authRouter = express.Router();

authRouter.post('/api/auth/register', validateUser, registerUser);
authRouter.post('/api/auth/login', validateLogin, loginUser);
authRouter.get('/api/user/auth/verifyEmail/:token', verifyMailer);

export default authRouter;
