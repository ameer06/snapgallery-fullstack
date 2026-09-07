import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsApi } from '../api/events';
import { galleryApi } from '../api/gallery';
import { Event, EventMember, Gallery, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Users, Image, Plus, Lock, Globe, Share2, Check, ArrowRight, UserPlus, Trash2 } from 'lucide-react';
import { UploadModal } from '../components/UploadModal';

export const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [event, setEvent] = useState<Event | null>(null);
  const [members, setMembers] = useState<EventMember[]>([]);
  const [allTeamMembers, setAllTeamMembers] = useState<User[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const loadEventData = async () => {
    if (!eventId) return;
    try {
      const eventRes = await eventsApi.getEventById(eventId);
      setEvent(eventRes);

      const membersRes = await eventsApi.getMembers(eventId);
      setMembers(membersRes);

      if (isAdmin) {
        const teamRes = await eventsApi.getTeamMembers();
        setAllTeamMembers(teamRes);

        const galleriesRes = await galleryApi.getGalleriesForEvent(eventId);
        setGalleries(galleriesRes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || !selectedUserId) return;
    try {
      await eventsApi.addMember(eventId, selectedUserId);
      setShowAddMemberModal(false);
      setSelectedUserId('');
      loadEventData();
    } catch (err: any) {
      alert(err.message || 'Failed to add team member');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!eventId || !confirm('Remove this team member from the event?')) return;
    try {
      await eventsApi.removeMember(eventId, userId);
      loadEventData();
    } catch (err: any) {
      alert(err.message || 'Failed to remove member');
    }
  };

  const copyShareLink = (slug: string) => {
    const shareUrl = `${window.location.origin}/gallery/${slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  if (isLoading) return <div className="p-12 text-center text-zinc-500">Loading event details...</div>;
  if (!event) return <div className="p-12 text-center text-zinc-500">Event not found</div>;

  const assignedUserIds = new Set(members.map((m) => m.user.id));
  const unassignedMembers = allTeamMembers.filter((m) => !assignedUserIds.has(m.id));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-zinc-100">
      {/* Event Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
        <div className="h-64 sm:h-80 relative overflow-hidden">
          <img
            src={event.coverPhotoUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200'}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-600 text-white shadow-md">
                  Active Event
                </span>
                <span className="text-xs text-zinc-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(event.eventDate).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{event.name}</h1>
              {event.location && (
                <p className="text-sm text-zinc-300 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>{event.location}</span>
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Photos</span>
              </button>
              {isAdmin && (
                <Link
                  to={`/admin/events/${event.id}/photos`}
                  className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm border border-zinc-700 transition-all"
                >
                  <span>Curation Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {event.description && (
          <div className="p-6 border-t border-zinc-800/80 bg-zinc-900/60 text-sm text-zinc-300 leading-relaxed">
            {event.description}
          </div>
        )}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Team Members */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Assigned Photographers</span>
              </h2>
              {isAdmin && (
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-indigo-400 transition-colors"
                  title="Assign Team Member"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-800/40 border border-zinc-800"
                >
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">{member.user.name}</p>
                    <p className="text-xs text-zinc-500">{member.user.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {member.user.role}
                    </span>
                    {isAdmin && member.user.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleRemoveMember(member.user.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Published Galleries (Admin) */}
        <div className="lg:col-span-2 space-y-6">
          {isAdmin && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-indigo-400" />
                    <span>Customer Private Galleries</span>
                  </h2>
                  <p className="text-xs text-zinc-400">Published galleries protected with 6-digit PINs</p>
                </div>
                <Link
                  to={`/admin/events/${event.id}/photos`}
                  className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Gallery</span>
                </Link>
              </div>

              {galleries.length === 0 ? (
                <div className="p-8 text-center bg-zinc-800/20 border border-zinc-800 rounded-2xl">
                  <Globe className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-zinc-400">No Gallery Published Yet</p>
                  <p className="text-xs text-zinc-500 mt-1">Select curated photos in Photo Review to publish a customer gallery.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {galleries.map((gallery) => (
                    <div
                      key={gallery.id}
                      className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-bold text-white">{gallery.name}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              gallery.status === 'PUBLISHED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {gallery.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                          {gallery.totalPhotos} curated photos • Slug: <code className="text-indigo-300 font-mono">/gallery/{gallery.publicSlug}</code>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyShareLink(gallery.publicSlug)}
                          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors"
                        >
                          {copiedSlug === gallery.publicSlug ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Copy Share Link</span>
                            </>
                          )}
                        </button>
                        <Link
                          to={`/gallery/${gallery.publicSlug}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 transition-colors border border-indigo-500/20"
                          title="Open Customer PIN Page"
                        >
                          <Globe className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {eventId && (
        <UploadModal
          eventId={eventId}
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={loadEventData}
        />
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl text-zinc-100">
            <h2 className="text-xl font-bold mb-4">Assign Team Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Select Photographer
                </label>
                <select
                  required
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose Team Member --</option>
                  {unassignedMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedUserId}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-md"
                >
                  Assign to Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
