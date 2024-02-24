import type { Request, Response } from 'express';
import { service } from '../services/plans';
import { ensureError } from '../utils/error';

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const plans = await service.getAll();
    res.json(plans);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const plan = await service.get(id);
    res.json(plan);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchParams = req.body;
    const plans = await service.search(searchParams);
    res.json(plans);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const creationParams = req.body;
    if (creationParams.length === 0) {
      throw new Error('Empty body');
    }

    const planData = {
      client: { connect: { userId: creationParams.clientId } },
      coach: { connect: { userId: creationParams.coachId } },
      status: creationParams.status
    };

    const plan = await service.create(planData);
    res.json(plan);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateParams = req.body;
    if (updateParams.length === 0) {
      throw new Error('Empty body');
    }

    const plan = await service.update(id, updateParams);
    res.json(plan);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const plan = await service.destroy(id);
    res.json(plan);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};

export const controller = {
  getAll,
  get,
  search,
  create,
  update,
  destroy
};
