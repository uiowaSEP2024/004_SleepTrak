import type { Request, Response } from 'express';
import { service } from '../services/plans.js';
import { ensureError } from '../utils/error.js';

const getAll = async (_req: Request, res: Response): Promise<void> => {
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

    const planData = {
      client: { connect: { userId: creationParams.clientId } },
      // TODO: Should change this into coachId after implementing coach onboarding feature
      coach: { connect: { userId: creationParams.clientId } },
      reminders: {
        create: creationParams.reminders
      }
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
