import User from '../models/User.js';
import ReferralIncome from '../models/ReferralIncome.js';
import walletService from './wallet.service.js';
import { REFERRAL_LEVELS, MAX_REFERRAL_DEPTH } from '../constants/referralLevels.js';
import { TRANSACTION_TYPES } from '../constants/transactionTypes.js';

/**
 * Referral Service — handles multi-level referral income distribution
 * and referral tree construction.
 */
const referralService = {
  /**
   * Distribute level income up the referral chain.
   * 
   * ASSUMPTION: Level income is calculated as a percentage of the daily ROI amount.
   * This is triggered within the same transaction as ROI processing.
   * 
   * Flow:
   *   1. Get investor's referredBy (Level 1 parent)
   *   2. Calculate configured percentage of ROI
   *   3. Credit parent wallet
   *   4. Move to parent's referredBy (Level 2)
   *   5. Continue until max level or no parent
   */
  async distributeLevelIncome(sourceUserId, roiAmount, investmentId, roiHistoryId, processingDate, session) {
    let currentUserId = sourceUserId;

    for (let level = 1; level <= MAX_REFERRAL_DEPTH; level++) {
      // Get current user's parent
      const currentUser = await User.findById(currentUserId).select('referredBy').session(session).lean();

      if (!currentUser || !currentUser.referredBy) {
        break; // No more parents in the chain
      }

      const parentUserId = currentUser.referredBy;
      const percentage = REFERRAL_LEVELS[level];

      if (!percentage) {
        break; // No configured percentage for this level
      }

      // Calculate referral income
      const referralAmount = Math.round(roiAmount * (percentage / 100) * 100) / 100;

      if (referralAmount <= 0) {
        currentUserId = parentUserId;
        continue;
      }

      try {
        // Create referral income record
        await ReferralIncome.create(
          [
            {
              receiverUser: parentUserId,
              sourceUser: sourceUserId,
              investment: investmentId,
              roiHistory: roiHistoryId,
              level,
              percentage,
              amount: referralAmount,
              processingDate,
            },
          ],
          { session }
        );

        // Credit parent's wallet
        await walletService.creditWallet(
          parentUserId,
          referralAmount,
          TRANSACTION_TYPES.REFERRAL_CREDIT,
          'ReferralIncome',
          roiHistoryId,
          `Level ${level} referral income (${percentage}%) from ROI`,
          session
        );
      } catch (error) {
        // Handle duplicate referral income (unique index protection)
        if (error.code === 11000) {
          console.warn(`⚠️ Duplicate referral income skipped: receiver=${parentUserId}, level=${level}`);
        } else {
          throw error;
        }
      }

      // Move up the chain
      currentUserId = parentUserId;
    }
  },

  /**
   * Get direct referrals for a user (Level 1 only).
   */
  async getDirectReferrals(userId) {
    const referrals = await User.find({ referredBy: userId })
      .select('fullName email mobile referralCode createdAt walletBalance')
      .sort({ createdAt: -1 })
      .lean();

    return referrals;
  },

  /**
   * Build the complete referral tree using BFS.
   * Avoids uncontrolled N+1 recursion by using batched queries with depth limiting.
   */
  async getReferralTree(userId, maxDepth = MAX_REFERRAL_DEPTH) {
    const buildLevel = async (parentIds, currentDepth) => {
      if (currentDepth > maxDepth || parentIds.length === 0) {
        return [];
      }

      // Batch query: find all users referred by any of the parent IDs
      const children = await User.find({ referredBy: { $in: parentIds } })
        .select('_id fullName email referralCode referredBy createdAt')
        .lean();

      if (children.length === 0) {
        return [];
      }

      // Recursively get next level
      const childIds = children.map((c) => c._id);
      const grandchildren = await buildLevel(childIds, currentDepth + 1);

      // Build tree structure
      return children.map((child) => ({
        ...child,
        level: currentDepth,
        children: grandchildren.filter(
          (gc) => gc.referredBy && gc.referredBy.toString() === child._id.toString()
        ),
      }));
    };

    // Start from the root user's direct referrals
    const tree = await buildLevel([userId], 1);

    // Clean up internal fields from tree nodes
    const cleanTree = (nodes) =>
      nodes.map((node) => ({
        _id: node._id,
        fullName: node.fullName,
        email: node.email,
        referralCode: node.referralCode,
        level: node.level,
        createdAt: node.createdAt,
        children: node.children ? cleanTree(node.children) : [],
      }));

    return cleanTree(tree);
  },

  /**
   * Get paginated referral income history for a user.
   */
  async getReferralIncome(userId, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const [incomes, total] = await Promise.all([
      ReferralIncome.find({ receiverUser: userId })
        .populate('sourceUser', 'fullName email')
        .sort({ processingDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReferralIncome.countDocuments({ receiverUser: userId }),
    ]);

    return {
      incomes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },
};

export default referralService;
