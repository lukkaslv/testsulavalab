
import React, { useState, useMemo, memo } from 'react';
import { AnalysisResult, Translations, DomainType } from '../types';
import { InterventionEngine } from '../services/InterventionEngine';
import { PlatformBridge } from '../utils/helpers';

interface props {
    result: AnalysisResult;
    t: Translations;
}

export const InterventionDashboard: React.FC<props> = memo(({ result, t }) => {
    const [модель, setМодель] = useState<Record<DomainType, number>>(result.domainProfile);
    
    const отклик = useMemo(() => {
        return InterventionEngine.рассчитатьОтклик(result, модель);
    }, [модель, result]);

    const изменитьМетрику = (сфера: DomainType, значение: number) => {
        setМодель(prev => ({ ...prev, [сфера]: значение }));
        if (значение % 10 === 0) PlatformBridge.haptic.impact('soft');
    };

    const сферы: DomainType[] = ['foundation', 'agency', 'money', 'social', 'legacy'];

    return (
        <div className="space-y-6 animate-in py-2">
            <div className="bg-slate-900/80 border border-indigo-500/30 p-6 rounded-[2.5rem] space-y-8 shadow-2xl backdrop-blur-xl">
                <header className="flex justify-between items-center">
                    <div className="space-y-1">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Tactical_Intervention_Lab</span>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Пульт Интервенций</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl animate-pulse">🛠️</div>
                </header>

                <div className="space-y-5">
                    {сферы.map(сфера => (
                        <div key={сфера} className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{t.domains[сфера]}</span>
                                <span className="text-[10px] font-mono text-indigo-400 font-bold">{модель[сфера]}%</span>
                            </div>
                            <input 
                                type="range" min="5" max="95" value={модель[сфера]} 
                                onChange={(e) => изменитьМетрику(сфера, parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-indigo-500 cursor-pointer hover:bg-slate-700 transition-colors"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-700 relative overflow-hidden shadow-2xl ${
                отклик.рискДекомпенсации > 60 ? 'bg-red-950/20 border-red-500/40' : 'bg-indigo-950/20 border-indigo-500/40'
            }`}>
                <div className="absolute top-0 right-0 p-4 opacity-5 text-7xl font-black">{отклик.рискДекомпенсации > 60 ? '⚠️' : '⚖️'}</div>
                
                <div className="relative z-10 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Прогноз Хаоса:</span>
                            <div className={`text-2xl font-black font-mono ${отклик.хаос > 60 ? 'text-red-400' : 'text-white'}`}>
                                {отклик.хаос}%
                            </div>
                        </div>
                        <div className="space-y-1 text-right">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Риск Срыва:</span>
                            <div className={`text-2xl font-black font-mono ${отклик.рискДекомпенсации > 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                {отклик.рискДекомпенсации}%
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-2">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] block">Системный вердикт:</span>
                        <p className={`text-[12px] leading-relaxed font-bold italic ${отклик.рискДекомпенсации > 60 ? 'text-red-300' : 'text-slate-200'}`}>
                            "{отклик.вердикт}"
                        </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[7px] text-slate-500 uppercase">Цена трансформации</span>
                            <span className="text-xs font-black text-indigo-300">{отклик.ценаИзменений} <span className="text-[8px] opacity-50">ед.энергии</span></span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[7px] text-slate-500 uppercase">Ожидаемое трение</span>
                            <span className="text-xs font-black text-amber-400">{отклик.трение}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-[7px] text-slate-700 text-center uppercase tracking-[0.4em] pt-4">
                Моделирование Ст. 19.2 // Все расчеты локальны и детерминированы.
            </p>
        </div>
    );
});
