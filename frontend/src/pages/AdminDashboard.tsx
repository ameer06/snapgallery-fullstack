import React, { useState, useEffect } from 'react';
import { eventsApi } from '../api/events';
import { Event, User } from '../types';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Users, Image, ShieldCheck, ArrowRight, MapPin, Sparkles } from 'lucide-react';

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
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Admin Studio</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Lead Control
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Manage events, assign photography teams, and publish private galleries</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-indigo-400 mb-3">
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-semibold text-zinc-500">Active</span>
          </div>
          <p className="text-3xl font-bold text-white">{events.length}</p>
          <p className="text-xs text-zinc-400 mt-1">Total Events Managed</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-emerald-400 mb-3">
            <Users className="w-6 h-6" />
            <span className="text-xs font-semibold text-zinc-500">Team</span>
          </div>
          <p className="text-3xl font-bold text-white">{teamMembers.length}</p>
          <p className="text-xs text-zinc-400 mt-1">Assigned Photographers</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-amber-400 mb-3">
            <Image className="w-6 h-6" />
            <span className="text-xs font-semibold text-zinc-500">Photos</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalPhotos.toLocaleString()}</p>
          <p className="text-xs text-zinc-400 mt-1">Total Uploaded Photos</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-purple-400 mb-3">
            <Sparkles className="w-6 h-6" />
            <span className="text-xs font-semibold text-zinc-500">Secure</span>
          </div>
          <p className="text-3xl font-bold text-white">100%</p>
          <p className="text-xs text-zinc-400 mt-1">PIN Encrypted Galleries</p>
        </div>
      </div>

      {/* Recent Events Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Active Events</h2>
          <span className="text-xs text-zinc-400 font-medium">{events.length} events total</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-zinc-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl">
            <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-zinc-300">No Events Created Yet</h3>
            <p className="text-xs text-zinc-500 mt-1">Click "Create New Event" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden shadow-xl flex flex-col group transition-all duration-200"
              >
                <div className="h-44 relative bg-zinc-800 overflow-hidden">
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
                  <p className="text-xs text-zinc-400 line-clamp-2">{event.description || 'No description provided.'}</p>

                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-800/80">
                    <span className="flex items-center gap-1">
                      <Image className="w-3.5 h-3.5 text-indigo-400" />
                      <strong className="text-zinc-200">{event.totalPhotos}</strong> photos
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <strong className="text-zinc-200">{event.totalMembers}</strong> team assigned
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      to={`/admin/events/${event.id}`}
                      className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 text-center transition-colors border border-zinc-700/80"
                    >
                      Manage Event
                    </Link>
                    <Link
                      to={`/admin/events/${event.id}/photos`}
                      className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white text-center transition-colors shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-1"
                    >
                      <span>Review Photos</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-zinc-100">
            <h2 className="text-xl font-bold mb-4">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arjun & Priya Wedding"
                  className="w-full px-4 py-2.5 bg-zinc-800/60 border border-zinc-700 rounded-xl text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Grand luxury palace wedding ceremony..."
                  className="w-full px-4 py-2.5 bg-zinc-800/60 border border-zinc-700 rounded-xl text-sm outline-none focus:border-indigo-500 h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-800/60 border border-zinc-700 rounded-xl text-sm outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Udaipur Palace"
                    className="w-full px-4 py-2.5 bg-zinc-800/60 border border-zinc-700 rounded-xl text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={coverPhotoUrl}
                  onChange={(e) => setCoverPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-zinc-800/60 border border-zinc-700 rounded-xl text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md"
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
