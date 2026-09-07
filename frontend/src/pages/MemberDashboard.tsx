import React, { useState, useEffect } from 'react';
import { eventsApi } from '../api/events';
import { photosApi } from '../api/photos';
import { Event, Photo } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, UploadCloud, Image, MapPin, CheckCircle } from 'lucide-react';
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
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Photographer Workspace</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Team Member
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Welcome back, {user?.name}. Upload and manage your assigned event photos.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('EVENTS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'EVENTS'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Assigned Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('UPLOADS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'UPLOADS'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Uploads ({myPhotos.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400">Loading workspace...</div>
      ) : activeTab === 'EVENTS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white border border-slate-200 rounded-2xl">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No Events Assigned Yet</p>
              <p className="text-xs text-slate-400 mt-1">Your Admin Lead will assign you to upcoming event shoots.</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden shadow-xs hover:shadow-md flex flex-col group transition-all"
              >
                <div className="h-40 relative bg-slate-100 overflow-hidden">
                  <img
                    src={event.coverPhotoUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200'}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-display font-bold text-white truncate">{event.name}</h3>
                    {event.location && (
                      <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{event.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(event.eventDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-900">
                      <Image className="w-3.5 h-3.5 text-indigo-600" />
                      {event.totalPhotos} photos
                    </span>
                  </div>

                  <button
                    onClick={() => openUploadModal(event.id)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs flex items-center justify-center space-x-2 transition-all"
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
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
              <Image className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No Uploads Recorded</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {myPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 cursor-pointer shadow-xs hover:shadow-md transition-all"
                >
                  <div className="aspect-square relative bg-slate-100 overflow-hidden">
                    <img
                      src={photo.storageUrl}
                      alt={photo.originalFilename}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs font-semibold text-slate-900 bg-white/90 px-3 py-1 rounded-full shadow-sm">
                        View
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 text-[11px] text-slate-600 flex items-center justify-between">
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
