
import React, { useRef, useEffect, memo, useState } from 'react';
import { AnalysisResult } from '../types';

interface StrangeAttractorProps {
  result: AnalysisResult;
  className?: string;
}

export const StrangeAttractor: React.FC<StrangeAttractorProps> = memo(({ result, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lyapunov, setLyapunov] = useState(0);

  // Map personality metrics to Lorenz parameters
  // Sigma (Prandtl): Fluid viscosity ~ NeuroSync (Connection speed)
  // Low Sync = High Viscosity (Sluggish)
  const sigma = 10 + ((100 - result.neuroSync) / 100) * 10; 

  // Rho (Rayleigh): Temperature diff (Driving Force) ~ Agency + Entropy
  // High Agency + High Entropy = High Energy driving chaos
  const rho = 28 + ((result.state.agency + result.state.entropy - 100) / 100) * 20;

  // Beta: Physical dimension constraint ~ Foundation
  // High Foundation = Damping
  const beta = 8/3 + (result.state.foundation / 100);

  useEffect(() => {
      // Estimated Lyapunov based on Rho (Simplified proxy for UI)
      // Real calculation requires time-series divergence analysis
      const estimatedLambda = (rho - 28) / 10; 
      setLyapunov(Number(estimatedLambda.toFixed(3)));
  }, [rho]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let x = 0.1, y = 0, z = 0;
    let points: {x: number, y: number, z: number, v: number}[] = [];
    const maxPoints = 1500; // Trail length
    const dt = 0.01;
    let frame: number;
    let angle = 0;

    const draw = () => {
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2 + 50; // Shift down slightly
        const scale = 5;
        const perspective = 300;

        // Lorenz Integration
        // dx/dt = sigma * (y - x)
        // dy/dt = x * (rho - z) - y
        // dz/dt = x * y - beta * z
        const dx = sigma * (y - x) * dt;
        const dy = (x * (rho - z) - y) * dt;
        const dz = (x * y - beta * z) * dt;
        
        x += dx;
        y += dy;
        z += dz;

        const velocity = Math.sqrt(dx*dx + dy*dy + dz*dz) / dt;

        points.push({ x, y, z, v: velocity });
        if (points.length > maxPoints) points.shift();

        // Render
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, w, h);
        
        // Background Grid (Abstract Phase Space)
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy - 50, 100, 0, Math.PI * 2);
        ctx.stroke();

        ctx.lineWidth = 1.5;
        
        // 3D Projection Rotation
        angle += 0.005;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i+1];

            // Rotate Y-axis
            const x1 = p1.x * cosA - p1.z * sinA;
            const z1 = p1.x * sinA + p1.z * cosA;
            const x2 = p2.x * cosA - p2.z * sinA;
            const z2 = p2.x * sinA + p2.z * cosA;

            // Project 3D to 2D
            const scale1 = perspective / (perspective + z1 + 60); // +60 to move away
            const scale2 = perspective / (perspective + z2 + 60);

            const screenX1 = cx + x1 * scale * scale1;
            const screenY1 = cy - p1.y * scale * scale1; // Flip Y
            const screenX2 = cx + x2 * scale * scale2;
            const screenY2 = cy - p2.y * scale * scale2;

            ctx.beginPath();
            ctx.moveTo(screenX1, screenY1);
            ctx.lineTo(screenX2, screenY2);
            
            // Color by velocity & index (fade tail)
            const alpha = i / points.length;
            const speedColor = p1.v > 30 ? `239, 68, 68` : `99, 102, 241`; // Red (Fast) vs Indigo (Slow)
            
            ctx.strokeStyle = `rgba(${speedColor}, ${alpha})`;
            ctx.stroke();
        }

        // Draw "Current State" Head
        if (points.length > 0) {
            const last = points[points.length-1];
            // Re-calculate projection for head
            const lx = last.x * cosA - last.z * sinA;
            const lz = last.x * sinA + last.z * cosA;
            const lScale = perspective / (perspective + lz + 60);
            const lScreenX = cx + lx * scale * lScale;
            const lScreenY = cy - last.y * scale * lScale;

            ctx.beginPath();
            ctx.arc(lScreenX, lScreenY, 3 * lScale, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [sigma, rho, beta]);

  const isChaotic = lyapunov > 0;

  return (
    <div className={`relative bg-slate-950 rounded-[3rem] border border-white/5 overflow-hidden ${className}`}>
        <div className="absolute top-6 left-8 z-10 space-y-1 pointer-events-none">
            <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">Strange_Attractor_v1</h4>
            <p className="text-[7px] text-slate-500 font-mono uppercase">PHASE_SPACE_TOPOLOGY</p>
        </div>

        <canvas ref={canvasRef} width={350} height={350} className="w-full h-full object-contain" />

        <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end pointer-events-none">
            <div className="space-y-1">
                <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Lyapunov_Exponent (λ)</span>
                <span className={`text-xl font-black ${isChaotic ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {lyapunov > 0 ? '+' : ''}{lyapunov}
                </span>
            </div>
            <div className="text-right space-y-1">
                <span className="text-[6px] text-slate-500 uppercase tracking-widest block">Regime</span>
                <span className={`text-[8px] font-black uppercase ${isChaotic ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isChaotic ? 'DETERMINISTIC_CHAOS' : 'STABLE_ORBIT'}
                </span>
            </div>
        </div>
        
        {/* Params Overlay */}
        <div className="absolute top-20 right-6 text-right pointer-events-none opacity-40 font-mono text-[7px] space-y-1">
             <p className="text-slate-400">σ: {sigma.toFixed(1)}</p>
             <p className="text-slate-400">ρ: {rho.toFixed(1)}</p>
             <p className="text-slate-400">β: {beta.toFixed(2)}</p>
        </div>
    </div>
  );
});
