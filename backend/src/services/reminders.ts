const { prisma } = require('../../prisma/client');

module.exports = {
  getAll: async (reminderId) => {
    try {
      const result = await prisma.reminder.findMany();

      return result;
    } catch (err) {
      return err;
    }
  },
  get: async (reminderId) => {
    console.log(reminderId);
    try {
      const result = await prisma.reminder.findUnique({
        where: {
          reminderId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  search: async (searchParams) => {
    try {
      const result = await prisma.reminder.findMany({
        where: searchParams
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  create: async (reminderData) => {
    try {
      const result = await prisma.reminder.create({ data: reminderData });

      return result;
    } catch (err) {
      return err;
    }
  },
  update: async (reminderId, valuesToUpdate) => {
    try {
      const result = await prisma.reminder.update({
        where: {
          reminderId
        },
        data: valuesToUpdate
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  destroy: async (reminderId) => {
    try {
      const result = await prisma.reminder.delete({
        where: {
          reminderId
        }
      });

      return result;
    } catch (err) {
      return err;
    }
  }
};
