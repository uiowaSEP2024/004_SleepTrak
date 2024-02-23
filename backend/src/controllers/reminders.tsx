import { type Request, type Response } from 'express';
const service = require('../services/reminders');

module.exports = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const reminders = await service.getAll();
      res.json(reminders);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  get: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const reminder = await service.get(id);
      res.json(reminder);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  search: async (req: Request, res: Response) => {
    try {
      const searchParams = req.body;
      const reminders = await service.search(searchParams);
      res.json(reminders);
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

      const reminderData = {
        plan: { connect: { planId: creationParams.planId } },
        timestamp: creationParams.timestamp,
        description: creationParams.description
      };

      const reminder = await service.create(reminderData);
      res.json(reminder);
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

      const reminder = await service.update(id, updateParams);
      res.json(reminder);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  destroy: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const reminder = await service.destroy(id);
      res.json(reminder);
    } catch (err) {
      res.status(500).send(err);
    }
  }
};
