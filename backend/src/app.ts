import express from 'express';
import path from 'path';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import plansRouter from './routes/plans.js';
import eventsRouter from './routes/events.js';
import babiesRouter from './routes/babies.js';
import remindersRouter from './routes/reminders.js';

dotenv.config();

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// Starts app
const app = express();

// App configurations
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(_dirname, 'public')));

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
