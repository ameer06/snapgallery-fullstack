import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Camera, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  Eye, 
  EyeOff, 
  Key, 
  CheckCircle, 
  Star, 
  Shield, 
  Sparkles, 
  Globe 
} from 'lucide-react';

export const Login: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'studio' | 'client'>('studio');
  const [email, setEmail] = useState('admin@snapgallery.demo');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [clientPin, setClientPin] = useState('482917');
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

  const handleClientUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientPin || clientPin.length !== 6) {
      alert('Please enter a valid 6-digit PIN');
      return;
    }
    // Navigate to default demo gallery with PIN
    navigate(`/gallery/arjun-priya-wedding`);
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
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Studio Brand Header */}
      <header className="w-full bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 z-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-display font-bold text-lg text-zinc-900 tracking-tight">SnapGallery</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 tracking-wider">
              Studio
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium border border-zinc-200/60">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-700 font-semibold">Studio Cloud Live</span>
          </div>
        </div>
      </header>

      {/* Main Split Content */}
      <main className="flex-1 flex flex-col justify-center w-full py-8 lg:py-12">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Form Panel */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between py-2">
              <div className="flex flex-col">
                {/* Brand emblem & Enterprise pill */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                      SG
                    </div>
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-sm text-zinc-900 leading-none">SnapGallery</span>
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-0.5">Studio Cloud Live</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    <Shield className="w-3 h-3 text-indigo-600" />
                    Enterprise & Pro
                  </span>
                </div>

                {/* Role Switcher Segmented Control */}
                <div className="bg-zinc-100 p-1 rounded-xl flex items-center mb-6 border border-zinc-200/60">
                  <button
                    type="button"
                    onClick={() => setActiveMode('studio')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      activeMode === 'studio' 
                        ? 'bg-white text-zinc-900 shadow-xs' 
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Studio & Crew</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode('client')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      activeMode === 'client' 
                        ? 'bg-white text-zinc-900 shadow-xs' 
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Client Gallery PIN</span>
                  </button>
                </div>

                {/* Mode 1: Studio & Crew Sign In */}
                {activeMode === 'studio' ? (
                  <div className="flex flex-col space-y-5">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900 tracking-tight mb-1">
                        Sign in to your Studio
                      </h1>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Access your active wedding shoots, RAW curation pipelines, and live ingest sync.
                      </p>
                    </div>

                    {/* Quick Demo Accounts */}
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">⚡ One-Click Demo Accounts</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={fillDemoAdmin}
                          className="flex items-center space-x-2 p-2 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold transition-all shadow-xs"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Admin Lead</span>
                        </button>
                        <button
                          type="button"
                          onClick={fillDemoMember}
                          className="flex items-center space-x-2 p-2 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold transition-all shadow-xs"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Team Member</span>
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                        {error}
                      </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Work Email / Photographer ID</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@snapgallery.demo"
                            className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-zinc-200 focus:border-indigo-600 rounded-lg text-xs text-zinc-900 outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-zinc-700">Studio Password</label>
                          <span className="text-[11px] text-indigo-600 font-medium hover:underline cursor-pointer">Forgot?</span>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-10 py-2.5 bg-white border border-zinc-200 focus:border-indigo-600 rounded-lg text-xs text-zinc-900 outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-600 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 focus:ring-0 accent-indigo-600" />
                          <span>Trust device for 30 days</span>
                        </label>
                        <span className="text-[11px] font-mono text-emerald-600 font-medium">Fast ingest ready</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-medium text-xs shadow-sm flex items-center justify-center space-x-2 transition-all mt-2"
                      >
                        <span>{isSubmitting ? 'Authenticating Studio Vault...' : 'Sign In to Workspace'}</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[10px]">Enter ↵</kbd>
                      </button>
                    </form>

                    <p className="text-center text-xs text-zinc-500 pt-2">
                      Don't have a studio account?{' '}
                      <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                        Register here
                      </Link>
                    </p>
                  </div>
                ) : (
                  /* Mode 2: Client Gallery PIN Access */
                  <div className="flex flex-col space-y-5">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900 tracking-tight mb-1">
                        Client Gallery Access
                      </h1>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Enter the unique 6-digit access PIN provided in your wedding invitation or photographer email.
                      </p>
                    </div>

                    <form onSubmit={handleClientUnlock} className="p-5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-4">
                      <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                        Collection Security PIN
                      </label>

                      <input
                        type="text"
                        required
                        pattern="\d{6}"
                        maxLength={6}
                        value={clientPin}
                        onChange={(e) => setClientPin(e.target.value)}
                        placeholder="482917"
                        className="w-full py-3 bg-white border border-zinc-200 rounded-lg text-center font-mono text-2xl font-bold tracking-widest text-indigo-600 outline-none focus:border-indigo-600 shadow-xs"
                      />

                      <p className="text-xs text-zinc-500 flex items-center gap-1.5 font-mono">
                        <Lock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Demo Gallery: Arjun & Priya Wedding</span>
                      </p>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm flex items-center justify-center space-x-2 transition-all"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Unlock Wedding Collection</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Micro Footer */}
              <div className="mt-8 pt-4 border-t border-zinc-200/60 flex items-center justify-between flex-wrap gap-2 text-[11px] text-zinc-400 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> 256-Bit Encrypted
                </span>
                <span>•</span>
                <span>SOC2 Type II Certified</span>
                <span>•</span>
                <span>Edge Accelerated Ingest</span>
              </div>
            </div>

            {/* Right Column: Editorial Visual Showcase Panel */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col relative rounded-2xl overflow-hidden min-h-[540px] lg:min-h-[640px] shadow-xl border border-zinc-800/80">
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

              {/* Top Telemetry Tag Pill */}
              <div className="relative z-10 p-6 flex items-start justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-md text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                  </span>
                  <span className="font-semibold text-zinc-900">Live Pipeline:</span>
                  <span className="font-mono text-[11px] text-zinc-600">Sony A1, Canon R5 • 4.8 GB/min Ingest</span>
                </div>
              </div>

              {/* Bottom Testimonial and Metric Highlights */}
              <div className="relative z-10 mt-auto p-6 sm:p-8 space-y-4">
                {/* Glassmorphic Testimonial Card */}
                <div className="bg-white/90 backdrop-blur-xl p-5 rounded-xl shadow-lg border border-white/40 space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                    <span className="text-[11px] text-zinc-500 font-medium ml-2">Production Review</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-900 leading-relaxed italic">
                    “SnapGallery completely transformed our high-profile wedding delivery workflow. Delivering 600 curated 45MP master frames to couples and VIP guests on the exact same evening is unprecedented.”
                  </p>
                  <div className="flex items-center justify-between border-t border-zinc-200/80 pt-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center">
                        PS
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-zinc-900">Priya Shah</span>
                        <span className="text-[10px] text-zinc-500">Lead Creative Director • Master Studio</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10px] font-semibold">
                      Verified Host
                    </span>
                  </div>
                </div>

                {/* Studio Metrics Counter Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-zinc-950/80 backdrop-blur-md text-white shadow-sm flex flex-col border border-zinc-800/60">
                    <span className="text-lg font-display font-bold text-indigo-400">2.4M+</span>
                    <span className="text-[10px] text-zinc-400">RAW Frames Delivered</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950/80 backdrop-blur-md text-white shadow-sm flex flex-col border border-zinc-800/60">
                    <span className="text-lg font-display font-bold text-indigo-400">99.99%</span>
                    <span className="text-[10px] text-zinc-400">Cloud Sync Uptime</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950/80 backdrop-blur-md text-white shadow-sm flex flex-col border border-zinc-800/60">
                    <span className="text-lg font-display font-bold text-indigo-400">4,500+</span>
                    <span className="text-[10px] text-zinc-400">Studios Globally</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-zinc-100 border-t border-zinc-200/80 py-3 px-6 lg:px-12 text-xs text-zinc-500">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>TLS 1.3 Strict Encryption</span>
            <span>•</span>
            <span>SOC2 Type II Certified</span>
            <span>•</span>
            <span>Photographer Cloud Vault</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Studio Support</span>
            <span>Privacy Policy</span>
            <span>System Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
