
import React, { memo } from 'react';
import { Translations } from '../types';

interface RadarChartProps {
  points: { x: number; y: number; label?: string }[];
  onLabelClick: (metric: string) => void;
  className?: string;
  t: Translations;
}

export const RadarChart: React.FC<RadarChartProps> = memo(({ points, onLabelClick, className = "", t }) => {
  
  const handleInteraction = (metric: string) => {
    // FIX: Cast window to any to access Telegram property
    (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred?.('light');
    onLabelClick(metric);
  };

  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Pentagon Grid Generation
  const center = 50;
  const levels = [20, 30, 45]; // radius levels
  const pentagonGrid = levels.map((r, idx) => {
      const pts = points.map((_, i) => {
          const angle = (Math.PI * 2 * i) / points.length - Math.PI / 2;
          const x = center + Math.cos(angle) * r;
          const y = center + Math.sin(angle) * r;
          return `${x},${y}`;
      }).join(' ');
      return (
          <polygon 
            key={idx} 
            points={pts} 
            fill="none" 
            stroke="#94a3b8" 
            strokeWidth="0.5" 
            strokeDasharray={idx === 1 ? "2 2" : "none"} 
            opacity={0.3 + (idx * 0.1)}
          />
      );
  });

  const axisLines = points.map((_, i) => {
      const angle = (Math.PI * 2 * i) / points.length - Math.PI / 2;
      const x2 = center + Math.cos(angle) * 48;
      const y2 = center + Math.sin(angle) * 48;
      return <line key={i} x1={center} y1={center} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="0.5" opacity="0.3" />;
  });

  return (
    <div className={`relative w-72 h-72 mx-auto ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none">
        {/* Grid and Axes */}
        {pentagonGrid}
        {axisLines}
        
        {/* Data Shape */}
        <polygon 
          points={polyPoints}
          fill="rgba(99, 102, 241, 0.2)"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinejoin="round"
          className="animate-in drop-shadow-xl"
        />
        
        {/* Points and Labels */}
        {points.map((p, i) => {
            // Label Positioning logic
            const angle = (Math.PI * 2 * i) / points.length - Math.PI / 2;
            const labelRadius = 58; 
            const lx = center + Math.cos(angle) * labelRadius;
            const ly = center + Math.sin(angle) * labelRadius;
            
            // Icon Mapping (Visual Sugar)
            const icons: Record<string, string> = {
                foundation: '⚓',
                agency: '⚡',
                social: '👥',
                legacy: '🌳',
                money: '💎'
            };
            
            const key = p.label || 'unknown';
            
            return (
                <g key={i} className="group cursor-pointer" onClick={(e) => { e.stopPropagation(); handleInteraction(key); }}>
                    <circle 
                        cx={p.x} cy={p.y} r="2" 
                        fill="#6366f1" 
                        className="animate-pulse" 
                        style={{ animationDelay: `${i * 0.1}s` }} 
                    />
                    
                    <g transform={`translate(${lx}, ${ly})`}>
                        <text 
                            textAnchor="middle" 
                            dy="0.3em" 
                            className="text-[5px] fill-slate-400 font-bold uppercase tracking-widest pointer-events-none"
                            style={{ fontSize: '4px' }}
                        >
                            {icons[key]} {t.domains[key]?.substring(0, 3)}
                        </text>
                    </g>
                </g>
            );
        })}
      </svg>
    </div>
  );
});
