import { prisma } from '../../prisma/client.js';
import type { Medicine } from '@prisma/client';
import { ensureError } from '../utils/error.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const create = async (answerData: any): Promise<Medicine | Error> => {
  try {
    const result = await prisma.medicine.create({
      data: answerData
    });

    return result;
  } catch (err) {
    throw ensureError(err);
  }
};

export const service = {
  create
};
