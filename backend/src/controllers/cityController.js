const { City, State } = require('../models');

const cityController = {
  getAllCities: async (req, res) => {
    try {
      const { stateId } = req.query;
      const query = stateId ? { state: stateId } : {};
      const cities = await City.find(query).populate('state', 'name slug').sort({ name: 1 });
      res.json(cities);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCityBySlug: async (req, res) => {
    try {
      const city = await City.findOne({ slug: req.params.slug }).populate('state', 'name slug');
      if (!city) {
        return res.status(404).json({ message: 'City not found' });
      }
      res.json(city);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createCity: async (req, res) => {
    try {
      const { name, state: stateId, image, description } = req.body;
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const state = await State.findById(stateId);
      if (!state) {
        return res.status(404).json({ message: 'State not found' });
      }
      
      const city = new City({ name, slug, state: stateId, image, description });
      await city.save();
      res.status(201).json(city);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = cityController;