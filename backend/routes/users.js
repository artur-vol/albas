import express from 'express';
import {
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  blockUser,
  unblockUser,
  deleteUser,
  changeUserRole
} from '../controllers/usersController.js';

import { authenticateToken } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { notBlocked } from '../middleware/notBlocked.js';

const router = express.Router();

router.get('/', authenticateToken, notBlocked, adminOnly, getAllUsers);
router.get('/me', authenticateToken, notBlocked, getCurrentUser);
router.get('/:id', authenticateToken, notBlocked, getUserById);
router.patch('/:id', authenticateToken, notBlocked, updateUser);
router.post('/:id/block', authenticateToken, adminOnly, blockUser);
router.post('/:id/unblock', authenticateToken, adminOnly, unblockUser);
router.delete('/:id', authenticateToken, adminOnly, deleteUser);
router.patch('/:id/role', authenticateToken, adminOnly, changeUserRole);

export default router;

