
import React, { memo } from 'react';
import { StructuralFracture, Translations } from '../types';

interface FractureMapProps {
    fractures: StructuralFracture[];
    t: Translations;
    className?: string;
}

export const FractureMap: React.FC<FractureMapProps> = memo(({ fractures, t, className }) => {
    if (fractures.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center bg-black/40 rounded-[3rem] border border-emerald-500/10 p-10 text-center ${className}`}>
                <div className="w-16 h-16 bg-emerald-500/5 rounded-full flex items-center justify-center text-3xl mb-4 border border-emerald-500/20">✨</div>
                <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Структурных разломов не обнаружено</h4>
                <p className="text-[8px] text-slate-500 uppercase mt-2 italic leading-relaxed">Сигнал системы когерентен по всем узлам.</p>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <header className="px-4 flex justify-between items-end">
                <div className="space-y-1">
                    <span className="text-[8px] font-black text-red-500 uppercase tracking-[0.4em] animate-pulse">Critical_Anomalies_Found</span>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Карта структурного дефицита</h3>
                </div>
                <span className="text-[10px] font-mono text-red-500 font-bold bg-red-950/30 px-2 py-0.5 rounded border border-red-500/20">{fractures.length} POINT_OF_FAILURE</span>
            </header>

            <div className="grid grid-cols-1 gap-3">
                {fractures.map((f, i) => (
                    <div key={i} className="bg-slate-900/60 border border-red-500/20 p-5 rounded-[2rem] flex items-start gap-4 shadow-xl animate-in">
                        <div className="flex flex-col items-center gap-2 pt-1 shrink-0">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                            <div className="w-px h-12 bg-gradient-to-b from-red-500/50 to-transparent"></div>
                        </div>
                        <div className="space-y-2 flex-1">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Узел #{parseInt(f.nodeId) + 1} // {t.domains[f.domain]}</span>
                                <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded ${f.intensity > 45 ? 'bg-red-500 text-white' : 'bg-red-950 text-red-400'}`}>
                                    INTENSITY: {f.intensity}%
                                </span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-200 italic leading-tight">
                                "{t.beliefs[f.beliefKey] || f.beliefKey}"
                            </p>
                            <p className="text-[9px] text-slate-500 uppercase font-medium leading-relaxed bg-black/40 p-2 rounded-lg border border-white/5">
                                {f.description}: Соматический блок подтвержден задержкой отклика.
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="px-4 opacity-30 text-center pt-4">
                <p className="text-[7px] text-slate-500 font-mono uppercase tracking-[0.3em]">X-Ray_Protocol_V1.1 // Structural_Dissonance_Scan</p>
            </footer>
        </div>
    );
});
