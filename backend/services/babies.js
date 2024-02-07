var { prisma } = require('../prisma/client');

module.exports = {
  getAll: async (babyId) => {
    try {
      const result = await prisma.baby.findMany();

      return result;
    } catch (err) {
      return err;
    }
  },
  get: async (babyId) => {
    console.log(babyId);
    try {
      const result = await prisma.baby.findUnique({
        where: {
          babyId: babyId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  search: async (searchParams) => {
    try {
      const result = await prisma.baby.findMany({
        where: searchParams
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  create: async (babyData) => {
    try {
      const result = await prisma.baby.create({ data: babyData });

      return result;
    } catch (err) {
      return err;
    }
  },
  update: async (babyId, valuesToUpdate) => {
    try {
      const result = await prisma.user.update({
        where: {
          babyId: babyId
        },
        data: valuesToUpdate
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  destroy: async (babyId) => {
    try {
      const result = await prisma.baby.delete({
        where: {
          babyId: babyId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  }
};
