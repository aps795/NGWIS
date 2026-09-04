import { Router } from 'express';
import { login, verify2FA, getMe, logout } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();
const authLimiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 8 });

// Step 1: Login with User ID / Password -> requires 2FA code
router.post('/login', authLimiter, login);

// Step 2: Submit 6-digit OTP passcode -> returns JWT session token
router.post('/verify-2fa', authLimiter, verify2FA);

// Check active session token
router.get('/me', requireAuth, getMe);

// Logout session
router.post('/logout', requireAuth, logout);

export default router;
