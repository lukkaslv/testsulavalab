
import React, { useMemo } from 'react';
import { AnalysisResult, Translations, DomainType } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { RadarChart } from '../RadarChart';

interface CompareViewProps {
  scanA: AnalysisResult; // Baseline (Older)
  scanB: AnalysisResult; // Current (Newer)
  t: Translations;
  onBack: () => void;
}

const DeltaCard = ({ label, oldVal, newVal, inverse = false }: { label: string, oldVal: number, newVal: number, inverse?: boolean }) => {
    const delta = newVal - oldVal;
    const isZero = delta === 0;
    const isPositive = delta > 0;
    
    // For Entropy, positive delta is usually "bad" (red), unless inverse logic applies
    // Default: Growth (Positive) = Green. 
    // Inverse (Entropy): Growth = Red.
    
    let color = 'text-slate-500';
    if (!isZero) {
        if (inverse) {
            color = isPositive ? 'text-red-400' : 'text-emerald-400';
        } else {
            color = isPositive ? 'text-emerald-400' : 'text-amber-400';
        }
    }

    return (
        <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[7px] font-black uppercase text-slate-500 tracking-widest mb-1">{label}</span>
            <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-slate-300">{newVal}</span>
                <span className={`text-[9px] font-mono font-black ${color}`}>
                    {isPositive ? '+' : ''}{delta}
                </span>
            </div>
        </div>
    );
};

export const CompareView: React.FC<CompareViewProps> = ({ scanA, scanB, t, onBack }) => {
  const comp = t.comparison;

  // Ensure graph points are available or calculate them
  const getPoints = (scan: AnalysisResult) => {
      if (scan.graphPoints && scan.graphPoints.length > 0) return scan.graphPoints;
      // Fallback calculation if graphPoints missing (legacy data)
      const keys: DomainType[] = ['foundation', 'agency', 'social', 'legacy', 'money'];
      const profile = scan.domainProfile || { foundation: scan.state.foundation, agency: scan.state.agency, money: scan.state.resource, social: 50, legacy: 50 };
      const count = keys.length;
      const center = 50;
      const radiusScale = 0.45;
      return keys.map((key, i) => {
        const value = profile[key] || 50;
        const normalizedValue = value / 100;
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
        const r = normalizedValue * (100 * radiusScale);
        const x = center + Math.cos(angle) * r;
        const y = center + Math.sin(angle) * r;
        return { x, y, label: key };
    });
  };

  const pointsA = useMemo(() => getPoints(scanA), [scanA]);
  const pointsB = useMemo(() => getPoints(scanB), [scanB]);

  const dateA = new Date(scanA.createdAt).toLocaleDateString();
  const dateB = new Date(scanB.createdAt).toLocaleDateString();

  const integrityDelta = scanB.integrity - scanA.integrity;
  const entropyDelta = scanB.entropyScore - scanA.entropyScore;

  const vectorLabel = useMemo(() => {
      if (integrityDelta > 5 && entropyDelta < -5) return comp.vector_crystallization;
      if (integrityDelta < -5 && entropyDelta > 5) return comp.vector_decay;
      if (Math.abs(integrityDelta) < 3 && Math.abs(entropyDelta) < 3) return comp.vector_stagnation;
      if (scanB.state.agency > scanA.state.agency + 10) return comp.vector_mobilization;
      return comp.vector_drift;
  }, [integrityDelta, entropyDelta, scanA, scanB, comp]);

  return (
    <div className="flex flex-col h-full bg-[#030712] text-slate-300 font-mono text-[10px] p-4 space-y-6 overflow-hidden select-none">
      <header className="flex justify-between items-center border-b border-indigo-900/30 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(99,102,241,0.2)]">Δ</div>
          <div>
            <h1 className="text-xs font-black uppercase tracking-widest text-indigo-400">{comp.title}</h1>
            <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">{dateA} vs {dateB}</span>
          </div>
        </div>
        <button 
            onClick={() => {
                onBack();
                PlatformBridge.haptic.impact('light');
            }}
            className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-slate-500 font-black uppercase text-[8px] tracking-widest hover:text-white transition-all active:scale-95"
        >
          {t.global.back}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
          
          {/* 1. VISUAL OVERLAY */}
          <div className="bg-slate-900/30 border border-white/5 p-4 rounded-[2rem] relative">
              <div className="absolute top-4 left-4 flex gap-2">
                  <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full border border-slate-500"></div>
                      <span className="text-[7px] text-slate-500 uppercase">BASELINE</span>
                  </div>
                  <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <span className="text-[7px] text-indigo-400 uppercase font-bold">CURRENT</span>
                  </div>
              </div>
              <RadarChart 
                  points={pointsB} 
                  secondaryPoints={pointsA} 
                  onLabelClick={() => {}} 
                  className="scale-90"
              />
          </div>

          {/* 2. VECTOR ANALYSIS */}
          <div className="bg-indigo-950/20 border border-indigo-500/30 p-5 rounded-2xl flex items-center justify-between">
              <div>
                  <span className="text-[8px] font-black uppercase text-indigo-500 tracking-widest block mb-1">{comp.evolution_vector}</span>
                  <span className="text-sm font-bold text-white uppercase tracking-tight">{vectorLabel}</span>
              </div>
              <div className="text-right">
                  <span className={`text-xl font-black ${integrityDelta >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {integrityDelta > 0 ? '+' : ''}{integrityDelta}%
                  </span>
                  <span className="text-[7px] font-black uppercase text-slate-500 tracking-widest block">Integrity Shift</span>
              </div>
          </div>

          {/* 3. METRIC DELTAS */}
          <div className="grid grid-cols-4 gap-2">
              <DeltaCard label="FND" oldVal={scanA.state.foundation} newVal={scanB.state.foundation} />
              <DeltaCard label="AGC" oldVal={scanA.state.agency} newVal={scanB.state.agency} />
              <DeltaCard label="RES" oldVal={scanA.state.resource} newVal={scanB.state.resource} />
              <DeltaCard label="ENT" oldVal={scanA.state.entropy} newVal={scanB.state.entropy} inverse />
          </div>

          {/* 4. ARCHETYPE SHIFT */}
          {scanA.archetypeKey !== scanB.archetypeKey && (
              <div className="p-4 bg-slate-800/40 rounded-xl border border-dashed border-slate-700 flex items-center gap-4 animate-in">
                  <div className="flex-1 text-center opacity-50">
                      <span className="text-[7px] uppercase block mb-1">WAS</span>
                      <span className="text-[9px] font-bold">{t.archetypes[scanA.archetypeKey]?.title}</span>
                  </div>
                  <span className="text-lg text-indigo-500">➜</span>
                  <div className="flex-1 text-center">
                      <span className="text-[7px] uppercase block mb-1 text-indigo-400">BECAME</span>
                      <span className="text-[9px] font-bold text-white">{t.archetypes[scanB.archetypeKey]?.title}</span>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};
