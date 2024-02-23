import { type Request, type Response } from 'express';
const service = require('../services/babies');

module.exports = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const babies = await service.getAll();
      res.json(babies);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  get: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const baby = await service.get(id);
      res.json(baby);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  search: async (req: Request, res: Response) => {
    try {
      const searchParams = req.body;
      const babies = await service.search(searchParams);
      res.json(babies);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const creationParams = req.body;
      if (Object.keys(creationParams).length === 0) {
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
      res.status(500).send(err);
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateParams = req.body;
      if (Object.keys(updateParams).length === 0) {
        throw new Error('Empty body');
      }

      const baby = await service.update(id, updateParams);
      res.json(baby);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  destroy: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const baby = await service.destroy(id);
      res.json(baby);
    } catch (err) {
      res.status(500).send(err);
    }
  }
};
