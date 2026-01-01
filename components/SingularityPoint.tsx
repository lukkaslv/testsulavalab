import React, { memo } from 'react';
import { SingularityPoint as SingularityPointType } from '../services/psychologyService';
import { Translations } from '../types';

interface SingularityPointProps {
    point: SingularityPointType | null;
    t: Translations;
    className?: string;
}

/**
 * ТОЧКА СХЛОПЫВАНИЯ (Ст. 5)
 * Визуализирует момент фазового перехода системы.
 */
export const SingularityPoint: React.FC<SingularityPointProps> = memo(({ point, t, className }) => {
    if (!point) return null;

    const motiveColors = {
        'ПОТОК': 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
        'ЗАЩИТА': 'text-amber-400 border-amber-500/30 bg-amber-950/20',
        'КРИЗИС': 'text-red-400 border-red-500/30 bg-red-950/20'
    };

    return (
        <div className={`space-y-6 animate-in py-2 ${className}`}>
            <header className="px-2 space-y-1">
                <span className="text-[8px] font-black text-white uppercase tracking-[0.4em] animate-pulse">ОБНАРУЖЕН_ГОРИЗОНТ_СОБЫТИЙ</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Точка Схлопывания</h3>
            </header>

            <div className="bg-black border-2 border-white/5 p-8 rounded-[3rem] relative overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500/5 blur-[80px] rounded-full"></div>

                <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Критический Узел:</span>
                            <div className="text-xl font-black text-white uppercase italic tracking-tighter">
                                {t.beliefs[point.beliefKey] || point.beliefKey}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-mono text-slate-400 uppercase">Сфера: {t.domains[point.domain]}</span>
                                <span className="text-[8px] text-slate-600">//</span>
                                <span className="text-[8px] font-mono text-slate-400 uppercase">Код_{point.nodeId}</span>
                            </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${motiveColors[point.motive]}`}>
                            {point.motive}
                        </div>
                    </div>

                    <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 space-y-3">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block">Системный Резонанс:</span>
                        <p className="text-[12px] text-slate-200 leading-relaxed font-medium italic font-serif">
                            "{point.description}"
                        </p>
                    </div>

                    <div className="flex justify-between items-end">
                         <div className="space-y-1">
                            <span className="text-[7px] text-slate-500 uppercase font-black tracking-widest">Сдвиг Потенциала (Δ)</span>
                            <div className="flex items-center gap-3">
                                <div className="h-1 w-32 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-white shadow-[0_0_10px_#fff] transition-all duration-1000" style={{ width: `${point.impactMagnitude}%` }}></div>
                                </div>
                                <span className="text-[10px] font-mono font-black text-white">{point.impactMagnitude}%</span>
                            </div>
                         </div>
                         <div className="text-right">
                             <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center relative">
                                 <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                                 <span className="text-[8px] font-black text-indigo-400">ЯДРО</span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            <footer className="px-4 text-center opacity-30 pt-2">
                <p className="text-[7px] text-slate-500 uppercase leading-relaxed font-mono">
                    Анализ фазового перехода Ст. 7.3 // Logic_V18.0_Singularity
                </p>
            </footer>
        </div>
    );
});