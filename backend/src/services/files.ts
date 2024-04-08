import { prisma } from '../../prisma/client.js';
import type { File } from '@prisma/client';
import { ensureError } from '../utils/error.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const create = async (fileData: any): Promise<File | Error> => {
  try {
    const result = await prisma.file.create({
      data: fileData
    });
    return result;
  } catch (err) {
    throw ensureError(err);
  }
};

const search = async (searchParams: any): Promise<File[] | Error> => {
  try {
    const result = await prisma.file.findMany({
      where: searchParams
    });
    return result;
  } catch (err) {
    throw ensureError(err);
  }
};

export const service = {
  create,
  search
};
