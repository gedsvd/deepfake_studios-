import React from 'react';

interface ProbabilityBarChartProps {
  realProbability: number; // 0 to 100
  fakeProbability: number; // 0 to 100
}

export const ProbabilityBarChart: React.FC<ProbabilityBarChartProps> = ({
  realProbability,
  fakeProbability,
}) => {
  return (
    <div className="w-full space-y-3 font-mono text-xs">
      <div className="text-[11px] uppercase tracking-wider text-slate-400">
        Class Probabilities Distribution
      </div>

      {/* Real Row */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_#00e68c]" />
            Real (Authentic)
          </span>
          <span className="text-emerald-400 font-bold tabular-nums">
            {realProbability.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-3.5 bg-slate-900/90 rounded-md overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-emerald-400 rounded-sm transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,230,140,0.5)]"
            style={{ width: `${Math.max(2, Math.min(100, realProbability))}%` }}
          />
        </div>
      </div>

      {/* Fake Row */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-400 inline-block shadow-[0_0_6px_#ff4d6d]" />
            Fake (Synthetic)
          </span>
          <span className="text-rose-400 font-bold tabular-nums">
            {fakeProbability.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-3.5 bg-slate-900/90 rounded-md overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-sm transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,77,109,0.5)]"
            style={{ width: `${Math.max(2, Math.min(100, fakeProbability))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
