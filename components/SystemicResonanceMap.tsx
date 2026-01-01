import React, { useRef, useEffect, memo } from 'react';
import { ПараметрыРезонанса } from '../services/SystemicResonanceEngine';
import { DomainType, Translations } from '../types';

interface props {
    данные: ПараметрыРезонанса;
    т: Translations;
    className?: string;
}

const ЦВЕТА_СФЕР: Record<string, string> = {
    foundation: '#10b981',
    agency: '#6366f1',
    legacy: '#ec4899',
    money: '#f59e0b',
    social: '#a855f7'
};

export const SystemicResonanceMap: React.FC<props> = memo(({ данные, т, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let кадр: number;
        let время = 0;

        const отрисовка = () => {
            const w = canvas.width, h = canvas.height;
            const cx = w / 2, cy = h / 2;
            ctx.clearRect(0, 0, w, h);

            // 1. Системное Солнце (Центр Поля)
            const пульсСолнца = 50 + Math.sin(время * 2) * 5;
            const градиентСолнца = ctx.createRadialGradient(cx, cy, 0, cx, cy, пульсСолнца * 1.5);
            градиентСолнца.addColorStop(0, `rgba(99, 102, 241, ${0.1 + данные.индексЛояльности / 500})`);
            градиентСолнца.addColorStop(1, 'transparent');
            
            ctx.fillStyle = градиентСолнца;
            ctx.beginPath(); ctx.arc(cx, cy, пульсСолнца * 1.5, 0, Math.PI * 2); ctx.fill();

            // 2. Линии Сцепленности
            данные.узлыСцепленности.forEach((узел, i) => {
                const угол = (i * Math.PI * 2 / данные.узлыСцепленности.length) + время * 0.2;
                const дистанция = 100 + (100 - узел.сила) * 0.5;
                const ux = cx + Math.cos(угол) * дистанция;
                const uy = cy + Math.sin(угол) * дистанция;

                // Линия связи (натяжение)
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                const натяжение = данные.индексЛояльности / 100;
                const jx = (cx + ux) / 2 + Math.sin(время * 5) * (10 * натяжение);
                const jy = (cy + uy) / 2 + Math.cos(время * 5) * (10 * натяжение);
                ctx.quadraticCurveTo(jx, jy, ux, uy);
                
                ctx.strokeStyle = узел.сила > 70 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.1)';
                ctx.lineWidth = 1 + (узел.сила / 20);
                ctx.setLineDash(узел.сила > 80 ? [] : [2, 4]);
                ctx.stroke();
                ctx.setLineDash([]);

                // Узел сферы
                ctx.beginPath();
                ctx.arc(ux, uy, 6 + узел.сила / 15, 0, Math.PI * 2);
                ctx.fillStyle = ЦВЕТА_СФЕР[узел.сфера] || '#fff';
                ctx.shadowBlur = 15;
                ctx.shadowColor = ЦВЕТА_СФЕР[узел.сфера];
                ctx.fill();
                ctx.shadowBlur = 0;

                // Подпись
                ctx.font = 'bold 8px monospace';
                ctx.fillStyle = '#94a3b8';
                ctx.textAlign = 'center';
                ctx.fillText(т.domains[узел.сфера].toUpperCase(), ux, uy + 25);
            });

            // 3. Ядро Субъекта (Клиент)
            const пульсЯдра = 15 + Math.sin(время * 4) * 2;
            ctx.beginPath();
            ctx.arc(cx, cy, пульсЯдра, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#fff';
            ctx.fill();
            ctx.shadowBlur = 0;

            время += 0.02;
            кадр = requestAnimationFrame(отрисовка);
        };

        отрисовка();
        return () => cancelAnimationFrame(кадр);
    }, [данные, т]);

    return (
        <div className={`relative bg-[#020617] rounded-[3rem] border border-white/5 overflow-hidden ${className}`}>
            <div className="absolute top-6 left-8 z-10 space-y-1 pointer-events-none">
                <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">Резонанс_Поля_V1</h4>
                <p className="text-[7px] text-slate-500 font-mono uppercase">СИСТЕМНАЯ СЦЕПЛЕННОСТЬ</p>
            </div>
            <canvas ref={canvasRef} width={350} height={350} className="w-full h-full object-contain" />
            <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end pointer-events-none opacity-60">
                <div className="space-y-1">
                    <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Индекс Лояльности</span>
                    <span className="text-xl font-black text-indigo-400">{данные.индексЛояльности}%</span>
                </div>
                <div className="text-right space-y-1">
                    <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Дифференциация</span>
                    <span className="text-xl font-black text-emerald-400">{данные.уровеньДифференциации}%</span>
                </div>
            </div>
        </div>
    );
});