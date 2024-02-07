const service = require('../services/reminders');

module.exports = {
  getAll: async (req, res) => {
    try {
      const reminders = await service.getAll();
      res.json(reminders);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  get: async (req, res) => {
    try {
      const { id } = req.params;
      const reminder = await service.get(id);
      res.json(reminder);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  search: async (req, res) => {
    try {
      const searchParams = req.body;
      const reminders = await service.search(searchParams);
      res.json(reminders);
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

      reminderData = {
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
  update: async (req, res) => {
    try {
      const { reminderId } = req.params;
      const updateParams = req.body;
      if (updateParams.length == 0) {
        throw new Error('Empty body');
      }

      const reminder = await service.update(reminderId, updateParams);
      res.json(reminder);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  destroy: async (req, res) => {
    try {
      const { reminderId } = req.params;

      const reminder = await service.destroy(reminderId);
      res.json(reminder);
    } catch (err) {
      res.status(500).send(err);
    }
  }
};
