var express = require('express');
var router = express.Router();
var controller = require('../controllers/reminders');
var auth = require('../services/auth');

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
