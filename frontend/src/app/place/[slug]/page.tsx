'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Calendar, MapPin, Star, Navigation, ChevronRight, Heart, Share2 } from 'lucide-react';
import api from '@/lib/api';

export default function PlaceDetailPage() {
  const params = useParams();
  const [place, setPlace] = useState<any>(null);
  const [relatedPlaces, setRelatedPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (params.slug) {
      api.getPlace(params.slug as string)
        .then(data => {
          setPlace(data);
          if (data.category) {
            api.getPlacesByCategory(data.category).then(related => {
              setRelatedPlaces(related.filter((p: any) => p._id !== data._id).slice(0, 4));
            }).catch(console.error);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.slug]);

  if (loading) return (
    <div className="min-h-screen pt-24">
      <div className="h-[60vh] bg-surface animate-pulse rounded-3xl mx-4" />
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="h-20 bg-surface animate-pulse rounded-2xl" />
        <div className="h-40 bg-surface animate-pulse rounded-2xl" />
      </div>
    </div>
  );

  if (!place) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <h1 className="text-3xl text-white mb-4">Place Not Found</h1>
        <Link href="/places" className="text-primary hover:underline">← Back to Places</Link>
      </motion.div>
    </div>
  );

  const images = place.images || [];

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero Section with Gallery */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-[60vh] rounded-3xl overflow-hidden mx-4 mb-12">
        <img src={images[imageIndex]} alt={place.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors" aria-label="Like">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors" aria-label="Share">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-sm">
            {imageIndex + 1} / {images.length}
          </div>
        )}

        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setImageIndex(idx)}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  imageIndex === idx ? 'border-primary scale-110' : 'border-white/20'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Header Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold uppercase tracking-wide">{place.category}</span>
              {place.isPopular && <span className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-semibold">⭐ Popular</span>}
              {place.featured && <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-semibold">✨ Featured</span>}
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-4">{place.name}</h1>
            <div className="flex items-center gap-6 text-white/80 flex-wrap">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{place.city?.name}, {place.state?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <span className="text-white font-semibold">{place.rating}/5</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="font-heading text-3xl font-bold text-white mb-4">About</h2>
              <p className="text-white/80 text-lg leading-relaxed">{place.description}</p>
            </motion.section>

            {/* Historical Importance */}
            {place.historicalImportance && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="font-heading text-3xl font-bold text-white mb-4">📜 Historical Importance</h2>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10">
                  <p className="text-white/90 text-lg leading-relaxed">{place.historicalImportance}</p>
                </div>
              </motion.section>
            )}

            {/* Details Grid */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <h2 className="font-heading text-3xl font-bold text-white mb-4">🎫 Visitor Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                  <Calendar className="w-7 h-7 text-primary mb-3" />
                  <h3 className="text-white/60 text-sm font-medium mb-1">Best Time to Visit</h3>
                  <p className="text-white text-lg font-semibold">{place.bestTimeToVisit || 'Year-round'}</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                  <DollarSign className="w-7 h-7 text-primary mb-3" />
                  <h3 className="text-white/60 text-sm font-medium mb-1">Entry Fee</h3>
                  <p className="text-white text-lg font-semibold">{place.entryFee || 'Free'}</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                  <Clock className="w-7 h-7 text-primary mb-3" />
                  <h3 className="text-white/60 text-sm font-medium mb-1">Opening Hours</h3>
                  <p className="text-white text-lg font-semibold">{place.timings || 'Check on site'}</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                  <Navigation className="w-7 h-7 text-primary mb-3" />
                  <h3 className="text-white/60 text-sm font-medium mb-1">Location</h3>
                  {place.mapLink ? (
                    <a href={place.mapLink} target="_blank" className="text-primary font-semibold hover:text-primary-dark transition-colors flex items-center gap-1">
                      View on Map <ChevronRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <p className="text-white/50">Not available</p>
                  )}
                </div>
              </div>
            </motion.section>

            {/* Nearby Attractions */}
            {place.nearbyAttractions && place.nearbyAttractions.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <h2 className="font-heading text-3xl font-bold text-white mb-4">🗺️ Nearby Attractions</h2>
                <div className="grid grid-cols-1 gap-3">
                  {place.nearbyAttractions.map((attraction: string, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                      <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-white/80">{attraction}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar - Quick Info */}
          <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-6">
            <div className="sticky top-32 space-y-6">
              {/* Rating Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 border border-white/10">
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-accent mb-2">{place.rating}</div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(place.rating) ? 'text-accent fill-accent' : 'text-white/20'}`}
                      />
                    ))}
                  </div>
                  <p className="text-white/70 text-sm">Excellent</p>
                </div>
              </div>

              {/* Share Card */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Share This Place</h3>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm font-medium">
                    Share
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors text-sm font-medium">
                    Save
                  </button>
                </div>
              </div>

              {/* Back to Explore */}
              <Link href="/places" className="block p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 text-center text-white font-semibold transition-colors">
                ← Back to All Places
              </Link>
            </div>
          </motion.aside>
        </div>

        {/* Related Places */}
        {relatedPlaces.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-16 pt-12 border-t border-white/10">
            <h2 className="font-heading text-3xl font-bold text-white mb-8">Similar {place.category} Destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPlaces.map((p: any, idx: number) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="group relative rounded-2xl overflow-hidden hover:shadow-xl transition-all"
                >
                  <Link href={`/place/${p.slug}`}>
                    <div className="relative aspect-[16/10]">
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white/70 text-xs font-semibold mb-1">{p.city?.name}</p>
                      <h3 className="font-heading text-lg font-semibold text-white group-hover:text-primary transition-colors line-clamp-2">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-white text-sm">{p.rating}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}