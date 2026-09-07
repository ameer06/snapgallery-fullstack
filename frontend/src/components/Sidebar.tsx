import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Image, 
  Camera, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/events', label: 'Events', icon: Calendar },
    { to: '/admin/team', label: 'Team', icon: Users },
  ];

  const memberLinks = [
    { to: '/member', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/member/events', label: 'Assigned Events', icon: Calendar },
    { to: '/member/uploads', label: 'My Uploads', icon: Image },
  ];

  const links = isAdmin ? adminLinks : memberLinks;

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 hidden lg:flex flex-col h-screen fixed left-0 top-0 z-40 select-none shadow-[0_1px_8px_rgba(0,0,0,0.03)] justify-between">
      <div className="flex flex-col">
        {/* Logo & Header */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-zinc-100">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-xs">
            <Camera className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="font-display font-bold text-lg text-zinc-900 tracking-tight">
            SnapGallery
          </span>
        </div>

        {/* Workspace Event Switcher */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200/80 hover:bg-zinc-100 transition-colors cursor-pointer text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span className="font-medium text-zinc-800 truncate">All Studio Events</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 px-3 pt-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Profile & Logout Card */}
      <div className="p-4 border-t border-zinc-100">
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-semibold text-xs text-zinc-900 truncate">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-zinc-500 truncate">
                {user?.email || 'user@snapgallery.studio'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-zinc-200/50">
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold uppercase tracking-wider">
              {isAdmin ? 'Lead Photographer' : 'Team Member'}
            </span>
            <button
              onClick={logout}
              className="p-1 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Log out"
              type="button"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
