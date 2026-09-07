import React, { useState, useEffect } from 'react';
import { eventsApi } from '../api/events';
import { Event, User } from '../types';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Users, Image, ArrowRight, MapPin, Sparkles, FolderKanban } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const totalPhotos = events.reduce((acc, curr) => acc + (curr.totalPhotos || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-slate-900">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Admin Studio</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Lead Control
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage events, assign photography teams, and publish private galleries</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-indigo-600 mb-3">
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</span>
          </div>
          <p className="text-3xl font-display font-extrabold text-slate-900">{events.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total Events Managed</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-3">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Team</span>
          </div>
          <p className="text-3xl font-display font-extrabold text-slate-900">{teamMembers.length}</p>
          <p className="text-xs text-slate-500 mt-1">Assigned Photographers</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-3">
            <Image className="w-5 h-5" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Photos</span>
          </div>
          <p className="text-3xl font-display font-extrabold text-slate-900">{totalPhotos.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Total Uploaded Photos</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-purple-600 mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secure</span>
          </div>
          <p className="text-3xl font-display font-extrabold text-slate-900">100%</p>
          <p className="text-xs text-slate-500 mt-1">PIN Encrypted Galleries</p>
        </div>
      </div>

      {/* Recent Events Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">Active Events</h2>
          <span className="text-xs text-slate-500 font-medium">{events.length} events total</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700">No Events Created Yet</h3>
            <p className="text-xs text-slate-400 mt-1">Click "Create New Event" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden shadow-xs hover:shadow-md flex flex-col group transition-all duration-200"
              >
                <div className="h-44 relative bg-slate-100 overflow-hidden">
                  <img
                    src={event.coverPhotoUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200'}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-display font-bold text-white truncate">{event.name}</h3>
                    {event.location && (
                      <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{event.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{event.description || 'No description provided.'}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Image className="w-3.5 h-3.5 text-indigo-600" />
                      <strong className="text-slate-900 font-semibold">{event.totalPhotos}</strong> photos
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <strong className="text-slate-900 font-semibold">{event.totalMembers}</strong> team assigned
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      to={`/admin/events/${event.id}`}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 text-center transition-colors border border-slate-200"
                    >
                      Manage Event
                    </Link>
                    <Link
                      to={`/admin/events/${event.id}/photos`}
                      className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white text-center transition-all flex items-center justify-center space-x-1"
                    >
                      <span>Review Photos</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-900">
            <h2 className="text-xl font-display font-bold mb-4">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arjun & Priya Wedding"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Grand luxury palace wedding ceremony..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-600 focus:bg-white transition-colors h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Udaipur Palace"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={coverPhotoUrl}
                  onChange={(e) => setCoverPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm"
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
