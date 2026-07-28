import mongoose from 'mongoose';
import { ROI_STATUS } from '../constants/transactionTypes.js';

const roiHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
      required: true,
    },
    roiAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    roiPercentage: {
      type: Number,
      required: true,
      min: 0,
    },
    processingDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ROI_STATUS),
      default: ROI_STATUS.CREDITED,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * CRITICAL INDEX: Prevents duplicate daily ROI for the same investment.
 * This is the database-level safeguard (Layer 2) against duplicate processing.
 */
roiHistorySchema.index({ investment: 1, processingDate: 1 }, { unique: true });

// Additional query indexes
roiHistorySchema.index({ user: 1, processingDate: -1 });

roiHistorySchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const ROIHistory = mongoose.model('ROIHistory', roiHistorySchema);

export default ROIHistory;
