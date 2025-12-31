
import React, { useRef, useEffect, memo } from 'react';
import { Translations, ArchetypeKey } from '../types';
import { RefractionVector } from '../services/refractionEngine';

interface RefractionPrismProps {
    vectors: RefractionVector[];
    currentArchetype: ArchetypeKey;
    t: Translations;
    className?: string;
}

const ARCH_COLORS: Record<string, string> = {
    THE_ARCHITECT: '#6366f1',
    THE_DRIFTER: '#94a3b8',
    THE_BURNED_HERO: '#f43f5e',
    THE_GOLDEN_PRISONER: '#f59e0b',
    THE_CHAOS_SURFER: '#ec4899',
    THE_GUARDIAN: '#10b981'
};

export const RefractionPrism: React.FC<RefractionPrismProps> = memo(({ vectors, currentArchetype, t, className }) => {
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

            // 1. Отрисовка центрального ядра (Current Identity)
            const coreRadius = 40 + Math.sin(time * 2) * 2;
            const coreColor = ARCH_COLORS[currentArchetype] || '#6366f1';

            ctx.beginPath();
            ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
            ctx.fillStyle = coreColor + '11';
            ctx.fill();
            ctx.strokeStyle = coreColor;
            ctx.lineWidth = 2;
            ctx.stroke();

            // 2. Отрисовка векторов преломления (Art. 5.1)
            vectors.forEach((v, i) => {
                const angle = (i * (Math.PI * 2 / vectors.length)) - Math.PI / 2 + (time * 0.2);
                const distance = 100 + (v.tension * 0.5);
                const vx = cx + Math.cos(angle) * distance;
                const vy = cy + Math.sin(angle) * distance;
                const targetColor = ARCH_COLORS[v.target] || '#fff';

                // Луч
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(vx, vy);
                ctx.strokeStyle = `rgba(255, 255, 255, ${v.weight / 250})`;
                ctx.lineWidth = 1 + (v.weight / 20);
                ctx.setLineDash([5, 15]);
                ctx.stroke();
                ctx.setLineDash([]);

                // Узел архетипа
                ctx.beginPath();
                ctx.arc(vx, vy, 4 + (v.weight / 15), 0, Math.PI * 2);
                ctx.fillStyle = v.isShadow ? '#fff' : targetColor;
                if (v.isShadow) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#fff';
                }
                ctx.fill();
                ctx.shadowBlur = 0;

                // Подпись
                ctx.font = 'bold 8px Inter, sans-serif';
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.textAlign = 'center';
                const label = t.archetypes[v.target]?.title.toUpperCase() || v.target;
                ctx.fillText(label, vx, vy + 20);
                ctx.fillText(`${v.weight}%`, vx, vy + 30);
            });

            // 3. Соединительная "паутина" (Art. 4.1)
            if (vectors.length > 1) {
                ctx.beginPath();
                vectors.forEach((v, i) => {
                    const angle = (i * (Math.PI * 2 / vectors.length)) - Math.PI / 2 + (time * 0.2);
                    const distance = 100 + (v.tension * 0.5);
                    const vx = cx + Math.cos(angle) * distance;
                    const vy = cy + Math.sin(angle) * distance;
                    if (i === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
                });
                ctx.closePath();
                ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            time += 0.01;
            frame = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(frame);
    }, [vectors, currentArchetype, t]);

    return (
        <div className={`relative bg-black/20 rounded-[3rem] border border-white/5 overflow-hidden ${className}`}>
            <div className="absolute top-6 left-8 pointer-events-none z-10">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Topological_Refraction_V1</span>
            </div>
            <canvas ref={canvasRef} width={350} height={350} className="w-full h-full object-contain" />
            <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end pointer-events-none opacity-40">
                <p className="text-[7px] text-slate-500 uppercase italic max-w-[150px]">
                    Линии показывают "тягу" системы к альтернативным состояниям (Art. 5).
                </p>
                <span className="text-[8px] font-mono text-white/20">Butterfly_Risk: DETECTED</span>
            </div>
        </div>
    );
});
