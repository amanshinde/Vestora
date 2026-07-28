import { Router } from 'express';
import { register, login, getMe, addDemoFunds } from '../controllers/auth.controller.js';
import validate from '../middleware/validate.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', authMiddleware, getMe);
router.post('/add-demo-funds', authMiddleware, addDemoFunds);

export default router;
