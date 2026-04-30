'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Compass, Lock, User } from 'lucide-react';
import api from '@/lib/api';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(username, password);
      localStorage.setItem('adminToken', data.token);
      router.push('/admin/dashboard');
    } catch { setError('Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4"><Compass className="w-10 h-10 text-white"/></div>
          <h1 className="font-heading text-3xl font-bold text-white">Admin Login</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-6 p-8 rounded-2xl bg-white/5 border border-white/10">
          {error && <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">{error}</div>}
          <div><label className="text-white/80 text-sm mb-2 block">Username</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"/><input type="text" value={username} onChange={e=>setUsername(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-surface border border-white/10 rounded-xl text-white" placeholder="Username"/></div></div>
          <div><label className="text-white/80 text-sm mb-2 block">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-surface border border-white/10 rounded-xl text-white" placeholder="Password"/></div></div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark rounded-xl text-white font-medium disabled:opacity-50">{loading?'Logging in...':'Login'}</button>
        </form>
        <p className="text-center text-white/40 text-sm mt-6">admin / travelbharat2024</p>
      </motion.div>
    </div>
  );
}