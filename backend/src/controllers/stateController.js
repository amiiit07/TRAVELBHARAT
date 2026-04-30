const { State } = require('../models');

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
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
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
      const state = await State.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!state) {
        return res.status(404).json({ message: 'State not found' });
      }
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