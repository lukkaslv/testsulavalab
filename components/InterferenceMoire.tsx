
import React, { useRef, useEffect, memo, useState } from 'react';
import { AnalysisResult } from '../types';

interface InterferenceMoireProps {
  result: AnalysisResult;
  className?: string;
}

export const InterferenceMoire: React.FC<InterferenceMoireProps> = memo(({ result, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nullificationIndex, setNullificationIndex] = useState(0);

  const { state, neuroSync } = result;
  
  // Wave A: Intent (Agency + Resource)
  const amplitudeA = (state.agency + state.resource) / 2;
  
  // Wave B: Resistance (Entropy + Lack of Foundation + Lack of Sync)
  const resistance = state.entropy + (100 - state.foundation) + (100 - neuroSync);
  const amplitudeB = Math.min(100, resistance / 2.5);

  // Phase Shift (Offset between centers)
  // Low Sync = High Offset
  const offsetDistance = (100 - neuroSync) * 1.5; 

  useEffect(() => {
      // Calculate Theoretical Nullification (Destructive Interference)
      // Simplified model: Deviation from perfect alignment costs energy
      const phaseCost = (100 - neuroSync) * 0.6;
      const entropyCost = state.entropy * 0.4;
      setNullificationIndex(Math.min(100, Math.round(phaseCost + entropyCost)));
  }, [neuroSync, state.entropy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame: number;
    let time = 0;

    const draw = () => {
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        ctx.clearRect(0, 0, w, h);
        
        // Background
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, w, h);

        ctx.lineWidth = 1.5;
        
        // Dynamic Offset based on time (Breathing)
        const breathe = Math.sin(time * 0.5) * 5;
        const currentOffset = offsetDistance + breathe;

        // Source A (Intent) - Cyan
        // Fixed Center
        const countA = 20 + Math.floor(amplitudeA / 4);
        for (let i = 0; i < countA; i++) {
            const r = (i * 8) + (time * 10) % 8;
            const alpha = Math.max(0, 1 - r / (w * 0.6));
            
            ctx.beginPath();
            ctx.arc(cx - currentOffset/2, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.6})`; // Cyan
            ctx.stroke();
        }

        // Source B (Shadow) - Magenta
        // Offset Center + Jitter from Entropy
        const countB = 20 + Math.floor(amplitudeB / 4);
        const jitter = state.entropy > 40 ? Math.sin(time * 10) * (state.entropy / 20) : 0;
        
        for (let i = 0; i < countB; i++) {
            const r = (i * 8) + (time * 10) % 8;
            const alpha = Math.max(0, 1 - r / (w * 0.6));
            
            ctx.beginPath();
            ctx.arc(cx + currentOffset/2 + jitter, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(236, 72, 153, ${alpha * 0.6})`; // Pink/Magenta
            ctx.stroke();
        }

        // Interference Nodes (Visual Sugar for "Knots")
        if (currentOffset > 20) {
            ctx.fillStyle = '#fff';
            // Find intersection points logic is complex, simulating visually
            // Draw "Hotspots" where waves might cancel
            const spotAlpha = (Math.sin(time * 2) + 1) / 2 * 0.3;
            ctx.fillStyle = `rgba(255, 255, 255, ${spotAlpha})`;
            ctx.beginPath();
            ctx.arc(cx, cy, currentOffset, 0, Math.PI * 2);
            ctx.fill();
        }

        time += 0.02;
        frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [amplitudeA, amplitudeB, offsetDistance, state.entropy]);

  return (
    <div className={`relative bg-[#020617] rounded-[3rem] border border-white/5 overflow-hidden ${className}`}>
        <div className="absolute top-6 left-8 z-10 space-y-1">
            <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">Interference_Moire_v1</h4>
            <p className="text-[7px] text-slate-500 font-mono uppercase">WAVE_FUNCTION_COLLAPSE</p>
        </div>

        <canvas ref={canvasRef} width={350} height={350} className="w-full h-full object-contain mix-blend-screen" />

        <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end pointer-events-none">
            <div className="space-y-1">
                <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Nullification_Index</span>
                <span className={`text-xl font-black ${nullificationIndex > 50 ? 'text-red-400' : 'text-indigo-400'}`}>
                    {nullificationIndex}%
                </span>
            </div>
            <div className="text-right space-y-1">
                <span className="text-[6px] text-slate-500 uppercase tracking-widest block">State</span>
                <span className={`text-[8px] font-black uppercase ${nullificationIndex > 50 ? 'text-red-400' : 'text-cyan-400'}`}>
                    {nullificationIndex > 50 ? 'DESTRUCTIVE' : 'RESONANT_FLOW'}
                </span>
            </div>
        </div>
        
        {/* Overlay Labels */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[6px] font-black text-cyan-500 uppercase -rotate-90 origin-center tracking-widest opacity-60">
            INTENT (A)
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-[6px] font-black text-pink-500 uppercase rotate-90 origin-center tracking-widest opacity-60">
            SHADOW (B)
        </div>
    </div>
  );
});
