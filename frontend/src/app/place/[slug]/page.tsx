'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Calendar, MapPin, Star, Navigation } from 'lucide-react';
import api from '@/lib/api';

export default function PlaceDetailPage() {
  const params = useParams();
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (params.slug) api.getPlace(params.slug as string).then(setPlace).catch(console.error).finally(() => setLoading(false)); }, [params.slug]);

  if (loading) return <div className="min-h-screen pt-24"><div className="h-[60vh] bg-surface animate-pulse"/></div>;
  if (!place) return <div className="min-h-screen pt-24 flex items-center justify-center"><h1 className="text-white">Not found</h1></div>;

  return (
    <div className="min-h-screen pt-24">
      <section className="relative h-[60vh]">
        <img src={place.images?.[0]} alt={place.name} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"/>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm mb-4">{place.category}</span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-2">{place.name}</h1>
            <p className="text-white/80 flex items-center gap-4"><MapPin className="w-5 h-5"/>{place.city?.name}, {place.state?.name}<Star className="w-5 h-5 text-accent ml-4"/>{place.rating}</p>
          </motion.div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section><h2 className="font-heading text-2xl text-white mb-4">About</h2><p className="text-white/80 text-lg">{place.description}</p></section>
            {place.historicalImportance && <section><h2 className="font-heading text-2xl text-white mb-4">Historical Importance</h2><p className="text-white/80">{place.historicalImportance}</p></section>}
            <section className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10"><Calendar className="w-6 h-6 text-primary mb-2"/><h3 className="text-white/60 text-sm">Best Time</h3><p className="text-white">{place.bestTimeToVisit || 'N/A'}</p></div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10"><DollarSign className="w-6 h-6 text-primary mb-2"/><h3 className="text-white/60 text-sm">Entry Fee</h3><p className="text-white">{place.entryFee || 'Free'}</p></div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10"><Clock className="w-6 h-6 text-primary mb-2"/><h3 className="text-white/60 text-sm">Timings</h3><p className="text-white">{place.timings || 'N/A'}</p></div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10"><Navigation className="w-6 h-6 text-primary mb-2"/><h3 className="text-white/60 text-sm">Location</h3><a href={place.mapLink} target="_blank" className="text-primary hover:underline">View Map</a></div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}