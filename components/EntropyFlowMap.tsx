
import React, { useRef, useEffect, memo } from 'react';
import { DomainType, EntropyVector } from '../types';

interface EntropyFlowMapProps {
    flux: EntropyVector[];
    className?: string;
}

const DOMAIN_POSITIONS: Record<DomainType, { x: number, y: number }> = {
    foundation: { x: 0.5, y: 0.2 },
    agency: { x: 0.2, y: 0.5 },
    money: { x: 0.8, y: 0.5 },
    social: { x: 0.3, y: 0.8 },
    legacy: { x: 0.7, y: 0.8 }
};

const DOMAIN_COLORS: Record<DomainType, string> = {
    foundation: '#10b981',
    agency: '#6366f1',
    money: '#f59e0b',
    social: '#a855f7',
    legacy: '#ec4899'
};

export const EntropyFlowMap: React.FC<EntropyFlowMapProps> = memo(({ flux, className }) => {
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
            ctx.clearRect(0, 0, w, h);

            // 1. Draw Static Nodes
            Object.entries(DOMAIN_POSITIONS).forEach(([domain, pos]) => {
                const x = pos.x * w, y = pos.y * h;
                const color = DOMAIN_COLORS[domain as DomainType];
                
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = color;
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.font = 'bold 8px monospace';
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.textAlign = 'center';
                ctx.fillText(domain.substring(0, 3).toUpperCase(), x, y - 12);
            });

            // 2. Draw Flux Vectors
            flux.forEach((vector) => {
                const start = DOMAIN_POSITIONS[vector.from];
                const end = DOMAIN_POSITIONS[vector.to];
                const x1 = start.x * w, y1 = start.y * h;
                const x2 = end.x * w, y2 = end.y * h;

                // Flux Line
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                const cpX = (x1 + x2) / 2 + Math.sin(time + vector.volume) * 20;
                const cpY = (y1 + y2) / 2 + Math.cos(time + vector.velocity) * 20;
                ctx.quadraticCurveTo(cpX, cpY, x2, y2);
                
                const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                gradient.addColorStop(0, DOMAIN_COLORS[vector.from] + '44');
                gradient.addColorStop(1, DOMAIN_COLORS[vector.to] + '88');
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1 + (vector.volume / 20);
                ctx.stroke();

                // Kinetic Particles
                const particleCount = Math.floor(vector.volume / 10) + 1;
                for (let i = 0; i < particleCount; i++) {
                    const pOffset = (time * vector.velocity * 0.5 + (i / particleCount)) % 1;
                    const px = Math.pow(1 - pOffset, 2) * x1 + 2 * (1 - pOffset) * pOffset * cpX + Math.pow(pOffset, 2) * x2;
                    const py = Math.pow(1 - pOffset, 2) * y1 + 2 * (1 - pOffset) * pOffset * cpY + Math.pow(pOffset, 2) * y2;
                    
                    ctx.beginPath();
                    ctx.arc(px, py, 2, 0, Math.PI * 2);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                }
            });

            time += 0.02;
            frame = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(frame);
    }, [flux]);

    return (
        <div className={`relative bg-black/40 rounded-[2.5rem] border border-white/5 overflow-hidden ${className}`}>
            <canvas ref={canvasRef} width={350} height={350} className="w-full h-full" />
            <div className="absolute top-6 left-8 pointer-events-none">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Entropy_Fluidity_Map</span>
            </div>
            {flux.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Система стабильна. Потоки не обнаружены.</p>
                </div>
            )}
        </div>
    );
});
