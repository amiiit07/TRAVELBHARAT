'use client';
import Link from 'next/link';
import { Compass, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-white">Travel<span className="text-primary">Bharat</span></span>
            </Link>
            <p className="text-white/60 text-sm">Discover the magic of India through our curated collection of tourist destinations.</p>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/states" className="text-white/60 hover:text-primary text-sm">All States</Link></li>
              <li><Link href="/states/tamil-nadu" className="text-white/60 hover:text-primary text-sm">Tamil Nadu</Link></li>
              <li><Link href="/states/kerala" className="text-white/60 hover:text-primary text-sm">Kerala</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/categories/heritage" className="text-white/60 hover:text-primary text-sm">Heritage</Link></li>
              <li><Link href="/categories/nature" className="text-white/60 hover:text-primary text-sm">Nature</Link></li>
              <li><Link href="/categories/beaches" className="text-white/60 hover:text-primary text-sm">Beaches</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/60 text-sm"><MapPin className="w-4 h-4" /><span>New Delhi, India</span></div>
              <div className="flex items-center gap-2 text-white/60 text-sm"><Mail className="w-4 h-4" /><span>hello@travelbharat.com</span></div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">© 2024 TravelBharat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}