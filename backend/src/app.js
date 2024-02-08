var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv');

dotenv.config();

// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var plansRouter = require('./routes/plans');
var eventsRouter = require('./routes/events');
var babiesRouter = require('./routes/babies');
var remindersRouter = require('./routes/reminders');

// Starts app
var app = express();

// App configurations
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Sets routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/plans', plansRouter);
app.use('/events', eventsRouter);
app.use('/babies', babiesRouter);
app.use('/reminders', remindersRouter);
// Security configurations
app.use(
  cors({
    origin: [process.env.CALLBACK_URL, 'http://localhost:3000'] // Replace with allowed origins
  })
);
module.exports = app;
