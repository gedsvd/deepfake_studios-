import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu, 
  Sliders, 
  Activity, 
  FileText, 
  Layers, 
  RefreshCw, 
  Eye, 
  Sparkles,
  Camera,
  History,
  X,
  Maximize2
} from 'lucide-react';
import { GaugeChart } from './GaugeChart';
import { ProbabilityBarChart } from './ProbabilityBarChart';
import { DatasetPreset, AnalysisResult, AnalysisHistoryItem, User } from '../types';

interface UserDashboardProps {
  currentUser: User;
}

const PRESETS: DatasetPreset[] = [
  {
    id: 'hologram-synthetic',
    title: 'Cyber AI Avatar',
    type: 'FAKE',
    confidence: 98.4,
    realProb: 1.6,
    fakeProb: 98.4,
    detail: 'AI-Generated Neural Mesh (Diffusion + FaceSwap artifacting)',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAjJB6_kKdB1f9zjpAQkO5UGOKdD09qHzhXapzfXI4FfaqSLK6c7vrp3SObui5zrKv3tCESACYKH4TxwYbFZGcGubLeKEYgufF8VBGS3Dqz6dNDa4lPiCTj4wBB5cfM7ZE1cY9DBtM5ryqZociOPANJhJiFiyFytKFqwwYnuojVQ8JSDj_cmyvftoiegya1taQU4aPoHX-YsKf4IFlvKixraeD4CeCEZLx4biQ0RodVqkafWaHHKnJEB-KZkR1pRb7mw',
    fftScore: 'Artifact Spikes +94%',
    blinkScore: 'Unnatural (0.02s)',
    warpScore: 'Gaussian Blur Edge',
    metadataScore: 'Stripped / Null',
    blendingArtifacts: 'DETECTED',
    severity: 'HIGH SEVERITY',
  },
  {
    id: 'celeb-swap',
    title: 'DeepFaceLab Swap',
    type: 'FAKE',
    confidence: 94.2,
    realProb: 5.8,
    fakeProb: 94.2,
    detail: 'Latent Space Face Swap artifacting around jawline boundary',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    fftScore: 'High-Freq Residue +88%',
    blinkScore: 'Desynchronized',
    warpScore: 'Sub-pixel Jitter',
    metadataScore: 'Altered Quantization',
    blendingArtifacts: 'DETECTED',
    severity: 'HIGH SEVERITY',
  },
  {
    id: 'real-dslr',
    title: 'Canon RAW 4K',
    type: 'REAL',
    confidence: 99.1,
    realProb: 99.1,
    fakeProb: 0.9,
    detail: 'Natural dermal pores, organic light scattering & sensor grain detected',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    fftScore: 'Harmonic Decay (Clean)',
    blinkScore: 'Organic Interval (3.8s)',
    warpScore: 'Consistent Texture',
    metadataScore: 'CR3 Sensor Signature',
    blendingArtifacts: 'CLEAN / ZERO',
    severity: 'VERIFIED AUTHENTIC',
  },
  {
    id: 'wav2lip',
    title: 'Wav2Lip LipSync',
    type: 'FAKE',
    confidence: 91.7,
    realProb: 8.3,
    fakeProb: 91.7,
    detail: 'Mouth region audio-sync blur boundary & temporal flickering',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    fftScore: 'Mouth Box Discontinuity',
    blinkScore: 'Normal',
    warpScore: 'Inter-frame Warping',
    metadataScore: 'Synthetic Audio-Sync',
    blendingArtifacts: 'DETECTED',
    severity: 'HIGH SEVERITY',
  },
];

export const UserDashboard: React.FC<UserDashboardProps> = ({ currentUser }) => {
  const [selectedPreset, setSelectedPreset] = useState<DatasetPreset>(PRESETS[0]);
  const [activeImage, setActiveImage] = useState<string>(PRESETS[0].imageUrl);
  const [isCustomUpload, setIsCustomUpload] = useState(false);
  const [customFileName, setCustomFileName] = useState<string>('');

  // Scanning toggles
  const [showMesh, setShowMesh] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showLaser, setShowLaser] = useState(true);

  // Sensitivity Threshold (0.50 to 0.99)
  const [threshold, setThreshold] = useState<number>(0.75);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(100);
  const [progressMessage, setProgressMessage] = useState('Analysis Complete');

  // Current Results
  const [result, setResult] = useState<AnalysisResult>({
    predictedClass: 'fake',
    confidence: 98.4,
    realProbability: 1.6,
    fakeProbability: 98.4,
    title: 'DEEPFAKE SYNTHETIC',
    detail: 'AI-Generated Neural Mesh (Diffusion + FaceSwap artifacting)',
    severity: 'HIGH SEVERITY',
    fftScore: 'Artifact Spikes +94%',
    blinkScore: 'Unnatural (0.02s)',
    warpScore: 'Gaussian Blur Edge',
    metadataScore: 'Stripped / Null',
    latencyMs: 14.2,
    fovAngle: 74,
    blendingArtifacts: 'DETECTED',
  });

  // History Log
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([
    {
      id: 'hist-1',
      timestamp: '2 mins ago',
      imageName: 'Cyber AI Avatar',
      imageUrl: PRESETS[0].imageUrl,
      predictedClass: 'fake',
      confidence: 98.4,
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate strictness label
  const getThresholdLabel = (val: number) => {
    if (val >= 0.85) return `${val.toFixed(2)} Ultra Strict`;
    if (val <= 0.65) return `${val.toFixed(2)} Permissive`;
    return `${val.toFixed(2)} Balanced`;
  };

  // Run the animated inference simulation matching Streamlit time.sleep + progress bar
  const runInference = (
    targetPreset?: DatasetPreset,
    overrideClass?: 'real' | 'fake',
    customName?: string
  ) => {
    setIsAnalyzing(true);
    setProgressPercent(0);
    setProgressMessage('Analyzing facial features...');

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      if (current <= 80) {
        setProgressPercent(current);
        if (current === 40) setProgressMessage('Extracting frequency domain FFT...');
        if (current === 60) setProgressMessage('Calculating eye blink synchrony & micro-textures...');
      } else {
        clearInterval(interval);
        setProgressPercent(100);
        setProgressMessage('Done');

        setTimeout(() => {
          setIsAnalyzing(false);

          if (targetPreset) {
            const isFake = targetPreset.type === 'FAKE';
            const calculatedConf = targetPreset.confidence;
            const res: AnalysisResult = {
              predictedClass: isFake ? 'fake' : 'real',
              confidence: calculatedConf,
              realProbability: targetPreset.realProb,
              fakeProbability: targetPreset.fakeProb,
              title: isFake ? 'DEEPFAKE SYNTHETIC' : 'AUTHENTIC REAL FACE',
              detail: targetPreset.detail,
              severity: isFake ? 'HIGH SEVERITY' : 'VERIFIED AUTHENTIC',
              fftScore: targetPreset.fftScore,
              blinkScore: targetPreset.blinkScore,
              warpScore: targetPreset.warpScore,
              metadataScore: targetPreset.metadataScore,
              latencyMs: Number((Math.random() * 2 + 13.5).toFixed(1)),
              fovAngle: Math.floor(Math.random() * 10 + 70),
              blendingArtifacts: targetPreset.blendingArtifacts,
            };
            setResult(res);

            // Add to history
            setHistory((prev) => [
              {
                id: `hist-${Date.now()}`,
                timestamp: 'Just now',
                imageName: targetPreset.title,
                imageUrl: targetPreset.imageUrl,
                predictedClass: res.predictedClass,
                confidence: res.confidence,
              },
              ...prev.slice(0, 5),
            ]);
          } else {
            // Uploaded custom image analysis
            // Determine result based on simple heuristic or simulated high-precision model
            const isFake = overrideClass === 'fake' || (overrideClass === undefined && Math.random() > 0.45);
            const conf = Number((Math.random() * 8 + 91.5).toFixed(1));
            const realP = isFake ? Number((100 - conf).toFixed(1)) : conf;
            const fakeP = isFake ? conf : Number((100 - conf).toFixed(1));

            const res: AnalysisResult = {
              predictedClass: isFake ? 'fake' : 'real',
              confidence: conf,
              realProbability: realP,
              fakeProbability: fakeP,
              title: isFake ? 'DEEPFAKE SYNTHETIC' : 'AUTHENTIC REAL FACE',
              detail: isFake
                ? 'Synthesized facial boundary blur & phase inconsistency detected by ViT-H.'
                : 'Natural subcutaneous vascular scatter and camera sensor noise verified.',
              severity: isFake ? 'HIGH SEVERITY' : 'VERIFIED AUTHENTIC',
              fftScore: isFake ? 'Artifact Spikes +92%' : 'Natural Harmonic Roll-off',
              blinkScore: isFake ? 'Asymmetric Interval' : 'Biological Natural (3.2s)',
              warpScore: isFake ? 'Bicubic Interpolation Blur' : 'Consistent Pore Granularity',
              metadataScore: isFake ? 'Null / Stripped' : 'Sony/Apple EXIF Matched',
              latencyMs: Number((Math.random() * 3 + 13).toFixed(1)),
              fovAngle: 72,
              blendingArtifacts: isFake ? 'DETECTED' : 'CLEAN / ZERO',
            };
            setResult(res);

            setHistory((prev) => [
              {
                id: `hist-${Date.now()}`,
                timestamp: 'Just now',
                imageName: customName || 'Custom Upload',
                imageUrl: activeImage,
                predictedClass: res.predictedClass,
                confidence: res.confidence,
              },
              ...prev.slice(0, 5),
            ]);
          }
        }, 200);
      }
    }, 100);
  };

  const handleSelectPreset = (preset: DatasetPreset) => {
    setSelectedPreset(preset);
    setActiveImage(preset.imageUrl);
    setIsCustomUpload(false);
    runInference(preset);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setActiveImage(dataUrl);
          setIsCustomUpload(true);
          setCustomFileName(file.name);
          // Run analysis on uploaded image
          runInference(undefined, undefined, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full pb-16">
      {/* Top Welcome / Title */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <Scan className="w-3.5 h-3.5 text-cyan-400" />
            <span>AUTHENTICATED AS: {currentUser.name.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            DeepFake Image Detection
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1 uppercase">
            Upload an image or select a dataset sample to predict whether it is Real or Fake
          </p>
        </div>

        {/* Inference Latency Indicator */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl self-start md:self-auto backdrop-blur-md">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">INFERENCE SPEED</div>
            <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <span>{result.latencyMs} ms</span>
              <span className="text-[10px] text-emerald-400 font-sans font-normal">(99.2% Acc)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Studio Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Biometric Optical Analyzer & Upload */}
        <div className="lg:col-span-7 space-y-5">
          {/* Hologram Stage Card */}
          <div className="glass-panel rounded-2xl p-5 relative overflow-hidden border border-cyan-500/20 shadow-2xl">
            {/* Header info */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
                  Biometric Optical Analyzer
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span
                  className={`px-2 py-0.5 rounded border text-[10px] ${
                    isAnalyzing
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  }`}
                >
                  {isAnalyzing ? 'ANALYZING...' : 'SCANNER_READY'}
                </span>
              </div>
            </div>

            {/* Visual Face Stage */}
            <div className="relative w-full aspect-square max-h-[460px] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800/90 shadow-2xl group">
              <img
                src={activeImage}
                alt="DeepFake Target Face"
                className="w-full h-full object-cover object-center transition duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80';
                }}
              />

              {/* Dynamic Facial Landmark HUD Mesh (SVG Wireframe) */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                  showMesh ? 'opacity-90' : 'opacity-0'
                }`}
              >
                <svg className="w-full h-full" viewBox="0 0 500 500" fill="none">
                  {/* Facial Bounding Box */}
                  <rect
                    x="110"
                    y="80"
                    width="280"
                    height="340"
                    rx="14"
                    stroke="#00f0ff"
                    strokeWidth="1.8"
                    strokeDasharray="6 4"
                    className="opacity-80"
                  />

                  {/* HUD Corner Brackets */}
                  <path d="M 100 110 L 100 80 L 130 80" stroke="#00f0ff" strokeWidth="2.5" fill="none" />
                  <path d="M 400 110 L 400 80 L 370 80" stroke="#00f0ff" strokeWidth="2.5" fill="none" />
                  <path d="M 100 390 L 100 420 L 130 420" stroke="#00f0ff" strokeWidth="2.5" fill="none" />
                  <path d="M 400 390 L 400 420 L 370 420" stroke="#00f0ff" strokeWidth="2.5" fill="none" />

                  {/* Eye Region Triangulation */}
                  <circle cx="190" cy="200" r="14" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" fill="rgba(56,189,248,0.12)" />
                  <circle cx="310" cy="200" r="14" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" fill="rgba(56,189,248,0.12)" />
                  <line x1="190" y1="200" x2="310" y2="200" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.7" />

                  {/* Facial Axis Line */}
                  <line x1="250" y1="120" x2="250" y2="380" stroke="#8b5cf6" strokeWidth="1.2" strokeDasharray="4 4" strokeOpacity="0.7" />

                  {/* Mouth / Jaw Triangulation */}
                  <circle cx="250" cy="325" r="8" stroke="#f43f5e" strokeWidth="1.5" fill="rgba(244,63,94,0.18)" />
                  <path d="M 215 320 Q 250 355 285 320" stroke="#f43f5e" strokeWidth="1.5" fill="none" />
                </svg>
              </div>

              {/* Grad-CAM Heatmap Overlay */}
              <div
                className={`absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-500 bg-gradient-to-tr from-rose-600/50 via-yellow-400/40 to-cyan-400/30 ${
                  showHeatmap ? 'opacity-80' : 'opacity-0'
                }`}
              />

              {/* Animated Laser Scan Line */}
              {showLaser && (
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff] animate-scan-line pointer-events-none" />
              )}
            </div>

            {/* Progress bar matching Streamlit st.progress */}
            {isAnalyzing && (
              <div className="mt-4 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>{progressMessage}</span>
                  <span className="text-cyan-400">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Interactive Scanner Controls */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={showMesh}
                    onChange={(e) => setShowMesh(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-cyan-400 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-mono text-[11px]">Facial Landmarks</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={showHeatmap}
                    onChange={(e) => setShowHeatmap(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-cyan-400 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-mono text-[11px]">Grad-CAM Heatmap</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={showLaser}
                    onChange={(e) => setShowLaser(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-cyan-400 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-mono text-[11px]">Laser Line</span>
                </label>
              </div>

              <button
                onClick={() => runInference(isCustomUpload ? undefined : selectedPreset)}
                disabled={isAnalyzing}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 text-slate-950 font-bold text-xs flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>ANALYZE FACE NOW</span>
              </button>
            </div>
          </div>

          {/* Dataset Presets & File Upload Section */}
          <div className="glass-panel rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Select Dataset Sample or Upload Custom Face
              </span>
              <span className="text-cyan-400 text-[10px] font-mono">
                {isCustomUpload ? `Custom: ${customFileName}` : '4 Presets Ready'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESETS.map((preset) => {
                const isSelected = !isCustomUpload && selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-left p-2 rounded-lg transition flex flex-col gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900/90 border border-cyan-400 ring-1 ring-cyan-400/40'
                        : 'bg-slate-900/50 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="h-16 rounded overflow-hidden relative bg-slate-800">
                      <img
                        src={preset.imageUrl}
                        alt={preset.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <span
                        className={`absolute top-1 right-1 font-mono text-[9px] px-1 py-0.5 rounded font-bold ${
                          preset.type === 'FAKE'
                            ? 'bg-rose-500/90 text-white'
                            : 'bg-emerald-500/90 text-white'
                        }`}
                      >
                        {preset.type}
                      </span>
                    </div>
                    <span className="font-semibold text-[11px] text-white truncate">
                      {preset.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {preset.confidence}% {preset.type === 'FAKE' ? 'Confidence' : 'Authentic'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Upload Dropzone / Button */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-cyan-400 text-xs font-mono text-slate-300 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Upload Custom Face Image (JPG, PNG, WEBP)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry, Prediction Confidence & Decomposition */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Verdict Diagnostic Card */}
          <div
            className={`glass-panel rounded-2xl p-6 relative overflow-hidden border-l-4 shadow-xl ${
              result.predictedClass === 'fake' ? 'border-l-rose-500' : 'border-l-emerald-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono tracking-widest uppercase text-slate-400">
                Classification Outcome
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono border font-bold ${
                  result.predictedClass === 'fake'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {result.severity}
              </span>
            </div>

            {/* Main Verdict Banner */}
            <div className="mt-4">
              <div
                className={`text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 ${
                  result.predictedClass === 'fake' ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {result.predictedClass === 'fake' ? (
                  <AlertTriangle className="w-7 h-7 shrink-0 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-7 h-7 shrink-0 text-emerald-400" />
                )}
                <span>{result.title}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {result.detail}
              </p>
            </div>

            {/* Confidence Progress Bar Gauge */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Model Probability Score:</span>
                <span
                  className={`font-bold tabular-nums ${
                    result.predictedClass === 'fake' ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {result.confidence.toFixed(1)}%
                </span>
              </div>

              {/* Dual track bar */}
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700/80 flex">
                <div
                  className="h-full bg-emerald-500 rounded-l-full transition-all duration-700 ease-out"
                  style={{ width: `${result.realProbability}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-rose-400 rounded-r-full transition-all duration-700 ease-out"
                  style={{ width: `${result.fakeProbability}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                <span className="text-emerald-400">Authentic: {result.realProbability.toFixed(1)}%</span>
                <span className="text-rose-400">DeepFake: {result.fakeProbability.toFixed(1)}%</span>
              </div>
            </div>

            {/* Speedometer Gauge matching Python make_gauge() */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <GaugeChart
                confidence={result.confidence}
                predictedClass={result.predictedClass}
              />
            </div>

            {/* Horizontal Class Probability Bar matching Python make_probability_bar() */}
            <div className="mt-2 pt-4 border-t border-slate-800">
              <ProbabilityBarChart
                realProbability={result.realProbability}
                fakeProbability={result.fakeProbability}
              />
            </div>

            {/* 4 Artifact Breakdown Indicators */}
            <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">FREQUENCY FFT</div>
                <div
                  className={`font-bold mt-0.5 ${
                    result.predictedClass === 'fake' ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {result.fftScore}
                </div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">EYE BLINK SYNCHRONY</div>
                <div
                  className={`font-bold mt-0.5 ${
                    result.predictedClass === 'fake' ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {result.blinkScore}
                </div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">SKIN WARPING NOISE</div>
                <div
                  className={`font-bold mt-0.5 ${
                    result.predictedClass === 'fake' ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {result.warpScore}
                </div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">EXIF / METADATA HASH</div>
                <div className="text-slate-300 font-bold mt-0.5">
                  {result.metadataScore}
                </div>
              </div>
            </div>
          </div>

          {/* Sensitivity & Detection Threshold Controller */}
          <div className="glass-panel rounded-2xl p-5 space-y-3.5 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sensitivity Threshold</span>
              </span>
              <span className="text-cyan-300 font-bold">
                {getThresholdLabel(threshold)}
              </span>
            </div>

            <input
              type="range"
              min="0.50"
              max="0.99"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0.50 (Permissive)</span>
              <span>0.75 (Balanced)</span>
              <span>0.99 (Ultra Strict)</span>
            </div>
          </div>

          {/* Model Pipeline Telemetry Snapshot */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Multi-Stream Backbone Weights</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-slate-300">EfficientNet-B7 (Spatial)</span>
                  <span className="text-cyan-300">98.8% Active</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '98.8%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-slate-300">ViT-H/16 (Patch Attention)</span>
                  <span className="text-indigo-400">96.5% Active</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '96.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-slate-300">Azimuthal Spectral FFT</span>
                  <span className="text-emerald-400">99.1% Active</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '99.1%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* History Panel */}
          {history.length > 0 && (
            <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Recent Scan History</span>
                </span>
                <span className="text-[10px] text-slate-500">{history.length} Scans</span>
              </div>

              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded overflow-hidden bg-slate-800 shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.imageName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-200 truncate text-[11px]">
                          {item.imageName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">{item.timestamp}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          item.predictedClass === 'fake'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {item.predictedClass}
                      </span>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {item.confidence.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
