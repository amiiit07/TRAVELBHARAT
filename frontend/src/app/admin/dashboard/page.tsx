'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Building, Castle, LogOut } from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ states: 0, cities: 0, places: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin/login'); return; }
    Promise.all([api.getStates(), api.getCities(), api.getPlaces({ limit: 100 })]).then(([s, c, p]) => {
      setStats({ states: s.length, cities: c.length, places: p.total || 0 });
    }).catch(console.error).finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/');
  };

  const menu = [
    { title: 'Manage Places', desc: 'Add or edit places', icon: Castle, href: '/admin/places' },
    { title: 'Manage States', desc: 'Add or edit states', icon: MapPin, href: '#' },
    { title: 'Manage Cities', desc: 'Add or edit cities', icon: Building, href: '#' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex items-center justify-between mb-8">
          <div><h1 className="font-heading text-3xl text-white mb-2">Admin Dashboard</h1><p className="text-white/60">Welcome back!</p></div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface text-white/80 hover:text-white"><LogOut className="w-5 h-5"/>Logout</button>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"><MapPin className="w-6 h-6 text-primary"/></div><div><p className="text-white/60 text-sm">States</p><p className="font-heading text-2xl text-white">{loading?'-':stats.states}</p></div></div></div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center"><Building className="w-6 h-6 text-secondary-light"/></div><div><p className="text-white/60 text-sm">Cities</p><p className="font-heading text-2xl text-white">{loading?'-':stats.cities}</p></div></div></div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center"><Castle className="w-6 h-6 text-accent"/></div><div><p className="text-white/60 text-sm">Places</p><p className="font-heading text-2xl text-white">{loading?'-':stats.places}</p></div></div></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menu.map((item,i) => (
            <motion.div key={item.title} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}>
              <Link href={item.href} className="block p-6 rounded-2xl bg-white/5 border border-white/10 group">
                <item.icon className="w-7 h-7 text-primary mb-4"/><h3 className="font-heading text-lg text-white group-hover:text-primary">{item.title}</h3><p className="text-white/60 text-sm">{item.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}