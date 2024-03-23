import { prisma } from '../../prisma/client.js';
import type { RecommendedPlan } from '@prisma/client';
import { ensureError } from '../utils/error.js';
import { getAgeInMonth } from '../utils/plansUtil.js';

// Get request gets the recommended schedule by babyId.
const get = async (babyId: string): Promise<RecommendedPlan | null | Error> => {
  try {
    // Find the baby by babyId
    const baby = await prisma.baby.findUnique({
      where: {
        babyId: babyId
      }
    });

    // Check if the baby exists
    if (!baby) {
      throw new Error(`Baby with ID ${babyId} not found`);
    }

    // Retrieve the recommended plan by the baby's age
    const result = await prisma.recommendedPlan.findUnique({
      where: {
        ageInMonth: getAgeInMonth(baby.dob.toString())
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
