'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, X, Loader } from 'lucide-react';
import api from '@/lib/api';

export default function AdminPlacesPage() {
  const router = useRouter();
  const [places, setPlaces] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    state: '',
    city: '',
    category: 'heritage',
    images: [''],
    description: '',
    historicalImportance: '',
    bestTimeToVisit: '',
    entryFee: '',
    timings: '',
    nearbyAttractions: [''],
    mapLink: '',
    rating: 4.5,
    isPopular: false,
    featured: false
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    Promise.all([
      api.getPlaces({ limit: 100 }),
      api.getStates(),
      api.getCities()
    ]).then(([placesData, statesData, citiesData]) => {
      setPlaces(placesData.places || []);
      setStates(statesData);
      setCities(citiesData);
    }).catch(console.error).finally(() => setLoading(false));
  }, [router]);

  const handleStateChange = (e: any) => {
    const selectedState = e.target.value;
    setFormData({ ...formData, state: selectedState, city: '' });
    const filteredCities = cities.filter(c => c.state === selectedState);
    setCities(cities);
  };

  const handleArrayInput = (field: string, index: number, value: string) => {
    const arr = [...(formData[field as keyof typeof formData] as any)];
    arr[index] = value;
    setFormData({ ...formData, [field]: arr });
  };

  const addArrayItem = (field: string) => {
    const arr = [...(formData[field as keyof typeof formData] as any)];
    arr.push('');
    setFormData({ ...formData, [field]: arr });
  };

  const removeArrayItem = (field: string, index: number) => {
    const arr = (formData[field as keyof typeof formData] as any).filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, [field]: arr });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create place');

      const newPlace = await response.json();
      setPlaces([newPlace, ...places]);
      setShowForm(false);
      setFormData({
        name: '',
        state: '',
        city: '',
        category: 'heritage',
        images: [''],
        description: '',
        historicalImportance: '',
        bestTimeToVisit: '',
        entryFee: '',
        timings: '',
        nearbyAttractions: [''],
        mapLink: '',
        rating: 4.5,
        isPopular: false,
        featured: false
      });
    } catch (error) {
      console.error('Error creating place:', error);
      alert('Failed to create place');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-24"><p className="text-white text-center">Loading...</p></div>;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl text-white mb-2">Manage Places</h1>
            <p className="text-white/60">Add and manage tourist destinations</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
          >
            <Plus className="w-5 h-5" />
            Add Place
          </button>
        </motion.div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl text-white">Add New Place</h2>
              <button onClick={() => setShowForm(false)} className="text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Place Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-white/10 text-white"
                    placeholder="e.g., Taj Mahal"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-white/10 text-white"
                  >
                    <option value="heritage">Heritage</option>
                    <option value="nature">Nature</option>
                    <option value="religious">Religious</option>
                    <option value="adventure">Adventure</option>
                    <option value="historical">Historical</option>
                    <option value="beaches">Beaches</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">State *</label>
                  <select
                    required
                    value={formData.state}
                    onChange={handleStateChange}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-white/10 text-white"
                  >
                    <option value="">Select State</option>
                    {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">City *</label>
                  <select
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-white/10 text-white"
                  >
                    <option value="">Select City</option>
                    {cities
                      .filter(c => c.state._id === formData.state || c.state === formData.state)
                      .map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-white/10 text-white h-24"
                  placeholder="Detailed description of the place"
                />
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Best Time to Visit</label>
                  <input
                    type="text"
                    value={formData.bestTimeToVisit}
                    onChange={e => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-white/10 text-white"
                    placeholder="e.g., October to March"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Entry Fee</label>
                  <input
                    type="text"
                    value={formData.entryFee}
                    onChange={e => setFormData({ ...formData, entryFee: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-white/10 text-white"
                    placeholder="e.g., ₹500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Timings</label>
                  <input
                    type="text"
                    value={formData.timings}
                    onChange={e => setFormData({ ...formData, timings: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-white/10 text-white"
                    placeholder="e.g., 6AM-8PM"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg bg-surface border border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Historical Importance */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Historical Importance</label>
                <textarea
                  value={formData.historicalImportance}
                  onChange={e => setFormData({ ...formData, historicalImportance: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-white/10 text-white h-16"
                  placeholder="Historical significance of the place"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Images (URLs)</label>
                <div className="space-y-2">
                  {(formData.images as string[]).map((img, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={img}
                        onChange={e => handleArrayInput('images', idx, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg bg-surface border border-white/10 text-white"
                        placeholder="Image URL"
                      />
                      {(formData.images as string[]).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('images', idx)}
                          className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('images')}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm"
                  >
                    + Add Image
                  </button>
                </div>
              </div>

              {/* Map Link */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Google Maps Link</label>
                <input
                  type="text"
                  value={formData.mapLink}
                  onChange={e => setFormData({ ...formData, mapLink: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-surface border border-white/10 text-white"
                  placeholder="https://maps.google.com/..."
                />
              </div>

              {/* Checkboxes */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-white/80">Mark as Popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-white/80">Mark as Featured</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader className="w-5 h-5 animate-spin" />}
                  {submitting ? 'Creating...' : 'Create Place'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Places List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-heading text-xl text-white mb-4">Recent Places ({places.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {places.map((place, i) => (
              <motion.div key={place._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50">
                <div className="mb-4">
                  {place.images?.[0] && <img src={place.images[0]} alt={place.name} className="w-full h-32 object-cover rounded-lg" />}
                </div>
                <h3 className="font-heading text-lg text-white mb-1">{place.name}</h3>
                <p className="text-white/60 text-sm mb-2">{place.city?.name}, {place.state?.name}</p>
                <div className="flex gap-2 mb-3">
                  <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">{place.category}</span>
                  {place.isPopular && <span className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs">Popular</span>}
                  {place.featured && <span className="px-2 py-1 rounded-full bg-secondary/20 text-secondary text-xs">Featured</span>}
                </div>
                <p className="text-white/70 text-xs leading-relaxed mb-3 line-clamp-2">{place.description}</p>
                <p className="text-white/50 text-xs">Rating: {place.rating}⭐</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}