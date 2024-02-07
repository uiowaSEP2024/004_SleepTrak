const service = require('../services/plans');

module.exports = {
  getAll: async (req, res) => {
    try {
      const plans = await service.getAll();
      res.json(plans);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  get: async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await service.get(id);
      res.json(plan);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  search: async (req, res) => {
    try {
      const searchParams = req.body;
      const plans = await service.search(searchParams);
      res.json(plans);
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

      planData = {
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
  update: async (req, res) => {
    try {
      const { planId } = req.params;
      const updateParams = req.body;
      if (updateParams.length == 0) {
        throw new Error('Empty body');
      }

      const plan = await service.update(planId, updateParams);
      res.json(plan);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  destroy: async (req, res) => {
    try {
      const { planId } = req.params;

      const plan = await service.destroy(planId);
      res.json(plan);
    } catch (err) {
      res.status(500).send(err);
    }
  }
};
