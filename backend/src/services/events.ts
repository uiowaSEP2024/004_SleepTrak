import { prisma } from '../../prisma/client';
import type { Event } from '@prisma/client';
import { ensureError } from '../utils/error';

const getAll = async (eventId: string): Promise<Event[] | Error> => {
  try {
    const result = await prisma.event.findMany();

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const get = async (eventId: string): Promise<Event | null | Error> => {
  try {
    const result = await prisma.event.findUnique({
      where: {
        eventId
      }
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const search = async (searchParams: any): Promise<Event[] | Error> => {
  try {
    const result = await prisma.event.findMany({
      where: searchParams
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const create = async (eventData: any): Promise<Event | Error> => {
  try {
    const result = await prisma.event.create({ data: eventData });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const update = async (
  eventId: string,
  valuesToUpdate: any
): Promise<Event | Error> => {
  try {
    const result = await prisma.event.update({
      where: {
        eventId
      },
      data: valuesToUpdate
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const destroy = async (eventId: string): Promise<Event | Error> => {
  try {
    const result = await prisma.event.delete({
      where: {
        eventId
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