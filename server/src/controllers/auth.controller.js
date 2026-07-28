import asyncHandler from '../utils/asyncHandler.js';
import authService from '../services/auth.service.js';

/**
 * Auth Controller — thin layer that reads HTTP input and calls services.
 */

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  res.status(201).json({
    success: true,
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  res.json({
    success: true,
    data: result,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);

  res.json({
    success: true,
    data: user,
  });
});
