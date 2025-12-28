
import { memo, useState, useEffect } from 'react';
import { DomainType, Translations, Choice, Scene, AdaptiveState } from '../../types';
import { AdaptiveProgressBar } from '../AdaptiveProgressBar';
import { PlatformBridge } from '../../utils/helpers';

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

const SomaticBreak = ({ t, onContinue }: { t: Translations, onContinue: () => void }) => (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-8 animate-in backdrop-blur-2xl bg-indigo-950/90 text-center">
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-4xl mb-8 animate-pulse-slow">🧘</div>
        <h2 className="text-2xl font-black uppercase text-white mb-4 italic tracking-tight">{t.sync.break_title}</h2>
        <p className="text-sm text-indigo-200 mb-10 leading-relaxed font-medium">
            {t.sync.break_desc}
        </p>
        <button 
            onClick={onContinue} 
            className="w-full max-w-xs py-5 bg-white text-indigo-950 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all"
        >
            {t.sync.break_btn}
        </button>
    </div>
);

const SoftTriggerWarning = ({ t }: { t: Translations }) => (
    <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-center gap-3 animate-in shadow-sm">
        <span className="text-lg">⚠️</span>
        <div className="flex-1">
            <h4 className="text-[9px] font-black uppercase text-amber-900 tracking-widest">{t.safety.trigger_warning_title}</h4>
            <p className="text-[8px] font-bold text-amber-700 leading-tight uppercase opacity-80">{t.safety.trigger_warning_desc}</p>
        </div>
    </div>
);

const IntensityMeter = ({ intensity }: { intensity: number }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((lvl) => (
            <div 
                key={lvl} 
                className={`w-1 h-3 rounded-full transition-all duration-500 ${lvl <= intensity ? 'bg-indigo-500' : 'bg-slate-200'}`}
                style={{ opacity: lvl <= intensity ? 1 : 0.3 }}
            ></div>
        ))}
    </div>
);

const EmergencyModal = ({ t, onReturn, onExit }: { t: Translations, onReturn: () => void, onExit: () => void }) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in backdrop-blur-xl bg-slate-900/80">
        <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6 text-center border border-slate-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">🆘</div>
            <div className="space-y-2">
                <h2 className="text-lg font-black uppercase text-slate-900 tracking-tight">{t.safety.emergency_contacts_title}</h2>
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">{t.safety.emergency_contacts_desc}</p>
            </div>
            <div className="space-y-3">
                <button onClick={onReturn} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all">
                    {t.safety.return_btn}
                </button>
                <button onClick={onExit} className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">
                    {t.global.back}
                </button>
            </div>
        </div>
    </div>
);

export const TestView = memo<TestViewProps>(({ t, activeModule, currentId, scene, onChoice, onExit, getSceneText, adaptiveState }) => {
  const numericId = parseInt(currentId);
  const isCalibration = numericId < 3;
  const isAdaptive = adaptiveState.clarity > 20;

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const isIntense = scene.intensity >= 5;

  // Fatigue Mitigation: Every 20 nodes, suggest a break
  useEffect(() => {
      if (numericId > 0 && numericId % 20 === 0) {
          setShowBreak(true);
      }
      setSelectedChoiceId(null);
  }, [currentId, numericId]);

  const handleChoiceClick = (c: Choice) => {
    if (selectedChoiceId) return; 
    
    setSelectedChoiceId(c.id);
    PlatformBridge.haptic.impact('medium');
    
    setTimeout(() => {
        onChoice(c);
    }, 120);
  };

  return (
    <div className="space-y-6 py-6 px-4 animate-in flex flex-col h-full relative">
      
      {showEmergency && <EmergencyModal t={t} onReturn={() => setShowEmergency(false)} onExit={onExit} />}
      {showBreak && <SomaticBreak t={t} onContinue={() => setShowBreak(false)} />}

      <div className="flex justify-between items-center shrink-0">
         <div className="flex items-center gap-3">
             <button onClick={onExit} aria-label={t.global.back} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 font-black text-sm hover:bg-slate-200 transition-colors active:scale-90">✕</button>
             <div className="flex flex-col">
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest leading-none">{t.ui.module_label}</span>
                <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest leading-none mt-1">
                  {isCalibration ? t.global.calibrating : t.domains[activeModule]}
                </span>
             </div>
         </div>
         <div className="flex flex-col items-end gap-1">
             <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                 <span className="text-[8px] font-mono font-bold text-slate-400">NODE_{currentId.padStart(2, '0')}</span>
             </div>
             <IntensityMeter intensity={scene.intensity} />
         </div>
      </div>
      
      <AdaptiveProgressBar 
        clarity={adaptiveState.clarity} 
        isAdaptive={isAdaptive} 
        contradictionsCount={adaptiveState.contradictions.length} 
        confidenceScore={adaptiveState.confidenceScore}
      />

      {isIntense && <SoftTriggerWarning t={t} />}

      <div className="flex-1 flex flex-col justify-center space-y-6 transition-all">
        <h3 className="text-2xl font-black uppercase text-slate-900 leading-tight tracking-tight">
            {getSceneText(scene.titleKey)}
        </h3>
        
        <div className="bg-white p-7 rounded-[2rem] text-slate-600 font-semibold border border-slate-100 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5 text-indigo-500 text-6xl font-black select-none pointer-events-none">?</div>
             <p className="relative z-10 text-xl leading-relaxed text-left hyphens-auto">
                {getSceneText(scene.descKey)}
             </p>
        </div>
      </div>

      <div 
        className="space-y-3 shrink-0 transition-all"
        role="radiogroup"
        aria-label="Choices"
      >
        {scene.choices.map((c, i) => {
          const isSelected = selectedChoiceId === c.id;
          return (
            <button 
                key={c.id} 
                role="radio"
                aria-checked={isSelected}
                disabled={!!selectedChoiceId}
                onClick={() => handleChoiceClick(c)} 
                className={`w-full p-6 text-left border rounded-[1.5rem] shadow-sm font-bold text-sm uppercase flex items-center gap-4 transition-all duration-150 active:scale-[0.97] group 
                ${isSelected 
                    ? 'bg-indigo-600 border-indigo-500 text-white scale-[0.98] ring-4 ring-indigo-500/20' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 active:bg-indigo-50'}`}
            >
                <span className={`w-9 h-9 rounded-xl border flex items-center justify-center font-mono text-[11px] transition-colors
                    ${isSelected ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    0{i+1}
                </span>
                <span className={`flex-1 leading-snug ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                    {getSceneText(c.textKey)}
                </span>
            </button>
          );
        })}
      </div>

      <div className="pt-2 pb-6 flex justify-center">
         <button onClick={() => setShowEmergency(true)} className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-slate-100 hover:bg-red-50 hover:text-red-400 hover:border-red-100 transition-all">
            {t.safety.uncomfortable_btn}
         </button>
      </div>
    </div>
  );
});

export const ReflectionView = ({ t, sensation }: { t: Translations, sensation?: string }) => {
  const message = t.sensation_feedback[sensation as keyof typeof t.sensation_feedback] || t.sensation_feedback.s4;
  
  return (
    <div className="flex flex-col items-center justify-center h-full animate-in bg-white">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <span className="text-4xl">📡</span>
        </div>
        <h3 className="text-lg font-black uppercase text-indigo-900 tracking-widest text-center max-w-[200px] leading-relaxed">
            {message}
        </h3>
    </div>
  );
};
