import type { Request, Response } from 'express';
import { service } from '../services/babies.js';
import { ensureError } from '../utils/error.js';

const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const babies = await service.getAll();
    res.json(babies);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const baby = await service.get(id);
    res.json(baby);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchParams = req.body;
    const babies = await service.search(searchParams);
    res.json(babies);
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

    const babyData = {
      name: creationParams.name,
      dob: new Date(creationParams.date),
      weight: creationParams.weight,
      medicine: creationParams.medicine,
      parent: { connect: { parentId: creationParams.parentId } }
    };

    const baby = await service.create(babyData);
    res.json(baby);
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

    const baby = await service.update(id, updateParams);
    res.json(baby);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const baby = await service.destroy(id);
    res.json(baby);
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
