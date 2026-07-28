import asyncHandler from '../utils/asyncHandler.js';
import investmentService from '../services/investment.service.js';

export const createInvestment = asyncHandler(async (req, res) => {
  const investment = await investmentService.createInvestment(
    req.user._id,
    req.body
  );

  res.status(201).json({
    success: true,
    data: investment,
  });
});

export const getUserInvestments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await investmentService.getUserInvestments(req.user._id, {
    page: parseInt(page),
    limit: Math.min(parseInt(limit) || 10, 50),
  });

  res.json({
    success: true,
    data: result.investments,
    pagination: result.pagination,
  });
});

export const getInvestmentById = asyncHandler(async (req, res) => {
  const investment = await investmentService.getInvestmentById(
    req.user._id,
    req.params.id
  );

  res.json({
    success: true,
    data: investment,
  });
});
