import { Router } from 'express';
import roiService from '../services/roi.service.js';
import env from '../config/env.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

const router = Router();

/**
 * Protected scheduler endpoint for Vercel cron or external triggers.
 * Calls the same roiService.processDailyROI() as the node-cron job.
 * Protected by CRON_SECRET — not available to normal authenticated users.
 */
router.post(
  '/process-daily-roi',
  asyncHandler(async (req, res) => {
    // Validate cron secret
    const cronSecret = req.headers['x-cron-secret'] || req.query.secret;

    if (!cronSecret || cronSecret !== env.CRON_SECRET) {
      throw ApiError.unauthorized('Invalid scheduler secret.', 'UNAUTHORIZED');
    }

    const summary = await roiService.processDailyROI();

    res.json({
      success: true,
      data: summary,
    });
  })
);

export default router;
