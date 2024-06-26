import type { Request, Response } from 'express';
import { service } from '../services/events.js';
import { ensureError } from '../utils/error.js';

const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const events = await service.getAll();
    res.json(events);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await service.get(id);
    res.json(event);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchParams = req.body;
    const events = await service.search(searchParams);
    res.json(events);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const creationParams = req.body;

    const eventData = {
      owner: { connect: { userId: creationParams.ownerId } },
      startTime: creationParams.startTime,
      endTime: creationParams.endTime,
      type: creationParams.type,
      foodType: creationParams.foodType ?? null,
      amount: creationParams.amount ?? null,
      unit: creationParams.unit ?? null,
      note: creationParams.note ?? null,
      medicineType: creationParams.medicineType ?? null
    };

    const event = await service.create(eventData);
    res.json(event);
  } catch (err) {
    console.log(err);
    res.status(500).send(ensureError(err));
  }
};
const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateParams = req.body;

    const event = await service.update(id, updateParams);
    res.json(event);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await service.destroy(id);
    res.json(event);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const getByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const events = await service.getByUserId(userId);
    res.json(events);
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
  destroy,
  getByUserId
};
