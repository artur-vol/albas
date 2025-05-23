import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { notBlocked } from '../middleware/notBlocked.js';
import { getMyBooks } from '../controllers/myBooksController.js';

const router = express.Router();

router.get('/', authenticateToken, notBlocked, getMyBooks);

export default router;

