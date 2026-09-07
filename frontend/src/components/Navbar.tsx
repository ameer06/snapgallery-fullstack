import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Bell, Plus, ChevronRight, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onNewEventClick?: () => void;
  title?: string;
  subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewEventClick, title = "Studio", subtitle = "Workspace" }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white/90 backdrop-blur-xl border-b border-zinc-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Mobile Brand / Left Breadcrumbs */}
      <div className="flex items-center gap-2">
        <Link to={isAdmin ? '/admin' : '/member'} className="flex lg:hidden items-center space-x-2 mr-2">
          <div className="p-1.5 bg-zinc-900 rounded-lg text-white">
            <Camera className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="font-display font-bold text-sm tracking-tight text-zinc-900">
            SnapGallery
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
          <span className="hover:text-zinc-900 transition-colors">{title}</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-900 font-semibold">{subtitle}</span>
        </div>
      </div>

      {/* Right Search, Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Search Input */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100/80 hover:bg-zinc-100 text-zinc-600 cursor-pointer transition-colors border border-zinc-200/50">
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-400 pr-4">Search assets, tags, shots...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-200/70 text-zinc-500 font-mono text-[10px]">⌘K</kbd>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            type="button"
            className="w-8.5 h-8.5 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
          </button>
        </div>

        {/* Admin Action Button */}
        {isAdmin && onNewEventClick && (
          <button
            onClick={onNewEventClick}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white font-medium text-xs hover:bg-zinc-800 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>New Event</span>
          </button>
        )}
      </div>
    </header>
  );
};
