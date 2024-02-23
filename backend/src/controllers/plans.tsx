import { type Request, type Response } from 'express';
const service = require('../services/plans');

module.exports = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const plans = await service.getAll();
      res.json(plans);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  get: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const plan = await service.get(id);
      res.json(plan);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  search: async (req: Request, res: Response) => {
    try {
      const searchParams = req.body;
      const plans = await service.search(searchParams);
      res.json(plans);
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

      const planData = {
        client: { connect: { userId: creationParams.clientId } },
        coach: { connect: { userId: creationParams.coachId } },
        status: creationParams.status
      };

      const plan = await service.create(planData);
      res.json(plan);
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

      const plan = await service.update(id, updateParams);
      res.json(plan);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  destroy: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const plan = await service.destroy(id);
      res.json(plan);
    } catch (err) {
      res.status(500).send(err);
    }
  }
};
