var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Routes 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Starts app
var app = express();

// App configurations
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sets routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
