import { Router } from 'express';
import { getEvents, createEvent, deleteEvent } from '../controllers/eventController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public: View upcoming events
router.get('/', getEvents);

// Protected: Admin schedule event
router.post('/', requireAuth, createEvent);

// Protected: Admin delete event
router.delete('/:id', requireAuth, deleteEvent);

export default router;
