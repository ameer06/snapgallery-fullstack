import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Calendar, Users, Image } from 'lucide-react';

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
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col min-h-[calc(100vh-4rem)] p-4 text-slate-700">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
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
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600">
          <p className="font-display font-semibold text-slate-900 mb-1">Collaborative Studio</p>
          <p className="text-[11px] leading-relaxed text-slate-500">Event photo uploads and PIN-protected gallery publishing.</p>
        </div>
      </div>
    </aside>
  );
};
