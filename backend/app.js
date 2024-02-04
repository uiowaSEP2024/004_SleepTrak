var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Routes 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var plansRouter = require('./routes/plans');
var eventsRouter = require('./routes/events');
var babiesRouter = require('./routes/babies');

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
app.use('/plans', plansRouter);
app.use('/events', eventsRouter);
app.use('/babies', babiesRouter);

module.exports = app;
