import React from 'react';
import { X, Cpu, Layers, GitBranch, Shield, Zap, Sparkles } from 'lucide-react';

interface ModelArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelArchitectureModal: React.FC<ModelArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 border border-cyan-500/30 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 sticky top-0 bg-[#0a0f1d]/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">X-FaceNet-v4 Model Architecture</h3>
              <p className="text-[10px] font-mono text-cyan-400">TRIPLE-STREAM ENSEMBLE FORENSIC PIPELINE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs text-slate-300">
          {/* Architecture Pipeline Flow */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Inference Data Pipeline
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-cyan-400 font-bold">Input Frame</div>
                <div className="text-[10px] text-slate-500 mt-0.5">RGB 1024×1024</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-indigo-400 font-bold">Face Align</div>
                <div className="text-[10px] text-slate-500 mt-0.5">MTCNN / 68 Landmarks</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-pink-400 font-bold">Feature Fusion</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Spatial + Spectral</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-emerald-400 font-bold">Classifier</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Softmax [Real, Fake]</div>
              </div>
            </div>
          </div>

          {/* Three Streams Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Three Forensic Backbone Streams</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <span className="text-cyan-300 font-bold font-mono text-xs">Stream 1: Spatial CNN</span>
                <p className="text-[11px] text-slate-400">
                  EfficientNet-B7 optimized via TensorRT for detecting sub-pixel warping and GAN blend lines around eyes and mouth.
                </p>
                <div className="pt-2 text-[10px] font-mono text-slate-500">Weight: 38%</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <span className="text-indigo-300 font-bold font-mono text-xs">Stream 2: Vision Transformer</span>
                <p className="text-[11px] text-slate-400">
                  ViT-H/16 self-attention heads capture global anatomical symmetry, lighting incongruities, and corneal reflection coherence.
                </p>
                <div className="pt-2 text-[10px] font-mono text-slate-500">Weight: 37%</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <span className="text-emerald-300 font-bold font-mono text-xs">Stream 3: Azimuthal FFT</span>
                <p className="text-[11px] text-slate-400">
                  Fast Fourier Transform 2D power spectrum exposing generative upsampling checkerboard artifacts invisible to human eyes.
                </p>
                <div className="pt-2 text-[10px] font-mono text-slate-500">Weight: 25%</div>
              </div>
            </div>
          </div>

          {/* Training Benchmarks */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Validation Benchmarks
            </span>
            <div className="grid grid-cols-3 gap-2 font-mono text-center">
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">FaceForensics++</div>
                <div className="text-emerald-400 font-bold text-sm">99.4% AUC</div>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Celeb-DF v2</div>
                <div className="text-emerald-400 font-bold text-sm">99.1% AUC</div>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">DFDC Benchmark</div>
                <div className="text-emerald-400 font-bold text-sm">98.7% AUC</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
