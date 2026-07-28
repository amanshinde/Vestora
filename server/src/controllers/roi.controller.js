import asyncHandler from '../utils/asyncHandler.js';
import ROIHistory from '../models/ROIHistory.js';

export const getROIHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = Math.min(parseInt(limit) || 10, 50);
  const skip = (pageNum - 1) * limitNum;

  const [history, total] = await Promise.all([
    ROIHistory.find({ user: req.user._id })
      .populate('investment', 'amount plan.name')
      .sort({ processingDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    ROIHistory.countDocuments({ user: req.user._id }),
  ]);

  res.json({
    success: true,
    data: history,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});
