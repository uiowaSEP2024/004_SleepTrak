import { type Request, type Response } from 'express';
const service = require('../services/users');
const utils = require('./utils');

interface User {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  coach: { connect: { coachId: string } } | null;
}

module.exports = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const users = await service.getAll();
      res.json(users);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  get: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await service.get(id);
      res.json(user);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  search: async (req: Request, res: Response) => {
    try {
      const searchParams = req.body;
      const users = await service.search(searchParams);
      res.json(users);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const creationParams = req.body;
      if (creationParams.length === 0) {
        throw new Error('Empty body');
      }

      let userData: User = {
        first_name: creationParams.first_name,
        last_name: creationParams.last_name,
        email: creationParams.email,
        role: creationParams.role,
        coach: creationParams.coachId
          ? { connect: { coachId: creationParams.coachId } }
          : null
      };

      userData = utils.collapseObject(userData);

      const user = await service.create(userData);
      res.json(user);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateParams = req.body;
      if (updateParams.length === 0) {
        throw new Error('Empty body');
      }

      const user = await service.update(id, updateParams);
      res.json(user);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  destroy: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const user = await service.destroy(id);
      res.json(user);
    } catch (err) {
      res.status(500).send(err);
    }
  }
};
