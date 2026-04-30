'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { State } from '@/types';

export default function StatesPage() {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { api.getStates().then(d => setStates(d)).catch(console.error).finally(() => setLoading(false)); }, []);
  const filtered = states.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Explore Indian States</h1>
          <p className="text-white/60">Discover the incredible diversity of India.</p>
        </motion.div>
        <input type="text" placeholder="Search states..." value={search} onChange={e => setSearch(e.target.value)} className="w-full max-w-md mx-auto mb-8 block px-4 py-3 rounded-xl bg-surface border border-white/10 text-white" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? [...Array(8)].map((_,i) => <div key={i} className="aspect-[4/3] rounded-2xl bg-surface animate-pulse"/>) :
           filtered.map((state,i) => (
            <motion.div key={state._id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="group relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Link href={`/states/${state.slug}`}>
                <img src={state.image} alt={state.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"/>
                <div className="absolute bottom-0 p-4">
                  <h3 className="font-heading text-xl text-white group-hover:text-primary">{state.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}