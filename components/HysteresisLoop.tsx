
import React, { useRef, useEffect, memo, useState } from 'react';
import { GameHistoryItem } from '../types';
import { WEIGHTS } from '../services/psychologyService';

interface HysteresisLoopProps {
  history: GameHistoryItem[];
  className?: string;
}

export const HysteresisLoop: React.FC<HysteresisLoopProps> = memo(({ history, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dissipationIndex, setDissipationIndex] = useState(0);

  // Simulation of state trajectory
  const trajectory = React.useMemo(() => {
      let currentResilience = 50; // Y: Resilience (Foundation + Agency)
      let currentLoad = 0;        // X: Stress Load (Entropy + Latency)
      
      const points: { x: number, y: number, load: number, res: number }[] = [];
      
      history.forEach(h => {
          const w = (WEIGHTS as any)[h.beliefKey] || WEIGHTS.default;
          
          // Calculate Load (Stress Input)
          // High latency + Negative Entropy impact = High Load
          const zScore = Math.max(0, (h.latency - 1500) / 1000);
          const somaticLoad = h.sensation === 's1' || h.sensation === 's4' ? 20 : 0;
          currentLoad = Math.min(100, Math.max(0, (w.e * 5) + (zScore * 10) + somaticLoad));

          // Calculate Resilience (System Response)
          // Foundation/Agency buffer the load
          const deltaRes = (w.f + w.a) * 2;
          // Hysteresis effect: Recovery is slower than Damage
          const elasticity = currentLoad > 50 ? 0.5 : 0.8; 
          currentResilience = Math.min(100, Math.max(0, currentResilience + (deltaRes * elasticity)));

          points.push({ x: currentLoad, y: currentResilience, load: currentLoad, res: currentResilience });
      });

      // Close the loop naturally for visualization if needed, or leave open to show drift
      // For hysteresis area calculation, we project back to origin
      
      return points;
  }, [history]);

  useEffect(() => {
      // Calculate Polygon Area (Shoelace Formula approximation)
      if (trajectory.length < 3) return;
      let area = 0;
      for (let i = 0; i < trajectory.length - 1; i++) {
          area += trajectory[i].x * trajectory[i+1].y - trajectory[i+1].x * trajectory[i].y;
      }
      // Normalized roughly to 0-100 scale for UI
      setDissipationIndex(Math.min(100, Math.round(Math.abs(area) / 200)));
  }, [trajectory]);

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
        const padding = 40;
        const graphW = w - padding * 2;
        const graphH = h - padding * 2;

        ctx.clearRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        // X Axis (Stress)
        ctx.beginPath(); ctx.moveTo(padding, h - padding); ctx.lineTo(w - padding, h - padding); ctx.stroke();
        // Y Axis (Resilience)
        ctx.beginPath(); ctx.moveTo(padding, h - padding); ctx.lineTo(padding, padding); ctx.stroke();

        // Labels
        ctx.fillStyle = '#64748b';
        ctx.font = '7px monospace';
        ctx.fillText('STRESS (LOAD) ->', w - 80, h - 25);
        ctx.save();
        ctx.translate(25, padding + 60);
        ctx.rotate(-Math.PI/2);
        ctx.fillText('RESILIENCE (CAPACITY) ->', 0, 0);
        ctx.restore();

        // Draw Loop
        ctx.beginPath();
        if (trajectory.length > 0) {
            const startX = padding + (trajectory[0].x / 100) * graphW;
            const startY = h - padding - (trajectory[0].y / 100) * graphH;
            ctx.moveTo(startX, startY);

            trajectory.forEach((p, i) => {
                const x = padding + (p.x / 100) * graphW;
                const y = h - padding - (p.y / 100) * graphH;
                
                // Smooth curve
                if (i > 0) {
                    const prev = trajectory[i-1];
                    const px = padding + (prev.x / 100) * graphW;
                    const py = h - padding - (prev.y / 100) * graphH;
                    const cx = (px + x) / 2;
                    const cy = (py + y) / 2;
                    ctx.quadraticCurveTo(px, py, cx, cy);
                }
            });
        }
        
        ctx.closePath();
        
        // Fill based on dissipation
        const fillAlpha = 0.1 + (Math.sin(time) * 0.05);
        ctx.fillStyle = dissipationIndex > 40 ? `rgba(239, 68, 68, ${fillAlpha})` : `rgba(99, 102, 241, ${fillAlpha})`;
        ctx.fill();

        ctx.strokeStyle = dissipationIndex > 40 ? '#f87171' : '#818cf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Animated Point
        const currentIndex = Math.floor(time * 5) % trajectory.length;
        if (trajectory[currentIndex]) {
            const p = trajectory[currentIndex];
            const px = padding + (p.x / 100) * graphW;
            const py = h - padding - (p.y / 100) * graphH;
            
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI*2);
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        time += 0.05;
        frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [trajectory, dissipationIndex]);

  return (
    <div className={`relative bg-[#020617] rounded-[3rem] border border-white/5 overflow-hidden ${className}`}>
        <div className="absolute top-6 left-8 z-10 space-y-1">
            <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">Hysteresis_Loop_v1</h4>
            <p className="text-[7px] text-slate-500 font-mono uppercase">PSYCHIC_INERTIA_SCAN</p>
        </div>

        <canvas ref={canvasRef} width={350} height={350} className="w-full h-full object-contain" />

        <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end pointer-events-none">
            <div className="space-y-1">
                <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Dissipation_Index</span>
                <span className={`text-xl font-black ${dissipationIndex > 40 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {dissipationIndex}%
                </span>
            </div>
            <div className="text-right space-y-1">
                <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Diagnosis</span>
                <span className={`text-[8px] font-black uppercase ${dissipationIndex > 40 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {dissipationIndex > 40 ? 'HIGH_VISCOSITY' : 'ELASTIC_RECOVERY'}
                </span>
            </div>
        </div>
        
        {/* Explanation Overlay */}
        <div className="absolute top-20 right-6 w-24 text-right pointer-events-none opacity-60">
             <p className="text-[6px] text-slate-400 leading-relaxed uppercase">
                Широкая петля = Энергия тратится на удержание напряжения, а не на действие.
             </p>
        </div>
    </div>
  );
});
