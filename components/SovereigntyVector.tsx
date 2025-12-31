
import React, { memo } from 'react';
import { Translations } from '../types';
import { SovereigntyMetrics } from '../services/sovereigntyEngine';

interface SovereigntyVectorProps {
    metrics: SovereigntyMetrics;
    t: Translations;
    className?: string;
}

export const SovereigntyVector: React.FC<SovereigntyVectorProps> = memo(({ metrics, t, className }) => {
    const { escapeVelocity: v, requiredVelocity: req, canEscape } = metrics;

    return (
        <div className={`relative bg-slate-950 rounded-[3rem] border border-white/5 p-8 flex flex-col justify-center space-y-10 overflow-hidden ${className}`}>
            <div className="absolute top-6 left-8 z-10 space-y-1">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Скан Вектора Суверенитета</span>
                <p className="text-[7px] text-slate-500 font-mono uppercase italic">Соотношение Воля/Инерция</p>
            </div>

            {/* Main Speedometer Style Gauge */}
            <div className="relative h-32 flex flex-col justify-center space-y-4">
                {/* Required Threshold Line */}
                <div 
                    className="absolute h-full w-0.5 bg-red-500/40 z-20 transition-all duration-1000 shadow-[0_0_15px_#ef4444]"
                    style={{ left: `${req}%` }}
                >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[7px] font-black text-red-500 uppercase tracking-widest whitespace-nowrap">
                        ГРАВИТАЦИОННЫЙ ЗАХВАТ
                    </span>
                </div>

                {/* Background Track */}
                <div className="h-4 bg-slate-900 rounded-full w-full overflow-hidden border border-white/5 relative">
                    {/* Escape Bar */}
                    <div 
                        className={`h-full transition-all duration-1000 ease-out flex items-center justify-end px-2 ${canEscape ? 'bg-cyan-500 shadow-[0_0_20px_#06b6d4]' : 'bg-indigo-600'}`}
                        style={{ width: `${v}%` }}
                    >
                        <div className="w-1 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="flex justify-between items-center px-1">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Текущая скорость</span>
                        <div className="text-2xl font-black text-white">{v} <span className="text-[10px] text-indigo-400">v/s</span></div>
                    </div>
                    <div className="text-right space-y-1">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Статус прорыва</span>
                        <div className={`text-sm font-black uppercase italic ${canEscape ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`}>
                            {canEscape ? 'ГОТОВ К ПРЫЖКУ' : 'УДЕРЖАНИЕ'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lever Analysis */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-2">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block">Рычаг Перехода:</span>
                    <div className="text-xs font-black text-white uppercase italic tracking-tight">
                        {t.domains[metrics.leverageDomain]}
                    </div>
                    <p className="text-[8px] text-slate-500 leading-tight">Воздействие на этот домен даст макс. прирост скорости (Art. 19.1).</p>
                </div>
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-2">
                    <span className="text-[8px] font-black text-red-400 uppercase tracking-widest block">Цена Прыжка:</span>
                    <div className="text-xs font-black text-white uppercase italic tracking-tight">
                        {metrics.systemicPrice}% <span className="text-[8px] text-red-500">Потеря Стабильности</span>
                    </div>
                    <p className="text-[8px] text-slate-500 leading-tight">Риск временной дестабилизации при смене сценария.</p>
                </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase italic tracking-wider">
                    {canEscape 
                        ? "Система обладает достаточным суверенитетом для изменения аттрактора."
                        : "Энергии воли недостаточно для самостоятельного выхода из воронки. Требуется внешняя опора."
                    }
                </p>
            </div>
        </div>
    );
});
