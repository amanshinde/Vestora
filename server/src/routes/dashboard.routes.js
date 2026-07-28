import { Router } from 'express';
import { getSummary, getEarnings } from '../controllers/dashboard.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/summary', getSummary);
router.get('/earnings', getEarnings);

export default router;
