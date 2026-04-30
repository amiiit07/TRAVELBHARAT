'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Mountain, Waves, Trees, Landmark, Palmtree } from 'lucide-react';
import api from '@/lib/api';
import { State, Place } from '@/types';

const categories = [
  { name: 'Heritage', slug: 'heritage', icon: Landmark, color: '#E94560' },
  { name: 'Nature', slug: 'nature', icon: Trees, color: '#10B981' },
  { name: 'Religious', slug: 'religious', icon: Palmtree, color: '#F59E0B' },
  { name: 'Adventure', slug: 'adventure', icon: Mountain, color: '#8B5CF6' },
  { name: 'Beaches', slug: 'beaches', icon: Waves, color: '#3B82F6' }
];

function ImageCard({ image, title, subtitle, href, index = 0 }: { image: string; title: string; subtitle?: string; href: string; index?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="group relative aspect-[4/3] rounded-2xl overflow-hidden">
      <Link href={href}>
        <div className="absolute inset-0"><Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" /></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-heading text-xl font-semibold text-white mb-1 group-hover:text-primary transition-colors">{title}</h3>
          {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
        </div>
      </Link>
    </motion.div>
  );
}

function PlaceCard({ place, index = 0 }: { place: any; index?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="group relative rounded-2xl overflow-hidden">
      <Link href={`/place/${place.slug}`}>
        <div className="relative aspect-[16/10]"><Image src={place.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'} alt={place.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" /></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-block px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-2">{place.category}</span>
          <h3 className="font-heading text-lg font-semibold text-white mb-1 group-hover:text-primary">{place.name}</h3>
          <p className="text-white/70 text-sm">{place.city?.name}, {place.state?.name}</p>
          <div className="flex items-center gap-1 mt-2"><span className="text-accent">★</span><span className="text-white/80 text-sm">{place.rating}</span></div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const [states, setStates] = useState<State[]>([]);
  const [popularPlaces, setPopularPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [statesData, placesData] = await Promise.all([api.getStates(), api.getPopularPlaces()]);
        setStates(statesData.slice(0, 8));
        setPopularPlaces(placesData);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen">
        <div className="absolute inset-0"><Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920" alt="India" fill priority className="object-cover" /><div className="absolute inset-0 hero-gradient" /></div>
        <div className="relative h-full flex flex-col items-center justify-center px-4 pt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">Explore India <span className="gradient-text">State by State</span></h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">Discover the magic of India through our curated collection of tourist destinations.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const query = searchQuery.trim();
              if (query) {
                router.push(`/search?q=${encodeURIComponent(query)}`);
              }
            }} className="max-w-2xl w-full mx-auto">
              <div className="relative">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                  <div className="flex items-center p-2">
                    <Search className="w-5 h-5 text-white/50 ml-3" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search destinations..." className="flex-1 bg-transparent text-white placeholder-white/50 outline-none px-3 py-2" />
                    <button type="submit" className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-xl text-white font-medium">Search</button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-surface border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[{ n: '36', l: 'States & UTs' }, { n: '500+', l: 'Tourist Places' }, { n: '1000+', l: 'Cities' }, { n: '6', l: 'Categories' }].map((s, i) => (
            <div key={i} className="text-center"><div className="font-heading text-3xl md:text-4xl font-bold gradient-text mb-2">{s.n}</div><div className="text-white/60">{s.l}</div></div>
          ))}
        </div>
      </section>

      {/* States */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">Explore States</h2>
          <p className="text-white/60 mb-10">Discover the diversity of India, one state at a time</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {!loading && states.map((state, i) => <ImageCard key={state._id} image={state.image} title={state.name} subtitle={state.description?.slice(0, 60)} href={`/states/${state.slug}`} index={i} />)}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4"><h2 className="font-heading text-3xl font-bold text-white mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((c, i) => (
              <a key={c.slug} href={`/categories/${c.slug}`} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-center">
                <c.icon className="w-7 h-7 mx-auto mb-4" style={{ color: c.color }} />
                <h3 className="font-heading text-lg font-semibold text-white group-hover:text-primary">{c.name}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Popular */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl font-bold text-white">Popular Destinations</h2>
            <Link href="/places" className="text-primary hover:text-primary-dark font-semibold transition-colors">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading && popularPlaces.slice(0, 6).map((place, i) => <PlaceCard key={place._id} place={place} index={i} />)}
          </div>
        </div>
      </section>
    </div>
  );
}