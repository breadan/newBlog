import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  User,
  validateLogin,
  generateAuthToken,
} from '../models/user.model.js';
import { sendEmail } from '../emailes/nodemailer.js';
import { ApiError } from '../utils/apiError.js';
/*
#Desc: Register
#Rout: /api/auth/register
#Method: post
#Access: public
*/

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, age } = req.body;
  const existsUser = await User.findOne({ email });
  if (existsUser) {
    return res.status(400).json({
      Status: false,
      message: 'User already exists',
    });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
    }); //if use insertMany put newUser[0].id
    // console.log(newUser._id);
    const tokenVerifying = jwt.sign(
      { id: newUser._id },
      process.env.VERIFY_SECRET
    );
    sendEmail({
      email,
      api: `http://localhost:7000/api/user/auth/verifyEmail/${tokenVerifying}`,
    });
    res.status(201).json({
      Status: true,
      message: 'User created successfully',
      newUser,
    });
    console.log(newUser.verified);
  }
});

/*
#Desc: LogIn
#Rout: /api/auth/login
#Method: post
#Access: public
*/
const loginUser = asyncHandler(async (req, res) => {
  //check if user is exists already
  const user = await User.findOne({ email: req.body.email });
  const checkVerify = user.verified;
  console.log(user.verified);
  if (!user || !checkVerify) {
    return res.status(400).json({
      Status: false,
      message: 'User not found Please Sign Up or u did not verify your email',
    });
  }
  //check password    //user.password it is in db //req.body.password from clint
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      Status: false,
      message: ' Password Wrong OR Your Account Not Valid',
    });
  } else {
    const token = user.generateAuthToken(); //it create new token
    res.status(200).json({
      _id: user._id,
      isAdmin: user.isAdmin,
      profilePhoto: user.profilePhoto,
      token,
    });
  }
});

export { registerUser, loginUser };
