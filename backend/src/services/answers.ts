import { prisma } from '../../prisma/client.js';
import type { OnboardingAnswer } from '@prisma/client';
import { ensureError } from '../utils/error.js';

const create = async (answerData: {
  answerId: string;
  answer_text: string;
  question: object;
  user: object;
  baby: object;
}): Promise<OnboardingAnswer | Error> => {
  try {
    const result = await prisma.onboardingAnswer.create({ data: answerData });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};

export const service = {
  create
};
