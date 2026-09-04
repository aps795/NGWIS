import dotenv from 'dotenv';
dotenv.config();

const getOrigins = () => {
  const list = [];
  if (process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL.split(',').forEach(o => list.push(o.trim().replace(/\/$/, '')));
  }
  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',').forEach(o => list.push(o.trim().replace(/\/$/, '')));
  }
  if (list.length === 0) {
    list.push('http://localhost:5173', 'https://aps795.github.io');
  }
  return list;
};

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'ngwis_default_dev_jwt_secret_change_in_prod_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  master2faCode: process.env.MASTER_2FA_CODE || '201608',
  otpExpirySeconds: parseInt(process.env.OTP_EXPIRY_SECONDS || '300', 10),
  frontendUrl: process.env.FRONTEND_URL || '',
  allowedOrigins: getOrigins(),
};
