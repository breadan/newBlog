import asyncHandler from 'express-async-handler';
import fs from 'fs';
import * as path from 'path';
import { postModel, validatePost } from '../models/post.model.js';

/*
#Desc: create new post
#Rout: /api/posts/register
#Method: post
#Access: Private (only logIn User)
*/
const createPost = asyncHandler(async (req, res) => {
  //check image
  if (!req.file) {
    return res.status(400).json({ message: 'No Image Provided' });
  }
  //check post
  const { error } = validatePost(req.body);
  if (error) {
    return res
      .status(error.message)
      .json({ message: error.details[0].message });
  }
  //upload photo
  const imagePath = path.join(__dirname, `uploads/${req.files.filename}`);
  const result = await cloudinaryUploadImage(imagePath);
  //create new post
  const { title, description, category, image } = req.body;
  const { user } = req.params;
  const newPost = await postModel.create({
    title,
    description,
    category,
    user: req.params.id,
    image: { url: result.secure_url, publicId: result.public_Id }, //???review result.secure_url
  });
  res.status(201).json({
    message: 'Post Created Successfully',
    newPost,
  });
  //delete image from project
  fs.unlinkSync(imagePath);
});

export { createPost };
