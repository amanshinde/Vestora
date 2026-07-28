import User from '../models/User.js';
import WalletTransaction from '../models/WalletTransaction.js';
import ApiError from '../utils/ApiError.js';
import { TRANSACTION_TYPES } from '../constants/transactionTypes.js';

/**
 * Wallet Service — handles all wallet balance changes with audit trail.
 * Every balance change creates a WalletTransaction record.
 * All operations accept a Mongoose session for transaction support.
 */
const walletService = {
  /**
   * Credit a user's wallet.
   * Creates an immutable WalletTransaction audit record.
   */
  async creditWallet(userId, amount, type, referenceType, referenceId, description, session) {
    const roundedAmount = Math.round(amount * 100) / 100;

    const query = User.findById(userId);
    if (session) query.session(session);
    const user = await query;

    if (!user) {
      throw ApiError.notFound(`User account not found: ${userId}`);
    }

    const balanceBefore = user.walletBalance || 0;
    const balanceAfter = Math.round((balanceBefore + roundedAmount) * 100) / 100;

    // Update wallet balance
    user.walletBalance = balanceAfter;

    // Update relevant totals
    if (type === TRANSACTION_TYPES.ROI_CREDIT) {
      user.totalROIEarned = Math.round(((user.totalROIEarned || 0) + roundedAmount) * 100) / 100;
    } else if (type === TRANSACTION_TYPES.REFERRAL_CREDIT) {
      user.totalLevelIncomeEarned = Math.round(((user.totalLevelIncomeEarned || 0) + roundedAmount) * 100) / 100;
    }

    await user.save({ session: session || null });

    // Create audit record
    const walletTxn = await WalletTransaction.create(
      [
        {
          user: userId,
          type,
          amount: roundedAmount,
          referenceType,
          referenceId,
          balanceBefore,
          balanceAfter,
          description,
        },
      ],
      { session: session || undefined }
    );

    return walletTxn[0];
  },

  /**
   * Debit a user's wallet.
   * Validates sufficient balance before debiting.
   */
  async debitWallet(userId, amount, type, referenceType, referenceId, description, session) {
    const roundedAmount = Math.round(amount * 100) / 100;

    const query = User.findById(userId);
    if (session) query.session(session);
    const user = await query;

    if (!user) {
      throw ApiError.notFound(`User account not found: ${userId}`);
    }

    if ((user.walletBalance || 0) < roundedAmount) {
      throw ApiError.badRequest(
        `Insufficient liquid wallet balance (₹${(user.walletBalance || 0).toLocaleString('en-IN')}). Please click "＋ ADD DEMO CAPITAL" in the upper terminal menu to recharge your available funds.`,
        'INSUFFICIENT_BALANCE'
      );
    }

    const balanceBefore = user.walletBalance;
    const balanceAfter = Math.round((balanceBefore - roundedAmount) * 100) / 100;

    // Update wallet balance
    user.walletBalance = balanceAfter;
    await user.save({ session: session || null });

    // Create audit record
    const walletTxn = await WalletTransaction.create(
      [
        {
          user: userId,
          type,
          amount: roundedAmount,
          referenceType,
          referenceId,
          balanceBefore,
          balanceAfter,
          description,
        },
      ],
      { session: session || undefined }
    );

    return walletTxn[0];
  },
};

export default walletService;
