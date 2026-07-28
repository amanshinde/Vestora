import asyncHandler from '../utils/asyncHandler.js';
import dashboardService from '../services/dashboard.service.js';

export const getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getSummary(req.user._id);

  res.json({
    success: true,
    data: summary,
  });
});

export const getEarnings = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const earnings = await dashboardService.getEarnings(req.user._id, {
    days: Math.min(parseInt(days) || 30, 365),
  });

  res.json({
    success: true,
    data: earnings,
  });
});
