
import React, { memo } from 'react';
import { PhaseTransitionReport } from '../services/psychologyService';
import { Translations } from '../types';

interface PhaseTransitionMapProps {
    report: PhaseTransitionReport;
    t: Translations;
    className?: string;
}

/**
 * КАРТА ТЕКУЧЕСТИ (Ст. 7)
 * Показывает "агрегатное состояние" психики и энергию перехода.
 */
export const PhaseTransitionMap: React.FC<PhaseTransitionMapProps> = memo(({ report, className }) => {
    const stateColors = {
        'КРИСТАЛЛ': 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20',
        'ТЕКУЧЕСТЬ': 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
        'ГАЗ': 'text-amber-400 border-amber-500/30 bg-amber-950/20'
    };

    return (
        <div className={`space-y-6 animate-in py-2 ${className}`}>
            <header className="px-2 space-y-1">
                <span className="text-[8px] font-black text-white uppercase tracking-[0.4em]">Thermodynamic_Mental_Audit</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Архитектура Перехода</h3>
            </header>

            <div className="bg-slate-950 border border-white/5 p-8 rounded-[3rem] relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)]"></div>
                
                <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Состояние Структуры:</span>
                            <div className="text-3xl font-black text-white italic tracking-tighter">
                                {report.aggregateState}
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${stateColors[report.aggregateState]}`}>
                            {report.aggregateState === 'ТЕКУЧЕСТЬ' ? 'ПЛАСТИЧНО' : report.aggregateState}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Потенциал Сдвига</span>
                             <div className="flex items-center gap-3">
                                <div className="h-1.5 flex-1 bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: `${report.shiftPotential}%` }}></div>
                                </div>
                                <span className="text-[10px] font-mono font-black text-white">{report.shiftPotential}%</span>
                             </div>
                        </div>
                        <div className="space-y-2">
                             <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Энергия Активации</span>
                             <div className="flex items-center gap-3">
                                <div className="h-1.5 flex-1 bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" style={{ width: `${report.activationEnergy}%` }}></div>
                                </div>
                                <span className="text-[10px] font-mono font-black text-white">{report.activationEnergy}%</span>
                             </div>
                        </div>
                    </div>

                    <div className="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-3">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] block">Вектор Трансформации:</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic">
                            "{report.statusDescription}"
                        </p>
                    </div>

                    {report.couplingNodes.length > 0 && (
                        <div className="space-y-2">
                            <span className="text-[8px] font-black text-red-400 uppercase tracking-widest block">Узлы Сцепки (Блокировка Перехода):</span>
                            <div className="flex gap-2">
                                {report.couplingNodes.map(nodeId => (
                                    <span key={nodeId} className="px-3 py-1 bg-red-950/40 border border-red-500/20 rounded-lg text-[9px] font-mono text-red-400">
                                        Код_{nodeId}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <footer className="px-4 text-center opacity-30">
                <p className="text-[7px] text-slate-500 uppercase leading-relaxed font-mono">
                    Анализ фазового пространства Ст. 7.1 // Logic_V20.0_Transition
                </p>
            </footer>
        </div>
    );
});
