
import React, { useRef, useEffect, memo, useState } from 'react';
import { SystemicMetrics, Translations } from '../types';
import { PlatformBridge } from '../utils/helpers';

interface SystemicFieldProps {
  metrics: SystemicMetrics;
  t: Translations;
  className?: string;
  interactive?: boolean;
}

/**
 * Genesis OS Systemic Field v12.5 (Interactive Constellation)
 * Compliance: Art. 3.1 (Clinical Validity), Art. 19.2 (Simulation)
 */
export const SystemicField: React.FC<SystemicFieldProps> = memo(({ metrics, t, className, interactive = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Track acknowledged nodes: 0-3 (Ancestors), 4 (Ghost/Excluded)
  const [acknowledgedNodes, setAcknowledgedNodes] = useState<number[]>([]);
  const sf = t.systemic_field;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame: number;
    let time = 0;

    const render = () => {
        const { loyaltyIndex, ancestralPressure, excludedPatternKey } = metrics;
        const w = canvas.width, h = canvas.height;
        const cx = w/2, cy = h/2, radius = 120;

        ctx.clearRect(0, 0, w, h);

        // 1. Core Field (Ancestral Orbits)
        // If integration is happening, the field stabilizes (less jitter)
        const integrationFactor = acknowledgedNodes.length / 5; // 0.0 to 1.0
        const currentStability = 1 + (integrationFactor * 2);

        ctx.setLineDash([5, 10]);
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 + integrationFactor * 0.2})`;
        ctx.lineWidth = 1 + integrationFactor;
        
        ctx.beginPath(); ctx.arc(cx, cy, radius * 0.8, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, radius * 0.5, 0, Math.PI*2); ctx.stroke();
        ctx.setLineDash([]);

        // 2. Ancestral Nodes & Vectors
        const pts = 4;
        for(let i=0; i<pts; i++) {
            const angle = (i * Math.PI * 2 / pts) + time * 0.05;
            const ax = cx + Math.cos(angle) * (radius * 0.9);
            const ay = cy + Math.sin(angle) * (radius * 0.9);
            
            const isAck = acknowledgedNodes.includes(i);

            // Vector Line
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            
            // Tension Math: If acknowledged, tension drops to 0. Else use metric.
            const tension = isAck ? 0 : ancestralPressure / 100;
            const jitter = tension > 0 ? Math.sin(time * 30 + i * 10) * (3 * tension) : 0;
            
            // Curve towards ancestor
            ctx.quadraticCurveTo((cx+ax)/2 + jitter, (cy+ay)/2 + jitter, ax, ay);
            
            // Color Logic: Red (Strain) -> Blue (Flow)
            if (isAck) {
                ctx.strokeStyle = '#3b82f6'; // Flow
                ctx.lineWidth = 2;
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#3b82f6';
            } else {
                ctx.strokeStyle = tension > 0.6 ? '#ef4444' : '#6366f1'; // Strain or Normal
                ctx.lineWidth = 1 + tension * 2;
                ctx.shadowBlur = 0;
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Ancestor Node
            ctx.beginPath();
            ctx.arc(ax, ay, isAck ? 7 : 4, 0, Math.PI*2);
            ctx.fillStyle = isAck ? '#3b82f6' : tension > 0.6 ? '#ef4444' : '#6366f1';
            ctx.fill();

            // Particles flow if acknowledged (Resource Transfer)
            if (isAck) {
                const pOffset = (time * 0.5) % 1;
                const px = ax + (cx - ax) * pOffset;
                const py = ay + (cy - ay) * pOffset;
                ctx.beginPath();
                ctx.arc(px, py, 2, 0, Math.PI*2);
                ctx.fillStyle = '#fff';
                ctx.fill();
            }
        }

        // 3. Sovereign Core (The Client)
        ctx.beginPath();
        // Pulse gets calmer as more nodes are integrated
        const corePulse = 12 + Math.sin(time * (3 - integrationFactor)) * 2;
        ctx.arc(cx, cy, corePulse, 0, Math.PI*2);
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = integrationFactor * 20;
        ctx.fill();
        ctx.shadowBlur = 0;

        // 4. Excluded Node (The Ghost) - Index 4
        if (excludedPatternKey) {
            const isGhostAck = acknowledgedNodes.includes(4);
            const gx = cx + Math.cos(-time * 0.15) * 60; 
            const gy = cy + Math.sin(-time * 0.15) * 60;
            
            // Connection to Core
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(gx, gy);
            ctx.strokeStyle = isGhostAck ? '#f59e0b' : 'rgba(244, 63, 94, 0.4)';
            ctx.setLineDash(isGhostAck ? [] : [2, 4]);
            ctx.lineWidth = isGhostAck ? 2 : 1;
            ctx.stroke();
            ctx.setLineDash([]);

            // Ghost Node Body
            ctx.beginPath();
            ctx.arc(gx, gy, isGhostAck ? 8 : 10, 0, Math.PI*2);
            if (isGhostAck) {
                ctx.fillStyle = '#f59e0b'; // Gold (Integrated)
                ctx.fill();
            } else {
                ctx.strokeStyle = '#f43f5e'; // Red (Excluded)
                ctx.lineWidth = 2;
                ctx.stroke();
                // "Empty" center for excluded
                ctx.fillStyle = '#020617';
                ctx.fill();
            }
        }

        time += 0.02;
        frame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frame);
  }, [metrics, acknowledgedNodes]);

  // Hit Test Logic for Interaction
  const handleInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!interactive) return;
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = (e.clientX - rect.left) * (canvasRef.current!.width / rect.width);
      const y = (e.clientY - rect.top) * (canvasRef.current!.height / rect.height);
      const cx = canvasRef.current!.width / 2;
      const cy = canvasRef.current!.height / 2;
      const radius = 120 * 0.9; // Match render radius

      // Check Ancestors (0-3) - Approximated positions based on time is hard, 
      // so we check radial distance bands for simplicity in this version, 
      // OR we just toggle them sequentially for UX flow if precise clicking is hard on mobile.
      // Let's implement Quadrant Detection for 4 ancestors.
      
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      let targetIndex = -1;

      // Check Ghost (Inner Circle)
      if (metrics.excludedPatternKey && dist > 40 && dist < 80) {
          targetIndex = 4;
      }
      // Check Ancestors (Outer Circle)
      else if (dist > 90 && dist < 150) {
          const angle = Math.atan2(dy, dx); // -PI to PI
          // Map angle to 0-3 index approx
          // This is a "feeling" simulation, so precise hitting isn't strictly required, 
          // but let's make it responsive.
          // Simplification: Just clicking the "Field" integrates the next available node.
          // This ensures a guided experience.
          
          const unacknowledged = [0, 1, 2, 3].filter(i => !acknowledgedNodes.includes(i));
          if (unacknowledged.length > 0) {
              targetIndex = unacknowledged[0];
          }
      }

      if (targetIndex !== -1 && !acknowledgedNodes.includes(targetIndex)) {
          PlatformBridge.haptic.impact('heavy');
          setAcknowledgedNodes(prev => [...prev, targetIndex]);
      }
  };

  return (
    <div className={`relative bg-slate-950 rounded-[3rem] border border-white/5 overflow-hidden ${className}`}>
        <div className="absolute top-6 left-8 z-10 space-y-1 pointer-events-none">
            <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">{sf.title}</h4>
            <p className="text-[8px] text-slate-600 font-mono italic">
                {interactive ? "INTERACTIVE_MODE_ACTIVE" : "READ_ONLY"}
            </p>
        </div>
        
        <canvas 
            ref={canvasRef} 
            width={320} 
            height={320} 
            className={`w-full h-full object-contain ${interactive ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
            onClick={handleInteraction}
        />
        
        <div className="absolute bottom-6 left-8 right-8 flex justify-between pointer-events-none">
            <div className="flex flex-col">
                <span className="text-[7px] text-slate-500 uppercase">{sf.loyalty_label}</span>
                <span className="text-xs font-black text-indigo-400">{metrics.loyaltyIndex}%</span>
            </div>
            {interactive && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 font-bold uppercase animate-pulse opacity-60 whitespace-nowrap">
                    {sf.interaction_hint}
                </div>
            )}
            <div className="flex flex-col items-end">
                <span className="text-[7px] text-slate-500 uppercase">{sf.diff_label}</span>
                <span className="text-xs font-black text-emerald-400">{metrics.differentiationLevel}%</span>
            </div>
        </div>
    </div>
  );
});
