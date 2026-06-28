import React, { useEffect, useState } from 'react';

export default function Avatar({ mood = 'neutral', size = 260 }) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    neutral: { head: '#534AB7', face: '#7F77DD', body: '#3C3489', glow: '#534AB7', label: 'Employee' },
    safe:    { head: '#0F6E56', face: '#1D9E75', body: '#085041', glow: '#1D9E75', label: 'Retained ✓' },
    risk:    { head: '#993C1D', face: '#D85A30', body: '#712B13', glow: '#D85A30', label: 'At Risk !' },
  };

  const c = colors[mood] || colors.neutral;
  const s = size;
  const cx = s / 2;

  const mouthPath = mood === 'risk'
    ? `M${cx - 18} ${s * 0.34} Q${cx} ${s * 0.29} ${cx + 18} ${s * 0.34}`
    : mood === 'safe'
    ? `M${cx - 18} ${s * 0.30} Q${cx} ${s * 0.37} ${cx + 18} ${s * 0.30}`
    : `M${cx - 16} ${s * 0.32} Q${cx} ${s * 0.35} ${cx + 16} ${s * 0.32}`;

  const eyeScaleY = blink ? 0.1 : 1;

  return (
    <svg width={s} height={s * 1.1} viewBox={`0 0 ${s} ${s * 1.1}`} style={{ filter: `drop-shadow(0 0 24px ${c.glow}55)`, transition: 'filter 0.6s ease' }}>
      <defs>
        <radialGradient id={`head-grad-${mood}`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={c.face} />
          <stop offset="100%" stopColor={c.head} />
        </radialGradient>
        <radialGradient id={`body-grad-${mood}`} cx="40%" cy="30%" r="65%">
          <stop offset="0%" stopColor={c.face} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c.body} />
        </radialGradient>
      </defs>

      {/* Glow ring */}
      <circle cx={cx} cy={s * 0.27} r={s * 0.27} fill="none" stroke={c.glow} strokeWidth="1" opacity="0.2" />
      <circle cx={cx} cy={s * 0.27} r={s * 0.22} fill="none" stroke={c.glow} strokeWidth="0.5" opacity="0.15" />

      {/* Head */}
      <circle cx={cx} cy={s * 0.27} r={s * 0.24} fill={`url(#head-grad-${mood})`} style={{ transition: 'fill 0.5s ease' }} />

      {/* Highlight on head */}
      <ellipse cx={cx - s * 0.07} cy={s * 0.17} rx={s * 0.07} ry={s * 0.045} fill="rgba(255,255,255,0.18)" />

      {/* Eyes */}
      <g transform={`translate(${cx - s * 0.09}, ${s * 0.245}) scale(1, ${eyeScaleY})`} style={{ transformOrigin: `${cx - s * 0.09}px ${s * 0.245}px`, transition: 'transform 0.1s' }}>
        <ellipse cx="0" cy="0" rx={s * 0.045} ry={s * 0.05} fill="white" />
        <circle cx={mood === 'risk' ? s * 0.008 : 0} cy={mood === 'safe' ? -s * 0.008 : 0} r={s * 0.025} fill="#1a1a2e" />
        <circle cx={s * 0.015} cy={-s * 0.015} r={s * 0.008} fill="white" opacity="0.9" />
      </g>
      <g transform={`translate(${cx + s * 0.09}, ${s * 0.245}) scale(1, ${eyeScaleY})`} style={{ transformOrigin: `${cx + s * 0.09}px ${s * 0.245}px`, transition: 'transform 0.1s' }}>
        <ellipse cx="0" cy="0" rx={s * 0.045} ry={s * 0.05} fill="white" />
        <circle cx={mood === 'risk' ? -s * 0.008 : 0} cy={mood === 'safe' ? -s * 0.008 : 0} r={s * 0.025} fill="#1a1a2e" />
        <circle cx={s * 0.015} cy={-s * 0.015} r={s * 0.008} fill="white" opacity="0.9" />
      </g>

      {/* Eyebrows */}
      {mood === 'risk' && <>
        <line x1={cx - s * 0.13} y1={s * 0.195} x2={cx - s * 0.05} y2={s * 0.21} stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <line x1={cx + s * 0.13} y1={s * 0.195} x2={cx + s * 0.05} y2={s * 0.21} stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      </>}
      {mood === 'safe' && <>
        <line x1={cx - s * 0.13} y1={s * 0.21} x2={cx - s * 0.05} y2={s * 0.195} stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <line x1={cx + s * 0.13} y1={s * 0.21} x2={cx + s * 0.05} y2={s * 0.195} stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      </>}

      {/* Mouth */}
      <path d={mouthPath} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ transition: 'd 0.4s ease' }} />

      {/* Cheeks for safe */}
      {mood === 'safe' && <>
        <ellipse cx={cx - s * 0.17} cy={s * 0.32} rx={s * 0.055} ry={s * 0.03} fill="#ff9999" opacity="0.35" />
        <ellipse cx={cx + s * 0.17} cy={s * 0.32} rx={s * 0.055} ry={s * 0.03} fill="#ff9999" opacity="0.35" />
      </>}

      {/* Body */}
      <rect x={cx - s * 0.22} y={s * 0.5} width={s * 0.44} height={s * 0.42} rx={s * 0.06} fill={`url(#body-grad-${mood})`} style={{ transition: 'fill 0.5s ease' }} />

      {/* Shirt highlight */}
      <ellipse cx={cx} cy={s * 0.55} rx={s * 0.1} ry={s * 0.04} fill="rgba(255,255,255,0.12)" />

      {/* Arms */}
      <rect x={cx - s * 0.38} y={s * 0.51} width={s * 0.16} height={s * 0.09} rx={s * 0.045} fill={c.head} style={{ transition: 'fill 0.5s ease' }} />
      <rect x={cx + s * 0.22} y={s * 0.51} width={s * 0.16} height={s * 0.09} rx={s * 0.045} fill={c.head} style={{ transition: 'fill 0.5s ease' }} />

      {/* Legs */}
      <rect x={cx - s * 0.17} y={s * 0.9} width={s * 0.13} height={s * 0.18} rx={s * 0.04} fill={c.body} style={{ transition: 'fill 0.5s ease' }} />
      <rect x={cx + s * 0.04} y={s * 0.9} width={s * 0.13} height={s * 0.18} rx={s * 0.04} fill={c.body} style={{ transition: 'fill 0.5s ease' }} />

      {/* Label badge */}
      <rect x={cx - s * 0.18} y={s * 0.64} width={s * 0.36} height={s * 0.1} rx={s * 0.025} fill="rgba(0,0,0,0.3)" />
      <text x={cx} y={s * 0.705} textAnchor="middle" fontSize={s * 0.055} fill="white" fontWeight="500" fontFamily="Inter, sans-serif">{c.label}</text>

      {/* Risk exclamation animation */}
      {mood === 'risk' && (
        <g>
          <circle cx={cx + s * 0.28} cy={s * 0.2} r={s * 0.07} fill="#D85A30" opacity="0.9">
            <animate attributeName="r" values={`${s * 0.07};${s * 0.09};${s * 0.07}`} dur="1s" repeatCount="indefinite" />
          </circle>
          <text x={cx + s * 0.28} y={s * 0.225} textAnchor="middle" fontSize={s * 0.075} fill="white" fontWeight="700">!</text>
        </g>
      )}

      {/* Safe checkmark animation */}
      {mood === 'safe' && (
        <g>
          <circle cx={cx + s * 0.28} cy={s * 0.2} r={s * 0.07} fill="#1D9E75" opacity="0.9" />
          <path d={`M${cx + s * 0.245} ${s * 0.2} L${cx + s * 0.27} ${s * 0.225} L${cx + s * 0.315} ${s * 0.175}`}
            stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}
