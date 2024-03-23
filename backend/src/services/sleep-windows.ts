import { prisma } from '../../prisma/client.js';
import type { SleepWindow } from '@prisma/client';
import { ensureError } from '../utils/error.js';

const get = async (windowId: string): Promise<SleepWindow | null | Error> => {
  try {
    const result = await prisma.sleepWindow.findUnique({
      where: {
        windowId: windowId
      }
    });
    return result;
  } catch (err) {
    throw ensureError(err);
  }
};

const create = async (sleepWindowData: any): Promise<SleepWindow | Error> => {

  try {
    const newSleepWindow = await prisma.sleepWindow.create({
      data: sleepWindowData
    });
    return newSleepWindow;
  } catch (err) {
    throw ensureError(err);
  }
};

const update = async (
  windowId: string,
  sleepWindowDataToUpdate: any
): Promise<SleepWindow | Error> => {
  try {
    const updatedSleepWindow = await prisma.sleepWindow.update({
      where: {
        windowId: windowId
      },
      data: sleepWindowDataToUpdate
    });
    return updatedSleepWindow;
  } catch (err) {
    throw ensureError(err);
  }
};

const destroy = async (windowId: string): Promise<SleepWindow | Error> => {
  try {
    const result = await prisma.sleepWindow.delete({
      where: {
        windowId: windowId
      }
    });
    return result;
  } catch (err) {
    throw ensureError(err);
  }
};

export const service = {
  get,
  create,
  update,
  destroy
};
