import React from 'react';
import { 
  ShieldCheck, 
  Home, 
  UserPlus, 
  LogIn, 
  Scan, 
  Users, 
  Zap, 
  Crosshair, 
  Activity, 
  LogOut, 
  X,
  Server
} from 'lucide-react';
import { NavigationMenu, User } from '../types';

interface SidebarProps {
  currentTab: NavigationMenu;
  onSelectTab: (tab: NavigationMenu) => void;
  currentUser: User | null;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}) => {
  const handleNavClick = (tab: NavigationMenu) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 lg:w-64 border-r border-slate-800/80 bg-[#0a0f1d]/95 backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand & Engine Badge */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <div className="w-full h-full bg-[#060913] rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="font-bold text-sm tracking-wider text-white">DEEPGUARD</span>
                <span className="block text-[10px] tracking-widest text-cyan-400 font-mono font-medium">
                  NEURAL VISION
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                v2.4
              </span>
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1 text-slate-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="p-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Navigate
              </label>
              <span className="text-[10px] text-cyan-400/80 font-mono">
                {currentUser ? (currentUser.role === 'admin' ? 'ADMIN CONSOLE' : 'USER PORTAL') : 'GUEST'}
              </span>
            </div>

            {/* Quick dropdown matching Streamlit st.sidebar.selectbox */}
            <div className="mb-4">
              <select
                value={currentTab}
                onChange={(e) => handleNavClick(e.target.value as NavigationMenu)}
                className="w-full bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400/50 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition cursor-pointer"
              >
                <option value="Home">Home</option>
                <option value="Register">Register</option>
                <option value="Login">
                  {currentUser ? (currentUser.role === 'admin' ? 'Admin Panel' : 'User Dashboard') : 'Login'}
                </option>
              </select>
            </div>

            <nav className="space-y-1.5">
              {/* Home Tab */}
              <button
                onClick={() => handleNavClick('Home')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  currentTab === 'Home'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Home className="w-4 h-4 text-cyan-400" />
                <span>Home</span>
              </button>

              {/* Register Tab */}
              <button
                onClick={() => handleNavClick('Register')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  currentTab === 'Register'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <UserPlus className="w-4 h-4 text-indigo-400" />
                <span>Register</span>
              </button>

              {/* Login / Dashboard Tab */}
              <button
                onClick={() => handleNavClick('Login')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  currentTab === 'Login'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {currentUser ? (
                  currentUser.role === 'admin' ? (
                    <>
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>Admin Panel</span>
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 text-emerald-400" />
                      <span>User Dashboard</span>
                    </>
                  )
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-cyan-400" />
                    <span>Login</span>
                  </>
                )}
              </button>
            </nav>

            {/* Model Pipeline Specs (Matching Reference HTML) */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 px-2 space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Pipeline Config
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Backend
                </span>
                <span className="font-mono text-[11px] text-cyan-300 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
                  TensorRT 9.2
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-indigo-400" /> Precision
                </span>
                <span className="font-mono text-[11px] text-indigo-300 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
                  FP16 TensorCore
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Sampling
                </span>
                <span className="font-mono text-[11px] text-emerald-300 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
                  60 FPS bi-cubic
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile / Logout footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          {currentUser ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-cyan-500/40 flex items-center justify-center font-mono text-xs text-cyan-300 font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-200 truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {currentUser.role === 'admin' ? 'Administrator' : 'Verified User'}
                    </p>
                  </div>
                </div>

                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                  {currentUser.role}
                </span>
              </div>

              {/* Streamlit-style Logout Button */}
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs text-cyan-400">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-300">Gov-Ops Cluster</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Node ID: #8802</p>
                </div>
              </div>
              <button
                onClick={() => handleNavClick('Login')}
                className="w-full text-center py-1.5 px-3 rounded text-xs font-mono bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition block"
              >
                Sign In to Platform →
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
