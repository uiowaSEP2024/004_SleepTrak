const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');
const auth = require('../services/auth');

// Protecting routes with auth0
router.use(auth.requireAuth);

// Routes
router.get('/all', controller.getAll);
router.get('/search', controller.search);
router.get('/:id', controller.get);
router.post('/create', controller.create);
router.put('/:id/update', controller.update);
router.delete('/:id/delete', controller.destroy);

module.exports = router;
