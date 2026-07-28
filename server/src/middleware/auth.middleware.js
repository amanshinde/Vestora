import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';

/**
 * JWT Authentication Middleware
 * Verifies Bearer token and attaches user to req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw ApiError.unauthorized('Access denied. No token provided.');
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Find user and attach to request
    const user = await User.findById(decoded.id).select('-passwordHash').lean();

    if (!user) {
      throw ApiError.unauthorized('User not found. Token may be invalid.');
    }

    if (user.accountStatus !== 'ACTIVE') {
      throw ApiError.unauthorized('Account is not active. Please contact support.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token has expired. Please login again.'));
    }
    next(error);
  }
};

export default authMiddleware;
