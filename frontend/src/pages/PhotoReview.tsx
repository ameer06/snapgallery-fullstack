import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { photosApi } from '../api/photos';
import { galleryApi } from '../api/gallery';
import { eventsApi } from '../api/events';
import { EventMember, Photo, Event } from '../types';
import { Lightbox } from '../components/Lightbox';
import { 
  CheckSquare, 
  Square, 
  Filter, 
  Lock, 
  Trash2, 
  Maximize2, 
  Sparkles, 
  Check, 
  X, 
  ChevronRight, 
  Cloud, 
  Camera, 
  PieChart, 
  Award, 
  Download, 
  Search, 
  Grid, 
  SlidersHorizontal,
  Copy,
  Star,
  Users
} from 'lucide-react';

export const PhotoReview: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [members, setMembers] = useState<EventMember[]>([]);
  const [selectedUploader, setSelectedUploader] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'picks' | 'review' | 'rejected' | 'fivestar'>('all');
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
  const [copiedLink, setCopiedLink] = useState(false);

  const loadData = async () => {
    if (!eventId) return;
    try {
      const eventRes = await eventsApi.getEventById(eventId);
      setEvent(eventRes);

      const res = await photosApi.getEventPhotos(eventId, selectedUploader || undefined, 0, 200);
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
    loadData();
  }, [eventId, selectedUploader]);

  const toggleSelectPhoto = (id: string) => {
    setSelectedPhotoIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredPhotos.map(p => p.id);
    const allVisibleSelected = visibleIds.every(id => selectedPhotoIds.has(id));
    
    if (allVisibleSelected) {
      setSelectedPhotoIds(prev => {
        const next = new Set(prev);
        visibleIds.forEach(id => next.delete(id));
        return next;
      });
    } else {
      setSelectedPhotoIds(prev => {
        const next = new Set(prev);
        visibleIds.forEach(id => next.add(id));
        return next;
      });
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
    loadData();
  };

  const filteredPhotos = photos.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.originalFilename.toLowerCase().includes(q);
      const matchUploader = p.uploadedBy?.name?.toLowerCase().includes(q);
      if (!matchName && !matchUploader) return false;
    }
    if (activeTab === 'picks') return selectedPhotoIds.has(p.id);
    return true;
  });

  const selectedCount = selectedPhotoIds.size;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 pb-28">
      {/* Top Header & Breadcrumbs Bar */}
      <div className="px-6 sm:px-8 py-5 bg-white border-b border-zinc-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 flex-wrap">
            <Link to="/admin" className="hover:text-zinc-900 transition-colors">Events</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-zinc-900">{event?.name || 'Event Photo Curation'}</span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[11px] font-mono">
              {event?.eventDate || '2026'}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-indigo-600 font-semibold">Photo Review & Curation</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
              <span>Live Session Sync</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium">
              <Cloud className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ingest Status: <strong>{photos.length} / {photos.length}</strong> Complete</span>
            </div>
          </div>
        </div>

        {/* Title & Action Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-display font-extrabold text-zinc-900 tracking-tight">
                {event?.name} — Photo Review & Curation
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono text-[11px] font-bold">
                FINAL ROUND
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-500 flex-wrap">
              <span>Master ingest pipeline. Select, approve, flag, and sequence frames for the couple's private gallery.</span>
              <div className="hidden md:flex items-center gap-2 font-mono text-[11px] bg-zinc-100 px-2.5 py-1 rounded text-zinc-600">
                <span className="font-semibold text-zinc-800">Shortcuts:</span>
                <span>[Space] Quick Look</span> • <span>[P] Pick</span> • <span>[F] Lightbox</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap self-start lg:self-center">
            {photos.length > 0 && (
              <button
                onClick={() => setLightboxIndex(0)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium text-xs transition-all"
                type="button"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Full Lightbox</span>
              </button>
            )}

            <button
              onClick={() => {
                if (selectedCount === 0) {
                  alert('Please select photos first to publish a private gallery.');
                  return;
                }
                setGalleryName(`${event?.name || 'Event'} — Private Customer Gallery`);
                setShowGalleryModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs transition-all shadow-xs"
              type="button"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Publish Private Gallery</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                {selectedCount} Selected
              </span>
            </button>
          </div>
        </div>

        {/* 4 Curation Bento Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>Total Ingested</span>
              <Camera className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="my-1.5 flex items-baseline gap-2">
              <span className="text-xl font-display font-bold text-zinc-900">{photos.length}</span>
              <span className="font-mono text-[11px] text-zinc-400">RAW+JPG Assets</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-600">
              <span className="px-1.5 py-0.5 rounded bg-zinc-200/70">Sony A1</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-200/70">Canon R5</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-200/70">Nikon Z8</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>Curation Progress</span>
              <PieChart className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="my-1.5 flex items-baseline gap-2">
              <span className="text-xl font-display font-bold text-indigo-600">{selectedCount}</span>
              <span className="text-xs text-zinc-600 font-medium">Selected Picks</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden flex">
              <div 
                className="h-full bg-indigo-600 transition-all duration-300" 
                style={{ width: `${photos.length > 0 ? (selectedCount / photos.length) * 100 : 0}%` }} 
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>Quality & AI Flags</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="my-1.5 flex items-baseline gap-2">
              <span className="text-xl font-display font-bold text-zinc-900">{Math.min(photos.length, 48)}</span>
              <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Master Shots
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>0 Corrupt</span>
              <span>Fast CDN Active</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>Team Streams</span>
              <Users className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="my-1 space-y-0.5 font-mono text-[11px]">
              {members.slice(0, 2).map((m) => (
                <div key={m.id} className="flex justify-between text-zinc-700">
                  <span className="truncate max-w-[120px]">{m.user.name}</span>
                  <span className="text-indigo-600 font-bold">Sync Active ✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Toolbar & Filters */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-6 sm:px-8 py-3 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by filename or photographer..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-100/80 text-zinc-900 placeholder:text-zinc-400 text-xs border border-zinc-200/60 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all"
            />
          </div>

          {/* Quick Status Pill Tabs */}
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 border border-zinc-200/60 flex-wrap">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                activeTab === 'all' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <span>All</span>
              <span className="text-zinc-400 font-normal">({photos.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('picks')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                activeTab === 'picks' ? 'bg-white text-indigo-700 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              <span>Picks</span>
              <span className="font-mono">({selectedCount})</span>
            </button>
          </div>

          {/* Uploader Filter */}
          <div className="flex items-center space-x-2 bg-zinc-100 border border-zinc-200/60 rounded-lg px-3 py-1.5 text-xs text-zinc-700">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <select
              value={selectedUploader}
              onChange={(e) => setSelectedUploader(e.target.value)}
              className="bg-transparent text-zinc-900 font-semibold outline-none cursor-pointer text-xs"
            >
              <option value="">Photographer: All</option>
              {members.map((m) => (
                <option key={m.user.id} value={m.user.id}>
                  {m.user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Visible Button */}
          <button
            onClick={handleSelectAllVisible}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors border border-zinc-200/60"
          >
            <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Select Visible ({filteredPhotos.length})</span>
          </button>
        </div>
      </div>

      {/* Photo Grid Container */}
      <div className="px-6 sm:px-8 py-6">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-400 font-mono text-xs">Loading curation assets...</div>
        ) : filteredPhotos.length === 0 ? (
          <div className="p-12 text-center bg-white border border-zinc-200/80 rounded-2xl">
            <Sparkles className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-zinc-800">No Photos Found</p>
            <p className="text-xs text-zinc-400 mt-1">Upload photographs to this event to begin curation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredPhotos.map((photo, index) => {
              const isSelected = selectedPhotoIds.has(photo.id);
              return (
                <div
                  key={photo.id}
                  className={`group relative rounded-xl overflow-hidden bg-white border transition-all duration-200 shadow-xs ${
                    isSelected ? 'border-indigo-600 ring-2 ring-indigo-600/30 scale-[0.99]' : 'border-zinc-200/80 hover:border-zinc-300 hover:shadow-md'
                  }`}
                >
                  {/* Image Container */}
                  <div className="aspect-square relative overflow-hidden bg-zinc-100">
                    <img
                      src={photo.storageUrl}
                      alt={photo.originalFilename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Selection Overlay */}
                    <div
                      onClick={() => toggleSelectPhoto(photo.id)}
                      className={`absolute inset-0 bg-zinc-950/20 transition-opacity cursor-pointer ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <div className="absolute top-3 left-3">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                              : 'bg-white/90 border-zinc-300 text-transparent hover:border-indigo-600'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Lightbox Trigger */}
                    <button
                      onClick={() => setLightboxIndex(index)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/90 text-zinc-900 opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow-xs"
                      title="Fullscreen Lightbox"
                      type="button"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Sub-label */}
                  <div className="p-2.5 bg-white text-[11px] text-zinc-500 flex items-center justify-between border-t border-zinc-100">
                    <span className="truncate max-w-[100px] font-medium text-zinc-800">{photo.uploadedBy?.name || 'Photographer'}</span>
                    <span className="font-mono text-[10px] text-zinc-400">{new Date(photo.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Selection Action Dock */}
      {selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-900 text-white border border-zinc-800 shadow-2xl rounded-full px-6 py-3 flex items-center space-x-6 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center space-x-2 border-r border-zinc-800 pr-4">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold text-white">{selectedCount} Selected</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setGalleryName(`${event?.name || 'Event'} — Private Customer Gallery`);
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
              className="p-1 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Viewer */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={filteredPhotos}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}

      {/* Create Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 shadow-2xl text-zinc-900">
            {createdGallerySlug ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-center mx-auto text-indigo-600">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-display font-bold text-zinc-900">Gallery Published!</h3>
                <p className="text-xs text-zinc-500">Customer Shareable URL:</p>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 font-mono text-xs text-indigo-600 break-all select-all flex items-center justify-between">
                  <span>{window.location.origin}/gallery/{createdGallerySlug}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/gallery/${createdGallerySlug}`);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="p-1 text-zinc-400 hover:text-zinc-900"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600">
                  Customer Access PIN: <strong className="text-zinc-900 font-mono text-sm">{pin}</strong>
                </div>
                <button
                  onClick={() => {
                    setShowGalleryModal(false);
                    setCreatedGallerySlug(null);
                    setSelectedPhotoIds(new Set());
                  }}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs shadow-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateGallerySubmit} className="space-y-4">
                <h2 className="text-lg font-display font-bold text-zinc-900">Create Customer Private Gallery</h2>
                <p className="text-xs text-zinc-500">
                  Publishing <strong className="text-indigo-600">{selectedCount}</strong> selected photos with 6-digit PIN protection.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1">Gallery Title</label>
                  <input
                    type="text"
                    required
                    value={galleryName}
                    onChange={(e) => setGalleryName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    value={galleryDescription}
                    onChange={(e) => setGalleryDescription(e.target.value)}
                    placeholder="Private gallery for the client..."
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs outline-none focus:border-indigo-600 focus:bg-white h-20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1">6-Digit Customer PIN</label>
                  <input
                    type="text"
                    required
                    pattern="\d{6}"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-mono tracking-widest text-center font-bold text-indigo-600 outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="publishToggle"
                    checked={publishImmediately}
                    onChange={(e) => setPublishImmediately(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-600 border-zinc-300 bg-zinc-50"
                  />
                  <label htmlFor="publishToggle" className="text-xs font-medium text-zinc-700">
                    Publish gallery immediately upon creation
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setShowGalleryModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingGallery}
                    className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-semibold text-xs shadow-xs"
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
