
import React, { useRef, useEffect, memo } from 'react';
import { Translations } from '../types';
import { AttractorMetrics } from '../services/teleologyEngine';

interface TeleologicalAttractorProps {
    metrics: AttractorMetrics;
    t: Translations;
    className?: string;
}

export const TeleologicalAttractor: React.FC<TeleologicalAttractorProps> = memo(({ metrics, t, className }) => {
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

            const { convergenceRate, isDegenerative } = metrics;
            
            // 1. Отрисовка сетки искривления (Space-Time Warp)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 0.5;
            const gridSize = 20;
            for (let x = 0; x < w; x += gridSize) {
                ctx.beginPath();
                for (let y = 0; y < h; y += 5) {
                    const dx = x - cx;
                    const dy = y - cy;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const force = (convergenceRate / 100) * (3000 / (dist + 50));
                    const offsetX = (dx / dist) * force;
                    ctx.lineTo(x - offsetX, y);
                }
                ctx.stroke();
            }

            // 2. Частицы-события (Event Horizon)
            const particles = 40;
            for (let i = 0; i < particles; i++) {
                const angle = (i * Math.PI * 2 / particles) + time * (0.5 + convergenceRate / 200);
                const baseDist = 120 - (time * 20 % 120);
                const dist = baseDist * (1 - convergenceRate / 150);
                const px = cx + Math.cos(angle) * dist;
                const py = cy + Math.sin(angle) * dist;
                
                ctx.beginPath();
                ctx.arc(px, py, 1, 0, Math.PI * 2);
                ctx.fillStyle = isDegenerative ? `rgba(239, 68, 68, ${dist / 120})` : `rgba(255, 255, 255, ${dist / 120})`;
                ctx.fill();
            }

            // 3. Сингулярность (The Attractor)
            const corePulse = 2 + Math.sin(time * 5) * 1;
            ctx.beginPath();
            ctx.arc(cx, cy, corePulse, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = isDegenerative ? '#ef4444' : '#fff';
            ctx.fill();
            ctx.shadowBlur = 0;

            time += 0.02;
            frame = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(frame);
    }, [metrics]);

    return (
        <div className={`relative bg-black rounded-[3rem] border border-white/10 overflow-hidden ${className}`}>
            <div className="absolute top-6 left-8 z-10 space-y-1">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Сканер Горизонта Событий</span>
                <p className="text-[7px] text-white font-mono uppercase">СХОЖДЕНИЕ_{metrics.convergenceRate}%</p>
            </div>
            <canvas ref={canvasRef} width={350} height={350} className="w-full h-full object-contain scale-110" />
            <div className="absolute bottom-6 left-8 right-8 text-center pointer-events-none">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    {metrics.fateDescription}
                </p>
                <span className="text-[6px] text-slate-600 uppercase tracking-[0.3em] block mt-2">Анализ Финальной Причины (Ст. 7.2)</span>
            </div>
        </div>
    );
});
