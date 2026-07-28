import mongoose from 'mongoose';
import Investment from '../models/Investment.js';
import ApiError from '../utils/ApiError.js';
import walletService from './wallet.service.js';
import { INVESTMENT_PLANS, INVESTMENT_STATUS, TRANSACTION_TYPES } from '../constants/transactionTypes.js';

/**
 * Investment Service — handles investment creation and retrieval.
 */
const investmentService = {
  /**
   * Create a new investment.
   * Validates plan, snapshots plan terms, debits wallet, and creates investment
   * within a MongoDB transaction.
   */
  async createInvestment(userId, { amount, planName }) {
    // Find matching plan configuration
    const plan = Object.values(INVESTMENT_PLANS).find((p) => p.name === planName);
    if (!plan) {
      throw ApiError.badRequest('Invalid investment plan.', 'INVALID_PLAN');
    }

    // Validate amount against plan limits
    if (amount < plan.minAmount) {
      throw ApiError.badRequest(
        `Minimum investment for ${plan.name} plan is ₹${plan.minAmount.toLocaleString()}`,
        'INVALID_AMOUNT'
      );
    }
    if (amount > plan.maxAmount && plan.maxAmount !== Infinity) {
      throw ApiError.badRequest(
        `Maximum investment for ${plan.name} plan is ₹${plan.maxAmount.toLocaleString()}`,
        'INVALID_AMOUNT'
      );
    }

    const session = await mongoose.startSession();

    try {
      let investment;

      await session.withTransaction(async () => {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.durationDays);

        // Create investment with plan snapshot
        const [newInvestment] = await Investment.create(
          [
            {
              user: userId,
              amount,
              plan: {
                name: plan.name,
                durationDays: plan.durationDays,
                dailyROIPercentage: plan.dailyROIPercentage,
              },
              startDate,
              endDate,
              status: INVESTMENT_STATUS.ACTIVE,
            },
          ],
          { session }
        );

        // Debit wallet for the investment amount
        await walletService.debitWallet(
          userId,
          amount,
          TRANSACTION_TYPES.INVESTMENT_DEBIT,
          'Investment',
          newInvestment._id,
          `Investment in ${plan.name} plan - ₹${amount.toLocaleString()}`,
          session
        );

        investment = newInvestment;
      });

      return investment;
    } finally {
      await session.endSession();
    }
  },

  /**
   * Get paginated investments for a user.
   */
  async getUserInvestments(userId, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const [investments, total] = await Promise.all([
      Investment.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Investment.countDocuments({ user: userId }),
    ]);

    return {
      investments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get a single investment by ID (with ownership check).
   */
  async getInvestmentById(userId, investmentId) {
    const investment = await Investment.findById(investmentId).lean();

    if (!investment) {
      throw ApiError.notFound('Investment not found.', 'INVESTMENT_NOT_FOUND');
    }

    // Ownership check — users can only access their own data
    if (investment.user.toString() !== userId.toString()) {
      throw ApiError.forbidden('You do not have access to this investment.');
    }

    return investment;
  },
};

export default investmentService;
