
import React, { memo } from 'react';
import { ResonancePoint } from '../services/psychologyService';
import { Translations, BeliefKey } from '../types';

interface ResonanceScannerProps {
    points: ResonancePoint[];
    t: Translations;
    className?: string;
}

/**
 * СКАНЕР РЕЗОНАНСА (Ст. 7.3)
 * Визуализирует точки разрыва между умом и телом.
 */
export const ResonanceScanner: React.FC<ResonanceScannerProps> = memo(({ points, t, className }) => {
    if (points.length === 0) {
        return (
            <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-emerald-500/10 text-center space-y-3">
                <div className="text-3xl grayscale opacity-30">🤝</div>
                <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Полный Резонанс</h4>
                <p className="text-[8px] text-slate-500 uppercase leading-relaxed">Сигнал ума и тела когерентен.</p>
            </div>
        );
    }

    return (
        <div className={`space-y-4 animate-in ${className}`}>
            <header className="px-2 space-y-1">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Resonance_Audit_V16</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Детектор Искажений</h3>
            </header>

            <div className="space-y-2">
                {points.map((p, i) => (
                    <div key={i} className="bg-slate-950/60 border border-indigo-500/20 p-5 rounded-[2rem] relative overflow-hidden group shadow-xl transition-all hover:bg-slate-900">
                        {/* Heat Level Bar */}
                        <div 
                            className="absolute top-0 left-0 bottom-0 w-1 bg-red-500 transition-all duration-1000 shadow-[0_0_10px_#ef4444]" 
                            style={{ height: `${p.dissonance}%`, opacity: 0.2 + (p.dissonance/100)*0.8 }}
                        ></div>

                        <div className="flex justify-between items-start mb-2 pl-2">
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-black text-white uppercase tracking-wider">
                                    {t.beliefs[p.beliefKey] || p.beliefKey}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-1 h-1 rounded-full ${p.dissonance > 70 ? 'bg-red-500 animate-ping' : 'bg-amber-500'}`}></div>
                                    <span className={`text-[8px] font-black uppercase ${p.dissonance > 70 ? 'text-red-400' : 'text-amber-400'}`}>
                                        Диссонанс: {p.dissonance}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pl-2 mt-3 p-3 bg-black/40 rounded-xl border border-white/5">
                            <p className="text-[10px] text-slate-300 italic leading-tight font-medium">
                                "{p.description}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="px-4 text-center opacity-30 pt-2">
                <p className="text-[7px] text-slate-500 uppercase leading-relaxed font-mono">
                    Анализ когерентности Ст. 7.3 // Logic_V16.0_Resonance
                </p>
            </footer>
        </div>
    );
});
