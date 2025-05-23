import express from 'express';
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from '../controllers/authorController.js';

import { authenticateToken } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = express.Router();

router.get('/', authenticateToken, getAllAuthors);
router.get('/:id', authenticateToken, getAuthorById);
router.post('/', authenticateToken, adminOnly, createAuthor);
router.patch('/:id', authenticateToken, adminOnly, updateAuthor);
router.delete('/:id', authenticateToken, adminOnly, deleteAuthor);

export default router;

