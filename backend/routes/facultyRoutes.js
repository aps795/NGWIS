import { Router } from 'express';
import {
  getFaculty,
  createFacultyMember,
  updateFacultyMember,
  deleteFacultyMember
} from '../controllers/facultyController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public: View faculty members
router.get('/', getFaculty);

// Protected: Admin / IT Admin create faculty member
router.post('/', requireAuth, createFacultyMember);

// Protected: Admin / IT Admin update faculty member
router.put('/:id', requireAuth, updateFacultyMember);

// Protected: Admin / IT Admin delete faculty member
router.delete('/:id', requireAuth, deleteFacultyMember);

export default router;
