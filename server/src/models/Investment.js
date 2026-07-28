import mongoose from 'mongoose';
import { INVESTMENT_STATUS } from '../constants/transactionTypes.js';

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Investment amount is required'],
      min: [1, 'Amount must be greater than 0'],
    },
    plan: {
      name: {
        type: String,
        required: true,
      },
      durationDays: {
        type: Number,
        required: true,
        min: [1, 'Duration must be at least 1 day'],
      },
      dailyROIPercentage: {
        type: Number,
        required: true,
        min: [0.01, 'Daily ROI percentage must be greater than 0'],
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(INVESTMENT_STATUS),
      default: INVESTMENT_STATUS.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for query optimization
investmentSchema.index({ user: 1, status: 1 });

// Validation: endDate must be after startDate
investmentSchema.pre('validate', function (next) {
  if (this.endDate && this.startDate && this.endDate <= this.startDate) {
    this.invalidate('endDate', 'End date must be after start date');
  }
  next();
});

investmentSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Investment = mongoose.model('Investment', investmentSchema);

export default Investment;
