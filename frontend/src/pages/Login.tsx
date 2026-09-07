import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@snapgallery.demo');
    setPassword('admin123');
  };

  const fillDemoMember = () => {
    setEmail('rahul@snapgallery.demo');
    setPassword('rahul123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-900">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
            <Camera className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to your SnapGallery Studio workspace</p>
        </div>

        {/* Demo Quick Fillers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">⚡ Quick Demo Accounts</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="flex items-center space-x-2 p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Admin Lead</span>
            </button>
            <button
              type="button"
              onClick={fillDemoMember}
              className="flex items-center space-x-2 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold transition-all"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Team Member</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@snapgallery.demo"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-sm shadow-md flex items-center justify-center space-x-2 transition-all mt-2"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
