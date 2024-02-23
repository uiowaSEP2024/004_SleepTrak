const { prisma } = require('../../prisma/client');

module.exports = {
  getAll: async () => {
    try {
      const result = await prisma.event.findMany();

      return result;
    } catch (err) {
      return err;
    }
  },
  get: async (eventId: string) => {
    try {
      const result = await prisma.event.findUnique({
        where: {
          eventId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  search: async (searchParams: any) => {
    try {
      const result = await prisma.event.findMany({
        where: searchParams
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  create: async (eventData: any) => {
    try {
      const result = await prisma.event.create({ data: eventData });

      return result;
    } catch (err) {
      return err;
    }
  },
  update: async (eventId: string, valuesToUpdate: any) => {
    try {
      const result = await prisma.event.update({
        where: {
          eventId
        },
        data: valuesToUpdate
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  destroy: async (eventId: string) => {
    try {
      const result = await prisma.event.delete({
        where: {
          eventId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  }
};
