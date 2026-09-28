import React, { useState } from 'react';
import { LogIn, KeyRound, ShieldAlert, Loader2, UserCheck, Shield } from 'lucide-react';
import { authenticateUser, ADMIN_EMAIL, ADMIN_PASS } from '../services/db';
import { fireBalloons } from '../utils/confetti';
import { User } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = authenticateUser(email, password);
      setLoading(false);

      if (res.success && res.user) {
        fireBalloons(); // Emulate st.balloons()
        onLoginSuccess(res.user);
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    }, 450);
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);

    setLoading(true);
    setTimeout(() => {
      const res = authenticateUser(demoEmail, demoPass);
      setLoading(false);
      if (res.success && res.user) {
        fireBalloons();
        onLoginSuccess(res.user);
      }
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto w-full py-6 sm:py-12 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          User/Admin Login
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-wider">
          AUTHENTICATE TO ACCESS DEEPFAKE FORENSIC WORKBENCH
        </p>
      </div>

      {/* Main Login Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative">
        {/* Quick Demo Fill Buttons */}
        <div className="mb-5 space-y-2">
          <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            Quick Demo Shortcuts:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin(ADMIN_EMAIL, ADMIN_PASS)}
              className="py-1.5 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Shield className="w-3 h-3 text-amber-400" />
              <span>Admin Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('sarah.chen@biometric.ai', 'user123')}
              className="py-1.5 px-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <UserCheck className="w-3 h-3 text-cyan-400" />
              <span>User Demo</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@admin.com or user@biometric.ai"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-slate-950" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
          Need an account?{' '}
          <button
            onClick={onNavigateToRegister}
            className="text-cyan-300 hover:underline font-semibold"
          >
            Register new user →
          </button>
        </div>
      </div>
    </div>
  );
};
