import mongoose from 'mongoose';
import app from '../server/src/app.js';
import connectDatabase from '../server/src/config/database.js';

// Vercel serverless entry point with persistent MongoDB pool reuse
export default async function handler(req, res) {
  try {
    if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
      await connectDatabase();
    }
  } catch (error) {
    console.error('❌ Serverless database connection failed:', error.message);
    return res.status(500).json({
      success: false,
      message: `Cloud Database Connection Error: Could not connect to MongoDB Atlas (${error.message}). Please ensure your MONGODB_URI is correctly configured in Vercel Settings -> Environment Variables and that Network Access in MongoDB Atlas is set to Allow Access From Anywhere (0.0.0.0/0).`,
      code: 'DB_CONNECTION_ERROR',
    });
  }

  return app(req, res);
}
