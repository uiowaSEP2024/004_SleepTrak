import express from 'express';
import path from 'path';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import plansRouter from './routes/plans';
import eventsRouter from './routes/events';
import babiesRouter from './routes/babies';
import remindersRouter from './routes/reminders';

dotenv.config();

// Starts app
const app = express();

// App configurations
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Security configurations
app.use(cors());

// Sets routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/plans', plansRouter);
app.use('/events', eventsRouter);
app.use('/babies', babiesRouter);
app.use('/reminders', remindersRouter);

export default app;
