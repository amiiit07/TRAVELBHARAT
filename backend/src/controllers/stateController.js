const { State } = require('../models');

const buildSlug = (value) =>
  value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const stateController = {
  getAllStates: async (req, res) => {
    try {
      const states = await State.find().sort({ name: 1 });
      res.json(states);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getStateBySlug: async (req, res) => {
    try {
      const state = await State.findOne({ slug: req.params.slug });
      if (!state) {
        return res.status(404).json({ message: 'State not found' });
      }
      res.json(state);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createState: async (req, res) => {
    try {
      const { name, image, description, isUnionTerritory } = req.body;
      const slug = buildSlug(name);
      
      const state = new State({
        name,
        slug,
        image,
        description,
        isUnionTerritory: isUnionTerritory || false
      });
      
      await state.save();
      res.status(201).json(state);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateState: async (req, res) => {
    try {
      const state = await State.findById(req.params.id);

      if (!state) {
        return res.status(404).json({ message: 'State not found' });
      }

      const { name, image, description, isUnionTerritory } = req.body;

      if (name) {
        state.name = name;
        state.slug = buildSlug(name);
      }
      if (image !== undefined) state.image = image;
      if (description !== undefined) state.description = description;
      if (isUnionTerritory !== undefined) state.isUnionTerritory = isUnionTerritory;

      await state.save();
      
      res.json(state);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteState: async (req, res) => {
    try {
      const state = await State.findByIdAndDelete(req.params.id);
      if (!state) {
        return res.status(404).json({ message: 'State not found' });
      }
      res.json({ message: 'State deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = stateController;