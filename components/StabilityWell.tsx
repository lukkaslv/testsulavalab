import React, { useRef, useEffect, memo } from 'react';
import { StabilityMetrics } from '../services/stabilityEngine';

interface StabilityWellProps {
    metrics: StabilityMetrics;
    className?: string;
}

/**
 * ГЕНЕЗИС: Гравитационная Воронка v1.3
 * Визуализирует глубину застревания в сценарии.
 */
export const StabilityWell: React.FC<StabilityWellProps> = memo(({ metrics, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frame: number;
        let time = 0;

        const draw = () => {
            const w = canvas.width, h = canvas.height;
            const cx = w / 2, cy = h / 2;
            ctx.clearRect(0, 0, w, h);

            const { wellDepth, fluidityIndex, attractorType } = metrics;
            
            // 1. Отрисовка топографических колец
            const ringCount = 8;
            const baseRadius = 20;
            const maxRadius = 140;

            for (let i = 0; i < ringCount; i++) {
                const step = i / ringCount;
                const distortion = (fluidityIndex / 100) * 15;
                const r = baseRadius + (maxRadius - baseRadius) * step;
                const opacity = (1 - step) * (wellDepth / 150 + 0.2);

                ctx.beginPath();
                for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
                    const noise = Math.sin(angle * 4 + time + i) * distortion;
                    const x = cx + Math.cos(angle) * (r + noise);
                    const y = cy + Math.sin(angle) * (r + noise);
                    if (angle === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.strokeStyle = attractorType === 'FRAGILE' ? `rgba(239, 68, 68, ${opacity})` : `rgba(99, 102, 241, ${opacity})`;
                ctx.lineWidth = 1 + (1 - step) * 2;
                ctx.stroke();
            }

            // 2. Центральный Эго-центр
            const egoPulse = 5 + Math.sin(time * 3) * 2;
            ctx.beginPath();
            ctx.arc(cx, cy, egoPulse, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#6366f1';
            ctx.fill();
            ctx.shadowBlur = 0;

            time += 0.02;
            frame = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(frame);
    }, [metrics]);

    const statusLabels: Record<string, string> = {
        'STABLE': 'СТАБИЛЬНЫЙ_АТТРАКТОР',
        'FRAGILE': 'ХРУПКИЙ_АТТРАКТОР',
        'LOCKED': 'БЛОКИРОВАННЫЙ_АТТРАКТОР',
        'TRANSITION': 'ФАЗОВЫЙ_ПЕРЕХОД'
    };

    return (
        <div className={`relative bg-[#020617] rounded-[3rem] border border-white/5 overflow-hidden ${className}`}>
            <div className="absolute top-6 left-8 z-10 space-y-1">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Гравитационная_Воронка</span>
                <p className="text-[7px] text-slate-500 font-mono uppercase">{statusLabels[metrics.attractorType]}</p>
            </div>
            <canvas ref={canvasRef} width={350} height={350} className="w-full h-full object-contain" />
            <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end pointer-events-none opacity-40">
                <div className="space-y-1">
                    <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Потенциальная Энергия</span>
                    <div className="w-20 h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${metrics.wellDepth}%` }}></div>
                    </div>
                </div>
                <p className="text-[7px] text-slate-500 uppercase text-right max-w-[120px]">
                    Глубина воронки отражает инерцию сценария (Ст. 8.2).
                </p>
            </div>
        </div>
    );
});