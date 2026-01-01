
import React, { memo } from 'react';
import { ОтчетСцепки } from '../services/RootCouplingEngine';
import { Translations, DomainType } from '../types';

interface props {
    отчет: ОтчетСцепки;
    т: Translations;
    className?: string;
}

const КООРДИНАТЫ: Record<DomainType, { x: number, y: number }> = {
    foundation: { x: 50, y: 15 },
    agency: { x: 15, y: 45 },
    money: { x: 85, y: 45 },
    social: { x: 30, y: 85 },
    legacy: { x: 70, y: 85 }
};

export const RootCouplingVisualizer: React.FC<props> = memo(({ отчет, т, className }) => {
    return (
        <div className={`relative bg-slate-950 rounded-[3rem] border border-white/5 p-8 overflow-hidden aspect-square ${className}`}>
            <header className="relative z-10 space-y-1">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">Root_Coupling_Scan</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Резонансный Узел</h3>
            </header>

            <svg viewBox="0 0 100 100" className="w-full h-full mt-4">
                {/* Силовые нити сцепки */}
                {отчет.узлы.map((узел, i) => {
                    const p1 = КООРДИНАТЫ[узел.домен1];
                    const p2 = КООРДИНАТЫ[узел.домен2];
                    const цвет = узел.тип === 'КОНФЛИКТ' ? '#ef4444' : узел.тип === 'ПАРАЗИТ' ? '#f59e0b' : '#6366f1';
                    
                    return (
                        <g key={i}>
                            <path 
                                d={`M ${p1.x} ${p1.y} Q 50 50 ${p2.x} ${p2.y}`}
                                fill="none"
                                stroke={цвет}
                                strokeWidth={1 + узел.силаСвязи / 25}
                                strokeOpacity={0.3 + узел.силаСвязи / 200}
                                className={узел.силаСвязи > 60 ? 'animate-pulse' : ''}
                            />
                            {узел.силаСвязи > 50 && (
                                <circle r="1.5" fill={цвет}>
                                    <animateMotion 
                                        path={`M ${p1.x} ${p1.y} Q 50 50 ${p2.x} ${p2.y}`} 
                                        dur={`${3 - узел.силаСвязи/40}s`} 
                                        repeatCount="indefinite" 
                                    />
                                </circle>
                            )}
                        </g>
                    );
                })}

                {/* Домены */}
                {(Object.keys(КООРДИНАТЫ) as DomainType[]).map((d) => {
                    const p = КООРДИНАТЫ[d];
                    const вГлавномУзле = отчет.главныйУзел?.includes(d);
                    
                    return (
                        <g key={d}>
                            <circle 
                                cx={p.x} cy={p.y} r="3.5" 
                                fill="#020617" 
                                stroke={вГлавномУзле ? '#fff' : '#475569'} 
                                strokeWidth="1" 
                            />
                            <text 
                                x={p.x} y={p.y + 7} 
                                textAnchor="middle" 
                                className="text-[3px] font-black fill-slate-500 uppercase tracking-tighter"
                            >
                                {т.domains[d].toUpperCase()}
                            </text>
                        </g>
                    );
                })}
            </svg>

            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
                <div className="space-y-1">
                    <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Статус Сцепки</span>
                    <span className={`text-[10px] font-black uppercase italic ${отчет.индексСцепленности > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {отчет.индексСцепленности > 50 ? 'ЖЕСТКАЯ ФИКСАЦИЯ' : 'ПЛАСТИЧНОСТЬ'}
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-[7px] text-slate-500 uppercase tracking-widest block">Индекс</span>
                    <span className="text-xl font-mono font-black text-white">{отчет.индексСцепленности}%</span>
                </div>
            </div>
        </div>
    );
});
