var express = require('express');
var router = express.Router();
var { prisma } = require('../prisma/client');

router.get('/all', async (req, res) => {
  const users = await prisma.baby.findMany();
  res.json(users);
});

router.get('/search', async (req, res) => {
  const users = await prisma.baby.findMany({
    where: req.body
  });
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = await prisma.baby.findUnique({
    where: {
      babyId: id
    }
  });
  res.json(user);
});

router.post('/create', async (req, res) => {
  const babyParams = req.body;
  const result = await prisma.baby.create(babyParams);
  res.json(result);
});

router.put('/:id/update', async (req, res) => {
  const { id } = req.params;
  const valuesToUpdate = req.body;
  const result = await prisma.user.update({
    where: {
      babyId: id
    },
    data: valuesToUpdate
  });

  res.json(result);
});

router.delete('/:id/delete', async (req, res) => {
  const { id } = req.params;
  const result = await prisma.baby.delete({
    where: {
      babyId: id
    }
  });
  res.json(result);
});

module.exports = router;
