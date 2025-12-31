
import React, { memo } from 'react';
import { Translations } from '../types';
import { PlatformBridge } from '../utils/helpers';

interface RadarChartProps {
  points: { x: number; y: number; label?: string }[];
  secondaryPoints?: { x: number; y: number; label?: string }[];
  shadowPoints?: { x: number; y: number; label?: string }[];
  showShadow?: boolean;
  onLabelClick: (metric: string) => void;
  className?: string;
  t: Translations;
}

export const RadarChart: React.FC<RadarChartProps> = memo(({ points, secondaryPoints, shadowPoints, showShadow = true, onLabelClick, className = "", t }) => {
  
  const handleInteraction = (metric: string) => {
    PlatformBridge.haptic.selection();
    onLabelClick(metric);
  };

  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const ghostPoints = secondaryPoints ? secondaryPoints.map(p => `${p.x},${p.y}`).join(' ') : null;
  const shadowPolyPoints = shadowPoints ? shadowPoints.map(p => `${p.x},${p.y}`).join(' ') : null;

  const center = 50;
  const levels = [20, 35, 48]; 

  return (
    <div className={`relative w-72 h-72 mx-auto ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none">
        <style>{`
            @keyframes shadow-breath {
                0% { opacity: 0.1; transform: scale(1); transform-origin: center; }
                50% { opacity: 0.25; transform: scale(1.05); transform-origin: center; }
                100% { opacity: 0.1; transform: scale(1); transform-origin: center; }
            }
            .animate-shadow { animation: shadow-breath 6s infinite ease-in-out; }
        `}</style>

        {/* Grid System */}
        {levels.map((r, idx) => (
            <polygon 
                key={idx} 
                points={points.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / points.length - Math.PI / 2;
                    return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
                }).join(' ')} 
                fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="0.5" 
            />
        ))}

        {/* Shadow Area (SRP Art 7.3) */}
        {shadowPolyPoints && showShadow && (
            <polygon 
                points={shadowPolyPoints} 
                fill="rgba(168, 85, 247, 0.2)" 
                stroke="#a855f7" 
                strokeWidth="1" 
                strokeDasharray="1 2" 
                className="animate-shadow" 
            />
        )}

        {/* Active Core Shape */}
        <polygon 
          points={polyPoints}
          fill="rgba(99, 102, 241, 0.15)"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinejoin="round"
          className="transition-all duration-700"
        />
        
        {points.map((p, i) => {
            const angle = (Math.PI * 2 * i) / points.length - Math.PI / 2;
            const lx = center + Math.cos(angle) * 58;
            const ly = center + Math.sin(angle) * 58;
            const key = p.label || 'unknown';
            
            return (
                <g key={i} className="cursor-pointer" onClick={() => handleInteraction(key)}>
                    <circle cx={p.x} cy={p.y} r="1.5" fill="#6366f1" />
                    <text textAnchor="middle" dy="0.3em" className="text-[4px] fill-slate-500 font-black uppercase tracking-widest" x={lx} y={ly}>
                        {t.domains[key]?.substring(0, 3)}
                    </text>
                </g>
            );
        })}
      </svg>
    </div>
  );
});
