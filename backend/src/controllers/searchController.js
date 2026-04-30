const { Place, State, City } = require('../models');

const searchController = {
  search: async (req, res) => {
    try {
      const { q, category, state } = req.query;
      
      const placeQuery = {};
      const stateQuery = {};
      
      if (q) {
        placeQuery.$or = [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ];
        stateQuery.$or = [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ];
      }
      
      if (category) placeQuery.category = category;
      
      const [places, states] = await Promise.all([
        Place.find(placeQuery).populate('state', 'name slug').populate('city', 'name slug').limit(20),
        Object.keys(stateQuery).length > 0 ? State.find(stateQuery).limit(10) : []
      ]);
      
      res.json({ places, states, cities: [] });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = searchController;