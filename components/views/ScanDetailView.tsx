
import React, { useState, memo, useMemo } from 'react';
import { AnalysisResult, Translations } from '../../types';
import { SupervisorService } from '../../services/supervisorService';
import { PlatformBridge } from '../../utils/helpers';
import { RadarChart } from '../RadarChart';
import { HorizonScanner } from '../HorizonScanner';
import { ForensicTimeline } from '../ForensicTimeline';
import { ResonanceLattice } from '../ResonanceLattice';
import { FractureMap } from '../FractureMap';
import { LatticeEngine } from '../../services/latticeEngine';
import { calculateForecast } from '../../services/psychologyService';

interface ScanDetailViewProps {
  scan: AnalysisResult;
  t: Translations;
  onBack: () => void;
}

export const ScanDetailView: React.FC<ScanDetailViewProps> = memo(({ scan, t, onBack }) => {
  const [dossier, setDossier] = useState<string | null>(null);
  
  const lattice = useMemo(() => LatticeEngine.calculate(scan), [scan]);
  const forecast = useMemo(() => scan.forecast || calculateForecast(scan.state.foundation, scan.state.agency, scan.state.resource, scan.state.entropy), [scan]);

  const handleGenerateReport = async () => {
      PlatformBridge.haptic.impact('medium');
      const data = await SupervisorService.generateClinicalSupervision(scan, t);
      setDossier(data.report);
      PlatformBridge.haptic.notification('success');
  };

  const copyReport = () => {
      if (dossier) {
          navigator.clipboard.writeText(dossier);
          PlatformBridge.haptic.notification('success');
      }
  };

  return (
    <div className="h-full bg-[#020617] text-slate-300 p-5 font-mono overflow-y-auto custom-scrollbar flex flex-col space-y-6 select-none animate-in">
        <header className="flex justify-between items-center border-b border-white/5 pb-4 shrink-0 bg-[#020617] z-20">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                    <h1 className="text-sm font-black uppercase text-white tracking-widest">NEURAL_TRACE</h1>
                </div>
                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.2em]">{scan.shareCode.substring(0,12)}</p>
            </div>
            <button onClick={onBack} className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-all active:scale-95">
                ✕
            </button>
        </header>

        {/* BLUEPRINT */}
        <section className="space-y-3">
            <h3 className="text-[9px] font-black uppercase text-slate-500 tracking-widest pl-2 border-l-2 border-indigo-500">CORE_TOPOLOGY</h3>
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-4 relative">
                <RadarChart 
                    points={scan.graphPoints} 
                    shadowPoints={scan.shadowPoints} 
                    onLabelClick={() => {}} 
                    className="scale-95"
                />
            </div>
        </section>

        {/* TIMELINE */}
        <section className="space-y-3">
            <h3 className="text-[9px] font-black uppercase text-slate-500 tracking-widest pl-2 border-l-2 border-emerald-500">TEMPORAL_DYNAMICS</h3>
            <ForensicTimeline result={scan} t={t} />
        </section>

        {/* LATTICE */}
        <section className="space-y-3">
            <h3 className="text-[9px] font-black uppercase text-slate-500 tracking-widest pl-2 border-l-2 border-amber-500">STRUCTURAL_BONDS</h3>
            <ResonanceLattice lattice={lattice} t={t} className="h-64 rounded-2xl border border-white/5 bg-black/20" />
        </section>

        {/* FRACTURES */}
        <section className="space-y-3">
            <h3 className="text-[9px] font-black uppercase text-slate-500 tracking-widest pl-2 border-l-2 border-red-500">FAULT_LINES</h3>
            <FractureMap fractures={scan.fractures} t={t} />
        </section>

        {/* HORIZON */}
        <section className="space-y-3">
            <h3 className="text-[9px] font-black uppercase text-slate-500 tracking-widest pl-2 border-l-2 border-cyan-500">PREDICTIVE_MODEL</h3>
            <HorizonScanner forecast={forecast} t={t} />
        </section>

        {/* ACTIONS */}
        <div className="pt-4 space-y-4">
            {!dossier ? (
                <button 
                    onClick={handleGenerateReport}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg active:scale-[0.98] transition-all"
                >
                    GENERATE_CLINICAL_REPORT
                </button>
            ) : (
                <div className="space-y-2 animate-in">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[8px] font-black uppercase text-emerald-500">REPORT_GENERATED</span>
                        <button onClick={copyReport} className="text-[8px] font-black uppercase text-slate-400 bg-slate-900 px-3 py-1.5 rounded hover:text-white transition-colors">
                            COPY
                        </button>
                    </div>
                    <div className="bg-black/50 border border-emerald-500/20 p-4 rounded-xl h-40 overflow-y-auto custom-scrollbar">
                        <pre className="text-[8px] font-mono text-emerald-100/70 whitespace-pre-wrap leading-relaxed">
                            {dossier}
                        </pre>
                    </div>
                </div>
            )}
        </div>

        <footer className="pt-8 pb-4 text-center opacity-30">
            <p className="text-[7px] uppercase tracking-[0.4em]">Archived Session Data // Immutable</p>
        </footer>
    </div>
  );
});
