import { Router } from 'express';
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice
} from '../controllers/noticeController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public: View published notices
router.get('/', getNotices);

// Protected: Admin create notice
router.post('/', requireAuth, createNotice);

// Protected: Admin update notice
router.put('/:id', requireAuth, updateNotice);

// Protected: Admin delete notice
router.delete('/:id', requireAuth, deleteNotice);

export default router;
