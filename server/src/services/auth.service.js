import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import generateReferralCode from '../utils/generateReferralCode.js';
import generateToken from '../utils/generateToken.js';
import walletService from './wallet.service.js';
import { TRANSACTION_TYPES } from '../constants/transactionTypes.js';

/**
 * Auth Service — contains all authentication business logic and demo balance management.
 */
const authService = {
  /**
   * Register a new user.
   * Validates referral code if provided, hashes password, generates unique referral code,
   * and initializes account with ₹100,000 demo trading capital.
   */
  async register({ fullName, email, mobile, password, referralCode }) {
    // Check for existing user by email
    const existingEmail = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existingEmail) {
      throw ApiError.conflict('A user with this email already exists.', 'USER_ALREADY_EXISTS');
    }

    // Check for existing user by mobile
    const existingMobile = await User.findOne({ mobile }).lean();
    if (existingMobile) {
      throw ApiError.conflict('A user with this mobile number already exists.', 'USER_ALREADY_EXISTS');
    }

    // Validate referral code if provided
    let referredByUser = null;
    if (referralCode && referralCode.trim()) {
      referredByUser = await User.findOne({ referralCode: referralCode.trim() }).lean();
      if (!referredByUser) {
        throw ApiError.badRequest('Invalid referral code.', 'INVALID_REFERRAL_CODE');
      }
    }

    // Generate unique referral code for new user
    const newReferralCode = await generateReferralCode();

    // Create user with ₹100,000 test capital
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      mobile,
      passwordHash: password,
      referralCode: newReferralCode,
      referredBy: referredByUser ? referredByUser._id : null,
      walletBalance: 100000,
    });

    // Log initial demo capital deployment in transaction ledger
    try {
      await walletService.creditWallet(
        user._id,
        0, // balance already initialized at 100000 in constructor, just recording or we can create transaction
        TRANSACTION_TYPES.ADJUSTMENT,
        'User',
        user._id,
        'Initial Demo Capital Allocation',
        null
      ).catch(() => {});
    } catch (e) {}

    // Generate JWT
    const token = generateToken(user._id);

    return {
      user: user.toJSON(),
      token,
    };
  },

  /**
   * Login a user.
   * Validates credentials and account status.
   */
  async login({ email, password }) {
    // Find user (include passwordHash for comparison)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    // Check account status
    if (user.accountStatus !== 'ACTIVE') {
      throw ApiError.unauthorized('Account is not active. Please contact support.', 'ACCOUNT_INACTIVE');
    }

    // Generate JWT
    const token = generateToken(user._id);

    return {
      user: user.toJSON(),
      token,
    };
  },

  /**
   * Get current user profile.
   */
  async getProfile(userId) {
    const user = await User.findById(userId).select('-passwordHash').lean();
    if (!user) {
      throw ApiError.notFound('User not found.');
    }
    return user;
  },

  /**
   * Add demo test capital (₹100,000) to member account.
   */
  async addDemoFunds(userId) {
    await walletService.creditWallet(
      userId,
      100000,
      TRANSACTION_TYPES.ADJUSTMENT,
      'Adjustment',
      userId,
      'Demo Capital Recharge (+₹100,000)',
      null
    );
    const updatedUser = await User.findById(userId).select('-passwordHash').lean();
    return updatedUser;
  },
};

export default authService;
