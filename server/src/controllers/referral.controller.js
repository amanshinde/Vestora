import asyncHandler from '../utils/asyncHandler.js';
import referralService from '../services/referral.service.js';

export const getDirectReferrals = asyncHandler(async (req, res) => {
  const referrals = await referralService.getDirectReferrals(req.user._id);

  res.json({
    success: true,
    data: referrals,
  });
});

export const getReferralTree = asyncHandler(async (req, res) => {
  const tree = await referralService.getReferralTree(req.user._id);

  res.json({
    success: true,
    data: tree,
  });
});

export const getReferralIncome = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await referralService.getReferralIncome(req.user._id, {
    page: parseInt(page),
    limit: Math.min(parseInt(limit) || 10, 50),
  });

  res.json({
    success: true,
    data: result.incomes,
    pagination: result.pagination,
  });
});
