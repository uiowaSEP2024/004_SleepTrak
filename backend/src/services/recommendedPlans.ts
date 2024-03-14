import { prisma } from '../../prisma/client.js';
import type { RecommendedPlan } from '@prisma/client';
import { ensureError } from '../utils/error.js';

function getAgeInMonth(dob: string): string {
  const today = new Date();
  const birthDate = new Date(dob);

  let ageYears = today.getFullYear() - birthDate.getFullYear();
  let ageMonths = today.getMonth() - birthDate.getMonth();

  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  return ageYears * 12 + ageMonths + 'M';
}

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
