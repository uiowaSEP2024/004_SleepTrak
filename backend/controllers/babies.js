const service = require('../services/babies');

module.exports = {
  getAll: async (req, res) => {
    try {
      const babies = await service.getAll();
      res.json(babies);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  get: async (req, res) => {
    try {
      const { id } = req.params;
      const baby = await service.get(id);
      res.json(baby);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  search: async (req, res) => {
    try {
      const searchParams = req.body;
      const babies = await service.search(searchParams);
      res.json(babies);
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

      babyData = {
        name: creationParams.body.name,
        dob: new Date(creationParams.date),
        weight: creationParams.weight,
        medicine: creationParams.medicine,
        parentId: creationParams.parentId
      };

      const baby = await service.create(babyData);
      res.json(baby);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  update: async (req, res) => {
    try {
      const { babyId } = req.params;
      const updateParams = req.body;
      if (updateParams.length == 0) {
        throw new Error('Empty body');
      }

      const baby = await service.update(babyId, updateParams);
      res.json(baby);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  destroy: async (req, res) => {
    try {
      const { babyId } = req.params;

      const baby = await service.destroy(babyId);
      res.json(baby);
    } catch (err) {
      res.status(500).send(err);
    }
  }
};
