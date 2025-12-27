
import React, { memo } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export const Logo: React.FC<LogoProps> = memo(({ size = 'md', className = "", animate = true }) => {
  const dimensions = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-40 h-40'
  }[size];

  return (
    <div className={`relative flex items-center justify-center ${dimensions} ${className} transition-transform duration-300 active:scale-90`}>
      {/* 
        GENESIS CORE SIGIL v5.0
        Design Strategy: 'The Squint Test'. 
        Recognizable as a 'G' and an 'Eye/Iris' even at 32px.
      */}
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible filter drop-shadow-[0_4px_12px_rgba(79,70,229,0.4)]">
        <defs>
          <linearGradient id="sigilGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
          
          {/* Mask for surgical-grade cutouts that stay visible at small scale */}
          <mask id="sigilMask">
            <rect x="0" y="0" width="100" height="100" fill="white" />
            {/* Wider cuts for mobile legibility */}
            <rect x="42" y="0" width="16" height="35" fill="black" />
            <rect x="42" y="65" width="16" height="35" fill="black" />
          </mask>
        </defs>

        {/* Main Structural Ring (The System/OS) */}
        <circle 
          cx="50" cy="50" r="42" 
          fill="none" 
          stroke="url(#sigilGradient)" 
          strokeWidth="12" 
          mask="url(#sigilMask)"
        />

        {/* The Core Insight Bar (The G-Element) */}
        {/* Bold terminal for the 'G' suggestion */}
        <path 
          d="M 50 50 L 85 50" 
          stroke="url(#sigilGradient)" 
          strokeWidth="12" 
          strokeLinecap="round"
        />

        {/* Central Pulse Point (The Neural Signal) */}
        <circle 
          cx="50" cy="50" r="6" 
          fill="#ffffff" 
          className={animate ? "animate-pulse" : ""}
          style={{ animationDuration: '2s' }}
        />

        {/* Inner Scanning Ring */}
        <circle 
          cx="50" cy="50" r="22" 
          fill="none" 
          stroke="url(#sigilGradient)" 
          strokeWidth="2" 
          className="opacity-30"
        />
      </svg>

      {/* Subtle Depth Aura */}
      {animate && (
        <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl animate-pulse -z-10"></div>
      )}
    </div>
  );
});
