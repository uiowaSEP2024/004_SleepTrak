import { prisma } from '../../prisma/client';
import type { Plan } from '@prisma/client';
import { ensureError } from '../utils/error';

const getAll = async (): Promise<Plan[] | Error> => {
  try {
    const result = await prisma.plan.findMany();

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const get = async (planId: string): Promise<Plan | null | Error> => {
  try {
    const result = await prisma.plan.findUnique({
      where: {
        planId
      }
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const search = async (searchParams: any): Promise<Plan[] | Error> => {
  try {
    const result = await prisma.plan.findMany({
      where: searchParams
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const create = async (planData: any): Promise<Plan | Error> => {
  try {
    const result = await prisma.plan.create({ data: planData });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const update = async (
  planId: string,
  valuesToUpdate: any
): Promise<Plan | Error> => {
  try {
    const result = await prisma.plan.update({
      where: {
        planId
      },
      data: valuesToUpdate
    });

    return result;
  } catch (err) {
    return ensureError(err);
  }
};
const destroy = async (planId: string): Promise<Plan | Error> => {
  try {
    const result = await prisma.plan.delete({
      where: {
        planId
      }
    });

    return result;
  } catch (err) {
    return ensureError(err);
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
