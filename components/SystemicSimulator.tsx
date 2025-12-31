
import React, { useState, memo, useMemo } from 'react';
import { DomainType, Translations, AnalysisResult } from '../types';
import { SimulationEngine } from '../services/simulationEngine';
import { PlatformBridge } from '../utils/helpers';

interface SystemicSimulatorProps {
    result: AnalysisResult;
    t: Translations;
    className?: string;
}

export const SystemicSimulator: React.FC<SystemicSimulatorProps> = memo(({ result, t, className }) => {
    const [simState, setSimState] = useState<Record<DomainType, number>>(result.domainProfile);
    const [activeControl, setActiveControl] = useState<DomainType | null>(null);

    const projection = useMemo(() => {
        if (!activeControl) return null;
        return SimulationEngine.project(result, activeControl, simState[activeControl]);
    }, [simState, activeControl, result]);

    const handleSimChange = (domain: DomainType, val: number) => {
        setActiveControl(domain);
        setSimState(prev => ({ ...prev, [domain]: val }));
        if (val % 10 === 0) PlatformBridge.haptic.impact('soft');
    };

    const domains: DomainType[] = ['foundation', 'agency', 'money', 'social', 'legacy'];

    return (
        <div className={`space-y-6 animate-in py-2 ${className}`}>
            <header className="px-2 space-y-1">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Симулятор Интервенций v15</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Карта Влияния</h3>
            </header>

            <div className="bg-slate-900/60 border border-white/5 p-6 rounded-[2.5rem] space-y-8 shadow-2xl">
                {domains.map(d => (
                    <div key={d} className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-white uppercase tracking-wider">{t.domains[d]}</span>
                                {projection && projection.delta[d] !== 0 && (
                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${projection.delta[d] > 0 ? 'bg-emerald-900/40 text-emerald-400' : 'bg-red-900/40 text-red-400'}`}>
                                        {projection.delta[d] > 0 ? '+' : ''}{projection.delta[d]}%
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-mono text-indigo-400 font-bold">{simState[d]}%</span>
                        </div>
                        <input 
                            type="range" min="5" max="95" value={simState[d]} 
                            onChange={(e) => handleSimChange(d, parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                        />
                    </div>
                ))}
            </div>

            {projection && (
                <div className="bg-indigo-600/10 border-2 border-indigo-500/20 p-6 rounded-[2.5rem] animate-in shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Прогноз Системы:</span>
                        <div className="text-right">
                            <span className="text-[7px] text-slate-500 uppercase block">Δ Целостность</span>
                            <span className={`text-lg font-black ${projection.integrityGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {projection.integrityGain > 0 ? '+' : ''}{projection.integrityGain}%
                            </span>
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-300 italic leading-relaxed">
                        {projection.integrityGain > 10 
                            ? "Высокая синергия интервенции. Система готова к быстрому переходу."
                            : projection.integrityGain < -5
                            ? "Высокий риск дестабилизации. Требуется предварительная работа с базовой безопасностью."
                            : "Стабильный линейный отклик. Рекомендуется долгосрочное сопровождение."
                        }
                    </p>
                </div>
            )}

            <footer className="px-4 text-center opacity-30">
                <p className="text-[7px] text-slate-500 uppercase leading-relaxed font-mono">
                    Протокол Симуляции Ст. 19.2 // Анализ Петель Обратной Связи
                </p>
            </footer>
        </div>
    );
});
