import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { notBlocked } from '../middleware/notBlocked.js';

import {
  getAllFines,
  getUserFines,
  markFinePaid
} from '../controllers/finesController.js';

const router = express.Router();

router.get('/all', authenticateToken, getAllFines);
router.get('/:userId', authenticateToken, notBlocked, getUserFines);
router.patch('/:fineId', authenticateToken, notBlocked, markFinePaid);

export default router;

