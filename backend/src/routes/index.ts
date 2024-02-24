import { Router } from 'express';
import type { Response } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const router = Router();

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

/* GET home page. */
router.get('/', function (res: Response) {
  res.render = function (view: string, options?: Record<string, any>) {
    const viewPath: string = path.join(_dirname, '../public', view) + '.html';
    let html = fs.readFileSync(viewPath, 'utf8');

    // Replace placeholders with options
    for (const key in options) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, options[key]);
    }

    // Send the rendered HTML
    this.send(html);
  };
  res.render('index', { title: 'Express' });
});

export default router;
