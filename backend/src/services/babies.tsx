const { prisma } = require('../../prisma/client');

module.exports = {
  getAll: async () => {
    try {
      const result = await prisma.baby.findMany();

      return result;
    } catch (err) {
      return err;
    }
  },
  get: async (babyId: string) => {
    try {
      const result = await prisma.baby.findUnique({
        where: {
          babyId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  search: async (searchParams: any) => {
    try {
      const result = await prisma.baby.findMany({
        where: searchParams
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  create: async (babyData: any) => {
    try {
      const result = await prisma.baby.create({ data: babyData });

      return result;
    } catch (err) {
      return err;
    }
  },
  update: async (babyId: string, valuesToUpdate: any) => {
    try {
      const result = await prisma.baby.update({
        where: {
          babyId
        },
        data: valuesToUpdate
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  destroy: async (babyId: string) => {
    try {
      const result = await prisma.baby.delete({
        where: {
          babyId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  }
};
