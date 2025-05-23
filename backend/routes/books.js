import express from 'express';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';

import { authenticateToken } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { notBlocked } from '../middleware/notBlocked.js';

const router = express.Router();

router.get('/', authenticateToken, notBlocked, getAllBooks);
router.get('/:id', authenticateToken, notBlocked, getBookById);
router.post('/', authenticateToken, notBlocked, adminOnly, createBook);
router.patch('/:id', authenticateToken, notBlocked, adminOnly, updateBook);
router.delete('/:id', authenticateToken, notBlocked, adminOnly, deleteBook);

export default router;

