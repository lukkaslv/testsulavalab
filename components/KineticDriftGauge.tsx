
import React, { memo } from 'react';
import { ОтчетДрейфа } from '../services/KineticDriftEngine';
import { Translations } from '../types';

interface props {
    отчет: ОтчетДрейфа;
    т: Translations;
    className?: string;
}

export const KineticDriftGauge: React.FC<props> = memo(({ отчет, т, className }) => {
    // Расчет угла стрелки: Слева (Деградация) -> Центр (Статика) -> Справа (Стабилизация)
    const угол = отчет.направление === 'СТАТИКА' ? 0 
               : отчет.направление === 'СТАБИЛИЗАЦИЯ' ? (отчет.скорость / 100) * 90 
               : -(отчет.скорость / 100) * 90;

    return (
        <div className={`relative bg-slate-950 rounded-[3rem] border border-white/5 p-8 overflow-hidden aspect-square flex flex-col items-center justify-center ${className}`}>
            <header className="absolute top-8 left-8 z-10 space-y-1">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">Kinetic_Vector_Audit</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Кинетический Дрейф</h3>
            </header>

            {/* Шкала полукругом */}
            <div className="relative w-64 h-32 mt-12 overflow-hidden">
                <div className="absolute inset-0 border-[12px] border-slate-900 rounded-t-full"></div>
                <div className="absolute inset-0 border-[1px] border-white/10 rounded-t-full border-b-0"></div>
                
                {/* Цветные зоны */}
                <div className="absolute left-0 bottom-0 w-1/3 h-full bg-red-500/10 rounded-tl-full blur-xl"></div>
                <div className="absolute right-0 bottom-0 w-1/3 h-full bg-emerald-500/10 rounded-tr-full blur-xl"></div>

                {/* Стрелка */}
                <div 
                    className="absolute bottom-0 left-1/2 w-1 h-32 bg-gradient-to-t from-indigo-500 to-white origin-bottom transition-all duration-[2000ms] cubic-bezier(0.34, 1.56, 0.64, 1)"
                    style={{ transform: `translateX(-50%) rotate(${угол}deg)` }}
                >
                    <div className="w-3 h-3 bg-white rounded-full absolute -top-1 -left-1 shadow-[0_0_15px_#fff]"></div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-3 w-full text-center">
                <div className="space-y-1">
                    <span className="text-[7px] text-red-500 uppercase font-black tracking-tighter">ДЕГРАДАЦИЯ</span>
                </div>
                <div className="space-y-1">
                    <span className="text-[7px] text-slate-500 uppercase font-black tracking-tighter">СТАТИКА</span>
                </div>
                <div className="space-y-1">
                    <span className="text-[7px] text-emerald-500 uppercase font-black tracking-tighter">СТАБИЛИЗАЦИЯ</span>
                </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 w-full">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[7px] text-slate-500 uppercase font-black block">Скорость Дрейфа</span>
                    <span className="text-xl font-mono font-black text-indigo-400">{отчет.скорость}%</span>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-1 text-right">
                    <span className="text-[7px] text-slate-500 uppercase font-black block">Активная Сфера</span>
                    <span className="text-[10px] font-black text-white uppercase truncate">{т.domains[отчет.активныйДомен]}</span>
                </div>
            </div>

            <div className="absolute bottom-6 text-center px-8 pointer-events-none">
                 <p className="text-[9px] text-slate-400 font-medium italic opacity-60">
                    Направление стрелки показывает, становится ли система более целостной в процессе сессии (Ст. 5.1).
                 </p>
            </div>
        </div>
    );
});
