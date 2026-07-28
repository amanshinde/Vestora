import Investment from '../models/Investment.js';
import ROIHistory from '../models/ROIHistory.js';
import ReferralIncome from '../models/ReferralIncome.js';
import WalletTransaction from '../models/WalletTransaction.js';
import User from '../models/User.js';
import { INVESTMENT_STATUS } from '../constants/transactionTypes.js';

/**
 * Dashboard Service — provides aggregated statistics and earnings data.
 * All computations are server-side to avoid sending full histories to the client.
 */
const dashboardService = {
  /**
   * Get dashboard summary for a user.
   * Returns aggregated totals computed server-side.
   */
  async getSummary(userId) {
    const user = await User.findById(userId).select('walletBalance totalROIEarned totalLevelIncomeEarned').lean();

    // Calculate total investments (sum of amounts for ACTIVE + COMPLETED)
    const investmentAgg = await Investment.aggregate([
      {
        $match: {
          user: user._id,
          status: { $in: [INVESTMENT_STATUS.ACTIVE, INVESTMENT_STATUS.COMPLETED] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          activeCount: {
            $sum: { $cond: [{ $eq: ['$status', INVESTMENT_STATUS.ACTIVE] }, 1, 0] },
          },
          totalCount: { $sum: 1 },
        },
      },
    ]);

    // Get today's ROI (most recent processing date)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const dailyROIAgg = await ROIHistory.aggregate([
      {
        $match: {
          user: user._id,
          processingDate: today,
          status: 'CREDITED',
        },
      },
      {
        $group: {
          _id: null,
          dailyROI: { $sum: '$roiAmount' },
        },
      },
    ]);

    const investmentStats = investmentAgg[0] || { totalAmount: 0, activeCount: 0, totalCount: 0 };
    const dailyROI = dailyROIAgg[0]?.dailyROI || 0;

    return {
      totalInvestments: investmentStats.totalAmount,
      activeInvestments: investmentStats.activeCount,
      totalInvestmentCount: investmentStats.totalCount,
      dailyROI,
      totalROIEarned: user.totalROIEarned,
      totalLevelIncomeEarned: user.totalLevelIncomeEarned,
      walletBalance: user.walletBalance,
    };
  },

  /**
   * Get earnings history data for charts.
   * Returns daily earnings (ROI + referral) for the last 30 days.
   */
  async getEarnings(userId, { days = 30 } = {}) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setUTCHours(0, 0, 0, 0);

    // Aggregate ROI earnings by date
    const roiEarnings = await ROIHistory.aggregate([
      {
        $match: {
          user: typeof userId === 'string' ? new (await import('mongoose')).default.Types.ObjectId(userId) : userId,
          processingDate: { $gte: startDate },
          status: 'CREDITED',
        },
      },
      {
        $group: {
          _id: '$processingDate',
          roiEarnings: { $sum: '$roiAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Aggregate referral earnings by date
    const referralEarnings = await ReferralIncome.aggregate([
      {
        $match: {
          receiverUser: typeof userId === 'string' ? new (await import('mongoose')).default.Types.ObjectId(userId) : userId,
          processingDate: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$processingDate',
          referralEarnings: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Merge into a single timeline
    const earningsMap = new Map();

    roiEarnings.forEach((e) => {
      const dateKey = e._id.toISOString().split('T')[0];
      earningsMap.set(dateKey, {
        date: dateKey,
        roiEarnings: e.roiEarnings,
        referralEarnings: 0,
        totalEarnings: e.roiEarnings,
      });
    });

    referralEarnings.forEach((e) => {
      const dateKey = e._id.toISOString().split('T')[0];
      const existing = earningsMap.get(dateKey) || {
        date: dateKey,
        roiEarnings: 0,
        referralEarnings: 0,
        totalEarnings: 0,
      };
      existing.referralEarnings = e.referralEarnings;
      existing.totalEarnings = existing.roiEarnings + e.referralEarnings;
      earningsMap.set(dateKey, existing);
    });

    // Sort by date and return
    return Array.from(earningsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  },
};

export default dashboardService;
