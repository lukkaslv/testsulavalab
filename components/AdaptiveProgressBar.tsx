
import React, { memo } from 'react';
import { useAppContext } from '../hooks/useAppContext';

interface AdaptiveProgressBarProps {
  clarity: number;
  isAdaptive: boolean;
  contradictionsCount: number;
  confidenceScore?: number;
}

export const AdaptiveProgressBar: React.FC<AdaptiveProgressBarProps> = memo(({ clarity, isAdaptive, contradictionsCount, confidenceScore }) => {
  const { t } = useAppContext();
  // Safe access to test_metrics to prevent runtime errors if translation is missing
  const tm = t?.test_metrics;

  if (!tm) return null;

  return (
    <div className="space-y-2 shrink-0 animate-in">
      <div className="flex justify-between items-end">
         <div className="flex flex-col">
            <span className="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">{tm.insight_resolution}</span>
            <span className={`text-[12px] font-black italic ${clarity > 80 ? 'text-emerald-600' : 'text-indigo-600'}`}>{Math.round(clarity)}%</span>
         </div>
         <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">{tm.confidence}</span>
            <span className="text-[10px] font-black text-slate-700">{confidenceScore ?? 100}%</span>
         </div>
      </div>
      <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden relative border border-slate-100 shadow-inner">
         <div 
            className={`h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.2)] ${clarity > 80 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
            style={{ width: `${clarity}%` }}
         ></div>
      </div>
      {isAdaptive && (
        <div className="flex justify-between">
           <span className="text-[7px] font-black text-amber-600 uppercase tracking-widest animate-pulse flex items-center gap-1">
                {tm.adaptive_active}
           </span>
           <span className="text-[7px] font-black text-slate-500 uppercase">
             {contradictionsCount > 0 ? `${contradictionsCount} ${tm.dissonance_points}` : tm.signal_clean}
           </span>
        </div>
      )}
    </div>
  );
});
