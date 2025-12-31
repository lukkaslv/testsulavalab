
import React, { useRef, useEffect, memo, useState } from 'react';
import { Translations, BeliefKey } from '../types';
import { WEIGHTS } from '../services/psychologyService';
import { PlatformBridge } from '../utils/helpers';

interface PatternTopologyProps {
  patterns: BeliefKey[];
  t: Translations;
  className?: string;
  onSelectPattern?: (key: BeliefKey | null) => void;
}

export const PatternTopology: React.FC<PatternTopologyProps> = memo(({ patterns, t, className, onSelectPattern }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const top = t.topology;
  
  // Store node positions for hit testing
  const nodesRef = useRef<Array<{x: number, y: number, r: number, key: BeliefKey}>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2 + 10; 
        const scale = Math.min(w, h) * 0.38;

        // Triangle Vertices (Barycentric Basis)
        const vF = { x: cx, y: cy - scale }; // Foundation (Top)
        const vA = { x: cx - scale * 0.9, y: cy + scale * 0.5 }; // Agency (Bottom Left)
        const vR = { x: cx + scale * 0.9, y: cy + scale * 0.5 }; // Resource (Bottom Right)

        // CLEAR
        ctx.clearRect(0, 0, w, h);

        // 1. DRAW ZONAL BACKGROUND (Art. 4.3)
        // Zone Foundation (Top)
        ctx.beginPath();
        ctx.moveTo(cx, cy); ctx.lineTo(vF.x, vF.y); ctx.lineTo(vA.x, vA.y); ctx.closePath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.03)'; ctx.fill();

        // Zone Agency (Left)
        ctx.beginPath();
        ctx.moveTo(cx, cy); ctx.lineTo(vA.x, vA.y); ctx.lineTo(vR.x, vR.y); ctx.closePath();
        ctx.fillStyle = 'rgba(99, 102, 241, 0.03)'; ctx.fill();

        // Zone Resource (Right)
        ctx.beginPath();
        ctx.moveTo(cx, cy); ctx.lineTo(vR.x, vR.y); ctx.lineTo(vF.x, vF.y); ctx.closePath();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.03)'; ctx.fill();

        // 2. DRAW MAIN FIELD GRID
        ctx.beginPath();
        ctx.moveTo(vF.x, vF.y); ctx.lineTo(vR.x, vR.y); ctx.lineTo(vA.x, vA.y); ctx.closePath();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Internal Grid Lines (Dashed)
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.moveTo(cx, cy); ctx.lineTo(vF.x, vF.y);
        ctx.moveTo(cx, cy); ctx.lineTo(vA.x, vA.y);
        ctx.moveTo(cx, cy); ctx.lineTo(vR.x, vR.y);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
        ctx.stroke();
        ctx.setLineDash([]);

        // 3. DRAW ANCHOR LABELS (The "Easier to Understand" Part)
        const drawAnchor = (pos: {x:number, y:number}, label: string, zone: string, color: string, align: CanvasTextAlign = 'center') => {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            
            ctx.font = 'black 10px Inter, sans-serif';
            ctx.fillStyle = color;
            ctx.textAlign = align;
            ctx.fillText(label, pos.x, align === 'center' ? pos.y - 15 : pos.y + 20);
            
            ctx.font = 'bold 7px Inter, sans-serif';
            ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
            ctx.fillText(zone, pos.x, align === 'center' ? pos.y - 30 : pos.y + 35);
        };

        drawAnchor(vF, top.anchors.foundation, top.zones.safety, '#10b981');
        drawAnchor(vA, top.anchors.agency, top.zones.power, '#6366f1', 'left');
        drawAnchor(vR, top.anchors.resource, top.zones.capacity, '#f59e0b', 'right');

        // 4. PLOT PATTERNS
        nodesRef.current = []; 

        patterns.forEach((key, i) => {
            const weights = WEIGHTS[key] || WEIGHTS.default;
            const wf = weights.f;
            const wa = weights.a;
            const wr = weights.r;
            
            // Normalize weights to 0.0 - 1.0 range for placement
            // This is a simplified barycentric projection
            const totalW = Math.abs(wf) + Math.abs(wa) + Math.abs(wr) || 1;
            const nf = Math.abs(wf) / totalW;
            const na = Math.abs(wa) / totalW;
            const nr = Math.abs(wr) / totalW;

            const x = vF.x * nf + vA.x * na + vR.x * nr;
            const y = vF.y * nf + vA.y * na + vR.y * nr;
            
            // Subtle "float" animation
            const floatX = Math.sin(time + i) * 2;
            const floatY = Math.cos(time + i * 1.2) * 2;
            
            const px = x + floatX;
            const py = y + floatY;

            const isHovered = hoveredNode === i;

            // Interactive Gravity Lines
            if (isHovered) {
                ctx.lineWidth = 0.5;
                ctx.setLineDash([2, 2]);
                ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(vF.x, vF.y); ctx.strokeStyle = '#10b981'; ctx.stroke();
                ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(vA.x, vA.y); ctx.strokeStyle = '#6366f1'; ctx.stroke();
                ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(vR.x, vR.y); ctx.strokeStyle = '#f59e0b'; ctx.stroke();
                ctx.setLineDash([]);
            }

            // Draw Node
            const impact = Math.abs(wf) + Math.abs(wa) + Math.abs(wr);
            const radius = (4 + impact) * (isHovered ? 1.4 : 1.0);
            
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            
            if (isHovered) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#fff';
                ctx.fillStyle = '#fff';
            } else {
                ctx.shadowBlur = 0;
                // Color by dominant weight
                if (Math.abs(wf) >= Math.abs(wa) && Math.abs(wf) >= Math.abs(wr)) ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
                else if (Math.abs(wa) >= Math.abs(wr)) ctx.fillStyle = 'rgba(99, 102, 241, 0.8)';
                else ctx.fillStyle = 'rgba(245, 158, 11, 0.8)';
            }
            
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Label
            if (isHovered || (patterns.length < 10 && impact > 4)) {
                ctx.font = isHovered ? 'bold 10px Inter, sans-serif' : '8px Inter, sans-serif';
                ctx.fillStyle = isHovered ? '#fff' : 'rgba(255, 255, 255, 0.5)';
                ctx.textAlign = 'center';
                const label = t.beliefs[key] ? t.beliefs[key].substring(0, 12) : key;
                ctx.fillText(label.toUpperCase(), px, py + radius + 12);
            }

            nodesRef.current.push({ x: px, y: py, r: radius + 8, key });
        });

        time += 0.025;
        animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [patterns, hoveredNode, t]);

  const handleInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) * (canvasRef.current!.width / rect.width);
      const y = (e.clientY - rect.top) * (canvasRef.current!.height / rect.height);

      const hit = nodesRef.current.findIndex(n => {
          const dx = x - n.x;
          const dy = y - n.y;
          return Math.sqrt(dx*dx + dy*dy) < n.r;
      });

      if (hit !== -1) {
          if (hit !== hoveredNode) PlatformBridge.haptic.selection();
          setHoveredNode(hit);
      } else {
          setHoveredNode(null);
      }
  };

  const handleClick = () => {
      if (hoveredNode !== null && onSelectPattern) {
          const key = nodesRef.current[hoveredNode].key;
          PlatformBridge.haptic.impact('light');
          onSelectPattern(key);
      } else if (onSelectPattern) {
          onSelectPattern(null);
      }
  };

  return (
    <div className={`relative ${className} group`}>
        <canvas 
            ref={canvasRef} 
            width={340} 
            height={340} 
            className="w-full h-full object-contain cursor-pointer active:scale-[0.99] transition-transform"
            onMouseMove={handleInteraction}
            onClick={handleClick}
            onMouseLeave={() => setHoveredNode(null)}
        />
        
        {/* Simplified Legend for Users */}
        <div className="absolute bottom-4 left-6 right-6 flex justify-between pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
            <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest max-w-[200px]">
               {top.legend}
            </p>
            <div className="flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </div>
        </div>
    </div>
  );
});
