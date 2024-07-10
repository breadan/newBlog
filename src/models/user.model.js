import { Schema, model, mongoose } from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=6hQNACQQjktni8CxSS_QSPqJv2tycskYmpFGzxv3FNs=',
        publicId: null,
      },
    },
    bio: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Invalid role',
      },
      default: 'user',
    },
  },
  { timestamps: true }
);

//generate Auth Token
const generateAuthToken = (userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
});

//validate register:
// const validateUser = (obj) => {
//   const schema = Joi.object({
//     name: Joi.string().trim().min(3).max(30).required(),
//     email: Joi.string().trim().min(3).max(30).required().email(),
//     password: Joi.string().trim().min(3).max(30).required(),
//     age: Joi.number().min(18).max(100).required(),
//   });
//   return schema.validate(obj);
// };

//validate register:
const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(30).required(),
    email: Joi.string().trim().min(3).max(30).required().email(),
    password: Joi.string().trim().min(3).max(30).required(),
    age: Joi.number().min(18).max(100).required(),
  });
  const { value, error } = schema.validate(req.body);

  if (error) throw error;

  req.body = value;

  return next();
};

//validate register:

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(3).max(30).required().email(),
    password: Joi.string().trim().min(3).max(30).required(),
  });

  const { value, error } = schema.validate(req.body);

  if (error) throw error;

  req.body = value;

  return next();
};

//validate update:
const validateUpdateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(30),
    password: Joi.string().trim().min(3).max(30),
    age: Joi.number().min(18).max(100).required(),
    bio: Joi.string(),
  });
  const { value, error } = schema.validate(req.body);

  if (error) throw error;

  req.body = value;

  return next();
  // return schema.validate(obj);
};

const User = model('User', userSchema);
export {
  User,
  validateUser,
  validateLogin,
  generateAuthToken,
  validateUpdateUser,
};
