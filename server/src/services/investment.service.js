import mongoose from 'mongoose';
import Investment from '../models/Investment.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import walletService from './wallet.service.js';
import { INVESTMENT_PLANS, INVESTMENT_STATUS, TRANSACTION_TYPES } from '../constants/transactionTypes.js';

/**
 * Investment Service — handles investment creation and retrieval.
 */
const investmentService = {
  /**
   * Create a new investment.
   * Validates plan, checks balance beforehand, debits wallet, and creates investment
   * with seamless compatibility for both standalone MongoDB and Replica Sets.
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
        `Minimum investment for ${plan.name} term is ₹${plan.minAmount.toLocaleString('en-IN')}`,
        'INVALID_AMOUNT'
      );
    }
    if (amount > plan.maxAmount && plan.maxAmount !== Infinity) {
      throw ApiError.badRequest(
        `Maximum investment for ${plan.name} term is ₹${plan.maxAmount.toLocaleString('en-IN')}`,
        'INVALID_AMOUNT'
      );
    }

    // Pre-verify sufficient balance to return clear operational feedback immediately
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('Member account not found.', 'USER_NOT_FOUND');
    }
    if ((user.walletBalance || 0) < amount) {
      throw ApiError.badRequest(
        `Insufficient liquid wallet balance (₹${(user.walletBalance || 0).toLocaleString('en-IN')}). Please click "＋ ADD DEMO CAPITAL" in the upper terminal menu to recharge your available funds before deploying this term.`,
        'INSUFFICIENT_BALANCE'
      );
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    let investment;
    let session;

    try {
      session = await mongoose.startSession();
      await session.withTransaction(async () => {
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
          `Capital deployment in ${plan.name} plan - ₹${amount.toLocaleString('en-IN')}`,
          session
        );

        investment = newInvestment;
      });
    } catch (err) {
      // If MongoDB instance does not support replica set transactions (common on developer standalone setups),
      // seamlessly fall back to executing sequentially without transaction session wrapper.
      const isTxUnsupported =
        err.message &&
        (err.message.includes('replica set') ||
         err.message.includes('not supported') ||
         err.message.includes('Transaction numbers') ||
         err.code === 20);

      if (isTxUnsupported && !err.isOperational) {
        console.warn('⚠️ Standalone MongoDB detected: executing investment creation sequentially without transaction.');
        
        const [newInvestment] = await Investment.create([
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
        ]);

        await walletService.debitWallet(
          userId,
          amount,
          TRANSACTION_TYPES.INVESTMENT_DEBIT,
          'Investment',
          newInvestment._id,
          `Capital deployment in ${plan.name} plan - ₹${amount.toLocaleString('en-IN')}`,
          null
        );

        investment = newInvestment;
      } else {
        // Re-throw operational or valid database errors
        throw err;
      }
    } finally {
      if (session) {
        await session.endSession().catch(() => {});
      }
    }

    return investment;
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
      throw ApiError.notFound('Investment term not found.', 'INVESTMENT_NOT_FOUND');
    }

    // Ownership check — users can only access their own data
    if (investment.user.toString() !== userId.toString()) {
      throw ApiError.forbidden('You do not have permission to access this investment record.');
    }

    return investment;
  },
};

export default investmentService;
