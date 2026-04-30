'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function CityDetailPage() {
  const params = useParams();
  const [city, setCity] = useState<any>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.slug) return;
    const slug = params.slug as string;
    Promise.all([api.getCity(slug), api.getPlaces({ city: slug })]).then(([c, p]) => {
      setCity(c);
      setPlaces(p.places);
    }).catch(console.error).finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <div className="min-h-screen pt-24"><div className="h-[50vh] bg-surface animate-pulse"/></div>;
  if (!city) return <div className="min-h-screen pt-24 flex items-center justify-center"><h1 className="text-white">Not found</h1></div>;

  return (
    <div className="min-h-screen pt-24">
      <section className="relative h-[50vh]">
        <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"/>
        <div className="absolute bottom-0 left-0 p-8"><h1 className="font-heading text-4xl md:text-6xl font-bold text-white">{city.name}</h1></div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-lg text-white/80 mb-12">{city.description}</p>
        {places.length > 0 && <section><h2 className="font-heading text-2xl text-white mb-6">Tourist Places in {city.name}</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{places.map((p:any) => <Link key={p._id} href={`/place/${p.slug}`} className="group relative aspect-[16/10] rounded-2xl overflow-hidden"><img src={p.images?.[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110"/><div className="absolute bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent"><span className="text-xs text-primary">{p.category}</span><h3 className="text-white group-hover:text-primary">{p.name}</h3></div></Link>)}</div></section>}
      </div>
    </div>
  );
}