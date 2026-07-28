import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Generates a signed JWT for the given user ID.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export default generateToken;
