import { Router } from 'express';
import { createInvestment, getUserInvestments, getInvestmentById } from '../controllers/investment.controller.js';
import validate from '../middleware/validate.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { createInvestmentSchema } from '../validators/investment.validator.js';

const router = Router();

// All investment routes require authentication
router.use(authMiddleware);

router.post('/', validate(createInvestmentSchema), createInvestment);
router.get('/', getUserInvestments);
router.get('/:id', getInvestmentById);

export default router;
