const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  category: { type: String, required: true, enum: ['heritage', 'nature', 'religious', 'adventure', 'historical', 'beaches'] },
  images: [{ type: String }],
  description: { type: String, required: true },
  historicalImportance: { type: String },
  bestTimeToVisit: { type: String },
  entryFee: { type: String },
  timings: { type: String },
  nearbyAttractions: [{ type: String }],
  mapLink: { type: String },
  rating: { type: Number, default: 4.5 },
  isPopular: { type: Boolean, default: false },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

placeSchema.index({ name: 'text', description: 'text' });
placeSchema.index({ category: 1 });
placeSchema.index({ isPopular: 1 });

module.exports = mongoose.model('Place', placeSchema);