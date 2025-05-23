import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';

import {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre
} from '../controllers/genresController.js';

const router = express.Router();

router.get('/', authenticateToken, getAllGenres);
router.get('/:id', authenticateToken, getGenreById);
router.post('/', authenticateToken, adminOnly, createGenre);
router.patch('/:id', authenticateToken, adminOnly, updateGenre);
router.delete('/:id', authenticateToken, adminOnly, deleteGenre);

export default router;

