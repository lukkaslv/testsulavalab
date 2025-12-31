
import React, { useRef, useEffect, memo, useState } from 'react';
import { Translations } from '../types';
import { PlatformBridge } from '../utils/helpers';

interface PsychoTomographyProps {
  f: number; a: number; r: number; e: number; s: number;
  t: Translations;
  className?: string;
  mode?: 'scan' | 'simulation';
}

/**
 * Genesis OS Neural MRI v12.1
 * Compliance: Art. 1.1 (Deterministic Visuals)
 */
export const PsychoTomography: React.FC<PsychoTomographyProps> = memo(({ f, a, r, e, s, t, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeLayers, setActiveLayers] = useState({ foundation: true, agency: true, neuroSync: true, entropy: true });

  const toggleLayer = (layer: keyof typeof activeLayers) => {
      PlatformBridge.haptic.selection();
      setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const valuesRef = useRef({ f, a, r, e, s, layers: activeLayers });
  useEffect(() => { valuesRef.current = { f, a, r, e, s, layers: activeLayers }; }, [f, a, r, e, s, activeLayers]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let frame: number;
    let t_val = 0;

    const draw = () => {
        const { f, a, e, s, layers } = valuesRef.current;
        const w = canvas.width, h = canvas.height;
        const cx = w / 2, cy = h / 2;

        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, w, h);
        
        // Clinical Grid
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
        ctx.lineWidth = 1;
        for(let i=0; i<w; i+=20) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,h); ctx.stroke(); }
        for(let i=0; i<h; i+=20) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(w,i); ctx.stroke(); }

        // FOUNDATION (Structure)
        if (layers.foundation) {
            const fWidth = 20 + (f / 100) * 40;
            ctx.fillStyle = f < 35 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(16, 185, 129, 0.6)';
            const segs = 10;
            for(let i=1; i<=segs; i++) {
                const isWeak = f < 40 && i > 6;
                const xOff = isWeak ? Math.sin(t_val * 10 + i) * 2 : 0;
                ctx.fillRect(cx - fWidth/2 + xOff, i * (h/12), fWidth, (h/15));
            }
        }

        // AGENCY (Energy Flow)
        if (layers.agency) {
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 + a/200})`;
            ctx.lineWidth = 2;
            const orbits = 3;
            for(let i=0; i<orbits; i++) {
                const rx = 50 + (a/100)*80 + Math.sin(t_val*2+i)*10;
                ctx.beginPath();
                ctx.ellipse(cx, cy, rx, rx*0.4, 0, 0, Math.PI*2);
                ctx.stroke();
            }
        }

        // NEUROSYNC (Signal Membrane)
        if (layers.neuroSync) {
            ctx.beginPath();
            ctx.arc(cx, cy, 140 + Math.sin(t_val*5)*3, 0, Math.PI*2);
            ctx.strokeStyle = s < 50 ? 'rgba(245, 158, 11, 0.5)' : 'rgba(56, 189, 248, 0.4)';
            ctx.setLineDash(s < 50 ? [5, 15] : []);
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // ENTROPY (Interference)
        if (layers.entropy && e > 20) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            for(let i=0; i<Math.floor(e); i++) {
                ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1);
            }
        }

        t_val += 0.03;
        frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  const tc = t.tomography_controls;

  return (
    <div className={`relative rounded-[3rem] overflow-hidden border border-white/5 bg-[#020617] shadow-2xl ${className}`}>
        <div className="absolute top-6 left-8 z-10 flex items-center gap-2 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">NEURAL_MRI_V12</span>
        </div>

        <canvas ref={canvasRef} width={400} height={400} className="w-full h-full mix-blend-screen" />
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/5">
            {(['foundation', 'agency', 'neuroSync', 'entropy'] as const).map(l => (
                <button key={l} onClick={() => toggleLayer(l)} className={`px-4 py-2 rounded-xl text-[7px] font-black uppercase transition-all ${activeLayers[l] ? 'bg-white/10 text-white' : 'text-slate-600 opacity-40'}`}>
                    {tc[`layer_${l}` as keyof typeof tc]}
                </button>
            ))}
        </div>
    </div>
  );
});
