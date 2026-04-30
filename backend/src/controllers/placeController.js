const { Place, State, City } = require('../models');

const placeController = {
  getAllPlaces: async (req, res) => {
    try {
      const { state, city, category, isPopular, featured, limit = 50, page = 1 } = req.query;
      const query = {};
      
      if (state) query.state = state;
      if (city) query.city = city;
      if (category) query.category = category;
      if (isPopular === 'true') query.isPopular = true;
      if (featured === 'true') query.featured = true;
      
      const skip = (page - 1) * limit;
      const places = await Place.find(query)
        .populate('state', 'name slug')
        .populate('city', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      const total = await Place.countDocuments(query);
      
      res.json({ places, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPlaceBySlug: async (req, res) => {
    try {
      const place = await Place.findOne({ slug: req.params.slug })
        .populate('state', 'name slug')
        .populate('city', 'name slug');
      
      if (!place) {
        return res.status(404).json({ message: 'Place not found' });
      }
      res.json(place);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPopularPlaces: async (req, res) => {
    try {
      const places = await Place.find({ isPopular: true })
        .populate('state', 'name slug')
        .populate('city', 'name slug')
        .limit(10);
      res.json(places);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPlacesByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const places = await Place.find({ category })
        .populate('state', 'name slug')
        .populate('city', 'name slug');
      res.json(places);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createPlace: async (req, res) => {
    try {
      const { name, state: stateId, city: cityId, category, images, description, historicalImportance, bestTimeToVisit, entryFee, timings, nearbyAttractions, mapLink, rating, isPopular, featured } = req.body;
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const state = await State.findById(stateId);
      const city = await City.findById(cityId);
      
      if (!state || !city) {
        return res.status(404).json({ message: 'State or City not found' });
      }
      
      const place = new Place({
        name, slug, state: stateId, city: cityId, category,
        images: images || [], description, historicalImportance, bestTimeToVisit,
        entryFee, timings, nearbyAttractions: nearbyAttractions || [], mapLink,
        rating: rating || 4.5, isPopular: isPopular || false, featured: featured || false
      });
      
      await place.save();
      res.status(201).json(place);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = placeController;