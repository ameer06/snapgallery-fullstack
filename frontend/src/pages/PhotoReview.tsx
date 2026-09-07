import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { photosApi } from '../api/photos';
import { galleryApi } from '../api/gallery';
import { eventsApi } from '../api/events';
import { EventMember, Photo } from '../types';
import { Lightbox } from '../components/Lightbox';
import { CheckSquare, Square, Filter, Lock, Trash2, Maximize2, Sparkles, Check, X } from 'lucide-react';

export const PhotoReview: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [members, setMembers] = useState<EventMember[]>([]);
  const [selectedUploader, setSelectedUploader] = useState<string>('');
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Create Gallery Modal State
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryName, setGalleryName] = useState('');
  const [galleryDescription, setGalleryDescription] = useState('');
  const [pin, setPin] = useState('482917');
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [isCreatingGallery, setIsCreatingGallery] = useState(false);
  const [createdGallerySlug, setCreatedGallerySlug] = useState<string | null>(null);

  const loadPhotos = async () => {
    if (!eventId) return;
    try {
      const res = await photosApi.getEventPhotos(eventId, selectedUploader || undefined, 0, 100);
      setPhotos(res.content);

      const memberRes = await eventsApi.getMembers(eventId);
      setMembers(memberRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [eventId, selectedUploader]);

  const toggleSelectPhoto = (id: string) => {
    setSelectedPhotoIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedPhotoIds.size === photos.length) {
      setSelectedPhotoIds(new Set());
    } else {
      setSelectedPhotoIds(new Set(photos.map((p) => p.id)));
    }
  };

  const handleCreateGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || selectedPhotoIds.size === 0) return;
    setIsCreatingGallery(true);

    try {
      const gallery = await galleryApi.createGallery(eventId, {
        name: galleryName,
        description: galleryDescription,
        pin,
        photoIds: Array.from(selectedPhotoIds),
      });

      if (publishImmediately) {
        await galleryApi.publishGallery(gallery.id);
      }

      setCreatedGallerySlug(gallery.publicSlug);
    } catch (err: any) {
      alert(err.message || 'Failed to create gallery');
    } finally {
      setIsCreatingGallery(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Delete ${selectedPhotoIds.size} selected photos? This action cannot be undone.`)) return;
    for (const id of Array.from(selectedPhotoIds)) {
      try {
        await photosApi.deletePhoto(id);
      } catch (err) {
        console.error(err);
      }
    }
    setSelectedPhotoIds(new Set());
    loadPhotos();
  };

  const selectedCount = selectedPhotoIds.size;
  const isAllSelected = photos.length > 0 && selectedCount === photos.length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-900 relative pb-28">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Photo Curation Studio</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Studio Curation
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review uploaded event photographs, select high-res assets, and publish customer galleries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Uploader Filter */}
          <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 shadow-xs">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-slate-500">Photographer:</span>
            <select
              value={selectedUploader}
              onChange={(e) => setSelectedUploader(e.target.value)}
              className="bg-transparent text-slate-900 font-semibold outline-none cursor-pointer"
            >
              <option value="" className="bg-white">All Uploaders</option>
              {members.map((m) => (
                <option key={m.user.id} value={m.user.id} className="bg-white">
                  {m.user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select All Toggle */}
          <button
            onClick={handleSelectAll}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            {isAllSelected ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-400" />}
            <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <span>Total Uploaded: <strong className="text-slate-900">{photos.length}</strong> photos</span>
        <span>Selected: <strong className="text-indigo-600">{selectedCount}</strong> photos</span>
      </div>

      {/* Photo Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">Loading photo studio...</div>
      ) : photos.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No Photos Uploaded Yet</p>
          <p className="text-xs text-slate-400 mt-1">Ask photographers to upload photos to this event.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo, index) => {
            const isSelected = selectedPhotoIds.has(photo.id);
            return (
              <div
                key={photo.id}
                className={`group relative rounded-2xl overflow-hidden bg-white border transition-all duration-200 shadow-xs ${
                  isSelected ? 'border-indigo-600 ring-2 ring-indigo-600/30 scale-[0.99]' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Image Container */}
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  <img
                    src={photo.storageUrl}
                    alt={photo.originalFilename}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />

                  {/* Selection Overlay */}
                  <div
                    onClick={() => toggleSelectPhoto(photo.id)}
                    className={`absolute inset-0 bg-slate-950/20 transition-opacity cursor-pointer ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <div className="absolute top-3 left-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-white/80 border-slate-300 text-transparent hover:border-indigo-600'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Lightbox Zoom Action */}
                  <button
                    onClick={() => setLightboxIndex(index)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 text-slate-900 opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow-sm"
                    title="Fullscreen Preview"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sub-label */}
                <div className="p-2.5 bg-white text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
                  <span className="truncate max-w-[100px] font-medium text-slate-700">{photo.uploadedBy?.name || 'Photographer'}</span>
                  <span className="text-slate-400">{new Date(photo.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky Selection Action Dock (Studio Minimalist Ink Pill) */}
      {selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white border border-slate-800 shadow-2xl rounded-full px-6 py-3 flex items-center space-x-6 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center space-x-2 border-r border-slate-800 pr-4">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold text-white">{selectedCount} Selected</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setGalleryName(`Private Gallery (${selectedCount} photos)`);
                setShowGalleryModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Publish Gallery</span>
            </button>

            <button
              onClick={handleDeleteSelected}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <button
              onClick={() => setSelectedPhotoIds(new Set())}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Viewer */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}

      {/* Create Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-900">
            {createdGallerySlug ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900">Gallery Published!</h3>
                <p className="text-xs text-slate-500">Customer Shareable URL:</p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-indigo-600 break-all select-all">
                  {window.location.origin}/gallery/{createdGallerySlug}
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Customer Access PIN: <strong className="text-slate-900 font-mono text-sm">{pin}</strong>
                </div>
                <button
                  onClick={() => {
                    setShowGalleryModal(false);
                    setCreatedGallerySlug(null);
                    setSelectedPhotoIds(new Set());
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs shadow-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateGallerySubmit} className="space-y-4">
                <h2 className="text-xl font-display font-bold">Create Customer Private Gallery</h2>
                <p className="text-xs text-slate-500">
                  Publishing <strong className="text-indigo-600">{selectedCount}</strong> selected photos with 6-digit PIN protection.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Gallery Title</label>
                  <input
                    type="text"
                    required
                    value={galleryName}
                    onChange={(e) => setGalleryName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    value={galleryDescription}
                    onChange={(e) => setGalleryDescription(e.target.value)}
                    placeholder="Private gallery for the client..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-600 h-20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">6-Digit Customer PIN</label>
                  <input
                    type="text"
                    required
                    pattern="\d{6}"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono tracking-widest text-center text-lg font-bold text-indigo-600 outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="publishToggle"
                    checked={publishImmediately}
                    onChange={(e) => setPublishImmediately(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-600 border-slate-300 bg-slate-50"
                  />
                  <label htmlFor="publishToggle" className="text-xs font-medium text-slate-700">
                    Publish gallery immediately upon creation
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowGalleryModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingGallery}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs shadow-sm"
                  >
                    {isCreatingGallery ? 'Creating...' : 'Create & Publish'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
