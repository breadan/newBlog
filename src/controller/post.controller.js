import asyncHandler from 'express-async-handler';
import fs from 'fs';
import * as path from 'path';
import { postModel, validatePost } from '../models/post.model.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { cloudinaryUpload } from '../utils/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** 
@desc    create new post
@route   /api/posts/register
@method  POST
@access  private 
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
<<<<<<< HEAD
  const imagePath = path.join(
    __dirname,
    '..',
    '..',
    'uploads',
    `${req.file.filename}`
  );
  const result = await cloudinaryUpload(imagePath);
=======
  const imagePath = path.join(__dirname, 'uploads', `${req.file.filename}`);
  const result = await cloudinaryUpload(imagePath);

>>>>>>> 6c6a286cc4d48f322cfadc314b7ffe16d195cc5f
  //create new post
  const { title, description, category, image } = req.body;
  console.log(req.body);
  const newPost = await postModel.create({
    title,
    description,
    category,
    user: req.user.id,
    image: { url: result.secure_url, publicId: result.public_Id },
  });

  res.status(201).json({
    message: 'Post Created Successfully',
    newPost,
  });
  //delete image from project
  fs.unlinkSync(imagePath);
});

export { createPost };
