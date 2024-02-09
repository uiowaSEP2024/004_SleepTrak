const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const plansRouter = require('./routes/plans');
const eventsRouter = require('./routes/events');
const babiesRouter = require('./routes/babies');
const remindersRouter = require('./routes/reminders');

// Starts app
const app = express();

// App configurations
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Security configurations
app.use(
  cors({
    origin: [process.env.CALLBACK_URL, 'http://localhost:3000'] // Replace with allowed origins
  })
);

// Sets routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/plans', plansRouter);
app.use('/events', eventsRouter);
app.use('/babies', babiesRouter);
app.use('/reminders', remindersRouter);

module.exports = app;
