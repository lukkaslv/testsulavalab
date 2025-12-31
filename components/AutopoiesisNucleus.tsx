
import React, { useRef, useEffect, memo } from 'react';
import { AutopoiesisMetrics, DomainType } from '../types';

interface AutopoiesisNucleusProps {
    metrics: AutopoiesisMetrics;
    t?: any; // Marked optional and unused
    className?: string;
}

const DOMAIN_COLORS: Record<DomainType, string> = {
    foundation: '#10b981',
    agency: '#6366f1',
    money: '#f59e0b',
    social: '#a855f7',
    legacy: '#ec4899'
};

export const AutopoiesisNucleus: React.FC<AutopoiesisNucleusProps> = memo(({ metrics, className }) => {
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

            // 1. System Pulse Frequency (Self-Healing Index)
            const pulseRate = 0.01 + (metrics.selfHealingIndex / 2000);
            const nucleusRadius = 40 + Math.sin(time * (pulseRate * 100)) * 5;

            // 2. Integration Aura
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
            grad.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
            grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.05)');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(cx, cy, 120, 0, Math.PI * 2); ctx.fill();

            // 3. Draw Levers ( Щупальца )
            metrics.levers.forEach((lever, i) => {
                const angle = (i * Math.PI * 2) / metrics.levers.length - Math.PI / 2;
                const impactLen = (lever.impact / 100) * 80;
                
                const endX = cx + Math.cos(angle) * (nucleusRadius + impactLen);
                const endY = cy + Math.sin(angle) * (nucleusRadius + impactLen);

                ctx.beginPath();
                ctx.moveTo(cx + Math.cos(angle) * nucleusRadius, cy + Math.sin(angle) * nucleusRadius);
                
                const cp1x = cx + Math.cos(angle + 0.2) * (nucleusRadius + impactLen * 0.5);
                const cp1y = cy + Math.sin(angle + 0.2) * (nucleusRadius + impactLen * 0.5);
                
                ctx.quadraticCurveTo(cp1x, cp1y, endX, endY);
                ctx.strokeStyle = DOMAIN_COLORS[lever.domain] || '#fff';
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.shadowBlur = 10;
                ctx.shadowColor = DOMAIN_COLORS[lever.domain];
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Lever Label
                ctx.font = 'bold 7px monospace';
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.textAlign = 'center';
                ctx.fillText(lever.label, endX, endY > cy ? endY + 12 : endY - 8);
            });

            // 4. Central Nucleus (The Source)
            ctx.beginPath();
            ctx.arc(cx, cy, nucleusRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#020617';
            ctx.fill();
            ctx.strokeStyle = metrics.selfHealingIndex > 60 ? '#10b981' : '#6366f1';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.font = 'black 14px Inter';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${metrics.selfHealingIndex}%`, cx, cy);
            
            ctx.font = 'bold 6px monospace';
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillText('HEAL_INDEX', cx, cy + 12);

            time += 0.05;
            frame = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(frame);
    }, [metrics]);

    return (
        <div className={`relative bg-black/40 rounded-[3rem] border border-white/5 overflow-hidden ${className}`}>
            <canvas ref={canvasRef} width={300} height={300} className="w-full h-full" />
            <div className="absolute top-6 left-8 pointer-events-none">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Autopoiesis_Core_V2</span>
            </div>
            <div className="absolute bottom-6 left-8 right-8 flex justify-between pointer-events-none">
                 <div className="flex flex-col">
                    <span className="text-[7px] text-slate-500 uppercase">Potent_Delta</span>
                    <span className="text-xs font-black text-emerald-400">+{metrics.integrationPotential}%</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[7px] text-slate-500 uppercase">Jump_Ready</span>
                    <span className="text-xs font-black text-indigo-400">{metrics.phaseTransitionReadiness}%</span>
                 </div>
            </div>
        </div>
    );
});
