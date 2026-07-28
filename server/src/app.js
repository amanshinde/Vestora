import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import investmentRoutes from './routes/investment.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import roiRoutes from './routes/roi.routes.js';
import referralRoutes from './routes/referral.routes.js';
import schedulerRoutes from './routes/scheduler.routes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/investments', investmentRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/roi', roiRoutes);
app.use('/api/v1/referrals', referralRoutes);
app.use('/api/v1/internal', schedulerRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
