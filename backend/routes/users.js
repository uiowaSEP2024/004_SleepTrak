var express = require('express');
var router = express.Router();
var { prisma } = require('../prisma/client');

router.get('/all', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.get('/search', async (req, res) => {
  const users = await prisma.user.findMany({
    where: req.body
  });
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      userId: id
    }
  });
  res.json(user);
});

router.post('/create', async (req, res) => {
  const userParams = req.body;
  const result = await prisma.user.create(userParams);
  res.json(result);
});

router.put('/:id/update', async (req, res) => {
  const { id } = req.params;
  const valuesToUpdate = req.body;
  const result = await prisma.user.update({
    where: {
      userId: id
    },
    data: valuesToUpdate
  });

  res.json(result);
});

router.delete('/:id/delete', async (req, res) => {
  const { id } = req.params;
  const result = await prisma.user.delete({
    where: {
      userId: id
    }
  });
  res.json(result);
});

module.exports = router;
