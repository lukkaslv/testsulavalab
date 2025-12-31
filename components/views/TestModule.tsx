
import { memo, useState, useEffect, useRef, useMemo } from 'react';
import { DomainType, Translations, Choice, Scene, AdaptiveState, InterventionType, BeliefKey, GameHistoryItem } from '../../types';
import { AdaptiveProgressBar } from '../AdaptiveProgressBar';
import { PlatformBridge } from '../../utils/helpers';
import { useAppContext } from '../../hooks/useAppContext';
import { WEIGHTS } from '../../services/psychologyService';

interface TestViewProps {
  t: Translations;
  activeModule: DomainType;
  currentId: string;
  scene: Scene;
  onChoice: (c: Choice) => void;
  onExit: () => void;
  getSceneText: (path: string) => string;
  adaptiveState: AdaptiveState;
}

type AtmosphereState = 'NEUTRAL' | 'TURBULENCE' | 'FREEZE' | 'FLOW' | 'HEAVY';

const calculateAtmosphere = (history: GameHistoryItem[]): AtmosphereState => {
    if (history.length < 3) return 'NEUTRAL';
    
    const window = history.slice(-3);
    const avgLatency = window.reduce((a, b) => a + b.latency, 0) / window.length;
    const hasDissonance = window.some(h => h.sensation === 's1' || h.sensation === 's4');
    
    const totalWeight = window.reduce((acc, h) => {
        const w = (WEIGHTS as any)[h.beliefKey] || WEIGHTS.default;
        return acc + Math.abs(w.f) + Math.abs(w.a) + Math.abs(w.r) + Math.abs(w.e);
    }, 0);

    if (avgLatency > 3500) return 'FREEZE';
    if (hasDissonance && totalWeight > 15) return 'TURBULENCE';
    if (totalWeight > 20) return 'HEAVY';
    if (avgLatency < 2000 && !hasDissonance) return 'FLOW';
    
    return 'NEUTRAL';
};

const BiofeedbackLayer = memo(({ state }: { state: AtmosphereState }) => {
    const config = {
        NEUTRAL: { bg: 'from-[#020617] to-[#0f172a]', pulse: 'opacity-10' },
        TURBULENCE: { bg: 'from-[#2a1205] to-[#0f172a]', pulse: 'opacity-20 animate-pulse' },
        FREEZE: { bg: 'from-[#082f49] to-[#020617]', pulse: 'opacity-10' },
        FLOW: { bg: 'from-[#022c22] to-[#020617]', pulse: 'opacity-20' },
        HEAVY: { bg: 'from-[#1e1b4b] to-[#020617]', pulse: 'opacity-20' }
    }[state];

    return (
        <div className={`absolute inset-0 z-0 transition-all duration-1000 bg-gradient-to-b ${config.bg}`}>
            {/* Grain Texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>
            
            {/* The Core Breath */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none transition-all duration-1000 ${config.pulse}`}></div>
        </div>
    );
});

const InterventionOverlay = ({ type, t, onResolve }: { type: InterventionType, t: Translations, onResolve: () => void }) => {
    const mp = t.mirror_protocol || { break_glass: "BREAK GLASS", manic_title: "MANIC", somatic_title: "SOMATIC", resume_btn: "RESUME" };
    const isManic = type.code === 'MANIC_BREAK';
    
    return (
        <div className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in text-center">
            <div className="w-24 h-24 rounded-full border-2 border-red-500/50 flex items-center justify-center mb-8 animate-pulse shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                <span className="text-4xl">{isManic ? '⚡' : '🧊'}</span>
            </div>
            <h2 className="text-xl font-black text-red-500 uppercase tracking-[0.3em] mb-4">{mp.break_glass}</h2>
            <p className="text-sm font-medium text-slate-200 leading-relaxed italic max-w-xs mx-auto mb-12">
                "{isManic ? mp.manic_desc : mp.somatic_desc}"
            </p>
            <button onClick={() => { PlatformBridge.haptic.notification('success'); onResolve(); }} className="px-10 py-4 bg-white text-black rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all shadow-xl active:scale-95">
                {mp.resume_btn}
            </button>
        </div>
    );
};

export const TestView = memo<TestViewProps>(({ t, activeModule, currentId, scene, onChoice, onExit, getSceneText, adaptiveState }) => {
  const { history } = useAppContext();
  const numericId = parseInt(currentId);
  const isCalibration = numericId < 3;
  const isAdaptive = adaptiveState.clarity > 20;

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isPacingLocked, setIsPacingLocked] = useState(false);
  const [pacingProgress, setPacingProgress] = useState(0);
  const [showIntervention, setShowIntervention] = useState(false);
  const resolvedInterventionRef = useRef<string | null>(null);

  const atmosphere = useMemo(() => calculateAtmosphere(history), [history.length]);

  useEffect(() => {
      if (adaptiveState.intervention) {
          const key = `${adaptiveState.intervention.code}_${history.length}`;
          if (resolvedInterventionRef.current !== key) {
              setShowIntervention(true);
              PlatformBridge.haptic.notification('error');
          }
      }
  }, [adaptiveState.intervention, history.length]);

  useEffect(() => {
      setSelectedChoiceId(null);
      const lastEntry = history[history.length - 1];
      const isFast = lastEntry && lastEntry.latency < 1200;
      const recentHistory = history.slice(-3);
      const isRushing = recentHistory.length === 3 && recentHistory.every(h => h.latency < 1500);

      if ((isFast || isRushing) && !isCalibration && !showIntervention) {
          setIsPacingLocked(true);
          setPacingProgress(0);
          const lockDuration = isRushing ? 2500 : 1500;
          const step = 50;
          const interval = setInterval(() => {
              setPacingProgress(p => {
                  const increment = (step / lockDuration) * 100;
                  if (p + increment >= 100) {
                      clearInterval(interval);
                      setIsPacingLocked(false);
                      PlatformBridge.haptic.notification('success');
                      return 100;
                  }
                  return p + increment;
              });
          }, step); 
          return () => clearInterval(interval);
      } else {
          setIsPacingLocked(false);
          setPacingProgress(100);
      }
  }, [currentId, showIntervention]);

  const handleInterventionResolve = () => {
      if (adaptiveState.intervention) {
          resolvedInterventionRef.current = `${adaptiveState.intervention.code}_${history.length}`;
      }
      setShowIntervention(false);
  };

  const handleChoiceClick = (c: Choice) => {
    if (selectedChoiceId || isPacingLocked || showIntervention) return; 
    setSelectedChoiceId(c.id);
    
    // SEMANTIC HAPTICS (Art. 4.3)
    const w = (WEIGHTS as any)[c.beliefKey as BeliefKey] || WEIGHTS.default;
    if (Math.abs(w.e) >= 3) PlatformBridge.haptic.notification('warning');
    else if (w.f >= 2) PlatformBridge.haptic.impact('heavy');
    else if (c.position === 0) PlatformBridge.haptic.impact('light');
    else PlatformBridge.haptic.impact('medium');

    onChoice(c);
  };

  if (showIntervention && adaptiveState.intervention) {
      return <InterventionOverlay type={adaptiveState.intervention} t={t} onResolve={handleInterventionResolve} />;
  }

  return (
    <div className="h-full relative overflow-hidden flex flex-col font-sans select-none">
      <BiofeedbackLayer state={atmosphere} />

      {/* TOP NAVIGATION */}
      <div className="relative z-10 px-6 pt-6 flex justify-between items-center opacity-60 shrink-0">
         <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
             <span className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
                 {isCalibration ? "CALIB" : t.domains[activeModule]}
             </span>
         </div>
         <button onClick={onExit} className="text-slate-500 hover:text-white transition-colors p-2 -mr-2">
             <span className="text-lg font-bold">✕</span>
         </button>
      </div>
      
      <div className="px-6 pt-4 relative z-10 shrink-0">
        <AdaptiveProgressBar 
            clarity={adaptiveState.clarity} 
            isAdaptive={isAdaptive} 
            contradictionsCount={adaptiveState.contradictions.length} 
        />
      </div>

      {/* QUESTION SPACE (The Void) */}
      <div className="flex-1 flex flex-col justify-center px-6 relative z-10 overflow-y-auto custom-scrollbar min-h-0">
        <div className="space-y-6 py-4">
            <h3 className="text-3xl sm:text-4xl font-black uppercase text-slate-100 leading-none tracking-tight">
                {getSceneText(scene.titleKey)}
            </h3>
            <div className="flex items-start gap-4">
                <div className="w-0.5 h-12 bg-indigo-500/50 shrink-0 mt-1"></div>
                <p className="text-lg sm:text-xl font-medium text-slate-400 leading-snug tracking-wide">
                    {getSceneText(scene.descKey)}
                </p>
            </div>
        </div>
      </div>

      {/* CHOICE TRIGGERS (Thumb Zone) - Uplifted for ergonomics */}
      <div className="px-4 pb-12 pt-6 space-y-3 relative z-20 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent shrink-0 backdrop-blur-sm">
        {isPacingLocked ? (
            <div className="h-[220px] flex flex-col items-center justify-center space-y-6 animate-in">
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 bg-teal-500/20 rounded-full animate-ping"></div>
                    <span className="text-xl animate-pulse">🌬️</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500 animate-pulse">
                    {t.test_metrics.adaptive_pacing}
                </p>
                <div className="w-32 h-0.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 transition-all ease-linear duration-75" style={{ width: `${pacingProgress}%` }}></div>
                </div>
            </div>
        ) : (
            scene.choices.map((c, i) => {
              const isSelected = selectedChoiceId === c.id;
              return (
                <button 
                    key={c.id} 
                    disabled={!!selectedChoiceId}
                    onClick={() => handleChoiceClick(c)} 
                    className={`w-full group relative overflow-hidden p-0 rounded-2xl transition-all duration-200 active:scale-[0.98] ${
                        isSelected ? 'scale-[0.99] opacity-100' : 'opacity-100'
                    }`}
                    style={{ animation: `fadeInUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards ${i * 0.05}s` }}
                >
                    <div className={`
                        absolute inset-0 transition-all duration-300
                        ${isSelected ? 'bg-indigo-600' : 'bg-slate-900 border border-slate-800 group-hover:border-slate-600'}
                    `}></div>
                    
                    <div className="relative flex items-center p-5 gap-4 min-h-[72px]">
                        <span className={`
                            w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-black border transition-colors
                            ${isSelected 
                                ? 'bg-white/20 border-white/20 text-white' 
                                : 'bg-black/20 border-white/5 text-slate-500 group-hover:text-slate-300'}
                        `}>
                            {i+1}
                        </span>
                        <span className={`
                            text-sm font-bold uppercase tracking-wide transition-colors text-left leading-tight
                            ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}
                        `}>
                            {getSceneText(c.textKey)}
                        </span>
                    </div>
                </button>
              );
            })
        )}
      </div>
    </div>
  );
});
