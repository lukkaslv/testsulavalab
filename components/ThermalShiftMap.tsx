
import React, { memo } from 'react';
import { ОтчетСдвига } from '../services/ThermalShiftEngine';
import { Translations, DomainType } from '../types';

interface props {
    отчет: ОтчетСдвига;
    т: Translations;
    className?: string;
}

const СЕТКА_ПОЗИЦИЙ: Record<DomainType, { x: string, y: string }> = {
    foundation: { x: '50%', y: '50%' }, // Центр - ядро
    agency: { x: '20%', y: '20%' },
    money: { x: '80%', y: '20%' },
    social: { x: '20%', y: '80%' },
    legacy: { x: '80%', y: '80%' }
};

export const ThermalShiftMap: React.FC<props> = memo(({ отчет, т, className }) => {
    return (
        <div className={`relative bg-slate-950 rounded-[3rem] border border-white/5 p-8 overflow-hidden aspect-square ${className}`}>
            {/* Фон - Тепловое Поле */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                {отчет.очаги.map((очаг, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full blur-[60px] transition-all duration-1000"
                        style={{
                            left: СЕТКА_ПОЗИЦИЙ[очаг.домен].x,
                            top: СЕТКА_ПОЗИЦИЙ[очаг.домен].y,
                            width: `${100 + очаг.температура}%`,
                            height: `${100 + очаг.температура}%`,
                            background: `radial-gradient(circle, ${очаг.температура > 60 ? '#ef4444' : '#6366f1'} 0%, transparent 70%)`,
                            transform: 'translate(-50%, -50%)',
                            opacity: очаг.температура / 100
                        }}
                    />
                ))}
            </div>

            <header className="relative z-10 space-y-1">
                <span className="text-[8px] font-black text-red-500 uppercase tracking-[0.4em] animate-pulse">Thermal_Load_Scan</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Карта Износа</h3>
            </header>

            <div className="relative h-full w-full flex items-center justify-center">
                {/* Очаги */}
                {отчет.очаги.map((очаг) => (
                    <div 
                        key={очаг.домен}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                        style={{ left: СЕТКА_ПОЗИЦИЙ[очаг.домен].x, top: СЕТКА_ПОЗИЦИЙ[очаг.домен].y }}
                    >
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-700
                            ${очаг.критичность ? 'bg-red-500/20 border-red-500 shadow-[0_0_20px_#ef4444]' : 'bg-slate-900 border-white/10'}`}>
                            <span className={`text-[10px] font-black ${очаг.температура > 50 ? 'text-red-400' : 'text-slate-500'}`}>
                                {очаг.температура}°
                            </span>
                        </div>
                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest text-center">
                            {т.domains[очаг.домен].substring(0,3)}
                        </span>
                        {очаг.износ > 50 && (
                            <div className="w-10 h-0.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500" style={{ width: `${очаг.износ}%` }}></div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Центр - Общий Статус */}
                <div className="relative z-10 w-24 h-24 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center shadow-2xl">
                    <span className="text-[7px] text-slate-500 uppercase font-black">CORE_TEMP</span>
                    <span className={`text-2xl font-black italic ${отчет.общаяТемпература > 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {отчет.общаяТемпература}%
                    </span>
                </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
                <div className="space-y-1">
                    <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Доминанта Износа</span>
                    <span className="text-[9px] font-black text-white uppercase italic">{т.domains[отчет.доминантаПерегрева]}</span>
                </div>
                <div className="text-right">
                    <span className="text-[7px] text-slate-600 uppercase font-mono">Art. 19.2 COMPLIANT</span>
                </div>
            </div>
        </div>
    );
});
