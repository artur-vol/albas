import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';
import {
  getAllPublishers,
  getPublisherById,
  createPublisher,
  updatePublisher,
  deletePublisher
} from '../controllers/publishersController.js';

const router = express.Router();

router.get('/', authenticateToken, getAllPublishers);
router.get('/:id', authenticateToken, getPublisherById);
router.post('/', authenticateToken, adminOnly, createPublisher);
router.patch('/:id', authenticateToken, adminOnly, updatePublisher);
router.delete('/:id', authenticateToken, adminOnly, deletePublisher);

export default router;

