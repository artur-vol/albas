import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { notBlocked } from '../middleware/notBlocked.js';

import {
  borrowBook,
  returnBook,
  adminReturnBook,
  adminBorrowBook,
  getAllBorrowings
} from '../controllers/borrowingController.js';

const router = express.Router();

router.post('/', authenticateToken, notBlocked, borrowBook);
router.post('/return', authenticateToken, notBlocked, returnBook);
router.post('/admin-return', authenticateToken, adminOnly, adminReturnBook);
router.post('/admin', authenticateToken, adminOnly, adminBorrowBook);
router.get('/all', authenticateToken, adminOnly, getAllBorrowings);

export default router;

