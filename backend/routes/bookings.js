import express from 'express';
import {
  getAllBookings,
  createBooking,
  getUserBookings,
  cancelBooking
} from '../controllers/bookingController.js';

import { authenticateToken } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { notBlocked } from '../middleware/notBlocked.js';

const router = express.Router();

router.get('/all', authenticateToken, adminOnly, getAllBookings);
router.post('/', authenticateToken, notBlocked, createBooking);
router.get('/:userId', authenticateToken, notBlocked, getUserBookings);
router.delete('/:id', authenticateToken, notBlocked, cancelBooking);

export default router;

