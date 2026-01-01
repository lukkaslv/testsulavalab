
import React, { useRef, useEffect, memo } from 'react';
import { ОтчетРитма } from '../services/ConnectionEngine';
import { Translations } from '../types';

interface props {
    отчет: ОтчетРитма;
    т: Translations;
    className?: string;
}

const ЦВЕТА: Record<string, string> = {
    foundation: '#10b981',
    agency: '#6366f1',
    money: '#f59e0b',
    social: '#a855f7',
    legacy: '#ec4899'
};

export const ConnectionRhythm: React.FC<props> = memo(({ отчет, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !отчет.волны.length) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width, h = canvas.height;
        const padding = 40;
        const drawW = w - padding * 2;
        const drawH = h - padding * 2;

        ctx.clearRect(0, 0, w, h);

        // 1. Клиническая сетка
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (i / 4) * drawH;
            ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(w - padding, y); ctx.stroke();
        }

        // 2. Линия Ритма
        ctx.beginPath();
        отчет.волны.forEach((узел, i) => {
            const x = padding + (i / (отчет.волны.length - 1)) * drawW;
            const y = padding + drawH - (узел.когерентность / 100) * drawH;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        
        const градиент = ctx.createLinearGradient(padding, 0, w - padding, 0);
        градиент.addColorStop(0, '#6366f1');
        градиент.addColorStop(0.5, '#818cf8');
        градиент.addColorStop(1, '#6366f1');
        
        ctx.strokeStyle = градиент;
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3. Узлы и Пики
        отчет.волны.forEach((узел, i) => {
            const x = padding + (i / (отчет.волны.length - 1)) * drawW;
            const y = padding + drawH - (узел.когерентность / 100) * drawH;
            
            if (узел.тревога) {
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#ef4444';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#ef4444';
                ctx.fill();
                ctx.shadowBlur = 0;
            } else if (i % 5 === 0) {
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = ЦВЕТА[узел.домен] || '#fff';
                ctx.fill();
            }
        });

        // 4. Подписи осей
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('100% КОГЕРЕНТНОСТЬ', padding, padding - 10);
        ctx.fillText('0% РАЗРЫВ', padding, h - padding + 20);
        ctx.textAlign = 'right';
        ctx.fillText('ВРЕМЯ СЕССИИ →', w - padding, h - padding + 20);

    }, [отчет]);

    return (
        <div className={`relative bg-slate-950/60 rounded-[3rem] border border-white/5 p-6 space-y-6 overflow-hidden ${className}`}>
            <header className="flex justify-between items-start">
                <div className="space-y-1">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Connection_Rhythm_Log</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Ритмограмма Связи</h3>
                </div>
                <div className="text-right">
                    <span className="text-[7px] text-slate-500 uppercase tracking-widest block">Стабильность</span>
                    <span className="text-xl font-mono font-black text-emerald-400">{отчет.средняяСтабильность}%</span>
                </div>
            </header>

            <canvas ref={canvasRef} width={600} height={300} className="w-full h-40 object-contain" />

            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-2">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] block">Анализ динамики:</span>
                <p className="text-[12px] text-slate-200 leading-relaxed font-bold italic">
                    "{отчет.вердикт}"
                </p>
                <div className="pt-2 flex justify-between items-center">
                    <span className="text-[7px] text-slate-500 uppercase font-mono">Аномалий обнаружено: {отчет.пикиДиссоциации}</span>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-[7px] text-red-500 font-black uppercase">ДИССОЦИАЦИЯ</span>
                    </div>
                </div>
            </div>
        </div>
    );
});
