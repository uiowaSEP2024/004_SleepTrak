var { prisma } = require('../../prisma/client');

module.exports = {
  getAll: async (eventId) => {
    try {
      const result = await prisma.event.findMany();

      return result;
    } catch (err) {
      return err;
    }
  },
  get: async (eventId) => {
    console.log(eventId);
    try {
      const result = await prisma.event.findUnique({
        where: {
          eventId: eventId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  search: async (searchParams) => {
    try {
      const result = await prisma.event.findMany({
        where: searchParams
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  create: async (eventData) => {
    try {
      const result = await prisma.event.create({ data: eventData });

      return result;
    } catch (err) {
      return err;
    }
  },
  update: async (eventId, valuesToUpdate) => {
    try {
      const result = await prisma.user.update({
        where: {
          eventId: eventId
        },
        data: valuesToUpdate
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  destroy: async (eventId) => {
    try {
      const result = await prisma.event.delete({
        where: {
          eventId: eventId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  }
};
