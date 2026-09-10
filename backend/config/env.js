import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Ephemeral cryptographic fallback for local development only
const defaultDevSecret = crypto.randomBytes(32).toString('hex');

const getOrigins = () => {
  const list = [];
  if (process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL.split(',').forEach(o => list.push(o.trim().replace(/\/$/, '')));
  }
  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',').forEach(o => list.push(o.trim().replace(/\/$/, '')));
  }
  if (list.length === 0) {
    list.push('http://localhost:5173', 'https://aps795.github.io', 'https://ngwis.vercel.app');
  }
  return list;
};

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || (isProduction ? '' : defaultDevSecret),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  master2faCode: process.env.MASTER_2FA_CODE ? process.env.MASTER_2FA_CODE.trim() : '',
  otpExpirySeconds: parseInt(process.env.OTP_EXPIRY_SECONDS || '300', 10),
  adminEmail: (process.env.ADMIN_EMAIL || 'admin@newglobalwisdom.edu.in').toLowerCase().trim(),
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH ? process.env.ADMIN_PASSWORD_HASH.trim() : '',
  smtpHost: (process.env.SMTP_HOST || 'smtp.gmail.com').trim(),
  smtpPort: parseInt(process.env.SMTP_PORT || '465', 10),
  smtpUser: (process.env.SMTP_USER || process.env.EMAIL_USER || '').toLowerCase().trim(),
  smtpAppPassword: (process.env.SMTP_APP_PASSWORD || process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS || '').trim(),
  sessionSecret: process.env.SESSION_SECRET || (isProduction ? '' : defaultDevSecret),
  frontendUrl: process.env.FRONTEND_URL || '',
  allowedOrigins: getOrigins(),
};
