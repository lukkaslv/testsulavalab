
import React, { useState, memo, useMemo } from 'react';
import { DomainType, Translations, AnalysisResult } from '../types';
import { SimulationEngine } from '../services/simulationEngine';
import { PlatformBridge } from '../utils/helpers';

interface SystemicSimulatorProps {
    result: AnalysisResult;
    t: Translations;
    className?: string;
}

/**
 * СИМУЛЯТОР ТРАНСФОРМАЦИИ (Ст. 19)
 * Позволяет специалисту моделировать терапевтический сдвиг.
 */
export const SystemicSimulator: React.FC<SystemicSimulatorProps> = memo(({ result, t, className }) => {
    const [simState, setSimState] = useState<Record<DomainType, number>>(result.domainProfile);
    
    const projection = useMemo(() => {
        return SimulationEngine.project(result, simState);
    }, [simState, result]);

    const handleSimChange = (domain: DomainType, val: number) => {
        setSimState(prev => ({ ...prev, [domain]: val }));
        if (val % 10 === 0) PlatformBridge.haptic.impact('soft');
    };

    const domains: DomainType[] = ['foundation', 'agency', 'money', 'social', 'legacy'];

    return (
        <div className={`space-y-6 animate-in py-2 ${className}`}>
            <div className="bg-slate-900/60 border border-indigo-500/20 p-6 rounded-[2.5rem] space-y-8 shadow-2xl">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Пульт Управления Сдвигом</span>
                    <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[8px] font-mono text-emerald-500">РЕЖИМ_ПРОЕКЦИИ</span>
                    </div>
                </div>

                {domains.map(d => (
                    <div key={d} className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">{t.domains[d]}</span>
                            <div className="flex items-center gap-3">
                                {projection.delta[d] !== 0 && (
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded ${projection.delta[d] > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                                        {projection.delta[d] > 0 ? '+' : ''}{projection.delta[d]}%
                                    </span>
                                )}
                                <span className="text-[10px] font-mono text-indigo-400 font-bold">{simState[d]}%</span>
                            </div>
                        </div>
                        <input 
                            type="range" min="5" max="95" value={simState[d]} 
                            onChange={(e) => handleSimChange(d, parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                        />
                    </div>
                ))}
            </div>

            <div className="bg-indigo-600/10 border-2 border-indigo-500/30 p-8 rounded-[2.5rem] animate-in shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">🔭</div>
                <div className="relative z-10 flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Прогноз Целостности:</span>
                        <div className="text-3xl font-black text-white italic">
                            {result.integrity + projection.integrityGain}%
                        </div>
                    </div>
                    <div className="text-right space-y-1">
                        <span className="text-[7px] text-slate-500 uppercase block">Системный отклик</span>
                        <span className={`text-sm font-black uppercase ${projection.integrityGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {projection.integrityGain > 0 ? 'РОСТ ЦЕЛОСТНОСТИ' : projection.integrityGain < 0 ? 'РИСК ДЕСТАБИЛИЗАЦИИ' : 'БЕЗ ИЗМЕНЕНИЙ'}
                        </span>
                    </div>
                </div>
                
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[8px] font-black text-slate-400 uppercase">Снижение износа:</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-400">+{projection.wearReduction}%</span>
                    </div>
                    <p className="text-[11px] text-slate-300 italic leading-relaxed font-medium">
                        {projection.integrityGain > 15 
                            ? "Высокий потенциал трансформации. Изменение этого вектора разблокирует скрытый ресурс системы."
                            : projection.integrityGain < -10
                            ? "Внимание: Резкое усиление воли при текущем фундаменте приведет к критическому износу."
                            : "Стабильный отклик. Психика готова к плавной интеграции изменений."
                        }
                    </p>
                </div>
            </div>

            <footer className="px-4 text-center opacity-30">
                <p className="text-[7px] text-slate-500 uppercase leading-relaxed font-mono">
                    Детерминированное Моделирование Ст. 19.2 // Logic_V19.0_Projection
                </p>
            </footer>
        </div>
    );
});
