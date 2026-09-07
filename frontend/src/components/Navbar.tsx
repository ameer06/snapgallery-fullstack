import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Camera, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to={user?.role === 'ADMIN' ? '/admin' : '/member'} className="flex items-center space-x-3 group">
          <div className="p-2 bg-indigo-600 rounded-xl group-hover:bg-indigo-500 transition-colors shadow-indigo-600/30 shadow-md">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              SnapGallery
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-indigo-400 border border-zinc-700">
              PRO
            </span>
          </div>
        </Link>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/80 text-sm">
              {user.role === 'ADMIN' ? (
                <Shield className="w-4 h-4 text-indigo-400" />
              ) : (
                <UserIcon className="w-4 h-4 text-emerald-400" />
              )}
              <span className="font-medium text-zinc-200">{user.name}</span>
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                user.role === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {user.role === 'ADMIN' ? 'Admin Lead' : 'Team Member'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
