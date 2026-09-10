import React, { useState, useEffect } from 'react';
import { eventsApi } from '../api/events';
import { photosApi } from '../api/photos';
import { Event, Photo } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, UploadCloud, Image as ImageIcon, MapPin, CheckCircle } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { UploadModal } from '../components/UploadModal';
import { Lightbox } from '../components/Lightbox';
import { getImageUrl } from '../utils/image';

export const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const { searchQuery } = (useOutletContext() || {}) as any;
  const [events, setEvents] = useState<Event[]>([]);
  const [myPhotos, setMyPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'EVENTS' | 'UPLOADS'>('EVENTS');

  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const eventRes = await eventsApi.getEvents();
      setEvents(eventRes.content);

      const photosRes = await photosApi.getOwnUploads();
      setMyPhotos(photosRes.content);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openUploadModal = (eventId: string) => {
    setActiveEventId(eventId);
    setShowUploadModal(true);
  };

  const filteredEvents = events.filter((e) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = e.name?.toLowerCase().includes(q);
      const matchLoc = e.location?.toLowerCase().includes(q);
      const matchDesc = e.description?.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchDesc) return false;
    }
    return true;
  });

  const filteredPhotos = myPhotos.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.originalFilename?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-6 sm:p-8 max-w-[1440px] mx-auto space-y-8 text-zinc-900 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-zinc-900 tracking-tight flex items-center gap-3">
            <span>Photographer Workspace</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Team Member
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Welcome back, {user?.name}. Ingest and track your assigned event photos.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-zinc-100 border border-zinc-200/60 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('EVENTS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'EVENTS'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Assigned Events ({filteredEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('UPLOADS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'UPLOADS'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            My Uploads ({filteredPhotos.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-zinc-400 font-mono text-xs">Loading workspace...</div>
      ) : activeTab === 'EVENTS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white border border-zinc-200/80 rounded-2xl">
              <Calendar className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-800">No Events Found</p>
              <p className="text-xs text-zinc-400 mt-1">Try refining your search query or check back later.</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-xl overflow-hidden shadow-xs hover:shadow-md flex flex-col group transition-all"
              >
                <div className="h-44 relative bg-zinc-100 overflow-hidden">
                  <img
                    src={getImageUrl(event.coverPhotoUrl)}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-display font-bold text-white truncate">{event.name}</h3>
                    {event.location && (
                      <p className="text-xs text-zinc-200 flex items-center gap-1 mt-0.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{event.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {new Date(event.eventDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-zinc-900">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                      {event.totalPhotos} photos
                    </span>
                  </div>

                  <button
                    onClick={() => openUploadModal(event.id)}
                    className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs shadow-xs flex items-center justify-center space-x-2 transition-all"
                  >
                    <UploadCloud className="w-4 h-4 text-indigo-400" />
                    <span>Upload Photographs</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* My Personal Uploads Grid */
        <div>
          {filteredPhotos.length === 0 ? (
            <div className="p-12 text-center bg-white border border-zinc-200/80 rounded-2xl">
              <ImageIcon className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-800">No Uploads Found</p>
              <p className="text-xs text-zinc-400 mt-1">Try refining your search query or upload new photographs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative rounded-xl overflow-hidden bg-white border border-zinc-200/80 cursor-pointer shadow-xs hover:shadow-md transition-all"
                >
                  <div className="aspect-square relative bg-zinc-100 overflow-hidden">
                    <img
                      src={getImageUrl(photo.storageUrl)}
                      alt={photo.originalFilename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs font-semibold text-zinc-900 bg-white/90 px-3 py-1 rounded-full shadow-xs">
                        View Asset
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 text-[11px] text-zinc-600 flex items-center justify-between border-t border-zinc-100">
                    <span className="truncate max-w-[110px] font-medium">{photo.originalFilename}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {activeEventId && (
        <UploadModal
          eventId={activeEventId}
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={loadData}
        />
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={myPhotos}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(idx) => setLightboxIndex(idx)}
        />
      )}
    </div>
  );
};
