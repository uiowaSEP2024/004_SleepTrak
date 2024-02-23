import express from 'express';
import { controller } from '../controllers/reminders';
const router = express.Router();

router.get('/all', controller.getAll);
router.get('/search', controller.search);
router.get('/:id', controller.get);
router.post('/create', controller.create);
router.put('/:id/update', controller.update);
router.delete('/:id/delete', controller.destroy);

export default router;
