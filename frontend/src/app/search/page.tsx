'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import api from '@/lib/api';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(q || '');

  useEffect(() => {
    setQuery(q || '');
    if (q) {
      setLoading(true);
      api.search(q).then(setResults).catch(console.error).finally(() => setLoading(false));
      return;
    }
    setResults(null);
    setLoading(false);
  }, [q]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextQuery = query.trim();
    if (nextQuery) {
      router.push(`/search?q=${encodeURIComponent(nextQuery)}`);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mb-8">
          <h1 className="font-heading text-3xl text-white mb-2">Search Results</h1>
          <form onSubmit={handleSubmit} className="mt-4 flex gap-3 max-w-2xl">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-white/10">
              <Search className="w-5 h-5 text-white/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search places, states, cities..."
                className="w-full bg-transparent outline-none text-white placeholder-white/40"
              />
            </div>
            <button type="submit" className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors">
              Search
            </button>
          </form>
          {q && <p className="text-white/60 mt-4">Showing results for "{q}"</p>}
        </motion.div>
        {loading ? <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-surface rounded-xl animate-pulse"/>)}</div> : !q ? (
          <div className="text-white/60 rounded-2xl border border-white/10 bg-surface p-8 text-center">
            Type a keyword and press Search to find places, states, or cities.
          </div>
        ) : (
          <>
            {results?.states?.length > 0 && <section className="mb-12"><h2 className="font-heading text-xl text-white mb-6">States</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{results.states.map((s:any) => <Link key={s._id} href={`/states/${s.slug}`} className="relative aspect-video rounded-xl overflow-hidden"><img src={s.image} className="w-full h-full object-cover"/><div className="absolute bottom-0 p-2 bg-black/60"><p className="text-white text-sm">{s.name}</p></div></Link>)}</div></section>}
            {results?.places?.length > 0 ? <section><h2 className="font-heading text-xl text-white mb-6">Places ({results.places.length})</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{results.places.map((p:any) => <Link key={p._id} href={`/place/${p.slug}`} className="group relative aspect-[16/10] rounded-2xl overflow-hidden"><img src={p.images?.[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110"/><div className="absolute bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent"><span className="text-xs text-primary">{p.category}</span><h3 className="text-white group-hover:text-primary">{p.name}</h3></div></Link>)}</div></section> : <p className="text-white/60">No places found.</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center text-white">Loading...</div>}><SearchContent/></Suspense>;
}