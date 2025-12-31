
import React, { useRef, useEffect, memo, useState } from 'react';
import { GameHistoryItem, Translations, BeliefKey } from '../types';
import { PlatformBridge } from '../utils/helpers';

interface CoherenceHelixProps {
  history: GameHistoryItem[];
  t: Translations;
  neuroSync: number;
  className?: string;
}

export const CoherenceHelix: React.FC<CoherenceHelixProps> = memo(({ history, t, neuroSync, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  
  // Calculate baseline for Z-Score locally for visualization
  const latencies = history.map(h => h.latency).filter(l => l > 300);
  const mean = latencies.reduce((a, b) => a + b, 0) / (latencies.length || 1);
  const stdDev = Math.sqrt(latencies.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / (latencies.length || 1)) || 1;

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
        const cx = w / 2;
        
        ctx.clearRect(0, 0, w, h);

        // Gradient Background for Depth
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, 'rgba(2, 6, 23, 0)');
        bgGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.05)');
        bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        const nodeCount = history.length;
        const spacing = h / (Math.min(nodeCount, 20) + 2); // Show subset fits in view or scale
        const scrollOffset = Math.sin(time * 0.2) * 50; // Gentle float

        history.forEach((item, i) => {
            // Mapping Logic
            const zScore = (item.latency - mean) / stdDev;
            const isDissonant = item.sensation === 's1' || item.sensation === 's4';
            
            // Y Position
            const y = 50 + (i * spacing) + scrollOffset;
            if (y < -50 || y > h + 50) return; // Cull out of view

            // Helix Rotation
            const angle = (i * 0.5) + (time * 0.5);
            const radius = 60;
            
            // STRAND ALPHA (Conscious Intent) - Stable
            const ax = cx + Math.cos(angle) * radius;
            const aZ = Math.sin(angle); // Depth factor
            
            // STRAND BETA (Unconscious Reality) - Distorted by NeuroSync & Resistance
            // Lower NeuroSync = Larger Phase Shift
            const syncFactor = neuroSync / 100;
            const distortion = isDissonant ? 1.5 : 1.0;
            const phaseShift = Math.PI * (1 - syncFactor) + (zScore * 0.2); 
            
            const bx = cx + Math.cos(angle + Math.PI + phaseShift) * (radius * distortion);
            const bZ = Math.sin(angle + Math.PI + phaseShift);

            const alphaScale = 0.8 + (aZ + 1) * 0.2; // 0.8 to 1.2
            const betaScale = 0.8 + (bZ + 1) * 0.2;

            // DRAW CONNECTORS (Base Pairs)
            // Color based on Coherence (Z-Score + Soma)
            ctx.beginPath();
            ctx.moveTo(ax, y);
            ctx.lineTo(bx, y);
            
            if (Math.abs(zScore) > 1.5 || isDissonant) {
                // Tension / Break
                ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 * alphaScale})`; // Red
                ctx.setLineDash([2, 4]);
            } else {
                // Flow
                ctx.strokeStyle = `rgba(16, 185, 129, ${0.3 * alphaScale})`; // Green
                ctx.setLineDash([]);
            }
            ctx.lineWidth = 2 * alphaScale;
            ctx.stroke();
            ctx.setLineDash([]);

            // DRAW NODES
            // Alpha Node
            ctx.beginPath();
            ctx.arc(ax, y, 4 * alphaScale, 0, Math.PI*2);
            ctx.fillStyle = `rgba(99, 102, 241, ${alphaScale})`;
            ctx.fill();

            // Beta Node
            ctx.beginPath();
            ctx.arc(bx, y, (4 + Math.max(0, zScore)*2) * betaScale, 0, Math.PI*2);
            ctx.fillStyle = isDissonant ? `rgba(245, 158, 11, ${betaScale})` : `rgba(16, 185, 129, ${betaScale})`;
            ctx.fill();
            
            // Selection Ring
            if (selectedNode === i) {
                ctx.beginPath();
                ctx.arc(bx, y, 10 * betaScale, 0, Math.PI*2);
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });

        time += 0.02;
        frame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frame);
  }, [history, neuroSync, selectedNode]);

  const handleInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const y = (e.clientX - rect.left) * (canvasRef.current!.height / rect.height);
      const h = canvasRef.current!.height;
      const spacing = h / (Math.min(history.length, 20) + 2);
      
      const index = Math.floor((y - 50) / spacing);
      if (index >= 0 && index < history.length) {
          if (selectedNode !== index) {
              setSelectedNode(index);
              PlatformBridge.haptic.selection();
          }
      }
  };

  return (
    <div className={`relative bg-[#020617] rounded-[3rem] border border-white/5 overflow-hidden flex flex-col ${className}`}>
        <div className="absolute top-6 left-8 z-10 space-y-1 pointer-events-none">
            <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">Coherence_Helix_v1</h4>
            <p className="text-[7px] text-slate-500 font-mono uppercase">DNA_OF_RESISTANCE</p>
        </div>

        <canvas 
            ref={canvasRef} 
            width={350} 
            height={500} 
            className="w-full h-full object-contain cursor-crosshair"
            onClick={handleInteraction}
        />

        {selectedNode !== null && history[selectedNode] && (
            <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl animate-in-up shadow-2xl">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] font-black text-indigo-400 uppercase">NODE_{selectedNode + 1}</span>
                    <span className="text-[8px] font-mono text-slate-500">
                        {history[selectedNode].latency}ms
                    </span>
                </div>
                <p className="text-[10px] font-bold text-white uppercase leading-tight">
                    {t.beliefs[history[selectedNode].beliefKey as BeliefKey] || history[selectedNode].beliefKey}
                </p>
                <div className="mt-2 flex gap-2">
                    {history[selectedNode].sensation !== 's0' && (
                        <span className="text-[7px] bg-red-900/30 text-red-400 px-2 py-0.5 rounded border border-red-500/20 uppercase font-black">SOMATIC_BLOCK</span>
                    )}
                    {history[selectedNode].latency > 2500 && (
                        <span className="text-[7px] bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-black">LATENCY_SPIKE</span>
                    )}
                </div>
            </div>
        )}
    </div>
  );
});
