import express from 'express';
import { controller } from '../controllers/users.js';
import { auth } from '../services/auth.js';
import { asyncHandler } from './handler.js';

const router = express.Router();

// Protecting routes with auth0
router.use(auth.requireAuth);

// Routes
router.get('/all', asyncHandler(controller.getAll));
router.get('/search', asyncHandler(controller.search));
router.get('/:id', asyncHandler(controller.get));
router.post('/create', asyncHandler(controller.create));
router.put('/:id/update', asyncHandler(controller.update));
router.delete('/:id/delete', asyncHandler(controller.destroy));

export default router;
