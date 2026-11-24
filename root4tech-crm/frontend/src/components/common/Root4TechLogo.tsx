import React, { useState } from 'react';

export interface Root4TechLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string | boolean;
  variant?: 'color' | 'dark' | 'light' | 'print';
  className?: string;
  textClassName?: string;
  useOriginalImage?: boolean;
}

export const Root4TechLogo: React.FC<Root4TechLogoProps> = ({
  size = 'md',
  showText = false,
  subtitle = false,
  variant = 'color',
  className = '',
  textClassName = '',
  useOriginalImage = true
}) => {
  const [imageError, setImageError] = useState(false);

  // Dimensions mapping
  const sizeMap = {
    xs: { box: 24, font: 'text-xs', subFont: 'text-[9px]' },
    sm: { box: 32, font: 'text-sm', subFont: 'text-[10px]' },
    md: { box: 40, font: 'text-base', subFont: 'text-[11px]' },
    lg: { box: 52, font: 'text-lg', subFont: 'text-xs' },
    xl: { box: 68, font: 'text-2xl', subFont: 'text-xs' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isPrint = variant === 'print';
  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Root 4 Tech Original Emblem */}
      {useOriginalImage && !imageError ? (
        <div
          className="relative shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-105"
          style={{ width: currentSize.box, height: currentSize.box }}
        >
          <img
            src="/root4tech-emblem.png"
            alt="Root 4 Tech Logo"
            width={currentSize.box}
            height={currentSize.box}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(56,189,248,0.4)]"
          />
        </div>
      ) : (
        /* Vector SVG Fallback with Electric Roots & Gradient */
        <svg
          width={currentSize.box}
          height={currentSize.box}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 transition-transform duration-300 hover:scale-105"
          aria-label="Root 4 Tech Official Logo"
        >
          <defs>
            <linearGradient id="r4t-vec-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="40%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            <linearGradient id="r4t-vec-root" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="60%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            <filter id="r4t-vec-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#38BDF8" floodOpacity="0.5" />
            </filter>
          </defs>

          <g transform="translate(10, 5)">
            {/* Main Stylized 'R' Upper Body & Right Leg */}
            <path
              d="M 68 20 H 118 C 142 20 156 34 156 56 C 156 76 142 90 120 90 H 96 L 146 158 L 116 158 L 76 96 V 158 H 68 V 20 Z"
              fill="url(#r4t-vec-blue)"
            />

            {/* Inner Cutout */}
            <path
              d="M 96 38 H 116 C 128 38 136 44 136 56 C 136 68 128 74 116 74 H 96 Z"
              fill={isDark ? '#0F172A' : '#FFFFFF'}
            />

            {/* Stylized Sharp Blade on Lower Right Leg */}
            <path
              d="M 120 90 L 146 158 L 150 148 L 134 94 Z"
              fill="#60A5FA"
              opacity="0.85"
            />

            {/* Electric Root Tendrils branching downwards and left */}
            <g stroke="url(#r4t-vec-root)" strokeLinecap="round" strokeLinejoin="round" filter="url(#r4t-vec-glow)">
              <path d="M 68 85 Q 60 100 62 118 T 58 145 T 62 165" strokeWidth="3.5" fill="none" />
              <path d="M 72 95 Q 68 115 72 135 T 70 160" strokeWidth="3" fill="none" />
              <path d="M 62 105 Q 45 115 36 128 T 24 142" strokeWidth="2.5" fill="none" />
              <path d="M 60 118 Q 48 132 40 148 T 32 162" strokeWidth="2" fill="none" />
              <path d="M 62 135 Q 52 148 46 160 T 42 172" strokeWidth="1.8" fill="none" />
              <path d="M 45 115 Q 38 122 34 130 T 26 135" strokeWidth="1.5" fill="none" />
              <path d="M 36 128 Q 28 136 20 142 T 14 150" strokeWidth="1.2" fill="none" />
              <path d="M 66 122 Q 72 135 76 148 T 80 162" strokeWidth="2" fill="none" />
              <path d="M 72 135 Q 78 145 84 154" strokeWidth="1.4" fill="none" />
            </g>

            <circle cx="24" cy="142" r="1.5" fill="#38BDF8" filter="url(#r4t-vec-glow)" />
            <circle cx="14" cy="150" r="1.2" fill="#38BDF8" filter="url(#r4t-vec-glow)" />
            <circle cx="32" cy="162" r="1.5" fill="#38BDF8" filter="url(#r4t-vec-glow)" />
            <circle cx="42" cy="172" r="1.5" fill="#38BDF8" filter="url(#r4t-vec-glow)" />
            <circle cx="80" cy="162" r="1.5" fill="#38BDF8" filter="url(#r4t-vec-glow)" />
          </g>
        </svg>
      )}

      {/* Brand Wordmark & Typography */}
      {showText && (
        <div className={`min-w-0 flex flex-col justify-center ${textClassName}`}>
          <div
            className={`font-black tracking-wider flex items-center gap-1.5 leading-none ${currentSize.font} ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            <span className="font-extrabold tracking-wide">ROOT 4 TECH</span>
            {!isPrint && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            )}
          </div>
          {subtitle && (
            <div
              className={`font-semibold uppercase tracking-wider mt-0.5 leading-tight ${currentSize.subFont} ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {typeof subtitle === 'string'
                ? subtitle
                : isPrint
                ? 'Software Development & Technology Operations'
                : 'Enterprise CRM Platform'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
