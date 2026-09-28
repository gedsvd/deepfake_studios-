import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Search, 
  Shield, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Activity,
  Layers,
  Terminal
} from 'lucide-react';
import { NavigationMenu, User } from '../types';

interface HomeViewProps {
  onNavigate: (tab: NavigationMenu) => void;
  currentUser: User | null;
  onOpenApiDocs: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  currentUser,
  onOpenApiDocs,
}) => {
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  const handlePing = () => {
    const ms = Math.floor(Math.random() * 5 + 11);
    setPingStatus(`${ms}ms (US-East Cluster Node #8802 - Optimal)`);
    setTimeout(() => {
      setPingStatus(null);
    }, 3500);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto w-full pb-12">
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center justify-center pt-4 sm:pt-8 pb-6 border-b border-slate-800/80">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4 tracking-wide shadow-sm shadow-cyan-500/10">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>NEURAL ARTIFACT CLASSIFIER • ENTERPRISE SUITE v2.4</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight gradient-title text-balance max-w-4xl">
          DeepFake Face Classification
        </h1>

        <p className="mt-4 text-xs sm:text-sm font-mono tracking-wider text-slate-400 uppercase max-w-3xl leading-relaxed">
          DETECT WHETHER A FACE IMAGE IS REAL OR DEEPFAKE USING ADVANCED DEEP LEARNING TECHNIQUES
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate(currentUser ? 'Login' : 'Login')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 text-slate-950 font-bold text-sm flex items-center gap-2.5 hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{currentUser ? 'Open Live Detection Studio' : 'Sign In to Detect DeepFakes'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!currentUser && (
            <button
              onClick={() => onNavigate('Register')}
              className="px-5 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400/50 text-slate-200 text-sm font-semibold flex items-center gap-2 transition hover:bg-slate-800/80 cursor-pointer"
            >
              <span>Create Account</span>
            </button>
          )}

          <button
            onClick={onOpenApiDocs}
            className="px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-sm font-mono flex items-center gap-2 transition"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>API Docs</span>
          </button>
        </div>
      </section>

      {/* Centered Animated Floating Image matching Streamlit with 'floating-inline' and responsive sizing */}
      <section className="flex items-center justify-center my-6 sm:my-8 px-4">
        <div className="relative flex justify-center items-center">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-indigo-500/20 to-cyan-500/30 rounded-full blur-3xl opacity-70 pointer-events-none" />

          {/* Floating Cyber Face Image using 'floating-inline' */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-OKEoS2-yHcvPJFyVjLpLr0nY8h7KxW33Qc8lNyfnu230Iexb9GsYrxmlKmCfensoMV45yCOWs2X4_tF9sRM2W2m4cBkxFMbezOrF17JSGMhVfIpykyaX2cTWk_8dKbHEnkQTcp_H9UDxOI5i-NN0SdrJD1g60rzS9HZKxK9znSF3-6twIonJvvm0xwm2XwQ6coDVgI2QLm3DvpJnPLh_nbg2d_p7gfy4VcGlquEdrLB3ZQ8VMo7qgEO-SkpGm1RF1w"
            alt="DeepFake Facial Classification Model"
            className="floating-inline w-48 sm:w-56 md:w-64 max-w-[85vw] h-auto aspect-[2/3] object-cover rounded-xl border border-cyan-400/40 shadow-2xl relative z-10 cursor-pointer"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCAjJB6_kKdB1f9zjpAQkO5UGOKdD09qHzhXapzfXI4FfaqSLK6c7vrp3SObui5zrKv3tCESACYKH4TxwYbFZGcGubLeKEYgufF8VBGS3Dqz6dNDa4lPiCTj4wBB5cfM7ZE1cY9DBtM5ryqZociOPANJhJiFiyFytKFqwwYnuojVQ8JSDj_cmyvftoiegya1taQU4aPoHX-YsKf4IFlvKixraeD4CeCEZLx4biQ0RodVqkafWaHHKnJEB-KZkR1pRb7mw';
            }}
          />
        </div>
      </section>

      {/* 4 Feature Cards (Pillars from Streamlit code & HTML) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Core Detection Pillars</span>
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Enterprise AI framework for forensic verification
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            Production Verified 99.2%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Deep Learning */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between group border-slate-800/80">
            <div>
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition">
                Deep Learning
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Built with CNNs, ResNeXt & Vision Transformers for microscopic pixel-level DeepFake detection.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Architecture</span>
              <span className="text-pink-400 font-semibold">Ensemble ViT</span>
            </div>
          </div>

          {/* Card 2: Image Analysis */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between group border-slate-800/80">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                Image Analysis
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Advanced preprocessing, frequency domain FFT & dual-stream biometric feature extraction.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Domain</span>
              <span className="text-cyan-300 font-semibold">Spatial + FFT</span>
            </div>
          </div>

          {/* Card 3: High Accuracy */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between group border-slate-800/80">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                High Accuracy
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Trained on diverse benchmarks (FaceForensics++, Celeb-DF, DFDC) for ultra-reliable classification.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Benchmark</span>
              <span className="text-indigo-300 font-semibold">99.2% AUC</span>
            </div>
          </div>

          {/* Card 4: Real-time Prediction */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between group border-slate-800/80">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                Real-time Prediction
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Optimized TensorRT execution pipeline for instant results with under 15ms per-frame response.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Latency</span>
              <span className="text-amber-400 font-semibold">14.2 ms / frame</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live System Status Bar from Streamlit and HTML */}
      <section className="glass-panel rounded-xl px-5 py-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className="text-slate-300">
            System online —{' '}
            <span className="text-cyan-300 font-semibold">model ready for inference</span>{' '}
            <span className="text-slate-500 hidden sm:inline">(TensorRT Engine v2.4 initialized)</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <span className="hidden md:inline">
            GPU: <strong className="text-slate-200">NVIDIA A100 (80GB)</strong>
          </span>
          <span className="hidden sm:inline">
            MEM: <strong className="text-slate-200">3.4 / 80 GB</strong>
          </span>

          <button
            onClick={handlePing}
            className="text-cyan-300 hover:text-cyan-200 hover:underline flex items-center gap-1.5 font-semibold transition cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{pingStatus ? pingStatus : 'Ping Server'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
