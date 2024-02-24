import { prisma } from '../../prisma/client.js';
import type { Baby } from '@prisma/client';
import { ensureError } from '../utils/error.js';

const getAll = async (): Promise<Baby[] | Error> => {
  try {
    const result = await prisma.baby.findMany();

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const get = async (babyId: string): Promise<Baby | null | Error> => {
  try {
    const result = await prisma.baby.findUnique({
      where: {
        babyId
      }
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const search = async (searchParams: any): Promise<Baby[] | Error> => {
  try {
    const result = await prisma.baby.findMany({
      where: searchParams
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const create = async (babyData: any): Promise<Baby | Error> => {
  try {
    const result = await prisma.baby.create({ data: babyData });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const update = async (
  babyId: string,
  valuesToUpdate: any
): Promise<Baby | Error> => {
  try {
    const result = await prisma.baby.update({
      where: {
        babyId
      },
      data: valuesToUpdate
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const destroy = async (babyId: string): Promise<Baby | Error> => {
  try {
    const result = await prisma.baby.delete({
      where: {
        babyId
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
