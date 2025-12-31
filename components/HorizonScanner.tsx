
import React, { useRef, useEffect, memo } from 'react';
import { ForecastMetrics, Translations } from '../types';

interface HorizonScannerProps {
  forecast: ForecastMetrics;
  simulatedForecast?: ForecastMetrics | null;
  t: Translations;
  className?: string;
}

export const HorizonScanner: React.FC<HorizonScannerProps> = memo(({ forecast, simulatedForecast, t, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hs = t.horizon_scanner;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const padding = 40;
    const graphW = w - padding * 2;
    const graphH = h - padding * 2;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Draw Grid (Time)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    
    // Y-Axis lines (Integrity 0-100)
    for(let i=0; i<=4; i++) {
        const y = padding + (i / 4) * graphH;
        ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(w - padding, y); ctx.stroke();
        
        ctx.fillStyle = '#64748b';
        ctx.font = '8px monospace';
        ctx.fillText(`${100 - i*25}%`, 5, y + 3);
    }

    // X-Axis lines (Months 0-6)
    for(let i=0; i<=6; i++) {
        const x = padding + (i / 6) * graphW;
        ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, h - padding); ctx.stroke();
        
        ctx.fillStyle = '#64748b';
        ctx.fillText(i === 0 ? 'NOW' : `+${i}${hs.months_label}`, x - 10, h - padding + 15);
    }
    ctx.setLineDash([]);

    // Helper to plot line
    const plotLine = (data: number[], color: string, glow: boolean = false, dashed: boolean = false) => {
        ctx.beginPath();
        data.forEach((val, i) => {
            const x = padding + (i / 6) * graphW;
            const y = padding + graphH - (val / 100) * graphH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        
        if (glow) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
        }
        if (dashed) {
            ctx.setLineDash([5, 5]);
        } else {
            ctx.setLineDash([]);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = dashed ? 2 : 3;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.setLineDash([]);

        // End dot
        const lastVal = data[data.length - 1];
        const endX = padding + graphW;
        const endY = padding + graphH - (lastVal / 100) * graphH;
        ctx.beginPath();
        ctx.arc(endX, endY, dashed ? 3 : 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    };

    // Draw Original Paths (Dimmed if simulating)
    const baseOpacity = simulatedForecast ? '40' : 'ff';
    
    // Decay Path (Red)
    plotLine(forecast.decayPath, `#ef4444${baseOpacity}`);

    // Inertial Path (Amber)
    plotLine(forecast.inertialPath, `#f59e0b${baseOpacity}`);

    // Growth Path (Green)
    plotLine(forecast.growthPath, `#10b981${baseOpacity}`, !simulatedForecast);

    // Draw Simulated Path if active
    if (simulatedForecast) {
        // We mainly care about the "Growth" potential in simulation (what if we optimize?)
        plotLine(simulatedForecast.growthPath, '#38bdf8', true, false); // Cyan for simulation
        
        // Also show inertial shift
        plotLine(simulatedForecast.inertialPath, '#fbbf24', false, true); // Dashed Amber

        // TELEOLOGICAL TARGET VISUALIZER
        if (simulatedForecast.targetIntegrity) {
            const targetY = padding + graphH - (simulatedForecast.targetIntegrity / 100) * graphH;
            const endX = padding + graphW;
            
            // Draw Target Line
            ctx.beginPath();
            ctx.moveTo(padding, targetY);
            ctx.lineTo(endX, targetY);
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)'; // Light Cyan
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw Attractor Point (The "Strange Attractor" Art 7.2)
            ctx.beginPath();
            ctx.arc(endX, targetY, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 9px monospace';
            ctx.fillText('TARGET', endX - 35, targetY - 10);
        }
    }

    // Tipping Point Indicator (Original)
    if (forecast.tippingPointMonth && !simulatedForecast) {
        const x = padding + (forecast.tippingPointMonth / 6) * graphW;
        ctx.save();
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, h - padding); ctx.stroke();
        
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 8px monospace';
        ctx.fillText('CRITICAL', x + 5, padding + 10);
        ctx.restore();
    }

  }, [forecast, simulatedForecast, t]);

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden ${className}`}>
        <header className="flex justify-between items-start mb-4">
            <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">{hs.title}</h4>
                <p className="text-[8px] text-slate-500 font-mono">{hs.subtitle}</p>
            </div>
            <div className="text-right space-y-1">
                {simulatedForecast ? (
                    <div className="flex items-center justify-end gap-2">
                        <span className="text-[7px] font-black text-cyan-400 uppercase animate-pulse">
                            {simulatedForecast.targetIntegrity ? 'TELEOLOGICAL_LINK' : 'SIMULATION_ACTIVE'}
                        </span>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-end gap-2">
                            <span className="text-[7px] font-black text-emerald-500 uppercase">{hs.path_growth}</span>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <span className="text-[7px] font-black text-amber-500 uppercase">{hs.path_inertial}</span>
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        </div>
                    </>
                )}
            </div>
        </header>

        <canvas ref={canvasRef} width={600} height={300} className="w-full h-auto object-contain" />

        <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                <span className="text-[7px] text-slate-500 uppercase block tracking-widest">{hs.momentum_label}</span>
                <div className="flex items-end gap-2">
                    <span className="text-lg font-black text-indigo-400">{simulatedForecast ? simulatedForecast.momentum : forecast.momentum}</span>
                    <div className="h-1 flex-1 bg-slate-800 rounded-full mb-1">
                        <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${simulatedForecast ? simulatedForecast.momentum : forecast.momentum}%` }}></div>
                    </div>
                </div>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                <span className="text-[7px] text-slate-500 uppercase block tracking-widest">{hs.friction_label}</span>
                <div className="flex items-end gap-2">
                    <span className="text-lg font-black text-amber-400">{simulatedForecast ? simulatedForecast.friction : forecast.friction}</span>
                    <div className="h-1 flex-1 bg-slate-800 rounded-full mb-1">
                        <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${simulatedForecast ? simulatedForecast.friction : forecast.friction}%` }}></div>
                    </div>
                </div>
            </div>
        </div>

        <p className="text-[8px] text-slate-600 mt-4 text-center italic">
            {simulatedForecast 
                ? (simulatedForecast.targetIntegrity ? "Моделирование обратной причинности: Цель определяет средства." : "Проекция на основе измененных параметров вмешательства (Art. 19.2).")
                : hs.forecast_desc
            }
        </p>
    </div>
  );
});
