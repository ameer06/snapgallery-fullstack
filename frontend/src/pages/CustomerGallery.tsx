import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { galleryApi } from '../api/gallery';
import { Photo, PublicGalleryInfo } from '../types';
import { PINModal } from '../components/PINModal';
import { Lightbox } from '../components/Lightbox';
import { Camera, Calendar, Image, Maximize2, ShieldCheck, Lock } from 'lucide-react';

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
          // Session expired or invalid
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Loading private gallery...
      </div>
    );
  }

  if (error || !galleryInfo) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 text-zinc-100">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Gallery Unavailable</h2>
          <p className="text-sm text-zinc-400">{error || 'This gallery is unpublished or has expired.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-600 selection:text-white">
      {/* PIN Prompt Modal */}
      {isPinRequired && (
        <PINModal galleryName={galleryInfo.name} onVerify={handleVerifyPin} />
      )}

      {/* Customer Header */}
      <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">SnapGallery</span>
              <span className="ml-2 text-xs text-zinc-400 font-medium">Private Collection</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>PIN Verified</span>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="py-12 px-6 max-w-7xl mx-auto text-center border-b border-zinc-900">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          {galleryInfo.name}
        </h1>
        {galleryInfo.description && (
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            {galleryInfo.description}
          </p>
        )}
        <div className="flex items-center justify-center space-x-6 text-xs text-zinc-500 font-medium">
          <span className="flex items-center gap-1.5">
            <Image className="w-4 h-4 text-indigo-400" />
            <strong className="text-zinc-200">{galleryInfo.totalPhotos}</strong> Curated Photographs
          </span>
          {galleryInfo.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-zinc-500" />
              Published {new Date(galleryInfo.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Published Photo Gallery Grid */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 hover:border-indigo-500/50 cursor-pointer shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] sm:aspect-square relative overflow-hidden bg-zinc-950">
                <img
                  src={photo.storageUrl}
                  alt={photo.originalFilename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="flex items-center justify-between w-full text-xs text-white">
                    <span className="font-semibold truncate">{photo.originalFilename}</span>
                    <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

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
