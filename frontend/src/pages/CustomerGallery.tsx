import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { galleryApi } from '../api/gallery';
import { Photo, PublicGalleryInfo } from '../types';
import { PINModal } from '../components/PINModal';
import { Lightbox } from '../components/Lightbox';
import { 
  Camera, 
  Calendar, 
  Image as ImageIcon, 
  Maximize2, 
  ShieldCheck, 
  Lock, 
  Heart, 
  Download, 
  ChevronDown, 
  Sparkles, 
  MapPin 
} from 'lucide-react';

export const CustomerGallery: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [galleryInfo, setGalleryInfo] = useState<PublicGalleryInfo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [sessionToken, setSessionToken] = useState<string | null>(
    localStorage.getItem('snapgallery_session')
  );
  const [isPinRequired, setIsPinRequired] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const loadGalleryData = async () => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch public info
      const info = await galleryApi.getPublicGalleryInfo(slug);
      setGalleryInfo(info);

      // 2. Try fetching photos if session token exists
      const storedSession = localStorage.getItem('snapgallery_session');
      if (storedSession) {
        try {
          const photoRes = await galleryApi.getPublicPhotos(slug, 0, 100);
          setPhotos(photoRes.content);
          setIsPinRequired(false);
        } catch (err) {
          localStorage.removeItem('snapgallery_session');
          setSessionToken(null);
          setIsPinRequired(true);
        }
      } else {
        setIsPinRequired(true);
      }
    } catch (err: any) {
      setError(err.message || 'Gallery unavailable or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGalleryData();
  }, [slug]);

  const handleVerifyPin = async (pin: string) => {
    if (!slug) return;
    const res = await galleryApi.verifyPin(slug, pin);
    localStorage.setItem('snapgallery_session', res.sessionToken);
    setSessionToken(res.sessionToken);

    // Fetch photos
    const photoRes = await galleryApi.getPublicPhotos(slug, 0, 100);
    setPhotos(photoRes.content);
    setIsPinRequired(false);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDownloadSingle = (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = photo.storageUrl;
    link.download = photo.originalFilename || 'photo.jpg';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 font-mono text-xs">
        <Sparkles className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
        <span>Loading high-fidelity gallery...</span>
      </div>
    );
  }

  if (error || !galleryInfo) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 text-zinc-100">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-display font-bold text-white">Gallery Unavailable</h2>
          <p className="text-sm text-zinc-400">{error || 'This gallery is unpublished or has expired.'}</p>
        </div>
      </div>
    );
  }

  const coverImage = photos[0]?.storageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 selection:bg-indigo-600 selection:text-white">
      {/* PIN Prompt Modal */}
      {isPinRequired && (
        <PINModal galleryName={galleryInfo.name} onVerify={handleVerifyPin} />
      )}

      {/* Customer Minimal Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-6 py-3 text-white">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-md">
              <Camera className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight">SnapGallery</span>
            <span className="text-zinc-500">•</span>
            <span className="text-xs text-zinc-400 font-mono">Private Collection</span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PIN Verified</span>
          </div>
        </div>
      </header>

      {/* Hero Cover Section */}
      <section className="relative w-full min-h-[85vh] flex items-end justify-center pb-16 px-6 overflow-hidden pt-16" id="hero">
        <div className="absolute inset-0 z-0">
          <img
            src={coverImage}
            alt={galleryInfo.name}
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/30" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto text-white space-y-4">
          <div className="inline-block tracking-widest uppercase text-xs font-semibold text-amber-200/90 font-mono">
            SACRED VOWS & CELEBRATIONS
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-light tracking-tight text-white drop-shadow-md">
            {galleryInfo.name}
          </h1>

          <div className="h-px w-20 mx-auto bg-white/40 my-3" />

          <p className="font-serif text-lg sm:text-2xl text-neutral-200 italic font-light">
            {galleryInfo.description || 'The Royal Courtyard & Palace Celebrations'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs tracking-wider uppercase text-neutral-300 font-mono">
            <span>{galleryInfo.publishedAt ? new Date(galleryInfo.publishedAt).toLocaleDateString() : 'September 2026'}</span>
            <span className="text-white/40">•</span>
            <span className="text-white font-normal">Curated Collection ({galleryInfo.totalPhotos} Photographs)</span>
          </div>

          <div className="pt-8 flex justify-center">
            <a href="#gallery-grid" className="group inline-flex flex-col items-center text-xs tracking-widest uppercase text-white/80 hover:text-white transition">
              <span className="mb-2 font-mono">Explore Gallery</span>
              <ChevronDown className="w-4 h-4 animate-bounce text-white/90" />
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Storyline Chapter Navigation */}
      <section className="sticky top-12 z-30 bg-[#FCFCFC]/95 backdrop-blur border-b border-zinc-200 py-3 px-6 shadow-xs">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <nav className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {['All', 'Highlights', 'Getting Ready', 'Ceremony', 'Reception', 'Portraits'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {cat} ({cat === 'All' ? photos.length : Math.ceil(photos.length / 4)})
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-3 text-xs text-zinc-500 font-mono whitespace-nowrap">
            <span>Chronological Sequence</span>
          </div>
        </div>
      </section>

      {/* Editorial Gallery Layout */}
      <section className="max-w-[1440px] mx-auto px-6 py-12" id="gallery-grid">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-zinc-200 pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono font-semibold">Sequence 01 — Ceremony & Elegance</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-zinc-900 font-normal mt-1">The Sacred Union</h2>
          </div>
          <p className="font-serif italic text-zinc-500 text-sm sm:text-base mt-2 sm:mt-0">
            Photographed under golden light & cascading petals
          </p>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          {photos.map((photo, index) => {
            const isFavorite = favorites.has(photo.id);
            const isWide = index === 0;
            const isVertical = index % 3 === 1;

            return (
              <figure
                key={photo.id}
                onClick={() => setLightboxIndex(index)}
                className={`group relative bg-zinc-100 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 shadow-xs border border-zinc-200/60 hover:shadow-lg ${
                  isWide 
                    ? 'md:col-span-12 aspect-[21/9]' 
                    : isVertical 
                      ? 'md:col-span-5 aspect-[3/4]' 
                      : 'md:col-span-7 aspect-[3/2]'
                }`}
              >
                <img
                  src={photo.storageUrl}
                  alt={photo.originalFilename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Favorite Badge */}
                {isFavorite && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      Favorite
                    </span>
                  </div>
                )}

                {/* Hover Overlay Controls */}
                <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-5 text-white">
                  <div className="space-y-0.5">
                    <span className="text-[10px] tracking-widest uppercase bg-white/20 backdrop-blur px-2.5 py-0.5 rounded text-white font-mono">
                      Frame #{index + 1}
                    </span>
                    <p className="text-xs font-mono text-zinc-300 truncate max-w-[200px]">
                      {photo.originalFilename}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => toggleFavorite(photo.id, e)}
                      className="p-2.5 rounded-full bg-white/90 text-zinc-800 hover:bg-white transition shadow-sm"
                      title="Favorite"
                      type="button"
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => handleDownloadSingle(photo, e)}
                      className="p-2.5 rounded-full bg-white/90 text-zinc-800 hover:bg-white transition shadow-sm"
                      title="Download"
                      type="button"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setLightboxIndex(index)}
                      className="p-2.5 rounded-full bg-white/90 text-zinc-800 hover:bg-white transition shadow-sm"
                      title="Expand Lightbox"
                      type="button"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </figure>
            );
          })}
        </div>
      </section>

      {/* Lightbox Viewer */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(idx) => setLightboxIndex(idx)}
        />
      )}
    </div>
  );
};
