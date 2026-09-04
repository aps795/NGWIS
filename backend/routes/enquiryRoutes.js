import { Router } from 'express';
import {
  createEnquiry,
  getEnquiries,
  updateEnquiry,
  deleteEnquiry
} from '../controllers/enquiryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();
const enquiryLimiter = createRateLimiter({ windowMs: 60 * 1000, maxRequests: 5 });

// Public: Submit admission enquiry
router.post('/', enquiryLimiter, createEnquiry);

// Protected: Admin list enquiries
router.get('/', requireAuth, getEnquiries);

// Protected: Admin update status / notes
router.patch('/:id', requireAuth, updateEnquiry);

// Protected: Admin delete enquiry
router.delete('/:id', requireAuth, deleteEnquiry);

export default router;
