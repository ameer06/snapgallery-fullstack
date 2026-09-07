import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Calendar, Users, UploadCloud, Settings, Image } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/events', label: 'Events', icon: Calendar },
    { to: '/admin/team', label: 'Team Members', icon: Users },
  ];

  const memberLinks = [
    { to: '/member', label: 'My Dashboard', icon: LayoutDashboard, end: true },
    { to: '/member/events', label: 'Assigned Events', icon: Calendar },
    { to: '/member/uploads', label: 'My Uploads', icon: Image },
  ];

  const links = isAdmin ? adminLinks : memberLinks;

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 hidden md:flex flex-col min-h-[calc(100vh-4rem)] p-4 text-zinc-300">
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          {isAdmin ? 'Management Studio' : 'Workspace'}
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-zinc-800/80">
        <div className="bg-zinc-800/40 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-400">
          <p className="font-semibold text-zinc-300 mb-1">Collaborative Mode</p>
          <p className="leading-relaxed">All event uploads and gallery publishing are tracked and secured.</p>
        </div>
      </div>
    </aside>
  );
};
