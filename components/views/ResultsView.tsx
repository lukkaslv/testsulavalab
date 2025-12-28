
import React, { useState, memo, useMemo } from 'react';
import { AnalysisResult, Translations, BeliefKey, SessionPulseNode } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { SessionPrepService } from '../../services/SessionPrepService';
import { RadarChart } from '../RadarChart';
import { BioSignature } from '../BioSignature';
import { SignalDecoder } from '../SignalDecoder';
import { useAppContext } from '../../hooks/useAppContext';

interface ResultsViewProps {
  lang: 'ru' | 'ka';
  t: Translations;
  result: AnalysisResult;
  isGlitchMode: boolean;
  onContinue: () => void;
  onShare: () => void;
  onBack: () => void;
  onNewCycle?: () => void; 
  isPro?: boolean; 
}

const DeltaMarker = ({ current, previous, t }: { current: number, previous?: number, t: Translations }) => {
    if (previous === undefined) return null;
    const diff = current - previous;
    if (Math.abs(diff) < 2) return <span className="text-[7px] text-slate-400 opacity-50 ml-1 font-mono">≈</span>;
    return (
        <span className={`text-[7px] ml-1 font-black ${diff > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {diff > 0 ? '↑' : '↓'}{Math.abs(Math.round(diff))}%
        </span>
    );
};

const SessionPulseGraph: React.FC<{ pulse: SessionPulseNode[], t: Translations, locked?: boolean }> = memo(({ pulse, t, locked }) => {
    if (!pulse || pulse.length < 5) return null;
    const [focusedNode, setFocusedNode] = useState<SessionPulseNode | null>(null);
    const maxTension = 100;
    const breakdownNode = useMemo(() => pulse.reduce((max, node) => node.tension > max.tension ? node : max, pulse[0]), [pulse]);
    const activeNode = focusedNode || breakdownNode;

    return (
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-[2rem] space-y-4 shadow-sm relative overflow-hidden group">
            {locked && (
                <div className="absolute inset-0 z-50 backdrop-blur-md bg-white/60 flex flex-col items-center justify-center text-center p-6 transition-all">
                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-xl mb-3 shadow-xl animate-pulse">🔒</div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{t.results.encrypted_overlay}</span>
                </div>
            )}
            <div className={`flex justify-between items-start relative z-10 min-h-[2rem] ${locked ? 'blur-sm opacity-50' : ''}`}>
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <span className="text-red-500 animate-pulse">❤</span> {t.ekg.title}
                    </span>
                    <span className="text-[8px] font-mono text-slate-300">N={pulse.length}</span>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-slate-800 tracking-tight">
                        NODE {activeNode.id + 1}
                    </span>
                    <br/>
                    <span className={`text-[9px] font-mono font-bold ${activeNode.tension > 70 ? 'text-red-500' : 'text-slate-400'}`}>
                        {activeNode.tension}%
                    </span>
                </div>
            </div>
            <div className={`relative h-24 w-full z-10 mt-2 ${locked ? 'blur-sm opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-end gap-1 h-full w-full">
                    {pulse.map((node, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end h-full">
                            <div 
                                className={`w-full rounded-t-sm transition-all duration-300 ${node.domain === 'foundation' ? 'bg-emerald-400' : 'bg-indigo-400'} 
                                    ${focusedNode?.id === node.id ? 'opacity-100 scale-y-105' : 'opacity-60'}`} 
                                style={{ height: `${(node.tension / maxTension) * 100}%` }}
                                onMouseEnter={() => setFocusedNode(node)}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

const PatternCard: React.FC<{ beliefKey: BeliefKey, t: Translations }> = ({ beliefKey, t }) => {
    const [isOpen, setIsOpen] = useState(false);
    const data = t.pattern_library[beliefKey] || t.pattern_library.default;
    const label = t.beliefs[beliefKey];

    return (
        <div onClick={() => { PlatformBridge.haptic.selection(); setIsOpen(!isOpen); }} className={`border rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer ${isOpen ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${isOpen ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {isOpen ? '🔓' : '🔒'}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-tight ${isOpen ? 'text-white' : 'text-slate-800'}`}>
                        {label}
                    </span>
                </div>
                <span className={`text-xl transition-transform ${isOpen ? 'rotate-180 text-indigo-400' : 'text-slate-300'}`}>▼</span>
            </div>
            {isOpen && (
                <div className="px-5 pb-5 pt-1 space-y-4 animate-in">
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block">{t.results.protection_label}</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{data.protection}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 block">{t.results.cost_label}</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{data.cost}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export const ResultsView = memo<ResultsViewProps>(({ 
  lang, t, result, isGlitchMode, onShare, onBack, onNewCycle, isPro
}) => {
  const { history, scanHistory } = useAppContext();
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  const prevScan = useMemo(() => {
      if (!scanHistory || scanHistory.scans.length < 2) return undefined;
      return scanHistory.scans[scanHistory.scans.length - 2];
  }, [scanHistory]);

  const baseline = useMemo(() => {
    if (history.length === 0) return 2000;
    const samples = history.slice(0, 5);
    return samples.reduce((acc, h) => acc + h.latency, 0) / samples.length;
  }, [history]);

  const sessionPrepQuestions = useMemo(() => SessionPrepService.generate(result, t), [result, t]);

  const handleCopyCode = () => {
      navigator.clipboard.writeText(result.shareCode);
      setCopySuccess(true);
      PlatformBridge.haptic.notification('success');
      setTimeout(() => setCopySuccess(false), 2000);
  };

  const isCriticalDeficit = result.state.foundation < 25;
  const isFragile = result.state.foundation < 40 || result.entropyScore > 55;

  const displayArchetype = useMemo(() => {
    const arch = t.archetypes[result.archetypeKey] || t.archetypes.THE_ARCHITECT;
    if (isFragile && t.soft_mode) {
      return { ...arch, title: `${t.soft_mode.archetype_prefix}${arch.title}` };
    }
    return arch;
  }, [result.archetypeKey, t, isFragile]);

  const displayVerdict = useMemo(() => {
    const v = t.verdicts[result.verdictKey] || t.verdicts.HEALTHY_SCALE;
    if (isFragile && t.soft_mode?.verdict_softened[result.verdictKey]) {
      return { ...v, label: t.soft_mode.verdict_softened[result.verdictKey] };
    }
    return v;
  }, [result.verdictKey, t, isFragile]);

  if (!disclaimerAccepted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in px-4 text-center">
         <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-3xl border border-indigo-100/50 animate-pulse">⚖️</div>
         <div className="space-y-4 max-w-sm">
            <h2 className="text-xl font-black uppercase text-slate-900 leading-tight italic">{t.results.disclaimer_title}</h2>
            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">{t.results.disclaimer_body}</p>
         </div>
         <button onClick={() => { setDisclaimerAccepted(true); PlatformBridge.haptic.notification('success'); }} className="w-full max-w-xs py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">
            {t.ui.agree_terms_btn}
         </button>
      </div>
    );
  }

  return (
    <div className={`space-y-10 pb-32 animate-in px-1 pt-2 font-sans ${isGlitchMode ? 'glitch' : ''}`}>
      
      {isCriticalDeficit && (
          <div className="bg-red-600 text-white p-6 rounded-[2.5rem] shadow-xl border-4 border-red-500/20 space-y-2 animate-pulse">
              <div className="flex items-center gap-3">
                  <span className="text-2xl">🛑</span>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">{t.safety.alert}</h3>
              </div>
              <p className="text-[11px] font-bold leading-tight italic">
                  {lang === 'ru' 
                    ? "Ваши показатели устойчивости требуют внимания специалиста. Рекомендуется обсудить эти результаты с вашим психологом в приоритетном порядке. Не принимайте важных решений самостоятельно." 
                    : "თქვენი მდგრადობის მაჩვენებლები მოითხოვს სპეციალისტის ყურადღებას. რეკომენდებულია ამ შედეგების განხილვა ფსიქოლოგთან."}
              </p>
          </div>
      )}

      <header className="dark-glass-card p-8 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden border-b-4 border-indigo-500/30">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-indigo-400 border-indigo-500/20 uppercase tracking-[0.4em] bg-white/5 px-3 py-1.5 rounded-full border">{t.results.blueprint}</span>
              <span className={`text-[10px] font-mono font-bold ${result.confidenceScore > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{result.confidenceScore}% {t.results.confidence}</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black italic uppercase text-white leading-none tracking-tighter">{displayArchetype.title}</h1>
              <p className="text-sm text-slate-400 font-medium leading-relaxed opacity-85 pt-2 border-l-2 border-indigo-500/50 pl-4">{displayArchetype.desc}</p>
            </div>

            {/* QUICK STATS WITH DELTA */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                {[
                    { key: 'integrity', label: t.results.integrity, val: result.integrity, prev: prevScan?.integrity },
                    { key: 'neuro_sync', label: t.results.neuro_sync, val: result.neuroSync, prev: prevScan?.neuroSync }
                ].map(stat => (
                    <div key={stat.key} className="space-y-0.5">
                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{stat.label}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-white">{stat.val}%</span>
                            <DeltaMarker current={stat.val} previous={stat.prev} t={t} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 flex flex-col items-center">
                <RadarChart points={result.graphPoints} onLabelClick={() => {}} lang={lang} />
                <BioSignature f={result.state.foundation} a={result.state.agency} r={result.state.resource} e={result.state.entropy} className="mt-4 opacity-50" />
            </div>
        </div>
      </header>

      {/* SESSION PREP BLOCK */}
      <section className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl space-y-6 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl">💬</div>
          <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">{t.results.session_prep}</span>
              <h3 className="text-xl font-black uppercase italic mt-1 leading-tight">{t.results.session_prep_desc}</h3>
          </div>
          <div className="space-y-3 relative z-10">
              {sessionPrepQuestions.map((q, i) => (
                  <div key={i} className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <p className="text-sm font-bold leading-relaxed">
                          <span className="text-indigo-300 mr-2">0{i+1}.</span>
                          {q}
                      </p>
                  </div>
              ))}
          </div>
          {onNewCycle && (
              <button 
                  onClick={onNewCycle}
                  className="mt-4 w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
              >
                  {t.ui.start_new_cycle_btn}
              </button>
          )}
      </section>

      {/* Signal Decoder: High-Transparency Evidence Block (AXIS 9.1 FEATURE LOCK) */}
      {isPro ? (
          <SignalDecoder history={history} t={t} baseline={baseline} lang={lang} />
      ) : (
          <div className="px-2">
             <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] text-center space-y-2 border-dashed">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Signal Decoder</span>
                <p className="text-[10px] font-bold text-slate-500 italic">
                    {lang === 'ru' ? 'Доступно в тарифе Clinical' : 'ხელმისაწვდომია Clinical ტარიფში'}
                </p>
             </div>
          </div>
      )}

      <SessionPulseGraph pulse={result.sessionPulse} t={t} locked={!isPro} />

      {/* PRO SHARE CARD */}
      <div className="bg-slate-900 p-6 rounded-[2.5rem] space-y-6 shadow-2xl border border-slate-800">
          <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{t.results.brief_instruction}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {lang === 'ru' ? 'Этот код содержит ваш зашифрованный профиль для психолога.' : 'ეს კოდი შეიცავს თქვენს დაშიფრულ პროფილს ფსიქოლოგისთვის.'}
              </p>
          </div>
          <button onClick={handleCopyCode} className={`w-full p-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-between transition-all active:scale-95 ${copySuccess ? 'bg-emerald-600 text-white' : 'bg-white text-slate-900 shadow-xl'}`}>
              <span className="font-mono">{copySuccess ? 'SUCCESS' : result.shareCode.substring(0, 15) + '...'}</span>
              <span>{copySuccess ? '✓' : '📋'}</span>
          </button>
      </div>

      <div className="px-2">
         <div className={`p-4 rounded-2xl border border-dashed text-center ${isFragile ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">VERDICT</span>
            <p className={`text-xs font-black uppercase italic ${isFragile ? 'text-indigo-600' : 'text-slate-600'}`}>{displayVerdict.label}</p>
         </div>
      </div>

      {(result.activePatterns && result.activePatterns.length > 0) && (
          <section className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 px-2">{t.results.active_patterns_title}</h3>
              <div className="grid grid-cols-1 gap-3">
                  {result.activePatterns.map((patternKey) => (
                      <PatternCard key={patternKey} beliefKey={patternKey} t={t} />
                  ))}
              </div>
          </section>
      )}

      {/* Methodology Section */}
      <section className="space-y-4">
        <button 
          onClick={() => setShowMethodology(!showMethodology)}
          className="w-full bg-slate-50 border border-slate-200 p-6 rounded-[2rem] space-y-3 text-left group"
        >
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.results.methodology_title}</h4>
              <span className="text-slate-300 group-hover:text-indigo-400 transition-colors">❯</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium italic opacity-80">
                {t.results.methodology_desc}
            </p>
        </button>
        
        {showMethodology && (
          <div className="px-4 space-y-4 animate-in">
             {t.methodology_faq?.map((item, i) => (
               <div key={i} className="space-y-1">
                 <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-tight">Q: {item.q}</h5>
                 <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.a}</p>
               </div>
             ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-3 pt-6">
          <button onClick={onShare} className="py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all">{t.results.share_button}</button>
          <button onClick={onBack} className="py-5 bg-white text-slate-900 border border-slate-200 rounded-[2rem] font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">{t.results.back}</button>
      </div>

      <footer className="pt-10 pb-20 px-4 text-center space-y-3 opacity-60">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              {lang === 'ru' 
                ? "Genesis OS не является медицинским изделием и не заменяет консультацию специалиста. Интерпретацию результатов проводит ваш психолог."
                : "Genesis OS არ წარმოადგენს სამედიცინო მოწყობილობას და არ ანაცვლებს სპეციალისტის კონსულტაციას."}
          </p>
          <div className="flex justify-center gap-4 opacity-50">
               <span className="text-[8px] font-mono">NON_MEDICAL_V3</span>
               <span className="text-[8px] font-mono">DETERMINISTIC_CORE</span>
          </div>
      </footer>
    </div>
  );
});
