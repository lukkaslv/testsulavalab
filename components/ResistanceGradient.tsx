
import React, { memo } from 'react';
import { ViscosityReport } from '../types';
import { Translations, DomainType } from '../types';

interface ResistanceGradientProps {
    report: ViscosityReport;
    t: Translations;
    className?: string;
}

/**
 * КАРТА ВЯЗКОСТИ СРЕДЫ (Ст. 21)
 * Показывает, где психика наиболее ригидна.
 */
export const ResistanceGradient: React.FC<ResistanceGradientProps> = memo(({ report, t, className }) => {
    const domains: DomainType[] = ['foundation', 'agency', 'money', 'social', 'legacy'];

    return (
        <div className={`space-y-6 animate-in py-2 ${className}`}>
            <div className="bg-slate-950/40 border border-indigo-500/20 p-6 rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl pointer-events-none">🏔️</div>
                
                <header className="space-y-1">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Viscosity_Mapping_V20</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Градиент Сопротивления</h3>
                </header>

                <div className="space-y-4">
                    {domains.map(d => {
                        const v = report.perDomain[d];
                        const isLever = report.leverageDomain === d;
                        
                        return (
                            <div key={d} className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${isLever ? 'text-emerald-400' : 'text-slate-400'}`}>
                                            {t.domains[d]}
                                        </span>
                                        {isLever && <span className="text-[7px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase font-black animate-pulse">Рычаг</span>}
                                    </div>
                                    <span className={`text-[10px] font-mono font-bold ${v > 60 ? 'text-red-400' : 'text-emerald-400'}`}>{v}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${v > 60 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                                        style={{ width: `${v}%`, opacity: 0.3 + (v/100)*0.7 }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] block">Вердикт по Среде:</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic">
                        "{report.barrierDescription}"
                    </p>
                </div>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-[2rem] flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl">🎯</div>
                <div className="space-y-1">
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Рекомендация по входу:</span>
                    <p className="text-[10px] text-slate-200 font-bold uppercase leading-tight">
                        Начните проработку с домена "{t.domains[report.leverageDomain].toUpperCase()}". Здесь инерция минимальна.
                    </p>
                </div>
            </div>
        </div>
    );
});
