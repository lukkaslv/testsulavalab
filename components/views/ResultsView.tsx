
import React, { useState, memo, useMemo } from 'react';
import { AnalysisResult, Translations } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { BioSignature } from '../BioSignature';
import { RadarChart } from '../RadarChart';
import { PsychoTomography } from '../PsychoTomography';
import { KineticFluxMap } from '../KineticFluxMap';
import { ClinicalSynthesisView } from './ClinicalSynthesisView';
import { RefractionPrism } from '../RefractionPrism';
import { StabilityWell } from '../StabilityWell';
import { ShadowReveal } from '../ShadowReveal';
import { TeleologicalAttractor } from '../TeleologicalAttractor';
import { SovereigntyVector } from '../SovereigntyVector';
import { ResonanceLattice } from '../ResonanceLattice';
import { SystemicField } from '../SystemicField';
import { AutopoiesisNucleus } from '../AutopoiesisNucleus';
import { BifurcationTree } from '../BifurcationTree';
import { SystemicSimulator } from '../SystemicSimulator';
import { EmergenceMatrix } from '../EmergenceMatrix';
import { PatternTopology } from '../PatternTopology';
import { CoherenceHelix } from '../CoherenceHelix';
import { SessionEKG } from '../SessionEKG';
import { HysteresisLoop } from '../HysteresisLoop';
import { InterferenceMoire } from '../InterferenceMoire';
import { StrangeAttractor } from '../StrangeAttractor';
import { ReliefMap } from '../ReliefMap';
import { TensegrityStructure } from '../TensegrityStructure';
import { SynthesisService } from '../../services/synthesisService';
import { RefractionEngine } from '../../services/refractionEngine';
import { StabilityEngine } from '../../services/stabilityEngine';
import { ShadowEngine } from '../../services/shadowEngine';
import { TeleologyEngine } from '../../services/teleologyEngine';
import { SovereigntyEngine } from '../../services/sovereigntyEngine';
import { LatticeEngine } from '../../services/latticeEngine';
import { ButterflyEngine } from '../../services/butterflyEngine';
import { EmergenceEngine } from '../../services/emergenceEngine';
import { ClinicalDecoder } from '../../services/clinicalDecoder';
import { calculateAutopoiesis } from '../../services/psychologyService';

interface ResultsViewProps {
  t: Translations;
  result: AnalysisResult;
  isGlitchMode: boolean;
  onContinue: () => void;
  onShare: () => void | Promise<void>;
  onBack: () => void;
  onSetView: (view: string) => void;
  isPro: boolean;
}

type Mode = 'blueprint' | 'emg' | 'sim' | 'paths' | 'lattice' | 'field' | 'nucleus' | 'signature' | 'flux' | 'dossier' | 'prism' | 'well' | 'shadow' | 'void' | 'sovereign' | 'topology' | 'helix' | 'ekg' | 'hysteresis' | 'moire' | 'attractor' | 'relief' | 'tensegrity';

export const ResultsView = memo<ResultsViewProps>(({ 
  t, result, onShare, onBack, onSetView, isPro
}) => {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [activeMode, setActiveMode] = useState<Mode>('blueprint');
  
  const arch = t.archetypes[result.archetypeKey] || t.archetypes.THE_ARCHITECT;

  const synthesis = useMemo(() => SynthesisService.generateSynthesis(result, t), [result, t]);
  const refractionVectors = useMemo(() => RefractionEngine.calculateVectors(result), [result]);
  const stability = useMemo(() => StabilityEngine.calculate(result), [result]);
  const shadowContract = useMemo(() => ShadowEngine.decode(result), [result]);
  const teleology = useMemo(() => TeleologyEngine.calculate(result), [result]);
  const sovereignty = useMemo(() => SovereigntyEngine.calculate(result), [result]);
  const lattice = useMemo(() => LatticeEngine.calculate(result), [result]);
  const bifurcations = useMemo(() => ButterflyEngine.calculateBifurcations(result), [result]);
  const emergentPatterns = useMemo(() => EmergenceEngine.detectPatterns(result), [result]);
  const clinical = useMemo(() => ClinicalDecoder.decode(result, t), [result, t]);
  const autopoiesis = useMemo(() => calculateAutopoiesis(result), [result]);

  if (!disclaimerAccepted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in px-6 text-center">
         <div className="w-20 h-20 bg-indigo-950/30 rounded-[2rem] flex items-center justify-center text-4xl border border-indigo-500/30 animate-pulse-slow">⚖️</div>
         <div className="space-y-4 max-w-sm">
            <h2 className="text-2xl font-black uppercase italic text-slate-200 tracking-tighter">{t.results.disclaimer_title}</h2>
            <p className="text-sm font-medium text-slate-400 leading-relaxed italic">{t.results.disclaimer_body}</p>
         </div>
         <button onClick={() => { PlatformBridge.haptic.notification('success'); setDisclaimerAccepted(true); }} className="w-full max-w-xs py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-[0.98] transition-all">
            {t.ui.agree_terms_btn}
         </button>
      </div>
    );
  }

  const modeLabels: Record<string, string> = {
      blueprint: 'КАРТА', ekg: 'ЭКГ', tensegrity: 'ТНС', relief: 'РЛФ', moire: 'ВОЛНА',
      attractor: 'ХАОС', hysteresis: 'ГИСТ', helix: 'ДНК', sim: 'СИМ', topology: 'ТОПО',
      lattice: 'РЕШ', emg: 'ЭМЕРДЖ'
  };

  return (
    <div className="space-y-8 pb-32 animate-in pt-2 text-slate-100 relative">
      <header className={`dark-glass-card p-8 rounded-[3rem] shadow-2xl relative overflow-hidden transition-all duration-1000 
        ${activeMode === 'emg' ? 'bg-indigo-950/30 border-indigo-500/40 shadow-[0_0_60px_rgba(99,102,241,0.15)]' : 
          activeMode === 'sim' ? 'bg-indigo-950/20 border-indigo-500/30' : 
          activeMode === 'void' ? 'bg-black border-white/20' : 
          activeMode === 'helix' ? 'bg-[#020617] border-indigo-500/10' :
          activeMode === 'ekg' ? 'bg-slate-950 border-red-500/10' :
          activeMode === 'hysteresis' ? 'bg-slate-950 border-indigo-500/10' :
          activeMode === 'moire' ? 'bg-black border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]' :
          activeMode === 'attractor' ? 'bg-[#020617] border-amber-500/10 shadow-[0_0_40px_rgba(245,158,11,0.1)]' :
          activeMode === 'relief' ? 'bg-[#020617] border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]' :
          activeMode === 'tensegrity' ? 'bg-[#020617] border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.1)]' :
          activeMode === 'topology' ? 'bg-[#020617] border-emerald-500/10' :
          'bg-slate-950 border-white/5'}`}>
        
        <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] px-4 py-2 rounded-full border transition-colors 
                ${activeMode === 'emg' ? 'text-indigo-300 border-indigo-500/40 bg-indigo-950/50' : 
                  'text-indigo-400 border-indigo-500/30 bg-indigo-950/40'}`}>
                {modeLabels[activeMode] || activeMode.toUpperCase()}
              </span>
              
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar max-w-[280px]">
                {Object.keys(modeLabels).map(key => (
                    <button key={key} onClick={() => { setActiveMode(key as Mode); PlatformBridge.haptic.selection(); }} className={`px-2 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all shrink-0 ${activeMode === key ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>
                        {modeLabels[key]}
                    </button>
                ))}
              </div>
            </div>
            
            {activeMode === 'tensegrity' && (
              <div className="space-y-2 animate-in">
                <h1 className="text-3xl font-black italic uppercase text-indigo-400 leading-none tracking-tighter">Тенсегрити</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                   Матрица Структурного Напряжения (Ст. 4)
                </p>
              </div>
            )}

            {activeMode === 'relief' && (
              <div className="space-y-2 animate-in">
                <h1 className="text-3xl font-black italic uppercase text-emerald-400 leading-none tracking-tighter">Топография Воли</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                   Поверхность Потенциальной Энергии (Ст. 4)
                </p>
              </div>
            )}

            {activeMode === 'attractor' && (
              <div className="space-y-2 animate-in">
                <h1 className="text-3xl font-black italic uppercase text-amber-400 leading-none tracking-tighter">Аттрактор Хаоса</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                   Проекция Системы Лоренца (Ст. 5)
                </p>
              </div>
            )}

            {activeMode === 'moire' && (
              <div className="space-y-2 animate-in">
                <h1 className="text-3xl font-black italic uppercase text-cyan-400 leading-none tracking-tighter">Интерференция</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                   Намерение vs Теневой Паттерн (Ст. 3)
                </p>
              </div>
            )}

            {activeMode === 'hysteresis' && (
              <div className="space-y-2 animate-in">
                <h1 className="text-3xl font-black italic uppercase text-indigo-400 leading-none tracking-tighter">Петля Гистерезиса</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                   Анализ Диссипации Энергии (Ст. 5)
                </p>
              </div>
            )}

            {activeMode === 'ekg' && (
              <div className="space-y-2 animate-in">
                <h1 className="text-3xl font-black italic uppercase text-red-400 leading-none tracking-tighter">ЭКГ Сессии</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                   Анализ Стресс-Отклика (Ст. 6)
                </p>
              </div>
            )}

            {activeMode === 'helix' && (
              <div className="space-y-2 animate-in">
                <h1 className="text-3xl font-black italic uppercase text-indigo-300 leading-none tracking-tighter">Спираль Когерентности</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                   Сознательное vs Бессознательное (Ст. 7)
                </p>
              </div>
            )}

            {activeMode === 'emg' && (
              <div className="space-y-2 animate-in">
                <h1 className="text-3xl font-black italic uppercase text-indigo-300 leading-none tracking-tighter">Матрица Эмерджентности</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                   Найдено состояний: {emergentPatterns.length} // Ст. 7.1 Compliance
                </p>
              </div>
            )}

            {activeMode === 'sim' && (
              <div className="space-y-2 animate-in">
                <h1 className="text-3xl font-black italic uppercase text-indigo-300 leading-none tracking-tighter">Сценарная Симуляция</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                   Модель Интервенции: ДЕТЕРМИНИРОВАННАЯ // Ст. 19.2
                </p>
              </div>
            )}

            {activeMode === 'topology' && (
              <div className="space-y-2 animate-in">
                <h1 className="text-3xl font-black italic uppercase text-emerald-400 leading-none tracking-tighter">{t.topology.title}</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                   Анализ Пространственного Распределения // Ст. 18.1
                </p>
              </div>
            )}

            {activeMode !== 'dossier' && !['emg', 'sim', 'paths', 'lattice', 'field', 'nucleus', 'sovereign', 'void', 'shadow', 'well', 'prism', 'topology', 'helix', 'ekg', 'hysteresis', 'moire', 'attractor', 'relief', 'tensegrity'].includes(activeMode) && (
              <div className="space-y-2">
                <h1 className="text-5xl font-black italic uppercase text-white leading-none tracking-tighter">{arch.title}</h1>
                <p className="text-sm text-slate-400 font-medium leading-relaxed pt-3 border-l-2 border-indigo-500/5 pl-5 italic opacity-80">
                  {arch.desc}
                </p>
              </div>
            )}
        </div>
        
        <div className={`mt-8 relative w-full aspect-square rounded-3xl overflow-hidden border flex items-center justify-center transition-all duration-500 
          ${activeMode === 'dossier' ? 'bg-transparent border-transparent aspect-auto' : 
            activeMode === 'emg' ? 'bg-black border-indigo-500/20' : 
            activeMode === 'sim' ? 'bg-black border-indigo-500/10' : 
            activeMode === 'helix' ? 'bg-[#020617] border-indigo-500/10' :
            activeMode === 'ekg' ? 'bg-[#020617] border-red-500/10' :
            activeMode === 'hysteresis' ? 'bg-[#020617] border-indigo-500/20' :
            activeMode === 'moire' ? 'bg-[#020617] border-cyan-500/20' :
            activeMode === 'attractor' ? 'bg-[#020617] border-amber-500/20' :
            activeMode === 'relief' ? 'bg-[#020617] border-emerald-500/20' :
            activeMode === 'tensegrity' ? 'bg-[#020617] border-indigo-500/20' :
            'bg-[#020617] border-slate-800'}`}>
            
            {activeMode === 'blueprint' && (
                <RadarChart points={result.graphPoints} shadowPoints={result.shadowPoints} showShadow={true} t={t} onLabelClick={() => {}} className="scale-110" />
            )}
            {activeMode === 'tensegrity' && (
                <div className="w-full h-full p-4 flex flex-col justify-center animate-in">
                    <TensegrityStructure result={result} t={t} className="w-full h-full" />
                </div>
            )}
            {activeMode === 'relief' && (
                <div className="w-full h-full p-4 flex flex-col justify-center animate-in">
                    <ReliefMap result={result} className="w-full h-full" />
                </div>
            )}
            {activeMode === 'attractor' && (
                <div className="w-full h-full p-4 flex flex-col justify-center animate-in">
                    <StrangeAttractor result={result} className="w-full h-full" />
                </div>
            )}
            {activeMode === 'moire' && (
                <div className="w-full h-full p-4 flex flex-col justify-center animate-in">
                    <InterferenceMoire result={result} className="w-full h-full" />
                </div>
            )}
            {activeMode === 'hysteresis' && (
                <div className="w-full h-full p-4 flex flex-col justify-center animate-in">
                    <HysteresisLoop history={result.history} className="w-full h-full" />
                </div>
            )}
            {activeMode === 'ekg' && (
                <div className="w-full h-full p-4 flex flex-col justify-center">
                    <SessionEKG pulse={result.sessionPulse} t={t} />
                </div>
            )}
            {activeMode === 'helix' && (
                <CoherenceHelix history={result.history} t={t} neuroSync={result.neuroSync} className="w-full h-full animate-in" />
            )}
            {activeMode === 'topology' && (
                <PatternTopology patterns={result.activePatterns} t={t} className="w-full h-full animate-in" />
            )}
            {activeMode === 'emg' && (
                <div className="w-full h-full p-4 overflow-y-auto no-scrollbar">
                    <EmergenceMatrix patterns={emergentPatterns} className="w-full animate-in" />
                </div>
            )}
            {activeMode === 'sim' && (
                <div className="w-full h-full p-4 overflow-y-auto no-scrollbar">
                    <SystemicSimulator result={result} t={t} className="w-full animate-in" />
                </div>
            )}
            {activeMode === 'paths' && (
                <div className="w-full h-full p-4 overflow-y-auto no-scrollbar">
                    <BifurcationTree nodes={bifurcations} t={t} className="w-full animate-in" />
                </div>
            )}
            {activeMode === 'lattice' && (
                <ResonanceLattice lattice={lattice} t={t} className="w-full h-full p-4 animate-in" />
            )}
            {activeMode === 'field' && (
                <SystemicField metrics={clinical.extra.systemicMetrics} t={t} className="w-full h-full animate-in" interactive={true} />
            )}
            {activeMode === 'nucleus' && (
                <AutopoiesisNucleus metrics={autopoiesis} t={t} className="w-full h-full animate-in" />
            )}
            {activeMode === 'sovereign' && (
                <SovereigntyVector metrics={sovereignty} t={t} className="w-full h-full animate-in" />
            )}
            {activeMode === 'void' && (
                <TeleologicalAttractor metrics={teleology} className="w-full h-full animate-in" />
            )}
            {activeMode === 'shadow' && (
                <ShadowReveal contract={shadowContract} t={t} className="w-full h-full animate-in" />
            )}
            {activeMode === 'well' && (
                <StabilityWell metrics={stability} className="w-full h-full animate-in" />
            )}
            {activeMode === 'prism' && (
                <RefractionPrism vectors={refractionVectors} currentArchetype={result.archetypeKey} t={t} className="w-full h-full animate-in" />
            )}
            {activeMode === 'flux' && (
                <div className="animate-in w-full h-full">
                    <KineticFluxMap flux={result.entropyFlux} t={t} className="w-full h-full" />
                </div>
            )}
            {activeMode === 'dossier' && (
                <ClinicalSynthesisView synthesis={synthesis} t={t} className="w-full h-full animate-in" />
            )}
            {activeMode === 'signature' && (
                <div className="animate-in flex flex-col items-center space-y-4">
                    <BioSignature f={result.state.foundation} a={result.state.agency} r={result.state.resource} e={result.state.entropy} width={300} height={300} />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.5em] opacity-50">Детерминированная Подпись Души</span>
                </div>
            )}
        </div>

        {!['dossier', 'emg', 'sim', 'paths', 'lattice', 'field', 'nucleus', 'sovereign', 'void', 'shadow', 'topology', 'helix', 'ekg', 'hysteresis', 'moire', 'attractor', 'relief', 'tensegrity'].includes(activeMode) && (
          <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center px-2">
              <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Индекс Стабильности (Ст. 5)</span>
                  <div className="flex items-center gap-2">
                      <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${result.butterflySensitivity > 60 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${100 - result.butterflySensitivity}%` }}></div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-300">{100 - result.butterflySensitivity}%</span>
                  </div>
              </div>
              <div className="text-right">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Риск Бабочки</span>
                  <p className={`text-[10px] font-mono font-bold ${result.butterflySensitivity > 60 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
                      {result.butterflySensitivity > 60 ? 'ВЫСОКАЯ ЧУВСТВИТЕЛЬНОСТЬ' : 'СТАБИЛЬНАЯ СИСТЕМА'}
                  </p>
              </div>
          </div>
        )}
      </header>

      <div onClick={() => { navigator.clipboard.writeText(result.shareCode); PlatformBridge.haptic.notification('success'); }} className="bg-[#0a0a0a] border-2 border-indigo-500/30 p-6 rounded-[2.5rem] flex flex-col items-center space-y-3 cursor-copy active:scale-95 transition-all shadow-2xl">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">КЛИНИЧЕСКИЙ ТОКЕН ДОСТУПА</span>
          <div className="w-full bg-black/50 p-4 rounded-xl border border-white/5">
              <p className="text-xs font-mono text-white break-all text-center font-bold tracking-wider leading-relaxed">{result.shareCode}</p>
          </div>
          <span className="text-[7px] text-slate-500 uppercase tracking-widest opacity-80 font-bold">{t.results.share_code_help}</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
          <button onClick={() => onSetView('protocol')} className="w-full bg-emerald-600/10 border-2 border-emerald-500/30 p-6 rounded-[2.5rem] flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl">
              <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-3xl">🗺️</div>
                  <div className="text-left">
                      <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-emerald-400">{t.roadmap.title}</h3>
                      <p className="text-[8px] font-mono text-emerald-200/60 uppercase tracking-widest mt-1">7-ДНЕВНАЯ ИНТЕГРАЦИЯ</p>
                  </div>
              </div>
              <span className="text-2xl text-emerald-500 group-hover:translate-x-2 transition-transform">➜</span>
          </button>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 px-2">
          <button onClick={onShare} className="py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-[0.97] transition-all border-b-4 border-indigo-800">{t.results.share_button}</button>
          <button onClick={onBack} className="py-5 bg-slate-800 text-white border-2 border-slate-700 rounded-[2rem] font-black uppercase text-xs tracking-widest active:scale-[0.97] transition-all">{t.results.back}</button>
      </div>

      <footer className="pt-16 pb-12 text-center opacity-30">
          <p className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-500">Genesis OS v6.0 // Архитектура Эмерджентности</p>
      </footer>
    </div>
  );
});
