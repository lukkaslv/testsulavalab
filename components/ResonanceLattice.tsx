
import React, { useRef, useEffect, memo, useState } from 'react';
import { DomainType, LatticeMetrics, ResonanceVector, Translations } from '../types';
import { PlatformBridge } from '../utils/helpers';

interface ResonanceLatticeProps {
  lattice: LatticeMetrics;
  resonance?: ResonanceVector[];
  t: Translations;
  className?: string;
  onBondSelect?: (from: DomainType, to: DomainType) => void;
}

const PENTAGON_VERTICES: Record<DomainType, { x: number, y: number }> = {
    foundation: { x: 0, y: 1 },      
    agency: { x: -0.95, y: 0.31 },   
    money: { x: 0.95, y: 0.31 },     
    social: { x: -0.59, y: -0.81 },  
    legacy: { x: 0.59, y: -0.81 }    
};

const DOMAIN_COLORS: Record<DomainType, string> = {
    foundation: '#10b981', 
    agency: '#6366f1',     
    money: '#f59e0b',      
    social: '#a855f7',     
    legacy: '#ec4899'      
};

export const ResonanceLattice: React.FC<ResonanceLatticeProps> = memo(({ lattice, resonance = [], t, className, onBondSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bondsRef = useRef<Array<{from: DomainType, to: DomainType, x1: number, y1: number, x2: number, y2: number, w: number}>>([]);
  const [hoveredBond, setHoveredBond] = useState<string | null>(null);

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
        const cy = h / 2;
        const radius = Math.min(w, h) / 2 * 0.75;

        ctx.clearRect(0, 0, w, h);
        bondsRef.current = [];

        // 1. DRAW BONDS
        lattice.bonds.forEach(bond => {
            const start = PENTAGON_VERTICES[bond.from];
            const end = PENTAGON_VERTICES[bond.to];
            
            const x1 = cx + start.x * radius;
            const y1 = cy + start.y * radius;
            const x2 = cx + end.x * radius;
            const y2 = cy + end.y * radius;

            const isStrained = bond.status === 'STRAINED' || bond.status === 'RUPTURED';
            const tension = bond.tension / 100;
            const bondKey = `${bond.from}-${bond.to}`;
            const isHovered = hoveredBond === bondKey;
            
            ctx.beginPath();
            
            if (isStrained || isHovered) {
                const jitter = isStrained ? Math.sin(time * 20) * (tension * 2) : 0;
                ctx.moveTo(x1, y1);
                const midX = (x1 + x2) / 2 + jitter;
                const midY = (y1 + y2) / 2 + jitter;
                ctx.quadraticCurveTo(midX, midY, x2, y2);
                
                if (isHovered) {
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 4;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#fff';
                } else {
                    ctx.strokeStyle = bond.status === 'RUPTURED' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(245, 158, 11, 0.6)';
                    ctx.lineWidth = 1 + tension * 3;
                    ctx.shadowBlur = 0;
                }
            } else {
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = bond.status === 'SYNERGETIC' ? 'rgba(56, 189, 248, 0.6)' : 'rgba(148, 163, 184, 0.2)';
                ctx.lineWidth = 1 + tension;
            }
            
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Store for hit testing (simple line rect)
            bondsRef.current.push({ from: bond.from, to: bond.to, x1, y1, x2, y2, w: 20 }); // w is hit tolerance

            if (!isStrained || bond.status === 'SYNERGETIC') {
                const particlePos = (time * 0.5) % 1;
                const px = x1 + (x2 - x1) * particlePos;
                const py = y1 + (y2 - y1) * particlePos;
                
                ctx.beginPath();
                ctx.arc(px, py, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
            }
        });

        // 2. DRAW VECTORS (Secondary)
        resonance.forEach((vec) => {
            const start = PENTAGON_VERTICES[vec.from];
            const end = PENTAGON_VERTICES[vec.to];
            const x1 = cx + start.x * radius;
            const y1 = cy + start.y * radius;
            const x2 = cx + end.x * radius;
            const y2 = cy + end.y * radius;
            
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const targetX = x1 + (x2 - x1) * 0.6;
            const targetY = y1 + (y2 - y1) * 0.6;

            ctx.save();
            ctx.translate(targetX, targetY);
            ctx.rotate(angle);
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-10, -5); ctx.lineTo(-10, 5); ctx.closePath();
            ctx.fillStyle = vec.strength < 0 ? '#ef4444' : '#10b981';
            ctx.fill();
            ctx.restore();
        });

        // 3. DRAW NODES
        (Object.keys(PENTAGON_VERTICES) as DomainType[]).forEach(domain => {
            const pos = PENTAGON_VERTICES[domain];
            const x = cx + pos.x * radius;
            const y = cy + pos.y * radius;
            const nodePulse = Math.sin(time * 2 + x) * 2;
            const color = DOMAIN_COLORS[domain];
            
            ctx.beginPath();
            ctx.arc(x, y, 8 + nodePulse, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(2, 6, 23, 0.8)';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = color;
            ctx.stroke();

            ctx.font = 'bold 10px monospace';
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const labelX = cx + pos.x * (radius + 25);
            const labelY = cy + pos.y * (radius + 25);
            ctx.fillText(t.domains[domain].toUpperCase().substring(0, 3), labelX, labelY);
        });

        time += 0.02;
        animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [lattice, resonance, hoveredBond]);

  // Line segment hit test
  const distToSegment = (p: {x:number, y:number}, v: {x:number, y:number}, w: {x:number, y:number}) => {
      const l2 = (w.x - v.x)**2 + (w.y - v.y)**2;
      if (l2 === 0) return Math.sqrt((p.x - v.x)**2 + (p.y - v.y)**2);
      let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
      t = Math.max(0, Math.min(1, t));
      return Math.sqrt((p.x - (v.x + t * (w.x - v.x)))**2 + (p.y - (v.y + t * (w.y - v.y)))**2);
  };

  const handleInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) * (canvasRef.current!.width / rect.width);
      const y = (e.clientY - rect.top) * (canvasRef.current!.height / rect.height);

      const hit = bondsRef.current.find(b => distToSegment({x,y}, {x: b.x1, y: b.y1}, {x: b.x2, y: b.y2}) < b.w);

      if (hit) {
          const key = `${hit.from}-${hit.to}`;
          if (hoveredBond !== key) {
              setHoveredBond(key);
              PlatformBridge.haptic.selection();
          }
      } else {
          setHoveredBond(null);
      }
  };

  const handleClick = () => {
      if (hoveredBond && onBondSelect) {
          const [from, to] = hoveredBond.split('-');
          PlatformBridge.haptic.impact('light');
          onBondSelect(from as DomainType, to as DomainType);
      }
  };

  return (
    <div className={`relative ${className}`}>
        <canvas 
            ref={canvasRef} 
            width={320} 
            height={320} 
            className="w-full h-full object-contain cursor-pointer" 
            onMouseMove={handleInteraction}
            onClick={handleClick}
            onMouseLeave={() => setHoveredBond(null)}
        />
        <div className="absolute bottom-2 right-2 text-[7px] font-mono text-slate-500 text-right pointer-events-none">
            <p>НАЖМИТЕ НА СВЯЗЬ ДЛЯ АНАЛИЗА</p>
        </div>
    </div>
  );
});
