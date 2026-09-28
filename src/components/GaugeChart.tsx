import React from 'react';

interface GaugeChartProps {
  confidence: number; // 0 to 100
  predictedClass: 'real' | 'fake';
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ confidence, predictedClass }) => {
  const isReal = predictedClass === 'real';
  const color = isReal ? '#00e68c' : '#ff4d6d';

  // Arc calculation for semi-circle speedometer (from 180 to 360 deg or -180 to 0)
  // Let's create an arc from 180 to 0 degrees:
  // angle = 180 - (confidence / 100) * 180 degrees
  const angle = 180 + (Math.min(100, Math.max(0, confidence)) / 100) * 180;
  const needleAngle = (Math.min(100, Math.max(0, confidence)) / 100) * 180 - 90;

  // Arc path: center at 150, 140, radius 100
  const cx = 150;
  const cy = 135;
  const r = 90;

  // Background arc parameters
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const bgArc = describeArc(cx, cy, r, 0, 180);
  const activeAngle = (Math.min(100, Math.max(0, confidence)) / 100) * 180;
  const activeArc = describeArc(cx, cy, r, 0, activeAngle);

  // Ticks
  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
        Confidence Meter
      </div>
      <div className="relative w-full max-w-[280px]">
        <svg viewBox="0 0 300 170" className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="gaugeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track (First 50% & second 50% steps matching Plotly) */}
          <path
            d={bgArc}
            fill="none"
            stroke="rgba(133, 142, 161, 0.2)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Active Confidence Arc */}
          <path
            d={activeArc}
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            filter="url(#glowFilter)"
            className="transition-all duration-700 ease-out"
          />

          {/* Ticks and labels */}
          {ticks.map((t) => {
            const tickDeg = (t / 100) * 180;
            const pInner = polarToCartesian(cx, cy, r - 15, tickDeg);
            const pOuter = polarToCartesian(cx, cy, r + 15, tickDeg);
            const pText = polarToCartesian(cx, cy, r - 26, tickDeg);
            return (
              <g key={t}>
                <line
                  x1={pInner.x}
                  y1={pInner.y}
                  x2={pOuter.x}
                  y2={pOuter.y}
                  stroke="rgba(133, 142, 161, 0.4)"
                  strokeWidth="1.5"
                />
                <text
                  x={pText.x}
                  y={pText.y + 4}
                  fill="#858ea1"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  {t}%
                </text>
              </g>
            );
          })}

          {/* Needle pivot */}
          <circle cx={cx} cy={cy} r="7" fill={color} filter="url(#glowFilter)" />
          <circle cx={cx} cy={cy} r="3" fill="#ffffff" />

          {/* Needle Pointer */}
          <g
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              transform: `rotate(${needleAngle}deg)`,
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <line
              x1={cx}
              y1={cy}
              x2={cx}
              y2={cy - r + 10}
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* Large readout */}
          <text
            x={cx}
            y={cy + 24}
            fill="#e1e2e4"
            fontSize="26"
            fontWeight="bold"
            fontFamily="JetBrains Mono"
            textAnchor="middle"
          >
            {confidence.toFixed(1)}%
          </text>
          <text
            x={cx}
            y={cy - 25}
            fill={color}
            fontSize="11"
            fontWeight="600"
            fontFamily="JetBrains Mono"
            textAnchor="middle"
            letterSpacing="0.05em"
          >
            {isReal ? 'VERIFIED REAL' : 'DEEPFAKE DETECTED'}
          </text>
        </svg>
      </div>
    </div>
  );
};
