import User from '../models/User.js';
import WalletTransaction from '../models/WalletTransaction.js';
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

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const balanceBefore = user.walletBalance;
    const balanceAfter = Math.round((balanceBefore + roundedAmount) * 100) / 100;

    // Update wallet balance
    user.walletBalance = balanceAfter;

    // Update relevant totals
    if (type === TRANSACTION_TYPES.ROI_CREDIT) {
      user.totalROIEarned = Math.round((user.totalROIEarned + roundedAmount) * 100) / 100;
    } else if (type === TRANSACTION_TYPES.REFERRAL_CREDIT) {
      user.totalLevelIncomeEarned = Math.round((user.totalLevelIncomeEarned + roundedAmount) * 100) / 100;
    }

    await user.save({ session });

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
      { session }
    );

    return walletTxn[0];
  },

  /**
   * Debit a user's wallet.
   * Validates sufficient balance before debiting.
   */
  async debitWallet(userId, amount, type, referenceType, referenceId, description, session) {
    const roundedAmount = Math.round(amount * 100) / 100;

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    if (user.walletBalance < roundedAmount) {
      throw new Error('Insufficient wallet balance');
    }

    const balanceBefore = user.walletBalance;
    const balanceAfter = Math.round((balanceBefore - roundedAmount) * 100) / 100;

    // Update wallet balance
    user.walletBalance = balanceAfter;
    await user.save({ session });

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
      { session }
    );

    return walletTxn[0];
  },
};

export default walletService;
