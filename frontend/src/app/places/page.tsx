'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, Filter } from 'lucide-react';
import api from '@/lib/api';

export default function AllPlacesPage() {
  const [places, setPlaces] = useState<any[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { name: 'All', value: 'all' },
    { name: 'Heritage', value: 'heritage' },
    { name: 'Religious', value: 'religious' },
    { name: 'Nature', value: 'nature' },
    { name: 'Beaches', value: 'beaches' },
    { name: 'Adventure', value: 'adventure' },
    { name: 'Historical', value: 'historical' }
  ];

  useEffect(() => {
    api.getPlaces({ limit: 100 }).then(data => {
      const allPlaces = data.places || [];
      setPlaces(allPlaces);
      setFilteredPlaces(allPlaces);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = places;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.city?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredPlaces(filtered);
  }, [search, selectedCategory, places]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[16/10] rounded-2xl bg-surface animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-heading text-5xl font-bold text-white mb-4">Discover All Places</h1>
          <p className="text-white/60 text-lg">Explore {places.length} amazing destinations across India</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
          <input
            type="text"
            placeholder="Search places, cities, descriptions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-surface border border-white/10 text-white placeholder-white/50 focus:border-primary outline-none transition-colors"
          />
        </motion.div>

        {/* Category Filter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-8 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 mr-4">
            <Filter className="w-5 h-5 text-primary" />
            <span className="text-white/80 font-semibold">Filter:</span>
          </div>
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-primary text-white'
                  : 'bg-white/5 border border-white/10 text-white/80 hover:border-primary/50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Results Count */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
          <p className="text-white/60">
            Showing <span className="text-primary font-semibold">{filteredPlaces.length}</span> of <span className="text-primary font-semibold">{places.length}</span> places
          </p>
        </motion.div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place, i) => (
              <motion.div
                key={place._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <Link href={`/place/${place.slug}`}>
                  <div className="relative aspect-[16/10]">
                    <img
                      src={place.images?.[0]}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-semibold capitalize">
                      {place.category}
                    </span>
                  </div>

                  {/* Popular Badge */}
                  {place.isPopular && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-accent/90 text-white text-xs font-semibold">
                        ⭐ Popular
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-heading text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {place.name}
                    </h3>

                    <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{place.city?.name}, {place.state?.name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-white font-semibold text-sm">{place.rating}</span>
                      </div>
                      <span className="text-white/60 text-xs">
                        {place.entryFee && place.entryFee !== 'Free' ? place.entryFee : 'Entry: Free'}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <p className="text-white/60 text-lg mb-4">No places found matching your criteria</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
