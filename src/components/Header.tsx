import React, { useState } from 'react';
import { ShieldCheck, Share2, Star, Github, Terminal, Menu, Check } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onOpenApiDocs: () => void;
  onOpenArchitecture: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenApiDocs,
  onOpenArchitecture,
  onToggleMobileMenu,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0a0f1d]/85 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 focus:outline-none"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Info */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-cyan-400 flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00e68c]" />
            CLUSTER_ONLINE
          </span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="hidden sm:inline text-slate-400">MODELS</span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="text-slate-200 hidden sm:inline font-semibold">X-FACENET-V4</span>
        </div>
      </div>

      {/* Top Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={handleShare}
          className="px-2.5 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/60 text-xs font-mono text-slate-300 hover:border-cyan-500/50 hover:text-white flex items-center gap-1.5 transition"
          title="Share platform"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
        </button>

        <button
          onClick={onOpenArchitecture}
          className="px-2.5 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/60 text-xs font-mono text-slate-300 hover:border-cyan-500/50 hover:text-white hidden md:flex items-center gap-1.5 transition"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Model Architecture</span>
        </button>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-lg border border-slate-700/80 bg-slate-900/60 text-slate-400 hover:text-white hover:border-cyan-500/40 transition"
          title="Source Code"
        >
          <Github className="w-4 h-4" />
        </a>

        <div className="h-4 w-px bg-slate-800 mx-0.5 sm:mx-1" />

        <button
          onClick={onOpenApiDocs}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 transition cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="font-semibold">API Docs</span>
        </button>

        {currentUser && (
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-mono text-xs text-cyan-300 font-bold">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
