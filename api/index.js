import app from '../server/src/app.js';
import connectDatabase from '../server/src/config/database.js';

export default async function handler(req, res) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Serverless initialization failed:', error);

    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      code: 'DB_CONNECTION_ERROR',
    });
  }
}