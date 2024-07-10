import asyncHandler from 'express-async-handler';
import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { dirname } from 'path';
import * as path from 'path';
import { cloudinaryUpload, cloudinaryRemove } from '../utils/cloudinary.js';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*
#Desc: Get All Users Profile
#Rout: /api/users/profile
#Method: get
#Access: Only Admin
*/

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  // console.log(req.headers.authorization.split(" ")[1])//to convert to array & take token[1]
  if (users) {
    res.status(201).json(users);
  } else {
    return res.status(404).json({
      status: 404,
      message: 'No users found',
    });
  }
});

/*
#Desc: Get User Profile
#Rout: /api/user/profile/:id
#Method: get
#Access: public
*/
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: 'User not found',
    });
  }
  res.status(201).json(user);
});

/*
#Desc: Update User Profile
#Rout: /api/users/profile/:id
#Method: put
#Access: Only User 
*/

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: 'User not found',
    });
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
  }
  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        password: req.body.password,
        age: req.body.age,
        bio: req.body.bio,
        $inc: { __v: 1 },
      },
    },
    { new: true }
  ).select('-password');
  res.status(201).json(updateUser);
});

/*
#Desc: Get Users Count              ?????????
#Rout: /api/users/count
#Method: get
#Access: Only Admin
*/

const getUsersCount = asyncHandler(async (req, res) => {
  const users = await User.find().countDocuments();
  if (users) {
    res.status(201).json(users);
  } else {
    return res.status(404).json({
      status: 404,
      message: 'No users found',
    });
  }
  User.countDocuments({ age: 25 }).then((count) => {
    console.log(count);
  });
});

/*
#Desc:  User Profile Photo
#Rout: /api/users/profile/profile-Photo
#Method: post
#Access: Only User 
*/

const profilePhoto = asyncHandler(async (req, res) => {
  //1
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ message: 'No File Selected' });
  }
  //2
  const imagePath = path.join(
    __dirname,
    '..',
    '..',
    'uploads',
    `${req.file.filename}`
  );
  //3 -in another folder
  //4
  const result = await cloudinaryUpload(imagePath);
  console.log(result);

  //
  const user = await User.findById(req.user.id);
  // console.log(user);
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: 'User not found',
    });
  }
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemove(user.profilePhoto.publicId);
  }
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();

  //7
  res.status(200).json({
    message: 'Profile Photo Uploaded Successfully',
    profilePhoto: { url: result.secure_url, publicId: result.public_id },
  });
  fs.unlinkSync(imagePath);
});

/*
#Desc: delete User Profile 
#Rout: /api/users/profile/:id
#Method: delete
#Access:  User himself or admin
*/
/**
 * 1- get userfrom DB
 * 2- git all posts from DB
 * 3- get the public ids from the posts
 * 4- delete all posts image from cloudinary
 * 5- delete profile picture from cloudinary
 * 6- delete user posts & comments
 * 7- delete the user himself
 * 8- send response
 */
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: 'User not found',
    });
  }
  await cloudinaryRemove(user.profilePhoto.publicId);
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'User Deleted Successfully' });
});

export {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getUsersCount,
  profilePhoto,
  deleteUserProfile,
};
