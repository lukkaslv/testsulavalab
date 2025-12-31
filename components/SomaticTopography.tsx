
import React, { useMemo, memo } from 'react';
import { AnalysisResult, DomainType } from '../types';

interface SomaticTopographyProps {
    result: AnalysisResult;
    className?: string;
}

const DOMAIN_COLORS: Record<DomainType, string> = {
    foundation: '#10b981', // Emerald
    agency: '#6366f1',     // Indigo
    money: '#f59e0b',      // Amber
    social: '#a855f7',     // Purple
    legacy: '#ec4899'      // Pink
};

export const SomaticTopography: React.FC<SomaticTopographyProps> = memo(({ result, className }) => {
    // Детерминированный анализ зон напряжения
    const zones = useMemo(() => {
        const counts: Record<string, { count: number, dominantDomain: DomainType, totalWeight: number }> = {};
        
        result.history.forEach(h => {
            if (h.sensation === 's0') return; // Пропускаем "Тишину"
            
            if (!counts[h.sensation]) {
                counts[h.sensation] = { count: 0, dominantDomain: h.domain, totalWeight: 0 };
            }
            
            counts[h.sensation].count += 1;
            // Упрощенная логика веса: латентность > 2сек добавляет вес
            const weight = h.latency > 2000 ? 2 : 1;
            counts[h.sensation].totalWeight += weight;
        });

        return counts;
    }, [result]);

    // SVG пути нервных сплетений (Совпадает с BodySyncView для консистентности)
    const nerves = {
        s1: "M90,75 Q100,85 110,75 L110,85 Q100,95 90,85 Z", // Горло
        s2: "M70,100 C60,110 50,130 50,150 C50,170 150,170 150,150 C150,130 140,110 130,100 Q100,120 70,100 Z", // Грудь
        s3: "M80,180 C70,190 70,210 80,220 L120,220 C130,210 130,190 120,180 Z", // Сплетение
        s4: "M70,240 C60,260 60,300 70,320 L130,320 C140,300 140,260 130,240 Z" // Живот
    };

    const getZoneColor = (sensation: string) => {
        const data = zones[sensation];
        if (!data) return 'transparent';
        return DOMAIN_COLORS[data.dominantDomain];
    };

    const getZoneOpacity = (sensation: string) => {
        const data = zones[sensation];
        if (!data) return 0;
        // Максимальная непрозрачность при 5+ срабатываниях
        return Math.min(0.8, 0.2 + (data.count * 0.15));
    };

    return (
        <div className={`relative bg-[#020617] rounded-[3rem] border border-white/5 overflow-hidden flex items-center justify-center ${className}`}>
            <div className="absolute top-6 left-8 z-10 space-y-1">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">СОМАТИЧЕСКАЯ КАРТА</span>
                <p className="text-[7px] text-slate-500 font-mono uppercase">РАСПРЕДЕЛЕНИЕ НАПРЯЖЕНИЯ</p>
            </div>

            <svg viewBox="0 0 200 400" className="h-full w-full max-w-[200px] drop-shadow-2xl">
                <defs>
                    <filter id="heat-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Силуэт */}
                <path d="M100,30 C110,30 120,38 120,50 C120,62 110,70 100,70 C90,70 80,62 80,50 C80,38 90,30 100,30 Z" fill="#1e293b" opacity="0.3" />
                <path d="M100,30 L100,350" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                {/* Активные Зоны */}
                {(Object.keys(nerves) as Array<keyof typeof nerves>).map(key => (
                    <g key={key} filter="url(#heat-glow)">
                        <path 
                            d={nerves[key]} 
                            fill={getZoneColor(key)}
                            fillOpacity={getZoneOpacity(key)}
                            stroke={getZoneColor(key)}
                            strokeWidth={zones[key] ? 1 : 0}
                            className="transition-all duration-1000"
                        />
                    </g>
                ))}

                {/* Контур тела (абстрактный) */}
                <path d="M70,90 L50,140 L50,280 L80,350 L120,350 L150,280 L150,140 L130,90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </svg>

            {/* Легенда */}
            <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end pointer-events-none">
                <div className="space-y-1">
                    <span className="text-[6px] text-slate-500 uppercase tracking-widest block">ИНТЕНСИВНОСТЬ СИГНАЛА</span>
                    <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i <= Object.keys(zones).length ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});
