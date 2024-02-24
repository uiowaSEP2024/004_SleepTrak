import { Router } from 'express';

const router = Router();

interface ResponseWithRender extends Response {
  render: (view: string, locals?: Record<string, any>) => void;
}

/* GET home page. */
router.get('/', function (res: ResponseWithRender) {
  res.render('index', { title: 'Express' });
});

export default router;
