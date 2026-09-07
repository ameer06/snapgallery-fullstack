import React, { useState, useEffect } from 'react';
import { eventsApi } from '../api/events';
import { User } from '../types';
import { Users, UserPlus } from 'lucide-react';

export const TeamManagement: React.FC = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loadTeam = async () => {
    try {
      const res = await eventsApi.getTeamMembers();
      setMembers(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await eventsApi.createTeamMember({ name, email, password });
      setShowAddModal(false);
      setName('');
      setEmail('');
      setPassword('');
      loadTeam();
    } catch (err: any) {
      alert(err.message || 'Failed to create team member');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Team Members</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Photographers
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage team members and event photographers</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400">Loading team members...</div>
      ) : members.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No Team Members Added Yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member) => (
            <div
              key={member.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center space-x-4 shadow-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                {member.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-display font-bold text-slate-900 truncate">{member.name}</h3>
                <p className="text-xs text-slate-500 truncate">{member.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    TEAM_MEMBER
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Joined {new Date(member.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-900">
            <h2 className="text-lg font-display font-bold mb-4">Create Team Member Account</h2>
            <form onSubmit={handleCreateMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priya Patel"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@snapgallery.demo"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
