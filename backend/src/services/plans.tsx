const { prisma } = require('../../prisma/client');

module.exports = {
  getAll: async () => {
    try {
      const result = await prisma.plan.findMany();

      return result;
    } catch (err) {
      return err;
    }
  },
  get: async (planId: string) => {
    try {
      const result = await prisma.plan.findUnique({
        where: {
          planId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  search: async (searchParams: any) => {
    try {
      const result = await prisma.plan.findMany({
        where: searchParams
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  create: async (planData: any) => {
    try {
      const result = await prisma.plan.create({ data: planData });

      return result;
    } catch (err) {
      return err;
    }
  },
  update: async (planId: string, valuesToUpdate: any) => {
    try {
      const result = await prisma.plan.update({
        where: {
          planId
        },
        data: valuesToUpdate
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  destroy: async (planId: string) => {
    try {
      const result = await prisma.plan.delete({
        where: {
          planId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  }
};
