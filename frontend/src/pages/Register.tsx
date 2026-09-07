import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-900">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-md">
            <Camera className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 mb-2">Create Account</h1>
          <p className="text-xs text-slate-500">Join SnapGallery Studio as an Admin or Team Member</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <UserIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@snapgallery.demo"
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

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Account Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  role === 'ADMIN'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin / Lead</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('TEAM_MEMBER')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  role === 'TEAM_MEMBER'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Team Member</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-sm shadow-md flex items-center justify-center space-x-2 transition-all mt-2"
          >
            <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
