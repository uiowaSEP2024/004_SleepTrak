import type { Request, Response } from 'express';
import { service } from '../services/reminders.js';
import { ensureError } from '../utils/error.js';

const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const reminders = await service.getAll();
    res.json(reminders);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const reminder = await service.get(id);
    res.json(reminder);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchParams = req.body;
    const reminders = await service.search(searchParams);
    res.json(reminders);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const creationParams = req.body;

    const reminderData = {
      plan: { connect: { planId: creationParams.planId } },
      timestamp: new Date(creationParams.timestamp),
      description: creationParams.description
    };

    const reminder = await service.create(reminderData);
    res.json(reminder);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateParams = req.body;

    const reminder = await service.update(id, updateParams);
    res.json(reminder);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const reminder = await service.destroy(id);
    res.json(reminder);
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
