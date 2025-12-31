
import React, { memo, useState } from 'react';
import { SessionPulseNode, Translations, DomainType } from '../types';

interface SessionEKGProps {
  pulse: SessionPulseNode[];
  t: Translations;
}

const DOMAIN_COLOR_MAP: Record<DomainType, string> = {
  foundation: 'bg-emerald-500',
  agency: 'bg-blue-500',
  money: 'bg-indigo-500',
  social: 'bg-purple-500',
  legacy: 'bg-pink-500',
};

const Tooltip = ({ node }: { node: SessionPulseNode | null }) => {
    if (!node) return null;
    return (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-950 border border-slate-700 rounded-lg text-[8px] font-mono text-white w-32 shadow-2xl z-20 pointer-events-none animate-in">
            <div className="flex justify-between"><span>NODE_ID:</span><span>{node.id + 1}</span></div>
            <div className="flex justify-between"><span>TENSION:</span><span className={node.tension > 70 ? 'text-red-400' : 'text-emerald-400'}>{node.tension}%</span></div>
            <div className="flex justify-between"><span>Z-SCORE:</span><span>{node.zScore.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>DOMAIN:</span><span className="uppercase">{node.domain.substring(0,3)}</span></div>
        </div>
    );
};

export const SessionEKG: React.FC<SessionEKGProps> = memo(({ pulse, t }) => {
  const [hoveredNode, setHoveredNode] = useState<SessionPulseNode | null>(null);

  if (!pulse || pulse.length === 0) return null;

  const maxTension = Math.max(...pulse.map(p => p.tension), 100);

  // Calculate Rhythm Diagnosis
  const tensionVariance = pulse.reduce((acc, p, i, arr) => {
      if (i === 0) return 0;
      return acc + Math.abs(p.tension - arr[i-1].tension);
  }, 0) / pulse.length;

  let rhythmLabel = "STABLE_FLOW";
  let rhythmColor = "text-emerald-400";
  
  if (tensionVariance > 40) { rhythmLabel = "CARDIAC_CHAOS"; rhythmColor = "text-red-400"; }
  else if (tensionVariance < 5) { rhythmLabel = "FLATLINE_DISASSOCIATION"; rhythmColor = "text-slate-400"; }
  else if (tensionVariance > 20) { rhythmLabel = "ARRHYTHMIA_DETECTED"; rhythmColor = "text-amber-400"; }

  return (
    <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 space-y-6 shadow-xl backdrop-blur-sm">
        <header className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-lg animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    ❤
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">{t.ekg.title}</h4>
                    <p className={`text-[7px] font-mono uppercase font-bold tracking-widest ${rhythmColor}`}>
                        RHYTHM: {rhythmLabel}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <span className="text-[7px] text-slate-500 uppercase tracking-widest block">Peak_Tension</span>
                <span className="text-xl font-black text-white">{Math.round(maxTension)}%</span>
            </div>
        </header>

        <div className="relative w-full h-40 flex items-end gap-0.5 pt-4 border-b border-white/5" onMouseLeave={() => setHoveredNode(null)}>
            {/* Grid Lines */}
            <div className="absolute inset-0 border-t border-dashed border-white/5 pointer-events-none" style={{ top: '25%' }}></div>
            <div className="absolute inset-0 border-t border-dashed border-white/5 pointer-events-none" style={{ top: '50%' }}></div>
            <div className="absolute inset-0 border-t border-dashed border-white/5 pointer-events-none" style={{ top: '75%' }}></div>

            {pulse.map((node, index) => {
                const height = Math.max(5, (node.tension / maxTension) * 100);
                const isCritical = node.tension > 80;
                
                return (
                    <div
                        key={index}
                        className="flex-1 h-full flex items-end relative group cursor-crosshair"
                        onMouseEnter={() => setHoveredNode(node)}
                    >
                        <div 
                            className={`w-full rounded-t-sm transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-y-110 origin-bottom ${
                                node.isBlock || isCritical ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : DOMAIN_COLOR_MAP[node.domain]
                            } ${hoveredNode && hoveredNode.id !== node.id ? 'opacity-20' : 'opacity-70'}`}
                            style={{ height: `${height}%` }}
                        />
                    </div>
                );
            })}
            
            {/* Overlay Diagnosis Line (Visual Sugar) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-overlay" preserveAspectRatio="none">
                <polyline 
                    points={pulse.map((p, i) => `${(i / (pulse.length - 1)) * 100},${100 - (p.tension/maxTension)*100}`).join(' ')} 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            {hoveredNode && <Tooltip node={hoveredNode} />}
        </div>

        <div className="flex justify-between text-[7px] font-mono text-slate-600 uppercase tracking-widest">
            <span>T=0 (START)</span>
            <span>T=END (FINAL)</span>
        </div>
    </div>
  );
});
