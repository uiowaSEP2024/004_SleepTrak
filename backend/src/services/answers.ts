import { prisma } from '../../prisma/client.js';
import type { OnboardingAnswer } from '@prisma/client';
import { ensureError } from '../utils/error.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const create = async (answerData: any): Promise<OnboardingAnswer | Error> => {
  try {
    const result = await prisma.onboardingAnswer.create({
      data: answerData
    });

    return result;
  } catch (err) {
    throw ensureError(err);
  }
};

const update = async (
  answerId: string,
  valuesToUpdate: any
): Promise<OnboardingAnswer | Error> => {
  try {
    const result = await prisma.onboardingAnswer.update({
      where: {
        answerId
      },
      data: valuesToUpdate
    });

    return result;
  } catch (err) {
    throw ensureError(err);
  }
};

export const service = {
  create,
  update
};
