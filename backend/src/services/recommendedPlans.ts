import { prisma } from '../../prisma/client.js';
import type { RecommendedPlan } from '@prisma/client';
import { ensureError } from '../utils/error.js';

const get = async (
  ageInMonth: string
): Promise<RecommendedPlan | null | Error> => {
  try {
    const result = await prisma.recommendedPlan.findUnique({
      where: {
        ageInMonth
      }
    });
    return result;
  } catch (err) {
    return ensureError(err);
  }
};

export const service = {
  get
};
