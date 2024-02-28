import type { Request, Response } from 'express';
import { service } from '../services/users.js';
import { collapseObject } from '../utils/collapse.js';
import { ensureError } from '../utils/error.js';

const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await service.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await service.get(id);
    res.json(user);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchParams = req.body;
    const users = await service.search(searchParams);
    res.json(users);
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

    let userData = {
      first_name: creationParams.first_name,
      last_name: creationParams.last_name,
      email: creationParams.email,
      role: creationParams.role,
      coach: creationParams.coachId
        ? { connect: { userId: creationParams.coachId } }
        : null
    };

    userData = collapseObject(userData);

    const user = await service.create(userData);
    res.json(user);
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

    const user = await service.update(id, updateParams);
    res.json(user);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};
const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await service.destroy(id);
    res.json(user);
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
