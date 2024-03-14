import express from 'express';
import { controller } from '../controllers/recommendedPlans.js';
import { auth } from '../services/auth.js';
import { asyncHandler } from './handler.js';

const router = express.Router();

// Protecting routes with auth0
router.use(auth.requireAuth);

// Routes
router.get('/:id', asyncHandler(controller.get));

export default router;
