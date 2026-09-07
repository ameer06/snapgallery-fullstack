import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsApi } from '../api/events';
import { galleryApi } from '../api/gallery';
import { Event, EventMember, Gallery, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, MapPin, Users, Plus, Lock, Globe, Share2, Check, ArrowRight, UserPlus, Trash2 } from 'lucide-react';
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

  if (isLoading) return <div className="p-12 text-center text-slate-400">Loading event details...</div>;
  if (!event) return <div className="p-12 text-center text-slate-400">Event not found</div>;

  const assignedUserIds = new Set(members.map((m) => m.user.id));
  const unassignedMembers = allTeamMembers.filter((m) => !assignedUserIds.has(m.id));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-slate-900">
      {/* Event Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm">
        <div className="h-64 sm:h-80 relative overflow-hidden">
          <img
            src={event.coverPhotoUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200'}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white text-slate-900 shadow-sm">
                  Active Event
                </span>
                <span className="text-xs text-slate-200 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(event.eventDate).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">{event.name}</h1>
              {event.location && (
                <p className="text-sm text-slate-200 flex items-center gap-1.5 mt-1 font-medium">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>{event.location}</span>
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Photos</span>
              </button>
              {isAdmin && (
                <Link
                  to={`/admin/events/${event.id}/photos`}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-sm"
                >
                  <span>Curation Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {event.description && (
          <div className="p-6 border-t border-slate-100 bg-white text-xs text-slate-600 leading-relaxed">
            {event.description}
          </div>
        )}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Team Members */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Assigned Photographers</span>
              </h2>
              {isAdmin && (
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-indigo-600 transition-colors"
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
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{member.user.name}</p>
                    <p className="text-[11px] text-slate-500">{member.user.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {member.user.role}
                    </span>
                    {isAdmin && member.user.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleRemoveMember(member.user.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    <span>Customer Private Galleries</span>
                  </h2>
                  <p className="text-xs text-slate-500">Published galleries protected with 6-digit PINs</p>
                </div>
                <Link
                  to={`/admin/events/${event.id}/photos`}
                  className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Gallery</span>
                </Link>
              </div>

              {galleries.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
                  <Globe className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No Gallery Published Yet</p>
                  <p className="text-[11px] text-slate-400 mt-1">Select curated photos in Photo Review to publish a customer gallery.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {galleries.map((gallery) => (
                    <div
                      key={gallery.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-slate-900">{gallery.name}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              gallery.status === 'PUBLISHED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {gallery.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {gallery.totalPhotos} curated photos • Slug: <code className="text-indigo-600 font-mono">/gallery/{gallery.publicSlug}</code>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyShareLink(gallery.publicSlug)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors shadow-xs"
                        >
                          {copiedSlug === gallery.publicSlug ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Copy Share Link</span>
                            </>
                          )}
                        </button>
                        <Link
                          to={`/gallery/${gallery.publicSlug}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-900">
            <h2 className="text-lg font-display font-bold mb-4">Assign Team Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Select Photographer
                </label>
                <select
                  required
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-600"
                >
                  <option value="">-- Choose Team Member --</option>
                  {unassignedMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedUserId}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs shadow-sm"
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
