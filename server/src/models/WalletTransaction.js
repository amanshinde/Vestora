import mongoose from 'mongoose';
import { TRANSACTION_TYPES } from '../constants/transactionTypes.js';

const walletTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    referenceType: {
      type: String,
      required: true,
      enum: ['Investment', 'ROIHistory', 'ReferralIncome', 'Adjustment'],
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Query index: user's transaction history in reverse chronological order
walletTransactionSchema.index({ user: 1, createdAt: -1 });

walletTransactionSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);

export default WalletTransaction;
