const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  isUnionTerritory: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('State', stateSchema);