
import React, { memo } from 'react';
import { ОтчетПроводимости } from '../services/ConductivityEngine';
import { Translations } from '../types';

interface props {
    отчет: ОтчетПроводимости;
    т: Translations;
    className?: string;
}

const GateIcon = ({ статус }: { статус: string }) => {
    switch(статус) {
        case 'ПРОЗРАЧЕН': return '✨';
        case 'ПРОНИЦАЕМ': return '🔓';
        case 'ВЯЗОК': return '⏳';
        case 'ЗАБЛОКИРОВАН': return '🛑';
        default: return '🔘';
    }
};

export const ConductivityGates: React.FC<props> = memo(({ отчет, т, className }) => {
    return (
        <div className={`space-y-6 animate-in py-2 ${className}`}>
            <header className="px-2 space-y-1">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">Access_Permeability_Scan</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Шлюзы Проводимости</h3>
            </header>

            <div className="space-y-3">
                {отчет.шлюзы.map((шлюз, i) => (
                    <div 
                        key={шлюз.домен}
                        className={`p-5 rounded-[2rem] border transition-all duration-700 relative overflow-hidden group
                            ${шлюз.статус === 'ПРОЗРАЧЕН' ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 
                              шлюз.статус === 'ЗАБЛОКИРОВАН' ? 'bg-red-950/10 border-red-900/20' : 'bg-slate-900/40 border-white/5'}`}
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        {/* Индикатор проводимости (фон) */}
                        <div 
                            className={`absolute left-0 top-0 bottom-0 opacity-10 transition-all duration-1000
                                ${шлюз.проводимость > 60 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            style={{ width: `${шлюз.проводимость}%` }}
                        ></div>

                        <div className="relative z-10 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border
                                    ${шлюз.проводимость > 70 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-800 border-white/5'}`}>
                                    <GateIcon статус={шлюз.статус} />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className={`text-xs font-black uppercase tracking-widest ${шлюз.статус === 'ПРОЗРАЧЕН' ? 'text-emerald-400' : 'text-white'}`}>
                                        {т.domains[шлюз.домен]}
                                    </h4>
                                    <span className="text-[7px] font-mono text-slate-500 uppercase tracking-tighter">{шлюз.статус}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[7px] text-slate-600 uppercase font-black block">Проводимость</span>
                                <span className={`text-xl font-mono font-black ${шлюз.проводимость > 60 ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {шлюз.проводимость}%
                                </span>
                            </div>
                        </div>

                        {шлюз.статус === 'ПРОЗРАЧЕН' && (
                            <div className="mt-4 pt-3 border-t border-emerald-500/20 animate-in">
                                <p className="text-[9px] text-emerald-300 italic font-bold uppercase tracking-tight">
                                    {шлюз.рекомендация}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-[2.5rem] flex items-center gap-5 shadow-inner">
                <div className="text-3xl animate-bounce">🎯</div>
                <div className="space-y-1">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Стратегическая точка входа:</span>
                    <p className="text-xs text-white font-black uppercase italic tracking-tighter">
                        ДОМЕН «{т.domains[отчет.точкаВхода].toUpperCase()}»
                    </p>
                </div>
            </div>
        </div>
    );
});
