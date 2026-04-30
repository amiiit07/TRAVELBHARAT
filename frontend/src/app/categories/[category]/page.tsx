'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';

const catInfo: Record<string, {name:string; desc:string}> = {
  heritage: {name:'Heritage', desc:'Ancient monuments and cultural landmarks.'},
  nature: {name:'Nature', desc:'National parks and natural landscapes.'},
  religious: {name:'Religious', desc:'Sacred temples and spiritual sites.'},
  adventure: {name:'Adventure', desc:'Trekking spots and adventure sports.'},
  historical: {name:'Historical', desc:'Forts, museums, and archaeological sites.'},
  beaches: {name:'Beaches', desc:'Pristine beaches and coastal getaways.'}
};

export default function CategoryPage() {
  const params = useParams();
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const slug = params.category as string;
  const info = catInfo[slug] || {name:slug, desc:''};

  useEffect(() => { if (slug) api.getPlacesByCategory(slug).then(setPlaces).catch(console.error).finally(() => setLoading(false)); }, [slug]);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center mb-12">
          <h1 className="font-heading text-4xl text-white mb-4">{info.name} Places</h1>
          <p className="text-white/60">{info.desc}</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? [...Array(6)].map((_,i) => <div key={i} className="aspect-[16/10] bg-surface rounded-2xl animate-pulse"/>) :
           places.map((p,i) => <motion.div key={p._id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="group relative aspect-[16/10] rounded-2xl overflow-hidden">
             <Link href={`/place/${p.slug}`}>
               <img src={p.images?.[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110"/>
               <div className="absolute bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent"><h3 className="text-white group-hover:text-primary">{p.name}</h3><p className="text-white/60 text-sm">{p.city?.name}</p></div>
             </Link>
           </motion.div>)}
        </div>
      </div>
    </div>
  );
}