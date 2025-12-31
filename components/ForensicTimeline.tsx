
import React, { memo, useMemo } from 'react';
import { GameHistoryItem, AnalysisResult, Translations, DomainType } from '../types';
import { WEIGHTS } from '../services/psychologyService';
import { BifurcationEngine } from '../services/bifurcationEngine';

interface ForensicTimelineProps {
  result: AnalysisResult;
  t: Translations;
  className?: string;
}

const DOMAIN_ICONS: Record<string, string> = {
    foundation: '⚓',
    agency: '⚡',
    money: '💎',
    social: '👥',
    legacy: '🌳'
};

export const ForensicTimeline: React.FC<ForensicTimelineProps> = memo(({ result, t, className }) => {
  const { history } = result;
  const bifurcations = useMemo(() => BifurcationEngine.detect(history), [history]);

  if (!history || history.length === 0) {
      return (
          <div className="p-10 text-center opacity-40 italic text-[10px] uppercase tracking-widest text-emerald-500">
              ДАННЫЕ ТРАССИРОВКИ НЕДОСТУПНЫ
          </div>
      );
  }

  return (
    <div className={`space-y-4 font-mono ${className}`}>
        <div className="flex justify-between items-center px-2 mb-6 border-b border-indigo-900/30 pb-2">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Нейронный Самописец</h4>
            <span className="text-[8px] text-slate-600 bg-slate-900 px-2 py-0.5 rounded">УЗЛЫ: {history.length}</span>
        </div>

        <div className="relative space-y-2">
            <div className="absolute left-[15px] top-0 bottom-0 w-px bg-slate-800/30"></div>

            {history.map((h, i) => {
                const bPoint = bifurcations.find(b => b.nodeId === h.nodeId);
                const w = (WEIGHTS as any)[h.beliefKey] || WEIGHTS.default;
                
                return (
                    <div key={i} className={`relative pl-8 pb-2 transition-all duration-500 ${bPoint ? 'scale-[1.02]' : ''}`}>
                        {/* Timeline marker */}
                        <div className={`absolute left-[12px] top-4 w-2 h-2 rounded-full border-2 border-slate-950 z-10 transition-all 
                            ${bPoint ? 'bg-red-500 scale-150 shadow-[0_0_15px_#ef4444] animate-pulse' : 'bg-slate-700'}`}>
                        </div>

                        <div className={`bg-slate-900/30 border p-3 rounded-2xl transition-all
                            ${bPoint ? 'border-red-500/50 bg-red-950/10 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/5'}`}>
                            
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] text-slate-600 font-black">#{String(i + 1).padStart(2, '0')}</span>
                                    <span className="text-xs">{DOMAIN_ICONS[h.domain]}</span>
                                    <span className={`text-[10px] font-bold ${bPoint ? 'text-red-400' : 'text-slate-300'}`}>
                                        {(t.beliefs[h.beliefKey] || h.beliefKey).toUpperCase()}
                                    </span>
                                </div>
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${h.latency > 2500 ? 'bg-amber-900/20 text-amber-500' : 'bg-slate-800 text-slate-500'}`}>
                                    {(h.latency/1000).toFixed(1)}с
                                </span>
                            </div>

                            {bPoint && (
                                <div className="mt-2 mb-2 py-1.5 px-2 bg-red-950/40 border-l-2 border-red-500 rounded-r-lg animate-in">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[7px] font-black text-red-400 uppercase tracking-widest">ОБНАРУЖЕНА БИФУРКАЦИЯ</span>
                                        <span className="text-[7px] font-black text-red-500 animate-ping">●</span>
                                    </div>
                                    <p className="text-[9px] text-red-100 font-bold mt-1">
                                        {bPoint.archetypeBefore} ➜ {bPoint.archetypeAfter} ({bPoint.intensity}%)
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-0.5 bg-slate-800 rounded-full overflow-hidden flex">
                                    {(['f', 'a', 'r', 'e'] as const).map(m => {
                                        const val = w[m] as number;
                                        if (val === 0) return null;
                                        const width = (Math.abs(val) / 8) * 100;
                                        const color = m === 'e' ? 'bg-red-500' : 'bg-indigo-500';
                                        return <div key={m} className={`h-full ${color} opacity-30`} style={{ width: `${width}%` }}></div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            <div className="pt-8 text-center opacity-20">
                <div className="w-1 h-1 bg-indigo-500 rounded-full mx-auto animate-ping"></div>
                <p className="text-[7px] mt-2 uppercase tracking-[0.6em] text-indigo-400">ПОТОК ДАННЫХ СТАБИЛЕН</p>
            </div>
        </div>
    </div>
  );
});
