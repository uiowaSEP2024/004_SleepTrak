var express = require('express');
var router = express.Router();
var { PrismaClient } = require("@prisma/client");
const { where } = require('sequelize');

const prisma = new PrismaClient();

router.get('/all', async (req, res) => {
  const users = await prisma.event.findMany()
  res.json(users)
});

router.get('/search', async (req, res) => {
  const users = await prisma.event.findMany({
    where: req.body
  })
  res.json(users)
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = await prisma.event
    .findUnique({
      where: {
        eventId: id,
      },
    });
  res.json(user);
})

router.post('/create', async (req, res) => {
  const eventParams = req.body;
  const result = await prisma.event.create(eventParams);
  res.json(result)
})


router.put('/:id/update', async (req, res) => {
  const { id } = req.params;
  const valuesToUpdate = req.body;
  const result = await prisma.user
    .update({
      where: {
        eventId: id
      },
      data: valuesToUpdate
    });

  res.json(result);
})

router.delete("/:id/delete", async (req, res) => {
  const { id } = req.params;
  const result = await prisma.event.delete({
    where: {
      eventId: id,
    }
  });
  res.json(result);
})

module.exports = router;

