import type { Reminder } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { ensureError } from '../utils/error';

const getAll = async (): Promise<Reminder[] | Error> => {
  try {
    const result = await prisma.reminder.findMany();

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const get = async (reminderId: string): Promise<Reminder | null | Error> => {
  try {
    const result = await prisma.reminder.findUnique({
      where: {
        reminderId
      }
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const search = async (searchParams: any): Promise<Reminder[] | Error> => {
  try {
    const result = await prisma.reminder.findMany({
      where: searchParams
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const create = async (reminderData: any): Promise<Reminder | Error> => {
  try {
    const result = await prisma.reminder.create({ data: reminderData });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const update = async (
  reminderId: string,
  valuesToUpdate: any
): Promise<Reminder | Error> => {
  try {
    const result = await prisma.reminder.update({
      where: {
        reminderId
      },
      data: valuesToUpdate
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const destroy = async (reminderId: string): Promise<Reminder | Error> => {
  try {
    const result = await prisma.reminder.delete({
      where: {
        reminderId
      }
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};

export const service = {
  getAll,
  get,
  search,
  create,
  update,
  destroy
};
