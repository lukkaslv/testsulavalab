
import React, { useMemo } from 'react';
import { AnalysisResult, Translations, BeliefKey } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { WEIGHTS } from '../../services/psychologyService';

interface TransparencyViewProps {
  t: Translations;
  result: AnalysisResult;
  onBack: () => void;
}

const FormulaCard = ({ label, value, formula, color }: { label: string, value: number, formula: string, color: string }) => (
    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl space-y-2 font-mono">
        <div className="flex justify-between items-center">
            <span className={`text-[9px] font-black uppercase tracking-widest ${color}`}>{label}</span>
            <span className="text-xl font-bold text-white">{value}%</span>
        </div>
        <div className="h-px bg-slate-800 w-full my-2"></div>
        <p className="text-[8px] text-slate-500 uppercase tracking-wider">{formula}</p>
    </div>
);

const ImpactRow = ({ label, weight, type }: { label: string, weight: number, type: 'f'|'a'|'r'|'e' }) => {
    if (weight === 0) return null;
    const color = weight > 0 
        ? (type === 'e' ? 'text-red-400' : 'text-emerald-400') 
        : (type === 'e' ? 'text-emerald-400' : 'text-red-400');
    
    return (
        <div className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
            <span className="text-[8px] font-mono text-slate-500 uppercase">{label}</span>
            <span className={`text-[9px] font-bold font-mono ${color}`}>
                {weight > 0 ? '+' : ''}{weight}
            </span>
        </div>
    );
};

export const TransparencyView: React.FC<TransparencyViewProps> = ({ t, result, onBack }) => {
  const tr = t.transparency;
  
  // Extract top impactful decisions
  const impactLog = useMemo(() => {
      if (!result.history) return [];
      return [...result.history]
        .map(h => {
            const w = WEIGHTS[h.beliefKey as BeliefKey] || WEIGHTS.default;
            const impactScore = Math.abs(w.f) + Math.abs(w.a) + Math.abs(w.r) + Math.abs(w.e);
            return { ...h, w, impactScore };
        })
        .sort((a, b) => b.impactScore - a.impactScore)
        .slice(0, 5);
  }, [result]);

  return (
    <div className="flex flex-col h-full bg-[#050505] text-slate-300 font-mono text-[10px] p-4 space-y-6 overflow-hidden select-none">
      <header className="flex justify-between items-center border-b border-indigo-900/30 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(99,102,241,0.2)]">∑</div>
          <div>
            <h1 className="text-xs font-black uppercase tracking-widest text-indigo-400">{tr.title}</h1>
            <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">{tr.desc}</span>
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

      <div className="flex-1 overflow-y-auto space-y-8 pr-1 custom-scrollbar">
        
        {/* SECTION 1: THE CORE FORMULA */}
        <section className="space-y-3 animate-in">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1 border-l-2 border-indigo-500">{tr.formula_label} (SIGMOID KERNEL)</h3>
            <div className="bg-black border border-slate-800 p-4 rounded-xl font-mono text-[9px] text-indigo-300 shadow-inner overflow-x-auto whitespace-nowrap">
                f(x) = 1 / (1 + e^(-k(x - x0)))
            </div>
            <p className="text-[8px] text-slate-600 leading-relaxed px-1">
                * {t.brief_explainer.intro_text}
            </p>
        </section>

        {/* SECTION 2: METRIC BREAKDOWN */}
        <section className="space-y-3 animate-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1 border-l-2 border-emerald-500">{tr.impact_label}</h3>
            <div className="grid grid-cols-2 gap-3">
                <FormulaCard 
                    label={tr.foundation} 
                    value={result.state.foundation} 
                    formula="F_new = σ(F_old + Δw)" 
                    color="text-emerald-400" 
                />
                <FormulaCard 
                    label={tr.agency} 
                    value={result.state.agency} 
                    formula="A_new = σ(A_old + Δw)" 
                    color="text-indigo-400" 
                />
                <FormulaCard 
                    label={tr.resource} 
                    value={result.state.resource} 
                    formula="R_new = σ(R_old + Δw)" 
                    color="text-amber-400" 
                />
                <FormulaCard 
                    label={tr.entropy} 
                    value={result.state.entropy} 
                    formula="E_new = E_old + |Δw|" 
                    color="text-red-400" 
                />
            </div>
        </section>

        {/* SECTION 3: HEAVY NODES (THE PROOF) */}
        <section className="space-y-4 animate-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500 pl-1 border-l-2 border-amber-500">{tr.bifurcations_title} (TOP IMPACT)</h3>
            
            <div className="space-y-3">
                {impactLog.map((log, i) => (
                    <div key={i} className="bg-slate-900/30 border border-white/5 p-4 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10 text-2xl font-black text-slate-500">{i + 1}</div>
                        
                        <div className="mb-3 pr-6">
                            <span className="text-[7px] font-black uppercase text-slate-500 tracking-widest block mb-1">
                                {t.domains[log.domain]} // NODE_{parseInt(log.nodeId) + 1}
                            </span>
                            <p className="text-[10px] text-white font-bold leading-tight">
                                {t.beliefs[log.beliefKey as string] || log.beliefKey}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 bg-black/20 p-3 rounded-lg">
                            <ImpactRow label="FND (BASE)" weight={log.w.f} type="f" />
                            <ImpactRow label="AGC (WILL)" weight={log.w.a} type="a" />
                            <ImpactRow label="RES (CAP)" weight={log.w.r} type="r" />
                            <ImpactRow label="ENT (CHAOS)" weight={log.w.e} type="e" />
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* SECTION 4: INTEGRITY HASH */}
        <section className="pt-4 border-t border-white/5 text-center space-y-2 opacity-60">
            <p className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-500">SYSTEM INTEGRITY HASH</p>
            <p className="text-[8px] font-mono text-indigo-500 break-all">{result.shareCode}</p>
        </section>

      </div>
    </div>
  );
};
