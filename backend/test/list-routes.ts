import expressListEndpoints from 'express-list-endpoints';
import { writeFile } from 'fs/promises';
import app from '../src/app.js';

const endpoints = expressListEndpoints(app);

async function writeToFile(): Promise<void> {
  await writeFile('routes.json', JSON.stringify(endpoints));
}

writeToFile().catch(console.error);
