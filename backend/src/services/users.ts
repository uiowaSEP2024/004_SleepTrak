import { prisma } from '../../prisma/client.js';
import type { User } from '@prisma/client';
import { ensureError } from '../utils/error.js';

const getAll = async (): Promise<User[] | Error> => {
  try {
    const result = await prisma.user.findMany({
      include: {
        babies: true
      }
    });

    return result;
  } catch (err) {
    throw ensureError(err);
  }
};
const get = async (userId: string): Promise<User | null | Error> => {
  try {
    const result = await prisma.user.findUnique({
      where: {
        userId
      },
      include: {
        babies: true
      }
    });

    return result;
  } catch (err) {
    throw ensureError(err);
  }
};
const search = async (searchParams: any): Promise<User[] | Error> => {
  try {
    const result = await prisma.user.findMany({
      where: searchParams
    });

    return result;
  } catch (err) {
    throw ensureError(err);
  }
};
const create = async (userData: any): Promise<User | Error> => {
  try {
    const result = await prisma.user.create({ data: userData });

    return result;
  } catch (err) {
    throw ensureError(err);
  }
};
const update = async (
  userId: string,
  valuesToUpdate: any
): Promise<User | Error> => {
  try {
    const result = await prisma.user.update({
      where: {
        userId
      },
      data: valuesToUpdate
    });

    return result;
  } catch (err) {
    throw ensureError(err);
  }
};
const destroy = async (userId: string): Promise<User | Error> => {
  try {
    const result = await prisma.user.delete({
      where: {
        userId
      }
    });

    return result;
  } catch (err) {
    throw ensureError(err);
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
