var express = require('express');
var router = express.Router();
var controller = require('../controllers/babies');

router.get('/all', controller.getAll);
router.get('/search', controller.search);
router.get('/:id', controller.get);
router.post('/create', controller.create);
router.put('/:id/update', controller.update);
router.delete('/:id/delete', controller.destroy);

module.exports = router;
