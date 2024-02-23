import { type Request, type Response } from 'express';
const service = require('../services/events');

module.exports = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const events = await service.getAll();
      res.json(events);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  get: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await service.get(id);
      res.json(event);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  search: async (req: Request, res: Response) => {
    try {
      const searchParams = req.body;
      const events = await service.search(searchParams);
      res.json(events);
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

      const eventData = {
        owner: { connect: { userId: creationParams.userId } },
        startTime: creationParams.startTime,
        endTime: creationParams.endTime,
        type: creationParams.type
      };

      const event = await service.create(eventData);
      res.json(event);
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

      const event = await service.update(id, updateParams);
      res.json(event);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  destroy: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const event = await service.destroy(id);
      res.json(event);
    } catch (err) {
      res.status(500).send(err);
    }
  }
};
