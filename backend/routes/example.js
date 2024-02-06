/*
    This is an example I made using the documentation. It's just for reference.
*/

var express = require('express');
var router = express.Router();
var { PrismaClient } = require('@prisma/client');
const { where } = require('sequelize');

const prisma = new PrismaClient();

app.post(`/post`, async (req, res) => {
  const { title, content, authorEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { email: authorEmail } }
    }
  });
  res.json(result);
});

app.put('/post/:id/views', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });

    res.json(post);
  } catch (error) {
    res.json({ error: `Post with ID ${id} does not exist in the database` });
  }
});

app.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: {
      id: Number(id)
    }
  });
  res.json(post);
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/user/:id/drafts', async (req, res) => {
  const { id } = req.params;

  const drafts = await prisma.user
    .findUnique({
      where: {
        id: Number(id)
      }
    })
    .posts({
      where: { published: false }
    });

  res.json(drafts);
});
module.exports = router;
