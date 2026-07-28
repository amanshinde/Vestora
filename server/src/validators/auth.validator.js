import Joi from 'joi';

export const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name cannot exceed 100 characters',
      'any.required': 'Full name is required',
    }),
  email: Joi.string().email().lowercase().trim().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required()
    .messages({
      'string.pattern.base': 'Mobile number must be exactly 10 digits',
      'any.required': 'Mobile number is required',
    }),
  password: Joi.string().min(8).max(128).required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password cannot exceed 128 characters',
      'any.required': 'Password is required',
    }),
  referralCode: Joi.string().trim().optional().allow(''),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string().required()
    .messages({
      'any.required': 'Password is required',
    }),
});
