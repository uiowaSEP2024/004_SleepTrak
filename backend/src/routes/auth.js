var express = require('express');
var router = express.Router();
var controller = require('../controllers/auth');

// Login Route
app.get('/login', controller.login);
app.get('/callback', controller.callback);
