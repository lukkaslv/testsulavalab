
import React, { memo } from 'react';
import { ОтчетНатяжения } from '../services/StructuralTensionEngine';
import { Translations, DomainType } from '../types';

interface props {
    отчет: ОтчетНатяжения;
    т: Translations;
    className?: string;
}

const КООРДИНАТЫ_ДОМЕНОВ: Record<DomainType, { x: number, y: number }> = {
    foundation: { x: 50, y: 15 },
    agency: { x: 15, y: 45 },
    money: { x: 85, y: 45 },
    social: { x: 30, y: 85 },
    legacy: { x: 70, y: 85 }
};

export const StructuralTensionMap: React.FC<props> = memo(({ отчет, т, className }) => {
    return (
        <div className={`relative bg-slate-950 rounded-[3rem] border border-white/5 p-8 overflow-hidden aspect-square ${className}`}>
            <header className="relative z-10 space-y-1">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">Structural_Strain_Scan</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Решетка Натяжения</h3>
            </header>

            <svg viewBox="0 0 100 100" className="w-full h-full mt-4">
                {/* Линии Натяжения */}
                {отчет.связи.map((связь, i) => {
                    const p1 = КООРДИНАТЫ_ДОМЕНОВ[связь.от];
                    const p2 = КООРДИНАТЫ_ДОМЕНОВ[связь.к];
                    const цвет = связь.статус === 'РАЗРЫВ' ? '#ef4444' : связь.статус === 'НАТЯЖЕНИЕ' ? '#f59e0b' : '#6366f1';
                    const толщина = 0.5 + (связь.сила / 50);
                    
                    return (
                        <g key={i}>
                            <line 
                                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} 
                                stroke={цвет} 
                                strokeWidth={толщина}
                                strokeOpacity={0.2 + (связь.напряжение / 150)}
                                className={связь.напряжение > 50 ? 'animate-pulse' : ''}
                            />
                            {связь.напряжение > 60 && (
                                <circle cx={(p1.x + p2.x)/2} cy={(p1.y + p2.y)/2} r="1.5" fill="#ef4444">
                                    <animate attributeName="r" values="1;2;1" dur="1s" repeatCount="indefinite" />
                                </circle>
                            )}
                        </g>
                    );
                })}

                {/* Узлы Доменов */}
                {(Object.keys(КООРДИНАТЫ_ДОМЕНОВ) as DomainType[]).map((d) => {
                    const p = КООРДИНАТЫ_ДОМЕНОВ[d];
                    const являетсяДоминантой = отчет.доминантаДеформации === d;
                    
                    return (
                        <g key={d}>
                            <circle 
                                cx={p.x} cy={p.y} r="3" 
                                fill="#020617" 
                                stroke={являетсяДоминантой ? '#ef4444' : '#6366f1'} 
                                strokeWidth="1" 
                            />
                            <text 
                                x={p.x} y={p.y + 6} 
                                textAnchor="middle" 
                                className="text-[3px] font-black fill-slate-500 uppercase tracking-tighter"
                            >
                                {т.domains[d].substring(0,3)}
                            </text>
                        </g>
                    );
                })}
            </svg>

            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
                <div className="space-y-1">
                    <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Центр Деформации</span>
                    <span className="text-[9px] font-black text-red-400 uppercase italic">{т.domains[отчет.доминантаДеформации]}</span>
                </div>
                <div className="text-right">
                    <span className="text-[7px] text-slate-500 uppercase tracking-widest block">Сцепление</span>
                    <span className="text-xl font-mono font-black text-white">{отчет.индексСцепления}%</span>
                </div>
            </div>
        </div>
    );
});
