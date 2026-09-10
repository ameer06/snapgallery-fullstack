import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Bell, Plus, ChevronRight, Camera, CheckCircle2, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onNewEventClick?: () => void;
  title?: string;
  subtitle?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNewEventClick, 
  title = "Studio", 
  subtitle = "Workspace",
  searchQuery = '',
  onSearchChange,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [showNotifications, setShowNotifications] = useState(false);

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
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-600/20 text-zinc-600 transition-all border border-zinc-200/60 w-64 lg:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search events, locations, tags..."
            className="w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 outline-none font-medium"
          />
          {searchQuery ? (
            <button onClick={() => onSearchChange?.('')} className="text-zinc-400 hover:text-zinc-600">
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-200/70 text-zinc-500 font-mono text-[10px] shrink-0">⌘K</kbd>
          )}
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8.5 h-8.5 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200/90 rounded-2xl shadow-xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">System Alerts</span>
                <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-zinc-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/60 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-950">Ingestion Pipeline Operational</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">Cloud PostgreSQL & S3 storage sync active.</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200/60 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-indigo-950">Customer Gallery Ready</p>
                    <p className="text-[11px] text-indigo-700 mt-0.5">PIN security enabled for public collections.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Action Button */}
        {isAdmin && onNewEventClick && (
          <button
            onClick={onNewEventClick}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white font-medium text-xs hover:bg-zinc-800 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>New Event</span>
          </button>
        )}
      </div>
    </header>
  );
};
