
import React, { useRef, useEffect, memo, useState } from 'react';
import { AnalysisResult, Translations, DomainType } from '../types';

interface TensegrityStructureProps {
  result: AnalysisResult;
  t: Translations;
  className?: string;
}

const DOMAINS: DomainType[] = ['foundation', 'agency', 'money', 'social', 'legacy'];

// Simple Physics Types
interface Point { x: number; y: number; vx: number; vy: number; pinned?: boolean }
interface Spring { a: number; b: number; len: number; k: number; type: 'strut' | 'cable' }

export const TensegrityStructure: React.FC<TensegrityStructureProps> = memo(({ result, t, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strainLevel, setStrainLevel] = useState(0);

  // Map metrics to physics parameters
  const f = result.state.foundation; // Repulsion / Strut Length
  const a = result.state.agency;     // Tension / Cable Stiffness
  const e = result.state.entropy;    // Chaos / External Force

  useEffect(() => {
      // Calculate overall systemic strain
      // Strain is high when High Agency pulls against Low Foundation (Implosion risk)
      // Or when Entropy is high destabilizing the structure
      const structuralImbalance = Math.abs(a - f);
      const strain = (structuralImbalance * 0.6) + (e * 0.4);
      setStrainLevel(Math.min(100, Math.round(strain)));
  }, [f, a, e]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame: number;
    let time = 0;

    // --- PHYSICS INIT ---
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    const points: Point[] = [];
    const springs: Spring[] = [];

    // 0. Center Node (Self)
    points.push({ x: cx, y: cy, vx: 0, vy: 0, pinned: true }); 

    // 1. Domain Nodes (Outer Ring)
    const radius = 80 + (f / 100) * 60; // Foundation dictates Volume (Space occupied)
    DOMAINS.forEach((d, i) => {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
        points.push({
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius,
            vx: 0, vy: 0
        });
    });

    // 2. Connections
    // Center to Nodes (Agency Cables)
    // High Agency = Short, Stiff cables (Pulling in)
    const cableStiffness = 0.05 + (a / 100) * 0.15;
    const cableLength = 100 - (a / 100) * 60; // High Agency shortens cables

    for (let i = 1; i <= 5; i++) {
        springs.push({ a: 0, b: i, len: cableLength, k: cableStiffness, type: 'cable' });
    }

    // Node to Node (Foundation Struts/Ring)
    // High Foundation = Rigid outer structure
    const strutStiffness = 0.01 + (f / 100) * 0.1;
    const strutLen = (radius * 2 * Math.PI) / 5; // Circumference segment

    for (let i = 1; i <= 5; i++) {
        const next = i === 5 ? 1 : i + 1;
        springs.push({ a: i, b: next, len: strutLen, k: strutStiffness, type: 'strut' });
    }

    const draw = () => {
        ctx.clearRect(0, 0, w, h);

        // --- UPDATE PHYSICS ---
        // 1. Spring Forces
        springs.forEach(s => {
            const p1 = points[s.a];
            const p2 = points[s.b];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const force = (dist - s.len) * s.k;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (!p1.pinned) { p1.vx += fx; p1.vy += fy; }
            if (!p2.pinned) { p2.vx -= fx; p2.vy -= fy; }
        });

        // 2. Entropy / Noise Forces
        // Random pushes based on Entropy level
        if (e > 10) {
            points.forEach((p, i) => {
                if (p.pinned) return;
                const noise = (e / 100) * 0.5;
                p.vx += (Math.random() - 0.5) * noise + Math.sin(time * 5 + i) * noise;
                p.vy += (Math.random() - 0.5) * noise + Math.cos(time * 5 + i) * noise;
            });
        }

        // 3. Integration & Damping
        points.forEach(p => {
            if (p.pinned) return;
            p.vx *= 0.92; // Damping
            p.vy *= 0.92;
            p.x += p.vx;
            p.y += p.vy;
        });

        // --- RENDER ---
        
        // Draw Springs
        springs.forEach(s => {
            const p1 = points[s.a];
            const p2 = points[s.b];
            
            // Calculate current tension for color
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const tensionRatio = dist / s.len; // 1.0 = resting, >1.0 = stretched

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            if (s.type === 'cable') {
                // Cables: Agency Vectors
                const isOverstretched = tensionRatio > 1.2;
                ctx.strokeStyle = isOverstretched ? '#ef4444' : '#6366f1'; // Red or Indigo
                ctx.lineWidth = 1 + (a / 100);
                if (isOverstretched) {
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#ef4444';
                } else {
                    ctx.shadowBlur = 0;
                }
            } else {
                // Struts: Foundation Perimeter
                const isBuckling = tensionRatio < 0.8;
                ctx.strokeStyle = isBuckling ? '#f59e0b' : '#10b981'; // Amber or Emerald
                ctx.lineWidth = 2 + (f / 100) * 2;
                ctx.shadowBlur = 0;
            }
            
            ctx.stroke();
        });

        // Draw Nodes
        points.forEach((p, i) => {
            if (i === 0) {
                // Center Self
                ctx.beginPath();
                ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
            } else {
                // Domain Nodes
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#020617';
                ctx.strokeStyle = '#94a3b8';
                ctx.lineWidth = 2;
                ctx.fill();
                ctx.stroke();
                
                // Labels
                const domainName = DOMAINS[i-1];
                const label = t.domains[domainName].substring(0,3).toUpperCase();
                ctx.fillStyle = '#64748b';
                ctx.font = '9px monospace';
                const lx = p.x + (p.x - cx) * 0.2; // Push label out
                const ly = p.y + (p.y - cy) * 0.2;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, lx, ly);
            }
        });

        time += 0.05;
        frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [f, a, e]);

  return (
    <div className={`relative bg-[#020617] rounded-[3rem] border border-white/5 overflow-hidden ${className}`}>
        <div className="absolute top-6 left-8 z-10 space-y-1 pointer-events-none">
            <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">Tensegrity_Matrix_v1</h4>
            <p className="text-[7px] text-slate-500 font-mono uppercase">STRUCTURAL_INTEGRITY_SIM</p>
        </div>

        <canvas ref={canvasRef} width={350} height={350} className="w-full h-full object-contain" />

        <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end pointer-events-none">
            <div className="space-y-1">
                <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Structural_Strain</span>
                <span className={`text-xl font-black ${strainLevel > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {strainLevel}%
                </span>
            </div>
            <div className="text-right space-y-1">
                <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Condition</span>
                <span className={`text-[8px] font-black uppercase ${strainLevel > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {strainLevel > 60 ? 'IMPLOSION_RISK' : strainLevel < 20 ? 'RIGID_STASIS' : 'ELASTIC_BALANCE'}
                </span>
            </div>
        </div>
    </div>
  );
});
