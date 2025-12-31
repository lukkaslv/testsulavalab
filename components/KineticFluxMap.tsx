
import React, { useRef, useEffect, memo } from 'react';
import { DomainType, EntropyFluxVector, Translations } from '../types';

interface KineticFluxMapProps {
  flux: EntropyFluxVector[];
  t: Translations;
  className?: string;
}

const DOMAIN_POSITIONS: Record<DomainType, { x: number, y: number }> = {
    foundation: { x: 0.5, y: 0.15 },
    agency: { x: 0.15, y: 0.45 },
    money: { x: 0.85, y: 0.45 },
    social: { x: 0.3, y: 0.85 },
    legacy: { x: 0.7, y: 0.85 }
};

const DOMAIN_COLORS: Record<DomainType, string> = {
    foundation: '#10b981', // Emerald
    agency: '#6366f1',     // Indigo
    money: '#f59e0b',      // Amber
    social: '#a855f7',     // Purple
    legacy: '#ec4899'      // Pink
};

export const KineticFluxMap: React.FC<KineticFluxMapProps> = memo(({ flux, t, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame: number;
    let time = 0;

    const render = () => {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // 1. Draw static nodes (Nodes of Self)
        Object.entries(DOMAIN_POSITIONS).forEach(([domain, pos]) => {
            const dx = pos.x * w;
            const dy = pos.y * h;
            const color = DOMAIN_COLORS[domain as DomainType];

            ctx.beginPath();
            ctx.arc(dx, dy, 6, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            
            ctx.font = 'bold 8px monospace';
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.textAlign = 'center';
            ctx.fillText(t.domains[domain as DomainType].toUpperCase().substring(0,3), dx, dy - 12);
        });

        // 2. Draw Flux Lines and Particles
        flux.forEach(vector => {
            const start = DOMAIN_POSITIONS[vector.from];
            const end = DOMAIN_POSITIONS[vector.to];
            const x1 = start.x * w, y1 = start.y * h;
            const x2 = end.x * w, y2 = end.y * h;

            // Gradient path
            const grad = ctx.createLinearGradient(x1, y1, x2, y2);
            grad.addColorStop(0, DOMAIN_COLORS[vector.from] + '22');
            grad.addColorStop(1, DOMAIN_COLORS[vector.to] + '44');

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Animated Particles (Deterministic based on time and intensity)
            const particleCount = Math.floor(vector.intensity / 5) + 1;
            for (let i = 0; i < particleCount; i++) {
                const offset = (time * vector.velocity + (i / particleCount)) % 1;
                const px = x1 + (x2 - x1) * offset;
                const py = y1 + (y2 - y1) * offset;

                ctx.beginPath();
                ctx.arc(px, py, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
            }
        });

        time += 0.01;
        frame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frame);
  }, [flux, t]);

  return (
    <div className={`relative bg-black/40 rounded-[3rem] border border-white/5 overflow-hidden ${className}`}>
        <div className="absolute top-6 left-8 z-10 space-y-1 pointer-events-none">
            <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">FLUX_DYNAMICS_V1</h4>
            <p className="text-[8px] text-slate-500 font-mono italic">Energy_Transfer_Map</p>
        </div>
        <canvas ref={canvasRef} width={400} height={400} className="w-full h-full object-contain" />
        <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end pointer-events-none">
            <p className="text-[7px] text-slate-600 uppercase italic max-w-[200px]">
                Частицы показывают перенос энтропийного давления между блоками психики.
            </p>
            <span className="text-[8px] font-mono text-indigo-500/50">Art. 6.1 Compliance</span>
        </div>
    </div>
  );
});
