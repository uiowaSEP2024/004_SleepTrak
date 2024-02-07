const service = require('../services/events');

module.exports = {
  getAll: async (req, res) => {
    try {
      const events = await service.getAll();
      res.json(events);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  get: async (req, res) => {
    try {
      const { id } = req.params;
      const event = await service.get(id);
      res.json(event);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  search: async (req, res) => {
    try {
      const searchParams = req.body;
      const events = await service.search(searchParams);
      res.json(events);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  create: async (req, res) => {
    try {
      const creationParams = req.body;
      if (creationParams.length == 0) {
        throw new Error('Empty body');
      }

      eventData = {
        owner: { connect: { userId: creationParams.userId } },
        startTime: creationParams.startTimeßßß,
        endTime: creationParams.endTime,
        type: creationParams.type
      };

      const event = await service.create(eventData);
      res.json(event);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  update: async (req, res) => {
    try {
      const { eventId } = req.params;
      const updateParams = req.body;
      if (updateParams.length == 0) {
        throw new Error('Empty body');
      }

      const event = await service.update(eventId, updateParams);
      res.json(event);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  destroy: async (req, res) => {
    try {
      const { eventId } = req.params;

      const event = await service.destroy(eventId);
      res.json(event);
    } catch (err) {
      res.status(500).send(err);
    }
  }
};
