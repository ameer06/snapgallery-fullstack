import React, { useState, useEffect } from 'react';
import { eventsApi } from '../api/events';
import { Event, User } from '../types';
import { Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Users, 
  Image, 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  UserPlus, 
  Copy, 
  Check 
} from 'lucide-react';
import { useLayoutContext } from '../router/AppRouter';
import { getImageUrl } from '../utils/image';

export const AdminDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'review' | 'published'>('all');
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [coverPhotoUrl, setCoverPhotoUrl] = useState('');

  const loadData = async () => {
    try {
      const eventRes = await eventsApi.getEvents();
      setEvents(eventRes.content);

      const teamRes = await eventsApi.getTeamMembers();
      setTeamMembers(teamRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await eventsApi.createEvent({
        name,
        description,
        eventDate,
        location,
        coverPhotoUrl: coverPhotoUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
      });
      setShowCreateModal(false);
      setName('');
      setDescription('');
      setEventDate('');
      setLocation('');
      setCoverPhotoUrl('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create event');
    }
  };

  const handleCopyLink = (gallerySlug: string, eventId: string) => {
    const url = `${window.location.origin}/gallery/${gallerySlug}`;
    navigator.clipboard.writeText(url);
    setCopiedEventId(eventId);
    setTimeout(() => setCopiedEventId(null), 2000);
  };

  const totalPhotos = events.reduce((acc, curr) => acc + (curr.totalPhotos || 0), 0);

  const filteredEvents = events.filter((e) => {
    if (activeFilter === 'published') return !!e.galleryPublished;
    if (activeFilter === 'review') return !e.galleryPublished;
    return true;
  });

  return (
    <div className="p-6 sm:p-8 max-w-[1440px] mx-auto space-y-8 text-zinc-900 pb-16">
      {/* Top Editorial Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono text-[11px] font-semibold uppercase tracking-wider border border-indigo-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
              STUDIO PULSE
            </span>
            <span className="font-mono text-xs text-zinc-400">/ CYCLE 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-900 tracking-tight">
            Good morning, Lead Photographer
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl">
            Here is what is happening across your active events and photography teams. Ingestion pipeline operating nominally.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Link
            to="/admin/team"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-medium text-xs hover:bg-zinc-50 transition-all shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-zinc-500" />
            <span>Invite Member</span>
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium text-xs hover:bg-zinc-800 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* 4 Key Stat Metrics Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Events */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Active Events</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-zinc-900">{events.length}</span>
              <span className="font-mono text-xs text-indigo-600 font-medium">+2 this month</span>
            </div>
            <p className="text-xs text-zinc-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              <span>Active shoot schedules</span>
            </p>
          </div>
        </div>

        {/* Photos Ingested */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Photos Ingested</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Image className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-zinc-900">{totalPhotos.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Raw digital negative files</span>
              <svg className="w-12 h-4 text-indigo-600 overflow-visible" fill="none" viewBox="0 0 64 20">
                <path d="M1 15 L14 12 L28 16 L42 7 L54 9 L63 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Published Galleries */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Client Galleries</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-zinc-900">
                {events.filter(e => e.galleryPublished).length}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                Live PINs
              </span>
            </div>
            <p className="text-xs text-zinc-500">Active verified shareable links</p>
          </div>
        </div>

        {/* Photographers */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Photographers</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-zinc-900">{teamMembers.length}</span>
              <span className="font-mono text-xs text-emerald-600">100% active</span>
            </div>
            <p className="text-xs text-zinc-500">Assigned across events</p>
          </div>
        </div>
      </div>

      {/* Workspace Events Grid + Filter Bar */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl font-display font-bold text-zinc-900 tracking-tight">Recent Events</h2>
            <span className="font-mono text-xs text-zinc-400">({filteredEvents.length} showing)</span>
          </div>

          {/* Segmented Filter Bar */}
          <div className="flex items-center p-1 bg-zinc-100 rounded-lg self-start sm:self-auto border border-zinc-200/60">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeFilter === 'all' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('review')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeFilter === 'review' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              In Review
            </button>
            <button
              onClick={() => setActiveFilter('published')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                activeFilter === 'published' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Published
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-zinc-400 font-mono text-xs">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center bg-white border border-zinc-200/80 rounded-2xl">
            <CalendarIcon className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-zinc-800">No Events Found</h3>
            <p className="text-xs text-zinc-400 mt-1">Create a new event to begin curation.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredEvents.map((event) => (
              <article
                key={event.id}
                className="p-5 rounded-xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row gap-6 group"
              >
                <div className="relative w-full md:w-56 h-48 md:h-auto rounded-lg overflow-hidden shrink-0 bg-zinc-100">
                  <img
                    src={getImageUrl(event.coverPhotoUrl)}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-zinc-900 font-mono text-[11px] shadow-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${event.galleryPublished ? 'bg-indigo-600' : 'bg-amber-500'}`}></span>
                      {event.galleryPublished ? `PIN: Active` : `INGEST 100%`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">EVENT #{event.id.substring(0, 6)}</span>
                        <h3 className="text-lg font-display font-bold text-zinc-900 tracking-tight truncate">{event.name}</h3>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider shrink-0 ${
                        event.galleryPublished 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${event.galleryPublished ? 'bg-indigo-600' : 'bg-amber-600'}`}></span>
                        {event.galleryPublished ? 'Gallery Published' : 'In Review'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{event.eventDate || 'Date TBD'}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats summary strip */}
                    <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/50 flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-700">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-zinc-900">{event.totalPhotos}</span>
                        <span className="text-zinc-400">uploaded</span>
                      </div>
                      <span className="text-zinc-300">/</span>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-zinc-900">{event.totalMembers}</span>
                        <span className="text-zinc-400">team assigned</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-2 border-t border-zinc-100">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/events/${event.id}`}
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white font-medium text-xs hover:bg-zinc-800 transition-all"
                      >
                        View Event
                      </Link>
                      <Link
                        to={`/admin/events/${event.id}/photos`}
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium text-xs transition-all"
                      >
                        Review Photos
                      </Link>
                    </div>

                    {event.galleryPublished && event.gallerySlug && (
                      <button
                        onClick={() => handleCopyLink(event.gallerySlug!, event.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all border border-zinc-200/60"
                        type="button"
                      >
                        {copiedEventId === event.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Copy Client Link</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full p-6 shadow-xl">
            <h2 className="text-lg font-display font-bold text-zinc-900 mb-4">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arjun & Priya Wedding"
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Grand luxury palace wedding ceremony..."
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs outline-none focus:border-indigo-600 focus:bg-white transition-colors h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Leela Palace, Chennai"
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={coverPhotoUrl}
                  onChange={(e) => setCoverPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
