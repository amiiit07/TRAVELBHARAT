const { City, State } = require('../models');

const buildSlug = (value) =>
  value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

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
      const slug = buildSlug(name);
      
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
  },

  updateCity: async (req, res) => {
    try {
      const city = await City.findById(req.params.id);

      if (!city) {
        return res.status(404).json({ message: 'City not found' });
      }

      const { name, state: stateId, image, description } = req.body;

      if (name) {
        city.name = name;
        city.slug = buildSlug(name);
      }

      if (stateId) {
        const state = await State.findById(stateId);
        if (!state) {
          return res.status(404).json({ message: 'State not found' });
        }
        city.state = stateId;
      }

      if (image !== undefined) city.image = image;
      if (description !== undefined) city.description = description;

      await city.save();
      const updatedCity = await City.findById(city._id).populate('state', 'name slug');
      res.json(updatedCity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteCity: async (req, res) => {
    try {
      const city = await City.findByIdAndDelete(req.params.id);

      if (!city) {
        return res.status(404).json({ message: 'City not found' });
      }

      res.json({ message: 'City deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = cityController;