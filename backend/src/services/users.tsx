const { prisma } = require('../../prisma/client');

module.exports = {
  getAll: async () => {
    try {
      const result = await prisma.user.findMany();

      return result;
    } catch (err) {
      return err;
    }
  },
  get: async (userId: string) => {
    try {
      const result = await prisma.user.findUnique({
        where: {
          userId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  search: async (searchParams: any) => {
    try {
      const result = await prisma.user.findMany({
        where: searchParams
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  create: async (userData: any) => {
    try {
      const result = await prisma.user.create({ data: userData });

      return result;
    } catch (err) {
      return err;
    }
  },
  update: async (userId: string, valuesToUpdate: any) => {
    try {
      const result = await prisma.user.update({
        where: {
          userId
        },
        data: valuesToUpdate
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  destroy: async (userId: string) => {
    try {
      const result = await prisma.user.delete({
        where: {
          userId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  }
};
