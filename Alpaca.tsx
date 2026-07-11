'use client';

import React from 'react';

type AlpacaMood = 'default' | 'hover' | 'analyzing' | 'completed' | 'judge' | 'mediator' | 'comedian';

interface AlpacaProps {
  mood?: AlpacaMood;
  size?: number;
  className?: string;
}

export default function Alpaca({ mood = 'default', size = 160, className = '' }: AlpacaProps) {
  const showJudgeHat = mood === 'judge';
  const showScarf = mood === 'mediator';
  const showSunglasses = mood === 'comedian';

  const earDuration = mood === 'analyzing' ? '0.8s' : mood === 'hover' ? '2s' : '4s';
  const earAngle = mood === 'analyzing' ? 6 : 3;

  const svgH = Math.round(size * 1.05);

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: svgH }}
    >
      <div
        style={{
          animation: `earTilt ${earDuration} ease-in-out infinite`,
        }}
      >
        <img
          src="/alpaca-default.jpg"
          alt="理理羊驼"
          width={size}
          height={svgH}
          style={{ objectFit: 'contain', display: 'block' }}
        />
      </div>

      {/* Judge hat overlay */}
      {showJudgeHat && (
        <svg
          viewBox="0 0 200 210"
          width={size}
          height={svgH}
          className="absolute inset-0"
          style={{ pointerEvents: 'none' }}
        >
          <rect x="40" y="62" width="120" height="10" rx="4" fill="#1A1A1A" />
          <rect x="58" y="20" width="84" height="44" rx="6" fill="#1A1A1A" />
          <rect x="52" y="58" width="96" height="6" rx="2" fill="#FFD700" />
          <circle cx="100" cy="38" r="8" fill="none" stroke="#FFD700" strokeWidth="1.5" />
          <circle cx="100" cy="38" r="3" fill="#FFD700" />
        </svg>
      )}

      {/* Scarf overlay */}
      {showScarf && (
        <svg
          viewBox="0 0 200 210"
          width={size}
          height={svgH}
          className="absolute inset-0"
          style={{ pointerEvents: 'none' }}
        >
          <path d="M50 158 Q100 180 150 158" stroke="#FF8C6B" strokeWidth="16" fill="none" strokeLinecap="round" />
          <path d="M53 158 Q100 176 147 158" stroke="#E07B5A" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M135 164 Q144 190 140 208" stroke="#FF8C6B" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M136 164 Q143 188 140 205" stroke="#E07B5A" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
      )}

      {/* Sunglasses overlay */}
      {showSunglasses && (
        <svg
          viewBox="0 0 200 210"
          width={size}
          height={svgH}
          className="absolute inset-0"
          style={{ pointerEvents: 'none' }}
        >
          <rect x="60" y="82" width="30" height="20" rx="6" fill="#1A1A1A" />
          <rect x="110" y="82" width="30" height="20" rx="6" fill="#1A1A1A" />
          <line x1="90" y1="92" x2="110" y2="92" stroke="#1A1A1A" strokeWidth="3" />
          <line x1="57" y1="89" x2="60" y2="91" stroke="#1A1A1A" strokeWidth="2.5" />
          <line x1="143" y1="91" x2="146" y2="89" stroke="#1A1A1A" strokeWidth="2.5" />
          <rect x="65" y="86" width="10" height="5" rx="2.5" fill="white" opacity="0.15" transform="rotate(-12 70 88)" />
          <rect x="115" y="86" width="10" height="5" rx="2.5" fill="white" opacity="0.15" transform="rotate(-12 120 88)" />
        </svg>
      )}

      {/* Analyzing glow */}
      {mood === 'analyzing' && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,140,107,0.25) 0%, transparent 70%)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      )}

      <style>{`
        @keyframes earTilt {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-${earAngle}deg); }
          75% { transform: rotate(${earAngle}deg); }
        }
      `}</style>
    </div>
  );
}