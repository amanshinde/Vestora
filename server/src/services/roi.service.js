import mongoose from 'mongoose';
import Investment from '../models/Investment.js';
import ROIHistory from '../models/ROIHistory.js';
import walletService from './wallet.service.js';
import referralService from './referral.service.js';
import { INVESTMENT_STATUS, TRANSACTION_TYPES, ROI_STATUS } from '../constants/transactionTypes.js';

/**
 * ROI Service — contains all daily ROI business logic.
 * This is the financial engine of the platform.
 */
const roiService = {
  /**
   * Pure function: calculates daily ROI amount.
   * Formula: investmentAmount * (dailyROIPercentage / 100)
   * Rounds to 2 decimal places to avoid floating-point accumulation.
   */
  calculateDailyROI(amount, percentage) {
    return Math.round(amount * (percentage / 100) * 100) / 100;
  },

  /**
   * Normalize a date to midnight UTC for consistent daily processing.
   * This ensures one ROI event per calendar day regardless of time zone.
   */
  normalizeDate(date) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  },

  /**
   * Main orchestrator: processes daily ROI for all eligible investments.
   * Returns a batch summary for logging.
   */
  async processDailyROI(processingDate = new Date()) {
    const normalizedDate = this.normalizeDate(processingDate);

    console.log(`📊 Starting daily ROI processing for: ${normalizedDate.toISOString().split('T')[0]}`);

    // Find all ACTIVE investments eligible for this processing date
    const eligibleInvestments = await Investment.find({
      status: INVESTMENT_STATUS.ACTIVE,
      startDate: { $lte: normalizedDate },
      endDate: { $gte: normalizedDate },
    }).lean();

    const summary = {
      date: normalizedDate.toISOString().split('T')[0],
      total: eligibleInvestments.length,
      credited: 0,
      skipped: 0,
      failed: 0,
    };

    for (const investment of eligibleInvestments) {
      try {
        const result = await this.processInvestmentROI(investment, normalizedDate);
        if (result.skipped) {
          summary.skipped++;
        } else {
          summary.credited++;
        }
      } catch (error) {
        summary.failed++;
        console.error(`❌ Failed to process ROI for investment ${investment._id}:`, error.message);
      }
    }

    // Check for investments that should be marked as COMPLETED
    await this.completeExpiredInvestments(normalizedDate);

    console.log(`✅ Daily ROI completed: processed=${summary.total} credited=${summary.credited} skipped=${summary.skipped} failed=${summary.failed}`);

    return summary;
  },

  /**
   * Process ROI for a single investment within a MongoDB transaction,
   * with seamless automatic fallback for standalone developer MongoDB setups.
   * Implements 3-layer idempotency:
   *   Layer 1: Application-level duplicate check (early exit)
   *   Layer 2: Unique MongoDB index on (investment, processingDate)
   *   Layer 3: MongoDB transaction for atomicity
   */
  async processInvestmentROI(investment, processingDate) {
    // Layer 1: Application-level duplicate check for efficient early exit
    const existingROI = await ROIHistory.findOne({
      investment: investment._id,
      processingDate,
    }).lean();

    if (existingROI) {
      return { skipped: true, reason: 'Already processed' };
    }

    // Calculate ROI
    const roiAmount = this.calculateDailyROI(
      investment.amount,
      investment.plan.dailyROIPercentage
    );

    let session;
    let roiHistory;

    try {
      session = await mongoose.startSession();
      await session.withTransaction(async () => {
        // Layer 2 + 3: Create ROI history within transaction
        const [newROI] = await ROIHistory.create(
          [
            {
              user: investment.user,
              investment: investment._id,
              roiAmount,
              roiPercentage: investment.plan.dailyROIPercentage,
              processingDate,
              status: ROI_STATUS.CREDITED,
            },
          ],
          { session }
        );

        roiHistory = newROI;

        // Credit user wallet
        await walletService.creditWallet(
          investment.user,
          roiAmount,
          TRANSACTION_TYPES.ROI_CREDIT,
          'ROIHistory',
          newROI._id,
          `Daily ROI (${investment.plan.dailyROIPercentage}%) on ${investment.plan.name} plan - ₹${investment.amount.toLocaleString('en-IN')}`,
          session
        );

        // Distribute referral level income
        await referralService.distributeLevelIncome(
          investment.user,
          roiAmount,
          investment._id,
          newROI._id,
          processingDate,
          session
        );
      });

      return { skipped: false, roiHistory };
    } catch (error) {
      // Handle duplicate key error (Layer 2 protection)
      if (error.code === 11000) {
        return { skipped: true, reason: 'Duplicate prevented by index' };
      }

      // Standalone MongoDB fallback support: if replica set transactions are unsupported on local developer database,
      // execute sequentially without transaction session wrapper.
      const isTxUnsupported =
        error.message &&
        (error.message.includes('replica set') ||
         error.message.includes('not supported') ||
         error.message.includes('Transaction numbers') ||
         error.code === 20);

      if (isTxUnsupported) {
        console.warn(`⚠️ Standalone MongoDB detected: executing ROI credit for investment ${investment._id} sequentially without transaction.`);
        try {
          const [newROI] = await ROIHistory.create([
            {
              user: investment.user,
              investment: investment._id,
              roiAmount,
              roiPercentage: investment.plan.dailyROIPercentage,
              processingDate,
              status: ROI_STATUS.CREDITED,
            },
          ]);

          roiHistory = newROI;

          await walletService.creditWallet(
            investment.user,
            roiAmount,
            TRANSACTION_TYPES.ROI_CREDIT,
            'ROIHistory',
            newROI._id,
            `Daily ROI (${investment.plan.dailyROIPercentage}%) on ${investment.plan.name} plan - ₹${investment.amount.toLocaleString('en-IN')}`,
            null
          );

          await referralService.distributeLevelIncome(
            investment.user,
            roiAmount,
            investment._id,
            newROI._id,
            processingDate,
            null
          );

          return { skipped: false, roiHistory };
        } catch (fallbackErr) {
          if (fallbackErr.code === 11000) {
            return { skipped: true, reason: 'Duplicate prevented by index' };
          }
          throw fallbackErr;
        }
      }

      throw error;
    } finally {
      if (session) {
        await session.endSession().catch(() => {});
      }
    }
  },

  /**
   * Mark investments as COMPLETED when they've passed their endDate.
   */
  async completeExpiredInvestments(processingDate) {
    const result = await Investment.updateMany(
      {
        status: INVESTMENT_STATUS.ACTIVE,
        endDate: { $lt: processingDate },
      },
      {
        status: INVESTMENT_STATUS.COMPLETED,
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`📋 Marked ${result.modifiedCount} investments as COMPLETED`);
    }
  },
};

export default roiService;
