// Loads .env once, validates the critical keys exist, and exports a single
// typed config object so the rest of the app never touches process.env directly.
require('dotenv').config();

const required = [
  'DB_URI',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'ENCRYPTION_SECRET_KEY',
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  // Fail fast: an app with half-configured secrets is worse than one that won't boot.
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`,

  db: {
    uri: process.env.DB_URI,
  },

  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  },

  encryptionKey: process.env.ENCRYPTION_SECRET_KEY,
  saltRounds: Number(process.env.SALT_ROUNDS) || 10,

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
  },
};
