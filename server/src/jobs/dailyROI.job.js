import cron from 'node-cron';
import roiService from '../services/roi.service.js';

/**
 * Daily ROI Cron Job
 * 
 * Runs at midnight (00:00) every day.
 * This file is ONLY a trigger — no business logic here.
 * The actual ROI algorithm lives in roi.service.js.
 * 
 * NOTE: In Vercel serverless deployment, node-cron cannot run
 * because there is no persistent process. Use the protected
 * scheduler endpoint (/api/v1/internal/process-daily-roi) instead,
 * triggered by Vercel Cron or an external scheduler.
 */
export const initializeCronJobs = () => {
  // Schedule: midnight every day
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ [CRON] Daily ROI job triggered');

    try {
      const summary = await roiService.processDailyROI();
      console.log('⏰ [CRON] Daily ROI job completed:', JSON.stringify(summary));
    } catch (error) {
      console.error('⏰ [CRON] Daily ROI job failed:', error.message);
    }
  });

  console.log('⏰ Daily ROI cron job scheduled (runs at 00:00 daily)');
};
