import { Router } from 'express';
import {
  login,
  verifyOtp,
  resendOtp,
  getSession,
  logout
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Rate limiters
const loginLimiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 10 });
const otpLimiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 12 });
const resendLimiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 5 });

// Step 1: Login with Email & Password -> Dispatches 6-digit OTP to admin Gmail
router.post('/login', loginLimiter, login);
router.post('/admin/login', loginLimiter, login);

// Step 2: Verify 6-digit OTP code -> Issues JWT authentication token
router.post('/verify-otp', otpLimiter, verifyOtp);
router.post('/verify-2fa', otpLimiter, verifyOtp);
router.post('/admin/verify-otp', otpLimiter, verifyOtp);

// Resend OTP code with cooldown enforcement
router.post('/resend-otp', resendLimiter, resendOtp);
router.post('/admin/resend-otp', resendLimiter, resendOtp);

// Active Session Profile Check
router.get('/session', requireAuth, getSession);
router.get('/me', requireAuth, getSession);

// Administrative Sign Out
router.post('/logout', logout);

export default router;
