
import React, { useState, useEffect } from 'react';
import { Translations, IntegrityReport, IntegrityCategory, StructuralAnomalies, ComplexityMetrics, ConfigError } from '../../types';
import { IntegrityService } from '../../services/integrityService';

const ORGAN_ICONS: Record<string, string> = {
    NERVOUS_SYSTEM: '🧠',
    METABOLISM: '🧬',
    VOICE: '🗣️',
    IMMUNITY: '🛡️',
    STRUCTURE: '🏗️'
};

// --- BIOMORPHIC COMPONENTS ---

const PulsingNucleus = ({ score, risk, status, t }: { score: number, risk: number, status: string, t: Translations }) => {
    // Dynamic heartbeat: Higher risk = faster pulse
    const duration = Math.max(0.5, 4 - (risk / 20)); 
    const colorClass = status === 'healthy' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-red-500';
    const shadowClass = status === 'healthy' ? 'shadow-emerald-500/50' : status === 'warning' ? 'shadow-amber-500/50' : 'shadow-red-500/50';

    return (
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Ambient Field */}
            <div 
                className={`absolute inset-0 rounded-full opacity-10 ${colorClass} blur-3xl transition-all duration-1000`}
                style={{ animation: `pulse ${duration * 2}s infinite` }}
            />
            
            {/* Core Membrane */}
            <div 
                className={`relative z-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full ${colorClass} bg-opacity-10 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(0,0,0,0.5)] ${shadowClass} transition-all duration-1000`}
                style={{ animation: `pulse ${duration}s cubic-bezier(0.4, 0, 0.6, 1) infinite` }}
            >
                <div className="absolute inset-0 rounded-full border border-white/20 animate-spin-slow" style={{ animationDuration: '30s' }}></div>
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-2xl">{score}%</span>
                <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-white/60 mt-2 text-center">
                    {t.integrity_audit.dynamics_label}
                </span>
            </div>

            {/* Orbit Tracks */}
            <div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow" style={{ animationDuration: '60s' }}></div>
            <div className="absolute inset-8 border border-white/5 rounded-full animate-spin-slow" style={{ animationDuration: '45s', animationDirection: 'reverse' }}></div>
        </div>
    );
};

const SatelliteOrgan = ({ 
    category, 
    index, 
    total, 
    t,
    onClick 
}: { 
    category: IntegrityCategory, 
    index: number, 
    total: number, 
    t: Translations,
    onClick: () => void 
}) => {
    // Calculate orbital position
    const angle = (index / total) * 2 * Math.PI - (Math.PI / 2);
    // Dynamic radius based on container size is tricky in CSS, so we stick to relative but scaled
    // We use a CSS variable or predefined scale for responsiveness
    const radius = 130; // Reduced radius for better fit on mobile
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const isHealthy = category.score >= 90;
    const borderColor = isHealthy ? 'border-emerald-500/30' : 'border-red-500/50';
    const textColor = isHealthy ? 'text-emerald-400' : 'text-red-400';

    return (
        <button
            onClick={onClick}
            className={`absolute w-16 h-16 rounded-2xl border backdrop-blur-md flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl bg-slate-900/60 ${borderColor}`}
            style={{ 
                transform: `translate(${x}px, ${y}px)`,
                left: 'calc(50% - 2rem)', 
                top: 'calc(50% - 2rem)'
            }}
        >
            <span className="text-xl mb-1 filter drop-shadow-lg">{ORGAN_ICONS[category.name]}</span>
            <span className={`text-[9px] font-black ${textColor}`}>{category.score}%</span>
            {(category.errors.length > 0 || category.warnings.length > 0) && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {category.errors.length + category.warnings.length}
                </div>
            )}
        </button>
    );
};

const ComplexityReadout = ({ metrics, t }: { metrics: ComplexityMetrics, t: Translations }) => (
    <div className="absolute top-4 left-4 space-y-3 z-10 w-32">
        <div className="space-y-1">
            <div className="flex justify-between text-[7px] font-black uppercase text-purple-400 tracking-widest">
                <span>{t.integrity_audit.metrics.emergence}</span>
                <span>{metrics.emergenceIndex}%</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 transition-all duration-1000" style={{width: `${metrics.emergenceIndex}%`}}></div>
            </div>
        </div>
        <div className="space-y-1">
            <div className="flex justify-between text-[7px] font-black uppercase text-emerald-400 tracking-widest">
                <span>{t.integrity_audit.metrics.synergy}</span>
                <span>{metrics.synergyFactor}%</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{width: `${metrics.synergyFactor}%`}}></div>
            </div>
        </div>
    </div>
);

const RiskMonitor = ({ risk, t }: { risk: number, t: Translations }) => (
    <div className="absolute top-4 right-4 space-y-1 z-10 text-right">
        <span className="text-[7px] font-black uppercase text-amber-500 tracking-widest block">{t.integrity_audit.metrics.phase_risk}</span>
        <span className="text-2xl font-black text-white block leading-none">{risk}%</span>
        <div className="flex gap-0.5 justify-end">
            {Array.from({length: 10}).map((_, i) => (
                <div key={i} className={`w-1 h-3 rounded-sm ${i < (risk/10) ? 'bg-amber-500' : 'bg-slate-800'}`}></div>
            ))}
        </div>
    </div>
);

const NarrativeTerminal = ({ text, t }: { text: string, t: Translations }) => (
    <div className="mx-4 mt-0 mb-4 bg-slate-900/90 border-l-2 border-emerald-500 p-4 rounded-r-xl shadow-lg backdrop-blur-md animate-in flex-shrink-0 max-h-[150px] overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 mb-2 sticky top-0 bg-slate-900/95 pb-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-[8px] font-black uppercase text-emerald-500 tracking-[0.2em]">{t.integrity_audit.system_narrative}</span>
        </div>
        <p className="text-[10px] font-mono text-emerald-100/90 whitespace-pre-wrap leading-relaxed">
            {text}
        </p>
    </div>
);

const AnomalyList = ({ structural, labels, t }: { structural: StructuralAnomalies, labels: Record<string, string>, t: Translations }) => {
    const activeKeys = (Object.keys(structural) as Array<keyof StructuralAnomalies>).filter(k => structural[k].length > 0);
    
    if (activeKeys.length === 0) return (
        <div className="text-center p-4 opacity-50 shrink-0">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{t.integrity_audit.no_anomalies}</span>
        </div>
    );

    return (
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-4 mask-fade-sides shrink-0">
            {activeKeys.map(key => (
                <div key={key} className="flex-shrink-0 bg-slate-800/50 border border-slate-700 p-3 rounded-xl min-w-[120px]">
                    <span className="text-[7px] font-black text-indigo-400 uppercase block mb-1 tracking-wider">{labels[key] || key}</span>
                    <span className="text-lg font-black text-white block leading-none">{structural[key].length}</span>
                </div>
            ))}
        </div>
    );
};

export const SystemIntegrityView: React.FC<{ t: Translations; onBack: () => void; }> = ({ t, onBack }) => {
  const [report, setReport] = useState<IntegrityReport | null>(null);
  const [selectedOrgan, setSelectedOrgan] = useState<IntegrityCategory | null>(null);
  const iv = t.integrity_audit;

  useEffect(() => {
    const run = () => setReport(IntegrityService.runAudit(t)); // Pass t for localization
    run();
    const interval = setInterval(run, 5000); 
    return () => clearInterval(interval);
  }, [t]);

  const anomalyLabels: Record<keyof StructuralAnomalies, string> = {
      deadCode: iv.anomalies.DEAD_CODE,
      spof: iv.anomalies.SPOF,
      butterflyEffect: iv.anomalies.BUTTERFLY,
      dominoEffect: iv.anomalies.DOMINO,
      hysteresis: iv.anomalies.HYSTERESIS,
      technicalDebt: iv.anomalies.TECH_DEBT,
      coupling: iv.anomalies.COUPLING,
      conwayViolations: iv.anomalies.CONWAY,
      determinismRisk: iv.anomalies.DETERMINISM,
      circuitBreakers: iv.anomalies.CIRCUIT_BRK,
      bifurcationPoints: iv.anomalies.BIFURCATION,
      strangeAttractors: iv.anomalies.ATTRACTORS,
      stableAttractors: iv.anomalies.STABLE,
      resonanceZones: iv.anomalies.RESONANCE
  };

  if (!report) return <div className="bg-black h-full flex items-center justify-center text-emerald-500 font-mono animate-pulse uppercase">{iv.initializing}</div>;

  return (
    <div className="h-full bg-[#020617] text-slate-300 font-mono flex flex-col overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="flex justify-between items-center p-4 z-20 shrink-0 border-b border-white/5 bg-[#020617]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${report.status === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
            <div>
                <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-white leading-none">{iv.title}</h1>
                <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">{iv.version_label}</span>
            </div>
        </div>
        <button onClick={onBack} className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-950/30 px-3 py-1.5 rounded-lg border border-red-900/30 transition-all">
            {iv.exit_btn}
        </button>
      </header>

      {/* Main Viewport - FLEXBOX Layout to prevent overlap */}
      <div className="flex-1 flex flex-col relative z-10 min-h-0">
          
          {/* Top HUD Area */}
          <div className="relative h-20 shrink-0">
             <ComplexityReadout metrics={report.complexity} t={t} />
             <RiskMonitor risk={report.complexity.phaseTransitionRisk} t={t} />
          </div>

          {/* Central Organism - Flex Grow to take available space */}
          <div className="flex-1 flex items-center justify-center relative min-h-[250px] overflow-hidden">
              <div className="relative scale-[0.85] sm:scale-100 transition-transform duration-1000">
                  <PulsingNucleus 
                      score={report.overallScore} 
                      risk={report.complexity.phaseTransitionRisk} 
                      status={report.status} 
                      t={t}
                  />
                  {report.categories.map((cat: IntegrityCategory, i: number) => (
                      <SatelliteOrgan 
                          key={cat.name} 
                          category={cat} 
                          index={i} 
                          total={report.categories.length} 
                          t={t}
                          onClick={() => setSelectedOrgan(cat)}
                      />
                  ))}
              </div>
          </div>

          {/* Data Layers - Fixed at bottom */}
          <div className="shrink-0 space-y-4 pb-4 w-full">
              <NarrativeTerminal text={report.narrative} t={t} />
              <AnomalyList structural={report.structuralAnomalies} labels={anomalyLabels} t={t} />
          </div>
      </div>

      {/* Detail Modal Overlay */}
      {selectedOrgan && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative">
                  <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                      <div className="flex items-center gap-3">
                          <span className="text-3xl">{ORGAN_ICONS[selectedOrgan.name]}</span>
                          <div>
                              <h3 className="text-xs font-black text-white uppercase tracking-widest">{iv.organs[selectedOrgan.name] || selectedOrgan.name}</h3>
                              <span className={`text-[9px] font-bold ${selectedOrgan.score > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{iv.efficiency}: {selectedOrgan.score}%</span>
                          </div>
                      </div>
                      <button onClick={() => setSelectedOrgan(null)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">✕</button>
                  </div>
                  <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3 bg-slate-900/50">
                      {selectedOrgan.errors.length === 0 && selectedOrgan.warnings.length === 0 ? (
                          <div className="text-center py-10 opacity-50">
                              <span className="text-4xl grayscale">✨</span>
                              <p className="text-[9px] text-emerald-500 uppercase tracking-widest mt-4">{iv.optimal}</p>
                          </div>
                      ) : (
                          <>
                            {selectedOrgan.errors.map((e: ConfigError, i: number) => (
                                <div key={i} className="p-3 bg-red-950/20 border-l-2 border-red-500 rounded-r-lg">
                                    <span className="text-[8px] font-black text-red-400 block mb-1">[CRITICAL] {e.type}</span>
                                    <p className="text-[10px] text-slate-300 font-medium">{e.details}</p>
                                </div>
                            ))}
                            {selectedOrgan.warnings.map((w: ConfigError, i: number) => (
                                <div key={i} className="p-3 bg-amber-950/20 border-l-2 border-amber-500 rounded-r-lg">
                                    <span className="text-[8px] font-black text-amber-400 block mb-1">[WARNING] {w.type}</span>
                                    <p className="text-[10px] text-slate-300 font-medium">{w.details}</p>
                                </div>
                            ))}
                          </>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
