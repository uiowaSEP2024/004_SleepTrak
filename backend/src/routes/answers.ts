import express from 'express';
import { controller } from '../controllers/answers.js';
import { auth } from '../services/auth.js';
import { asyncHandler } from './handler.js';

const router = express.Router();

// Protecting routes with auth0
router.use(auth.requireAuth);

// Routes
router.get('/create', asyncHandler(controller.create));

export default router;
