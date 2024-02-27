var { prisma } = require('../../prisma/client');

module.exports = {
  getAll: async (userId) => {
    try {
      const result = await prisma.user.findMany({
        include: {
          Babies: true
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  get: async (userId) => {
    try {
      const result = await prisma.user.findUnique({
        where: {
          userId: userId
        },
        include: {
          Babies: true
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  search: async (searchParams) => {
    try {
      const result = await prisma.user.findMany({
        where: searchParams
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  create: async (userData) => {
    try {
      const result = await prisma.user.create({ data: userData });

      return result;
    } catch (err) {
      return err;
    }
  },
  update: async (userId, valuesToUpdate) => {
    try {
      const result = await prisma.user.update({
        where: {
          userId: userId
        },
        data: valuesToUpdate
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  destroy: async (userId) => {
    try {
      const result = await prisma.user.delete({
        where: {
          userId: userId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  }
};
