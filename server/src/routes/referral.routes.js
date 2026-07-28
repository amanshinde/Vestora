import { Router } from 'express';
import { getDirectReferrals, getReferralTree, getReferralIncome } from '../controllers/referral.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/direct', getDirectReferrals);
router.get('/tree', getReferralTree);
router.get('/income', getReferralIncome);

export default router;
