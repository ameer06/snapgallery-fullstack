import React, { useState, useEffect } from 'react';
import { eventsApi } from '../api/events';
import { photosApi } from '../api/photos';
import { Event, Photo } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, UploadCloud, Image, MapPin, CheckCircle, Plus } from 'lucide-react';
import { UploadModal } from '../components/UploadModal';
import { Lightbox } from '../components/Lightbox';

export const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Photographer Workspace</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Team Member
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Welcome back, {user?.name}. Upload and manage your assigned event photos.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('EVENTS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'EVENTS'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Assigned Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('UPLOADS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'UPLOADS'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            My Uploads ({myPhotos.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-zinc-500">Loading workspace...</div>
      ) : activeTab === 'EVENTS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl">
              <Calendar className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-zinc-400">No Events Assigned Yet</p>
              <p className="text-xs text-zinc-500 mt-1">Your Admin Lead will assign you to upcoming event shoots.</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden shadow-xl flex flex-col group transition-all"
              >
                <div className="h-40 relative bg-zinc-800 overflow-hidden">
                  <img
                    src={event.coverPhotoUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200'}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white truncate">{event.name}</h3>
                    {event.location && (
                      <p className="text-xs text-zinc-300 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{event.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      {new Date(event.eventDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-zinc-200">
                      <Image className="w-3.5 h-3.5 text-indigo-400" />
                      {event.totalPhotos} photos
                    </span>
                  </div>

                  <button
                    onClick={() => openUploadModal(event.id)}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
                  >
                    <UploadCloud className="w-4 h-4" />
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
          {myPhotos.length === 0 ? (
            <div className="p-12 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl">
              <Image className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-zinc-400">No Uploads Recorded</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {myPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer shadow-md"
                >
                  <div className="aspect-square relative bg-zinc-950 overflow-hidden">
                    <img
                      src={photo.storageUrl}
                      alt={photo.originalFilename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs font-semibold text-white bg-black/60 px-3 py-1 rounded-full border border-white/20">
                        View
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 text-[11px] text-zinc-400 flex items-center justify-between">
                    <span className="truncate max-w-[110px]">{photo.originalFilename}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
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
