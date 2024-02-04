var express = require('express');
var router = express.Router();
var { PrismaClient } = require("@prisma/client");
const { where } = require('sequelize');

const prisma = new PrismaClient();


router.get('/all', async (req, res) => {
    const reminders = await prisma.reminder.findMany()
    res.json(reminders)
});

router.get('/search', async (req, res) => {
    const reminders = await prisma.reminder.findMany({
        where: req.body
    })
    res.json(reminders)
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const reminder = await prisma.reminder
        .findUnique({
            where: {
                reminderId: id,
            },
        });
    res.json(reminder);
})

router.post('/create', async (req, res) => {
    const reminderParams = req.body;
    const result = await prisma.reminder.create(reminderParams);
    res.json(result)
})


router.put('/:id/update', async (req, res) => {
    const { id } = req.params;
    const valuesToUpdate = req.body;
    const result = await prisma.reminder
        .update({
            where: {
                reminderId: id
            },
            data: valuesToUpdate
        });

    res.json(result);
})

router.delete("/:id/delete", async (req, res) => {
    const { id } = req.params;
    const result = await prisma.reminder.delete({
        where: {
            reminderId: id,
        }
    });
    res.json(result);
})

module.exports = router;
