import app from './app.js';
import env from './config/env.js';
import connectDatabase from './config/database.js';
import { initializeCronJobs } from './jobs/dailyROI.job.js';

const startServer = async () => {
  // Connect to MongoDB
  await connectDatabase();

  // Initialize scheduled jobs (only in non-serverless environments)
  if (env.NODE_ENV !== 'production') {
    initializeCronJobs();
  }

  // Start server
  const PORT = env.PORT;
  app.listen(PORT, () => {
    console.log(`🚀 Vestora server running on port ${PORT} (${env.NODE_ENV})`);
  });
};

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
