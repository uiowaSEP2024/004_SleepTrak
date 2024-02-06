var express = require('express');
var router = express.Router();
var { prisma } = require('../prisma/client');

router.get('/all', async (req, res) => {
  const users = await prisma.plan.findMany();
  res.json(users);
});

router.get('/search', async (req, res) => {
  const users = await prisma.plan.findMany({
    where: req.body
  });
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = await prisma.plan.findUnique({
    where: {
      planId: id
    }
  });
  res.json(user);
});

router.get('/:id/reminders', async (req, res) => {
  const { id } = req.params;

  const user = await prisma.reminder.findMany({
    where: {
      planId: id
    }
  });
  res.json(user);
});

router.post('/:id/reminders/create', async (req, res) => {
  const { id } = req.params;
  req.body.planId = id;

  const user = await prisma.reminder.create(req.body);
  res.json(user);
});

router.post('/create', async (req, res) => {
  const planParams = req.body;
  const result = await prisma.plan.create(planParams);
  res.json(result);
});

router.put('/:id/update', async (req, res) => {
  const { id } = req.params;
  const valuesToUpdate = req.body;
  const result = await prisma.user.update({
    where: {
      planId: id
    },
    data: valuesToUpdate
  });

  res.json(result);
});

router.delete('/:id/delete', async (req, res) => {
  const { id } = req.params;
  const result = await prisma.plan.delete({
    where: {
      planId: id
    }
  });
  res.json(result);
});

module.exports = router;
