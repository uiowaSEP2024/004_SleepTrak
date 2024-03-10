import { prisma } from '../../prisma/client.js';
import type { OnboardingAnswer } from '@prisma/client';
import { ensureError } from '../utils/error.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const create = async (answerData: any): Promise<OnboardingAnswer | Error> => {
  try {
    const result = await prisma.onboardingAnswer.upsert({
      where: { answerId: answerData.answerId },
      update: answerData,
      create: answerData
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};

export const service = {
  create
};
