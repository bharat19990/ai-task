import express from 'express';
import { generateContent } from './ai.controller.js';
import { protect } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateContent);

export default router;
