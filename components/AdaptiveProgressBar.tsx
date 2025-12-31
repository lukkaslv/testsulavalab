
import React, { memo } from 'react';
import { useAppContext } from '../hooks/useAppContext';

interface AdaptiveProgressBarProps {
  clarity: number;
  isAdaptive: boolean;
  contradictionsCount: number;
  confidenceScore?: number;
}

export const AdaptiveProgressBar: React.FC<AdaptiveProgressBarProps> = memo(({ clarity, isAdaptive, contradictionsCount }) => {
  const { t } = useAppContext();
  const tm = t?.test_metrics;

  if (!tm) return null;

  const isStable = clarity > 85;

  return (
    <div className="space-y-2 shrink-0 animate-in opacity-80">
      <div className="flex justify-between items-end">
         <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">{tm.insight_resolution}</span>
         <span className={`text-[10px] font-mono font-bold ${isStable ? 'text-emerald-500' : 'text-indigo-400'}`}>{Math.round(clarity)}%</span>
      </div>
      
      <div className="w-full bg-slate-800/50 h-1 rounded-full overflow-hidden relative">
         <div 
            className={`h-full transition-all duration-1000 ease-out ${isStable ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-indigo-500 shadow-[0_0_10px_#6366f1]'}`} 
            style={{ width: `${clarity}%` }}
         ></div>
      </div>

      {isAdaptive && contradictionsCount > 0 && (
        <div className="flex items-center gap-2 justify-end">
           <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></div>
           <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest">{contradictionsCount} {tm.dissonance_points}</span>
        </div>
      )}
    </div>
  );
});
