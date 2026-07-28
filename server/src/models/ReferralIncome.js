import mongoose from 'mongoose';

const referralIncomeSchema = new mongoose.Schema(
  {
    receiverUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sourceUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
      required: true,
    },
    roiHistory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ROIHistory',
      required: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    processingDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

/**
 * Unique constraint: prevents duplicate referral payouts
 * for the same ROI event at the same level for the same receiver.
 */
referralIncomeSchema.index(
  { receiverUser: 1, sourceUser: 1, roiHistory: 1, level: 1 },
  { unique: true }
);

// Query index for fetching a user's referral income history
referralIncomeSchema.index({ receiverUser: 1, processingDate: -1 });

referralIncomeSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const ReferralIncome = mongoose.model('ReferralIncome', referralIncomeSchema);

export default ReferralIncome;
