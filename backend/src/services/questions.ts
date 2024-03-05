import { prisma } from '../../prisma/client.js';
import type { Question } from '@prisma/client';
import { ensureError } from '../utils/error.js';

const getAll = async (): Promise<Question[] | Error> => {
  try {
    const result = await prisma.onboardingQuestion.findMany();

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const get = async (questionId: string): Promise<Question | null | Error> => {
  try {
    const result = await prisma.onboardingQuestion.findUnique({
      where: {
        questionId
      }
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};

export const service = {
  getAll,
  get
};
