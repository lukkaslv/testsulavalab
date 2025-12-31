
import React, { useRef, useEffect, memo, useState } from 'react';
import { AnalysisResult, Translations, DomainType } from '../types';

interface ReliefMapProps {
  result: AnalysisResult;
  t: Translations;
  className?: string;
}

const DOMAIN_COORDS: Record<DomainType, {x: number, y: number}> = {
    foundation: { x: 0.5, y: 0.5 }, // Center anchor
    agency: { x: 0.2, y: 0.2 },
    money: { x: 0.8, y: 0.2 },
    social: { x: 0.2, y: 0.8 },
    legacy: { x: 0.8, y: 0.8 }
};

export const ReliefMap: React.FC<ReliefMapProps> = memo(({ result, t, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ruggedness, setRuggedness] = useState(0);

  const { domainProfile, state } = result;

  useEffect(() => {
      // Calculate Ruggedness (Variance in heights)
      const values = Object.values(domainProfile);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const entropyFactor = state.entropy / 20;
      setRuggedness(Math.round((max - min) + entropyFactor));
  }, [domainProfile, state.entropy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame: number;
    let time = 0;

    const gridSize = 24;
    const gridPoints: {x: number, y: number, z: number}[][] = [];

    // Initialize Grid Logic
    const calculateHeight = (gx: number, gy: number, t: number) => {
        let z = 0;
        // Inverse Distance Weighting from Domains
        (Object.keys(DOMAIN_COORDS) as DomainType[]).forEach(d => {
            const pos = DOMAIN_COORDS[d];
            const val = domainProfile[d];
            
            const dx = gx - pos.x;
            const dy = gy - pos.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Physics: High Score = Valley (Low Z), Low Score = Peak (High Z)
            // Gaussian influence
            const influence = Math.exp(-dist * 4); 
            // Invert value: 100 -> 0 (Valley), 0 -> 100 (Peak)
            const heightContribution = (100 - val) * influence;
            
            z += heightContribution;
        });

        // Entropy Noise
        const noise = Math.sin(gx * 10 + t) * Math.cos(gy * 10 + t) * (state.entropy / 5);
        
        return Math.max(0, (z / 2) + noise);
    };

    const draw = () => {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Isometric Projection Setup
        const isoX = w / 2;
        const isoY = h / 3;
        const scaleX = w / 1.5;
        const scaleY = h / 3;

        const toIso = (x: number, y: number, z: number) => {
            return {
                x: isoX + (x - y) * scaleX * 0.5,
                y: isoY + (x + y) * scaleY * 0.5 - z * 1.5
            };
        };

        // Generate Grid Frame
        for (let i = 0; i <= gridSize; i++) {
            gridPoints[i] = [];
            for (let j = 0; j <= gridSize; j++) {
                const u = i / gridSize;
                const v = j / gridSize;
                const z = calculateHeight(u, v, time);
                gridPoints[i][j] = { x: u, y: v, z };
            }
        }

        ctx.lineWidth = 1;

        // Draw Terrain
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const p1 = gridPoints[i][j];
                const p2 = gridPoints[i+1][j];
                const p3 = gridPoints[i+1][j+1];
                const p4 = gridPoints[i][j+1];

                const isoP1 = toIso(p1.x, p1.y, p1.z);
                const isoP2 = toIso(p2.x, p2.y, p2.z);
                const isoP3 = toIso(p3.x, p3.y, p3.z);
                const isoP4 = toIso(p4.x, p4.y, p4.z);

                // Color based on height (Z)
                const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;
                let fillStyle = '';
                let strokeStyle = '';

                if (avgZ > 60) { // Peak (Resistance)
                    fillStyle = `rgba(239, 68, 68, ${0.1 + avgZ/200})`; // Red
                    strokeStyle = `rgba(239, 68, 68, 0.4)`;
                } else if (avgZ < 20) { // Valley (Resource)
                    fillStyle = `rgba(16, 185, 129, ${0.1 + (20-avgZ)/100})`; // Emerald
                    strokeStyle = `rgba(16, 185, 129, 0.3)`;
                } else { // Plateau
                    fillStyle = `rgba(99, 102, 241, 0.05)`; // Indigo
                    strokeStyle = `rgba(99, 102, 241, 0.2)`;
                }

                ctx.beginPath();
                ctx.moveTo(isoP1.x, isoP1.y);
                ctx.lineTo(isoP2.x, isoP2.y);
                ctx.lineTo(isoP3.x, isoP3.y);
                ctx.lineTo(isoP4.x, isoP4.y);
                ctx.closePath();
                
                ctx.fillStyle = fillStyle;
                ctx.fill();
                ctx.strokeStyle = strokeStyle;
                ctx.stroke();
            }
        }

        // Draw Flow Particles (Gradient Descent simulation)
        // Simplified: Particles move towards lower Z
        const particleCount = 15;
        for (let k = 0; k < particleCount; k++) {
            // Deterministic pseudo-random paths
            const tOffset = time * 0.5 + k;
            let px = (Math.sin(tOffset * 0.3) + 1) / 2;
            let py = (Math.cos(tOffset * 0.2) + 1) / 2;
            
            // Sample height
            const z = calculateHeight(px, py, time);
            
            const isoP = toIso(px, py, z);
            
            ctx.beginPath();
            ctx.arc(isoP.x, isoP.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 5;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        time += 0.01;
        frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [domainProfile, state.entropy]);

  return (
    <div className={`relative bg-[#020617] rounded-[3rem] border border-white/5 overflow-hidden ${className}`}>
        <div className="absolute top-6 left-8 z-10 space-y-1 pointer-events-none">
            <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">Relief_Map_v1</h4>
            <p className="text-[7px] text-slate-500 font-mono uppercase">PSYCHIC_TOPOGRAPHY</p>
        </div>

        <canvas ref={canvasRef} width={350} height={350} className="w-full h-full object-contain" />

        <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end pointer-events-none">
            <div className="space-y-1">
                <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Ruggedness_Index</span>
                <span className={`text-xl font-black ${ruggedness > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {ruggedness}%
                </span>
            </div>
            <div className="text-right space-y-1">
                <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Terrain</span>
                <span className={`text-[8px] font-black uppercase ${ruggedness > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {ruggedness > 50 ? 'HIGH_RESISTANCE' : 'SMOOTH_FLOW'}
                </span>
            </div>
        </div>
        
        {/* Legend Overlay */}
        <div className="absolute top-20 right-6 text-right pointer-events-none opacity-60 font-mono text-[7px] space-y-1">
             <div className="flex items-center justify-end gap-1">
                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> <span className="text-slate-400">PEAK (BLOCK)</span>
             </div>
             <div className="flex items-center justify-end gap-1">
                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> <span className="text-slate-400">VALLEY (FLOW)</span>
             </div>
        </div>
    </div>
  );
});
