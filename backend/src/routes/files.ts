import express from 'express';
import { controller } from '../controllers/files.js';
import { auth } from '../services/auth.js';
import { asyncHandler } from './handler.js';
import multer from 'multer';

const router = express.Router();

// Set up Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Protecting routes with auth0
router.use(auth.requireAuth);

// Routes
router.get('/:id', asyncHandler(controller.get));
router.post('/create', upload.single('file'), asyncHandler(controller.create));
router.post('/search', asyncHandler(controller.search));
router.delete('/:id/delete', asyncHandler(controller.destroy));

export default router;
