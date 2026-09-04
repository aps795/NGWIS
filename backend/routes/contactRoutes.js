import { Router } from 'express';
import { submitContact, getContactMessages } from '../controllers/contactController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();
const contactLimiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 5 });

// Public: Submit contact form message
router.post('/', contactLimiter, submitContact);

// Protected: Admin review messages
router.get('/', requireAuth, getContactMessages);

export default router;
