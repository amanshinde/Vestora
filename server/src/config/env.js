import dotenv from 'dotenv';

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/vestora',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret_key_vestora_prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || '*',
  CRON_SECRET: process.env.CRON_SECRET || 'default_cron_secret_vestora',
};

// Log warning if fallback defaults are active in production
if (!process.env.MONGODB_URI) {
  console.warn('⚠️ Warning: MONGODB_URI environment variable is not defined in process.env. Defaulting to local instance.');
}

export default env;
