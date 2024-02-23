const { prisma } = require('../../prisma/client');

module.exports = {
  getAll: async () => {
    try {
      const result = await prisma.reminder.findMany();

      return result;
    } catch (err) {
      return err;
    }
  },
  get: async (reminderId: string) => {
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
  search: async (searchParams: any) => {
    try {
      const result = await prisma.reminder.findMany({
        where: searchParams
      });

      return result;
    } catch (err) {
      return err;
    }
  },
  create: async (reminderData: any) => {
    try {
      const result = await prisma.reminder.create({ data: reminderData });

      return result;
    } catch (err) {
      return err;
    }
  },
  update: async (reminderId: string, valuesToUpdate: any) => {
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
  destroy: async (reminderId: string) => {
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
