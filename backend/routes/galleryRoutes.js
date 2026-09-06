import { Router } from 'express';
import {
  getGallery,
  createGalleryItem,
  deleteGalleryItem
} from '../controllers/galleryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public: View gallery items
router.get('/', getGallery);

// Protected: Admin add photo
router.post('/', requireAuth, createGalleryItem);

// Protected: Admin delete photo
router.delete('/:id', requireAuth, deleteGalleryItem);

export default router;
