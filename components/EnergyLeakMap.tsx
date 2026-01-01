
import React, { memo } from 'react';
import { MaintenanceReport } from '../services/psychologyService';
import { Translations } from '../types';

interface EnergyLeakMapProps {
    report: MaintenanceReport;
    t: Translations;
    className?: string;
}

/**
 * КАРТА УТЕЧЕК (Ст. 6.1)
 * Визуализирует, как дефицитные зоны истощают ресурсные.
 */
export const EnergyLeakMap: React.FC<EnergyLeakMapProps> = memo(({ report, t, className }) => {
    return (
        <div className={`space-y-6 animate-in py-2 ${className}`}>
            <div className="bg-slate-950/60 border border-red-500/20 p-6 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl pointer-events-none">🩸</div>
                
                <header className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <span className="text-[8px] font-black text-red-500 uppercase tracking-[0.4em] animate-pulse">Homeostasis_Leak_Log</span>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Системные Утечки</h3>
                    </div>
                    <div className="text-right">
                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest block">Цена Удержания</span>
                        <span className="text-xl font-mono font-black text-red-500">{report.totalCost}%</span>
                    </div>
                </header>

                <div className="space-y-4">
                    {report.leaks.length === 0 ? (
                        <div className="py-10 text-center opacity-30 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                            Утечек не обнаружено. Система эффективна.
                        </div>
                    ) : (
                        report.leaks.map((leak, i) => (
                            <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-2 group transition-all">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase">{t.domains[leak.from]}</span>
                                        <span className="text-red-500 text-xs">➜</span>
                                        <span className="text-[10px] font-black text-red-400 uppercase">{t.domains[leak.to]}</span>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-red-500">-{leak.volume}%</span>
                                </div>
                                <p className="text-[10px] text-slate-400 italic leading-tight">
                                    {leak.impact}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Статус системы:</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                        report.status === 'СТАБИЛЬНО' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' :
                        report.status === 'САМОПОЕДАНИЕ' ? 'bg-red-950 border-red-500 text-white animate-pulse' :
                        'bg-amber-950/30 border-amber-500/30 text-amber-400'
                    }`}>
                        {report.status}
                    </span>
                </div>
            </div>

            <footer className="px-4 text-center opacity-30">
                <p className="text-[7px] text-slate-600 uppercase leading-relaxed font-mono">
                    Анализ паразитарных связей Ст. 6.2 // Logic_V17.0_Entropy_Drain
                </p>
            </footer>
        </div>
    );
});
