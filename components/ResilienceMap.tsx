
import React, { memo } from 'react';
import { ResilienceReport } from '../services/psychologyService';
import { Translations } from '../types';

interface ResilienceMapProps {
    report: ResilienceReport;
    t: Translations;
    className?: string;
}

/**
 * КАРТА ЗАПАСА ПРОЧНОСТИ (Ст. 8.1)
 * Показывает риск разрушения структуры под нагрузкой.
 */
export const ResilienceMap: React.FC<ResilienceMapProps> = memo(({ report, t, className }) => {
    const statusColors = {
        'ЭЛАСТИЧНО': 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
        'ПРЕДЕЛ': 'text-amber-400 border-amber-500/30 bg-amber-950/20',
        'РАЗРУШЕНИЕ': 'text-red-400 border-red-500/30 bg-red-950/20 animate-pulse'
    };

    return (
        <div className={`space-y-6 animate-in py-2 ${className}`}>
            <header className="px-2 space-y-1">
                <span className="text-[8px] font-black text-white uppercase tracking-[0.4em]">Structural_Integrity_Audit</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Запас Прочности</h3>
            </header>

            <div className="bg-slate-950/60 border border-white/5 p-8 rounded-[3rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-6 opacity-5 text-8xl font-black grayscale pointer-events-none">🏗️</div>
                
                <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Коэффициент Упругости:</span>
                            <div className="text-3xl font-black text-white italic">
                                {report.safetyMargin}%
                            </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${statusColors[report.status]}`}>
                            {report.status}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block">Зоны Хрупкости (Риск Излома):</span>
                        <div className="flex flex-wrap gap-2">
                            {report.fragileDomains.length === 0 ? (
                                <span className="text-[10px] text-emerald-400 font-bold uppercase italic">Рисков не обнаружено</span>
                            ) : (
                                report.fragileDomains.map(d => (
                                    <span key={d} className="px-3 py-1 bg-red-950/40 border border-red-500/30 rounded-lg text-[9px] font-black text-red-400 uppercase">
                                        {t.domains[d]}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-3">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block">Технический Анализ:</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic font-serif">
                            {report.status === 'ЭЛАСТИЧНО' 
                                ? "Система обладает высокой адаптивностью. Вмешательство безопасно." 
                                : report.status === 'ПРЕДЕЛ'
                                ? "Обнаружена системная усталость. Рекомендуется фаза стабилизации перед изменениями."
                                : "Критическое напряжение структуры. Риск ретравматизации при конфронтации."}
                        </p>
                    </div>

                    <div className="flex justify-between items-end">
                         <div className="space-y-1">
                            <span className="text-[7px] text-slate-500 uppercase font-black">Индекс Ригидности</span>
                            <div className="flex items-center gap-3">
                                <div className="h-1 w-32 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${report.rigidityIndex}%` }}></div>
                                </div>
                                <span className="text-[10px] font-mono font-black text-white">{report.rigidityIndex}%</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            <footer className="px-4 text-center opacity-30">
                <p className="text-[7px] text-slate-500 uppercase leading-relaxed font-mono">
                    Анализ износа Ст. 8.1 // Logic_V19.0_Resilience
                </p>
            </footer>
        </div>
    );
});
