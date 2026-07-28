import crypto from 'crypto';
import User from '../models/User.js';

/**
 * Generates a collision-resistant referral code.
 * Format: 2 uppercase letters + 6 hex chars (e.g., NX-AB3F9C1D)
 * Retries if a collision is detected.
 */
const generateReferralCode = async () => {
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const prefix = 'NX';
    const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
    const code = `${prefix}-${randomPart}`;

    // Check for collision
    const existing = await User.findOne({ referralCode: code }).lean();
    if (!existing) {
      return code;
    }
  }

  throw new Error('Failed to generate unique referral code after maximum attempts');
};

export default generateReferralCode;
