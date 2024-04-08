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
import questionsRouter from './routes/questions.js';
import answersRouter from './routes/answers.js';
import medicinesRouter from './routes/medicines.js';
import recommendedPlanRouter from './routes/recommendedPlans.js';
import sleepWindowRouter from './routes/sleep-windows.js';
import filesRouter from './routes/files.js';

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
app.use('/questions', questionsRouter);
app.use('/recommended_plans', recommendedPlanRouter);
app.use('/answers', answersRouter);
app.use('/medicines', medicinesRouter);
app.use('/files', filesRouter);
app.use('/sleep-windows', sleepWindowRouter);

export default app;
