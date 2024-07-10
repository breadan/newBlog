import { Schema, model, SchemaTypes } from 'mongoose';
import Joi from 'joi';

const postSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      minLength: 4,
      maxLength: 200,
    },
    description: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 200,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Technology', 'Lifestyle', 'Business', 'Sports', 'Health'],
    },
    image: {
      type: Object,
      default: {
        url: '',
        publicId: null,
      },
    },
    //id of users created likes here
    likes: [
      {
        type: SchemaTypes.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

const postModel = model('Post', postSchema);

//validation Post
const validatePost = (obj) => {
  const scheme = Joi.object({
    title: Joi.string().trim().min(2).max(200).required(),
    description: Joi.string().trim().min(2).max(200).required(),
    category: Joi.string().trim().required(),
  });
  return validatePost(obj);
};

//validation Post
const validateUpdatePost = (obj) => {
  const scheme = Joi.object({
    title: Joi.string().trim().min(2).max(200),
    description: Joi.string().trim().min(2).max(200),
    category: Joi.string().trim(),
  });
  return validateUpdatePost(obj);
};

export { postModel, validatePost, validateUpdatePost };
