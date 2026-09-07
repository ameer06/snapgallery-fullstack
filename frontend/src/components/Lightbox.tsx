import React, { useEffect } from 'react';
import { Photo } from '../types';
import { X, ChevronLeft, ChevronRight, Download, User, Calendar, HardDrive } from 'lucide-react';
import { getImageUrl } from '../utils/image';

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos.length, onClose, onNavigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center space-x-4 text-zinc-300">
          <span className="text-sm font-semibold px-3 py-1 bg-zinc-800/80 rounded-full border border-zinc-700">
            {currentIndex + 1} / {photos.length}
          </span>
          <span className="text-sm font-medium hidden sm:inline text-zinc-400 truncate max-w-xs">
            {currentPhoto.originalFilename}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href={getImageUrl(currentPhoto.storageUrl)}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="p-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors border border-zinc-700/80"
            title="Download Full Resolution"
          >
            <Download className="w-5 h-5" />
          </a>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors border border-zinc-700/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 z-10 p-3 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all border border-zinc-700/80 shadow-2xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < photos.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 z-10 p-3 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all border border-zinc-700/80 shadow-2xl"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Container */}
      <div className="max-w-6xl max-h-[85vh] p-4 flex flex-col items-center justify-center">
        <img
          src={getImageUrl(currentPhoto.storageUrl)}
          alt={currentPhoto.originalFilename}
          className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl select-none"
        />

        {/* Footer Info */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 bg-zinc-900/80 px-5 py-2.5 rounded-2xl border border-zinc-800">
          {currentPhoto.uploadedBy && (
            <div className="flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Photographer: {currentPhoto.uploadedBy.name}</span>
            </div>
          )}
          {currentPhoto.fileSize && (
            <div className="flex items-center space-x-1.5">
              <HardDrive className="w-3.5 h-3.5 text-zinc-500" />
              <span>{(currentPhoto.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
          )}
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>{new Date(currentPhoto.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
