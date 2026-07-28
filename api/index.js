import app from './server/src/app.js';
import connectDatabase from './server/src/config/database.js';

// Vercel serverless entry point
let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await connectDatabase();
    isConnected = true;
  }

  return app(req, res);
}
