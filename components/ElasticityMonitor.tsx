
import React, { useRef, useEffect, memo } from 'react';
import { ОтчетУпругости } from '../services/ElasticityEngine';
import { Translations } from '../types';

interface props {
    отчет: ОтчетУпругости;
    т: Translations;
    className?: string;
}

export const ElasticityMonitor: React.FC<props> = memo(({ отчет, т, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !отчет.график.length) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width, h = canvas.height;
        const padding = 30;
        const drawW = w - padding * 2;
        const drawH = h - padding * 2;

        ctx.clearRect(0, 0, w, h);

        // 1. Отрисовка зон "Затопления"
        ctx.fillStyle = 'rgba(239, 68, 68, 0.05)';
        ctx.fillRect(padding, padding + drawH * 0.7, drawW, drawH * 0.3);

        // 2. Линия Напряжения (фоновая)
        ctx.beginPath();
        ctx.setLineDash([2, 4]);
        отчет.график.forEach((п, i) => {
            const x = padding + (i / (отчет.график.length - 1)) * drawW;
            const y = padding + drawH - (п.напряжение / 100) * drawH;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.stroke();
        ctx.setLineDash([]);

        // 3. Линия Упругости (основная)
        ctx.beginPath();
        отчет.график.forEach((п, i) => {
            const x = padding + (i / (отчет.график.length - 1)) * drawW;
            const y = padding + drawH - (п.остаток / 100) * drawH;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#ef4444');
        grad.addColorStop(0.5, '#6366f1');
        grad.addColorStop(1, '#10b981');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.stroke();

        // 4. Метки
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 8px monospace';
        ctx.fillText('АФФЕКТ', padding, padding);
        ctx.fillText('ПОТОК', padding, h - padding + 15);

    }, [отчет]);

    return (
        <div className={`bg-slate-950/40 border border-white/5 rounded-[3rem] p-6 space-y-6 shadow-2xl relative overflow-hidden ${className}`}>
            <header className="flex justify-between items-center">
                <div className="space-y-1">
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.4em]">Elasticity_Recovery_Scan</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Упругость Системы</h3>
                </div>
                <div className="text-right">
                    <span className="text-[7px] text-slate-500 uppercase tracking-widest block">Индекс Возврата</span>
                    <span className={`text-xl font-mono font-black ${отчет.индексУпругости > 60 ? 'text-emerald-400' : 'text-red-500'}`}>
                        {отчет.индексУпругости}%
                    </span>
                </div>
            </header>

            <canvas ref={canvasRef} width={400} height={200} className="w-full h-32 object-contain" />

            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-3">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] block">Прогноз Контейнера:</span>
                <p className="text-[12px] text-slate-200 leading-relaxed font-bold italic">
                    "{отчет.вердикт}"
                </p>
                <div className="flex justify-between pt-2 border-t border-white/5">
                    <span className="text-[7px] text-slate-600 uppercase font-mono tracking-tighter">Период затухания: {отчет.времяЗатухания} узлов</span>
                    <span className={`text-[7px] font-black uppercase ${отчет.индексУпругости > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {отчет.индексУпругости > 70 ? 'ВЫСОКАЯ АДАПТИВНОСТЬ' : 'РИГИДНОСТЬ ЗАЩИТ'}
                    </span>
                </div>
            </div>
        </div>
    );
});
