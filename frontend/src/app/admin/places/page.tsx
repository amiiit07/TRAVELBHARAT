'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, Castle, Edit2, Loader, MapPin, Plus, Save, Search, Trash2, X } from 'lucide-react';
import api from '@/lib/api';

const emptyPlaceForm = {
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
};

const emptyStateForm = {
  name: '',
  image: '',
  description: '',
  isUnionTerritory: false
};

const emptyCityForm = {
  name: '',
  state: '',
  image: '',
  description: ''
};

export default function AdminPlacesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'places' | 'states' | 'cities'>('places');
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [placePage, setPlacePage] = useState(1);
  const [placeTotalPages, setPlaceTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [editingStateId, setEditingStateId] = useState<string | null>(null);
  const [editingCityId, setEditingCityId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'place' | 'state' | 'city'; id: string; name: string } | null>(null);
  const [deleteInput, setDeleteInput] = useState('');
  const [placeForm, setPlaceForm] = useState(emptyPlaceForm);
  const [stateForm, setStateForm] = useState(emptyStateForm);
  const [cityForm, setCityForm] = useState(emptyCityForm);

  const filteredCitiesForPlace = useMemo(
    () => cities.filter((city) => city.state?._id === placeForm.state || city.state === placeForm.state),
    [cities, placeForm.state]
  );

  const filteredPlaces = useMemo(() => {
    if (!searchTerm.trim()) return places;
    const term = searchTerm.toLowerCase();
    return places.filter((place) => {
      const stateName = place.state?.name || '';
      const cityName = place.city?.name || '';
      return [place.name, place.category, place.description, stateName, cityName]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [places, searchTerm]);

  const filteredStates = useMemo(() => {
    if (!searchTerm.trim() || activeTab !== 'states') return states;
    const term = searchTerm.toLowerCase();
    return states.filter((state) => [state.name, state.description, state.slug].join(' ').toLowerCase().includes(term));
  }, [states, searchTerm, activeTab]);

  const filteredCities = useMemo(() => {
    if (!searchTerm.trim() || activeTab !== 'cities') return cities;
    const term = searchTerm.toLowerCase();
    return cities.filter((city) => {
      const stateName = city.state?.name || '';
      return [city.name, city.description, city.slug, stateName].join(' ').toLowerCase().includes(term);
    });
  }, [cities, searchTerm, activeTab]);

  const loadPlaces = async (page = placePage) => {
    setListLoading(true);
    try {
      const placesData = await api.getPlaces({ limit: 12, page });
      setPlaces(placesData.places || []);
      setPlacePage(placesData.page || page);
      setPlaceTotalPages(placesData.totalPages || 1);
    } finally {
      setListLoading(false);
    }
  };

  const loadReferenceData = async () => {
    const [statesData, citiesData] = await Promise.all([api.getStates(), api.getCities()]);
    setStates(statesData || []);
    setCities(citiesData || []);
  };

  const loadData = async (page = placePage) => {
    await Promise.all([loadPlaces(page), loadReferenceData()]);
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    loadData(1).catch(console.error).finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!loading) {
      loadPlaces(placePage).catch(console.error);
    }
  }, [placePage]);

  const resetPlaceForm = () => {
    setPlaceForm(emptyPlaceForm);
    setEditingPlaceId(null);
  };

  const resetStateForm = () => {
    setStateForm(emptyStateForm);
    setEditingStateId(null);
  };

  const resetCityForm = () => {
    setCityForm(emptyCityForm);
    setEditingCityId(null);
  };

  const handleArrayInput = (field: 'images' | 'nearbyAttractions', index: number, value: string) => {
    const nextValues = [...(placeForm[field] as string[])];
    nextValues[index] = value;
    setPlaceForm({ ...placeForm, [field]: nextValues });
  };

  const addArrayItem = (field: 'images' | 'nearbyAttractions') => {
    setPlaceForm({ ...placeForm, [field]: [...(placeForm[field] as string[]), ''] });
  };

  const removeArrayItem = (field: 'images' | 'nearbyAttractions', index: number) => {
    const nextValues = (placeForm[field] as string[]).filter((_, itemIndex) => itemIndex !== index);
    setPlaceForm({ ...placeForm, [field]: nextValues.length ? nextValues : [''] });
  };

  const handlePlaceSubmit = async (event: any) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...placeForm,
        images: placeForm.images.map((image) => image.trim()).filter(Boolean),
        nearbyAttractions: placeForm.nearbyAttractions.map((item) => item.trim()).filter(Boolean),
        rating: Number(placeForm.rating)
      };

      if (editingPlaceId) {
        await api.updatePlace(editingPlaceId, payload);
      } else {
        await api.createPlace(payload);
      }

      await loadData();
      resetPlaceForm();
      setActiveTab('places');
      setPlacePage(1);
    } catch (error) {
      console.error(error);
      alert('Failed to save place');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStateSubmit = async (event: any) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (editingStateId) {
        await api.updateState(editingStateId, stateForm);
      } else {
        await api.createState(stateForm);
      }

      await loadData();
      resetStateForm();
      setActiveTab('states');
    } catch (error) {
      console.error(error);
      alert('Failed to save state');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCitySubmit = async (event: any) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (editingCityId) {
        await api.updateCity(editingCityId, cityForm);
      } else {
        await api.createCity(cityForm);
      }

      await loadData();
      resetCityForm();
      setActiveTab('cities');
    } catch (error) {
      console.error(error);
      alert('Failed to save city');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (type: 'place' | 'state' | 'city', id: string, name: string) => {
    setDeleteTarget({ type, id, name });
    setDeleteInput('');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    if (deleteInput.trim() !== deleteTarget.name) {
      alert(`Type ${deleteTarget.name} exactly to confirm deletion.`);
      return;
    }

    try {
      if (deleteTarget.type === 'place') await api.deletePlace(deleteTarget.id);
      if (deleteTarget.type === 'state') await api.deleteState(deleteTarget.id);
      if (deleteTarget.type === 'city') await api.deleteCity(deleteTarget.id);
      setDeleteTarget(null);
      await loadData(placePage);
    } catch (error) {
      console.error(error);
      alert(`Failed to delete ${deleteTarget.type}`);
    }
  };

  const startEditPlace = (place: any) => {
    setActiveTab('places');
    setEditingPlaceId(place._id);
    setPlaceForm({
      name: place.name || '',
      state: place.state?._id || place.state || '',
      city: place.city?._id || place.city || '',
      category: place.category || 'heritage',
      images: place.images?.length ? place.images : [''],
      description: place.description || '',
      historicalImportance: place.historicalImportance || '',
      bestTimeToVisit: place.bestTimeToVisit || '',
      entryFee: place.entryFee || '',
      timings: place.timings || '',
      nearbyAttractions: place.nearbyAttractions?.length ? place.nearbyAttractions : [''],
      mapLink: place.mapLink || '',
      rating: place.rating ?? 4.5,
      isPopular: Boolean(place.isPopular),
      featured: Boolean(place.featured)
    });
  };

  const startEditState = (state: any) => {
    setActiveTab('states');
    setEditingStateId(state._id);
    setStateForm({
      name: state.name || '',
      image: state.image || '',
      description: state.description || '',
      isUnionTerritory: Boolean(state.isUnionTerritory)
    });
  };

  const startEditCity = (city: any) => {
    setActiveTab('cities');
    setEditingCityId(city._id);
    setCityForm({
      name: city.name || '',
      state: city.state?._id || city.state || '',
      image: city.image || '',
      description: city.description || ''
    });
  };

  if (loading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center text-white">Loading admin panel...</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-heading text-4xl font-bold text-white mb-2">Admin Content Manager</h1>
            <p className="text-white/60">Full REST-based CRUD for states, cities, and places.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setActiveTab('places')} className={`px-4 py-2 rounded-lg border ${activeTab === 'places' ? 'bg-primary text-white border-primary' : 'bg-white/5 text-white/70 border-white/10'}`}>Places</button>
            <button onClick={() => setActiveTab('states')} className={`px-4 py-2 rounded-lg border ${activeTab === 'states' ? 'bg-primary text-white border-primary' : 'bg-white/5 text-white/70 border-white/10'}`}>States</button>
            <button onClick={() => setActiveTab('cities')} className={`px-4 py-2 rounded-lg border ${activeTab === 'cities' ? 'bg-primary text-white border-primary' : 'bg-white/5 text-white/70 border-white/10'}`}>Cities</button>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-white/10 w-full md:max-w-xl">
            <Search className="w-5 h-5 text-white/50" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full bg-transparent outline-none text-white placeholder-white/40"
            />
          </div>
          <p className="text-white/50 text-sm">
            {activeTab === 'places' && `${filteredPlaces.length} visible on page ${placePage} of ${placeTotalPages}`}
            {activeTab === 'states' && `${filteredStates.length} states found`}
            {activeTab === 'cities' && `${filteredCities.length} cities found`}
          </p>
        </div>

        {activeTab === 'places' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handlePlaceSubmit} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl text-white">{editingPlaceId ? 'Edit Place' : 'Add Place'}</h2>
                  <p className="text-white/60 text-sm">Create or update tourist destinations.</p>
                </div>
                {editingPlaceId && (
                  <button type="button" onClick={resetPlaceForm} className="text-white/60 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={placeForm.name} onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })} required placeholder="Place name" className="px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />
                <select value={placeForm.category} onChange={(e) => setPlaceForm({ ...placeForm, category: e.target.value })} className="px-4 py-3 rounded-lg bg-surface border border-white/10 text-white">
                  <option value="heritage">Heritage</option>
                  <option value="nature">Nature</option>
                  <option value="religious">Religious</option>
                  <option value="adventure">Adventure</option>
                  <option value="historical">Historical</option>
                  <option value="beaches">Beaches</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={placeForm.state} onChange={(e) => setPlaceForm({ ...placeForm, state: e.target.value, city: '' })} required className="px-4 py-3 rounded-lg bg-surface border border-white/10 text-white">
                  <option value="">Select State</option>
                  {states.map((state) => <option key={state._id} value={state._id}>{state.name}</option>)}
                </select>
                <select value={placeForm.city} onChange={(e) => setPlaceForm({ ...placeForm, city: e.target.value })} required className="px-4 py-3 rounded-lg bg-surface border border-white/10 text-white">
                  <option value="">Select City</option>
                  {filteredCitiesForPlace.map((city) => <option key={city._id} value={city._id}>{city.name}</option>)}
                </select>
              </div>

              <textarea value={placeForm.description} onChange={(e) => setPlaceForm({ ...placeForm, description: e.target.value })} required placeholder="Description" className="w-full h-24 px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />
              <textarea value={placeForm.historicalImportance} onChange={(e) => setPlaceForm({ ...placeForm, historicalImportance: e.target.value })} placeholder="Historical importance" className="w-full h-20 px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={placeForm.bestTimeToVisit} onChange={(e) => setPlaceForm({ ...placeForm, bestTimeToVisit: e.target.value })} placeholder="Best time to visit" className="px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />
                <input value={placeForm.entryFee} onChange={(e) => setPlaceForm({ ...placeForm, entryFee: e.target.value })} placeholder="Entry fee" className="px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />
                <input value={placeForm.timings} onChange={(e) => setPlaceForm({ ...placeForm, timings: e.target.value })} placeholder="Timings" className="px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />
                <input type="number" step="0.1" min="0" max="5" value={placeForm.rating} onChange={(e) => setPlaceForm({ ...placeForm, rating: Number(e.target.value) })} placeholder="Rating" className="px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-white/80 text-sm mb-2">Images</p>
                  <div className="space-y-2">
                    {placeForm.images.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <input value={image} onChange={(e) => handleArrayInput('images', index, e.target.value)} placeholder="Image URL" className="flex-1 px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />
                        <button type="button" onClick={() => removeArrayItem('images', index)} className="px-3 rounded-lg bg-white/5 border border-white/10 text-white/70">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('images')} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70">+ Add Image</button>
                  </div>
                </div>

                <div>
                  <p className="text-white/80 text-sm mb-2">Nearby Attractions</p>
                  <div className="space-y-2">
                    {placeForm.nearbyAttractions.map((attraction, index) => (
                      <div key={index} className="flex gap-2">
                        <input value={attraction} onChange={(e) => handleArrayInput('nearbyAttractions', index, e.target.value)} placeholder="Nearby attraction" className="flex-1 px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />
                        <button type="button" onClick={() => removeArrayItem('nearbyAttractions', index)} className="px-3 rounded-lg bg-white/5 border border-white/10 text-white/70">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('nearbyAttractions')} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70">+ Add Attraction</button>
                  </div>
                </div>
              </div>

              <input value={placeForm.mapLink} onChange={(e) => setPlaceForm({ ...placeForm, mapLink: e.target.value })} placeholder="Google Maps link" className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-white/80"><input type="checkbox" checked={placeForm.isPopular} onChange={(e) => setPlaceForm({ ...placeForm, isPopular: e.target.checked })} /> Popular</label>
                <label className="flex items-center gap-2 text-white/80"><input type="checkbox" checked={placeForm.featured} onChange={(e) => setPlaceForm({ ...placeForm, featured: e.target.checked })} /> Featured</label>
              </div>

              <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
                {submitting ? <Loader className="w-5 h-5 animate-spin" /> : editingPlaceId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingPlaceId ? 'Update Place' : 'Create Place'}
              </button>
            </motion.form>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-heading text-2xl text-white">All Places ({filteredPlaces.length})</h2>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={placePage <= 1 || listLoading} onClick={() => setPlacePage((page) => Math.max(1, page - 1))} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 disabled:opacity-40">
                    Prev
                  </button>
                  <span className="text-white/60 text-sm">{placePage} / {placeTotalPages}</span>
                  <button type="button" disabled={placePage >= placeTotalPages || listLoading} onClick={() => setPlacePage((page) => Math.min(placeTotalPages, page + 1))} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 disabled:opacity-40">
                    Next
                  </button>
                </div>
              </div>
              {listLoading && <p className="text-white/50 text-sm">Loading places page...</p>}
              <div className="grid gap-4 max-h-[1200px] overflow-y-auto pr-1">
                {filteredPlaces.map((place) => (
                  <div key={place._id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-start gap-4">
                      {place.images?.[0] && <img src={place.images[0]} alt={place.name} className="w-24 h-24 rounded-xl object-cover" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-heading text-lg text-white truncate">{place.name}</h3>
                            <p className="text-white/60 text-sm">{place.city?.name}, {place.state?.name}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => startEditPlace(place)} className="p-2 rounded-lg bg-primary/20 text-primary"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => openDeleteModal('place', place._id, place.name)} className="p-2 rounded-lg bg-red-500/20 text-red-400"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <p className="text-white/60 text-xs mt-2 line-clamp-2">{place.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs capitalize">{place.category}</span>
                          {place.isPopular && <span className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs">Popular</span>}
                          {place.featured && <span className="px-2 py-1 rounded-full bg-secondary/20 text-secondary text-xs">Featured</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'states' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleStateSubmit} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl text-white">{editingStateId ? 'Edit State' : 'Add State'}</h2>
                  <p className="text-white/60 text-sm">Manage state records through REST APIs.</p>
                </div>
                {editingStateId && (
                  <button type="button" onClick={resetStateForm} className="text-white/60 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <input value={stateForm.name} onChange={(e) => setStateForm({ ...stateForm, name: e.target.value })} required placeholder="State name" className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />
              <input value={stateForm.image} onChange={(e) => setStateForm({ ...stateForm, image: e.target.value })} required placeholder="State image URL" className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />
              <textarea value={stateForm.description} onChange={(e) => setStateForm({ ...stateForm, description: e.target.value })} required placeholder="State description" className="w-full h-28 px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />
              <label className="flex items-center gap-2 text-white/80"><input type="checkbox" checked={stateForm.isUnionTerritory} onChange={(e) => setStateForm({ ...stateForm, isUnionTerritory: e.target.checked })} /> Union Territory</label>
              <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
                {submitting ? <Loader className="w-5 h-5 animate-spin" /> : editingStateId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingStateId ? 'Update State' : 'Create State'}
              </button>
            </motion.form>

            <div className="space-y-4">
              <h2 className="font-heading text-2xl text-white">All States ({filteredStates.length})</h2>
              <div className="grid gap-4 max-h-[1200px] overflow-y-auto pr-1">
                {filteredStates.map((state) => (
                  <div key={state._id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-start gap-4">
                      {state.image && <img src={state.image} alt={state.name} className="w-24 h-24 rounded-xl object-cover" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-heading text-lg text-white truncate">{state.name}</h3>
                            <p className="text-white/60 text-sm">/{state.slug}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => startEditState(state)} className="p-2 rounded-lg bg-primary/20 text-primary"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => openDeleteModal('state', state._id, state.name)} className="p-2 rounded-lg bg-red-500/20 text-red-400"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <p className="text-white/60 text-xs mt-2 line-clamp-2">{state.description}</p>
                        {state.isUnionTerritory && <span className="inline-block mt-3 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs">Union Territory</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cities' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleCitySubmit} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl text-white">{editingCityId ? 'Edit City' : 'Add City'}</h2>
                  <p className="text-white/60 text-sm">Manage city records through REST APIs.</p>
                </div>
                {editingCityId && (
                  <button type="button" onClick={resetCityForm} className="text-white/60 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <input value={cityForm.name} onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })} required placeholder="City name" className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />
              <select value={cityForm.state} onChange={(e) => setCityForm({ ...cityForm, state: e.target.value })} required className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-white">
                <option value="">Select State</option>
                {states.map((state) => <option key={state._id} value={state._id}>{state.name}</option>)}
              </select>
              <input value={cityForm.image} onChange={(e) => setCityForm({ ...cityForm, image: e.target.value })} required placeholder="City image URL" className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />
              <textarea value={cityForm.description} onChange={(e) => setCityForm({ ...cityForm, description: e.target.value })} required placeholder="City description" className="w-full h-28 px-4 py-3 rounded-lg bg-surface border border-white/10 text-white" />
              <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
                {submitting ? <Loader className="w-5 h-5 animate-spin" /> : editingCityId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingCityId ? 'Update City' : 'Create City'}
              </button>
            </motion.form>

            <div className="space-y-4">
              <h2 className="font-heading text-2xl text-white">All Cities ({filteredCities.length})</h2>
              <div className="grid gap-4 max-h-[1200px] overflow-y-auto pr-1">
                {filteredCities.map((city) => (
                  <div key={city._id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-start gap-4">
                      {city.image && <img src={city.image} alt={city.name} className="w-24 h-24 rounded-xl object-cover" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-heading text-lg text-white truncate">{city.name}</h3>
                            <p className="text-white/60 text-sm">{city.state?.name || 'Unknown State'}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => startEditCity(city)} className="p-2 rounded-lg bg-primary/20 text-primary"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => openDeleteModal('city', city._id, city.name)} className="p-2 rounded-lg bg-red-500/20 text-red-400"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <p className="text-white/60 text-xs mt-2 line-clamp-2">{city.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg rounded-2xl bg-background border border-white/10 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-heading text-2xl text-white">Delete {deleteTarget.type}</h3>
                <p className="text-white/60 text-sm mt-1">Type the exact name to confirm permanent deletion.</p>
              </div>
              <button type="button" onClick={() => setDeleteTarget(null)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
              <p className="text-white/60 text-sm">Target</p>
              <p className="text-white font-semibold">{deleteTarget.name}</p>
            </div>
            <input
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder={`Type ${deleteTarget.name}`}
              className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-white mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setDeleteTarget(null)} className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/70">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} className="px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600">
                Delete Permanently
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
