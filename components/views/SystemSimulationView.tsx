
import React, { useState } from 'react';
import { Translations, SimulationReport, PersonaResult, JourneyAnomaly } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { SimulationService } from '../../services/simulationService';

interface SystemSimulationViewProps {
  t: Translations;
  onBack: () => void;
}

const AnomalyCard: React.FC<{ anomaly: JourneyAnomaly, type: string }> = ({ anomaly, type }) => (
    <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg space-y-1">
        <p className="text-[9px] font-bold text-red-400">{type.toUpperCase()}: {anomaly.type || 'DUPLICATE'}</p>
        <p className="text-[8px] text-slate-400 italic">{anomaly.details}</p>
        {anomaly.key && <p className="text-[8px] text-amber-400 font-mono">KEY: {anomaly.key}</p>}
        {anomaly.key1 && <p className="text-[8px] text-amber-400 font-mono">KEYS: {anomaly.key1}, {anomaly.key2} ({anomaly.similarity}%)</p>}
    </div>
);

const PersonaCard: React.FC<{ result: PersonaResult }> = ({ result }) => (
    <div className="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-lg">
        <p className="text-[9px] font-bold text-indigo-300">{result.persona}</p>
        <p className="text-[8px] text-slate-400">ARCHETYPE: <span className="text-white">{result.dominantArchetype}</span></p>
        <div className="grid grid-cols-4 gap-1 mt-2 text-[7px] font-mono text-center">
            <span className="bg-slate-800/50 p-1 rounded">F:{Math.round(result.finalState.foundation)}</span>
            <span className="bg-slate-800/50 p-1 rounded">A:{Math.round(result.finalState.agency)}</span>
            <span className="bg-slate-800/50 p-1 rounded">R:{Math.round(result.finalState.resource)}</span>
            <span className="bg-slate-800/50 p-1 rounded">E:{Math.round(result.finalState.entropy)}</span>
        </div>
    </div>
);

export const SystemSimulationView: React.FC<SystemSimulationViewProps> = ({ onBack }) => {
  const [report, setReport] = useState<SimulationReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runSimulation = () => {
    setIsRunning(true);
    setProgress(0);
    setReport(null);

    const interval = setInterval(() => {
        setProgress(p => Math.min(100, p + 5));
    }, 100);

    setTimeout(() => {
        const simReport = SimulationService.runSimulation();
        setReport(simReport);
        setIsRunning(false);
        clearInterval(interval);
        setProgress(100);
        PlatformBridge.haptic.notification('success');
    }, 2000);
  };
  
  const allAnomalies = report ? [
      ...report.pathfinder.anomalies.map((a: JourneyAnomaly) => ({...a, source: 'Pathfinder'})),
      ...report.semanticGhost.duplicates.map((d: JourneyAnomaly) => ({...d, source: 'Semantic Ghost'})),
      ...report.assetGuardian.orphans.map((o: JourneyAnomaly) => ({...o, source: 'Asset Guardian'})),
  ] : [];

  return (
    <div className="min-h-screen bg-[#020617] text-emerald-400 font-mono text-[10px] p-4 flex flex-col space-y-6 overflow-hidden">
      <header className="flex justify-between items-center border-b border-purple-900/30 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border border-purple-500/30 flex items-center justify-center text-lg font-black bg-purple-500/5 shadow-lg">🔮</div>
          <div>
            <h1 className="text-xs font-black uppercase tracking-widest text-purple-300">ПРОТОКОЛ: ОРАКУЛ</h1>
            <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">DYNAMIC SIMULATOR v1.0</span>
          </div>
        </div>
        <button onClick={onBack} className="bg-red-950/20 px-4 py-2 rounded-xl border border-red-900/30 text-red-500 font-black">ВЫХОД</button>
      </header>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
          <button 
              onClick={runSimulation} 
              disabled={isRunning}
              className="w-full py-5 bg-purple-600/10 border border-purple-500/30 text-purple-300 rounded-2xl text-[10px] font-black uppercase hover:bg-purple-600/20 transition-all disabled:opacity-50 disabled:animate-pulse"
          >
              {isRunning ? "СИМУЛЯЦИЯ..." : "ЗАПУСТИТЬ СИМУЛЯЦИЮ"}
          </button>
          
          {(isRunning || progress > 0) && (
             <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-purple-500 transition-all duration-300" style={{width: `${progress}%`}}></div>
             </div>
          )}

          {report && (
              <div className="space-y-6 animate-in">
                  <section className="space-y-3">
                      <h3 className="text-slate-500 font-black tracking-widest uppercase text-[9px]">ОБНАРУЖЕННЫЕ АНОМАЛИИ ({allAnomalies.length})</h3>
                      {allAnomalies.length > 0 ? (
                        allAnomalies.map((a: JourneyAnomaly, i: number) => <AnomalyCard key={i} anomaly={a} type={a.source || 'UNKNOWN'} />)
                      ) : (
                        <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-center text-emerald-400 text-[9px]">
                            Аномалий не обнаружено.
                        </div>
                      )}
                  </section>
                  <section className="space-y-3">
                      <h3 className="text-slate-500 font-black tracking-widest uppercase text-[9px]">ПСИХОМЕТРИЧЕСКИЙ КАЛИБРАТОР</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {report.calibrator.results.map((r: PersonaResult) => <PersonaCard key={r.persona} result={r} />)}
                      </div>
                  </section>
              </div>
          )}
      </div>
      
      <footer className="shrink-0 border-t border-purple-900/20 pt-4 text-center opacity-40">
        <p className="text-[8px] text-slate-500 tracking-[0.3em] uppercase">Genesis_Oracle_Protocol // Pre-Flight Check</p>
      </footer>
    </div>
  );
};
