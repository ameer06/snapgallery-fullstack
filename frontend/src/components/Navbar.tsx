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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to={user?.role === 'ADMIN' ? '/admin' : '/member'} className="flex items-center space-x-3 group">
          <div className="p-2 bg-slate-900 rounded-xl group-hover:bg-indigo-600 transition-colors shadow-sm text-white">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-slate-900">
              SnapGallery
            </span>
            <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-indigo-600 border border-slate-200">
              STUDIO
            </span>
          </div>
        </Link>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
              {user.role === 'ADMIN' ? (
                <Shield className="w-4 h-4 text-indigo-600" />
              ) : (
                <UserIcon className="w-4 h-4 text-emerald-600" />
              )}
              <span className="font-semibold text-slate-900">{user.name}</span>
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {user.role === 'ADMIN' ? 'Admin Lead' : 'Team Member'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
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
