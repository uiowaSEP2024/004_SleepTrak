import express from 'express';
import { controller } from '../controllers/babies';
import { auth } from '../services/auth';
const router = express.Router();

// Protecting routes with auth0
router.use(auth.requireAuth);

// Routes
router.get('/all', controller.getAll);
router.get('/search', controller.search);
router.get('/:id', controller.get);
router.post('/create', controller.create);
router.put('/:id/update', controller.update);
router.delete('/:id/delete', controller.destroy);

export default router;
