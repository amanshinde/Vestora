import { Router } from 'express';
import { getROIHistory } from '../controllers/roi.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/history', getROIHistory);

export default router;
