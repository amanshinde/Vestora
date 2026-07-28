/**
 * Wallet Transaction Types
 * Used for audit trail in WalletTransaction model.
 */
export const TRANSACTION_TYPES = {
  ROI_CREDIT: 'ROI_CREDIT',
  REFERRAL_CREDIT: 'REFERRAL_CREDIT',
  INVESTMENT_DEBIT: 'INVESTMENT_DEBIT',
  ADJUSTMENT: 'ADJUSTMENT',
};

/**
 * Investment Statuses
 */
export const INVESTMENT_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

/**
 * Account Statuses
 */
export const ACCOUNT_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  BLOCKED: 'BLOCKED',
};

/**
 * ROI History Statuses
 */
export const ROI_STATUS = {
  CREDITED: 'CREDITED',
  FAILED: 'FAILED',
};

/**
 * Investment Plans Configuration
 * 
 * ASSUMPTION: Specific plans are not defined by the assessment.
 * These are configurable defaults documented in the README.
 */
export const INVESTMENT_PLANS = {
  STARTER: {
    name: 'Starter',
    minAmount: 1000,
    maxAmount: 10000,
    durationDays: 30,
    dailyROIPercentage: 1,
  },
  GROWTH: {
    name: 'Growth',
    minAmount: 10001,
    maxAmount: 50000,
    durationDays: 60,
    dailyROIPercentage: 1.5,
  },
  PREMIUM: {
    name: 'Premium',
    minAmount: 50001,
    maxAmount: Infinity,
    durationDays: 90,
    dailyROIPercentage: 2,
  },
};
