
import React, { useState, memo, useCallback, useMemo } from 'react';
import { AnalysisResult, Translations, AdaptiveState, ScanHistory, BeliefKey, SessionPulseNode } from '../../types';
import { StorageService } from '../../services/storageService';
import { PlatformBridge } from '../../utils/helpers';
import { generateClinicalNarrative } from '../../services/clinicalNarratives';
import { EvolutionDashboard } from '../EvolutionDashboard';
import { SessionPrepService } from '../../services/SessionPrepService';
import { RadarChart } from '../RadarChart';
import { BioSignature } from '../BioSignature';

interface ResultsViewProps {
  lang: 'ru' | 'ka';
  t: Translations;
  result: AnalysisResult;
  isGlitchMode: boolean;
  onContinue: () => void;
  onShare: () => void;
  onBack: () => void;
  getSceneText: (path: string) => string;
  adaptiveState: AdaptiveState;
  onOpenBriefExplainer: () => void;
  onNewCycle?: () => void; // New prop for restarting
}

const DeltaBadge = ({ current, previous, inverse = false }: { current: number, previous: number | undefined, inverse?: boolean }) => {
    if (previous === undefined) return null;
    const diff = current - previous;
    if (Math.abs(diff) < 2) return null; 
    const isPositive = diff > 0;
    const isGood = inverse ? !isPositive : isPositive;
    return (
        <span className={`text-[9px] font-black ml-2 px-1.5 py-0.5 rounded ${isGood ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(Math.round(diff))}%
        </span>
    );
};

// --- NEW COMPONENT: SESSION EKG (The Heartbeat of the Session) ---
const SessionPulseGraph: React.FC<{ pulse: SessionPulseNode[], t: Translations }> = memo(({ pulse, t }) => {
    if (!pulse || pulse.length < 5) return null;
    
    // Interactive State
    const [focusedNode, setFocusedNode] = useState<SessionPulseNode | null>(null);

    const maxTension = 100;
    
    // Find breakdown point (Highest spike followed by drop or sustained high)
    const breakdownNode = useMemo(() => pulse.reduce((max, node) => node.tension > max.tension ? node : max, pulse[0]), [pulse]);
    
    const activeNode = focusedNode || breakdownNode;

    return (
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-[2rem] space-y-4 shadow-sm relative overflow-hidden group">
            {/* READOUT HEADER */}
            <div className="flex justify-between items-start relative z-10 min-h-[2rem]">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <span className="text-red-500 animate-pulse">❤</span> {t.results.session_ekg_title}
                    </span>
                    <span className="text-[8px] font-mono text-slate-300">N={pulse.length} // MAX_TENSION: {breakdownNode.tension}%</span>
                </div>
                
                {/* DYNAMIC READOUT */}
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <span className={`w-2 h-2 rounded-full ${activeNode.isBlock ? 'bg-red-500' : activeNode.isFlow ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span>
                        <span className="text-[10px] font-black uppercase text-slate-800 tracking-tight">
                            NODE {activeNode.id + 1}: {t.domains[activeNode.domain]}
                        </span>
                    </div>
                    <span className={`text-[9px] font-mono font-bold ${activeNode.tension > 70 ? 'text-red-500' : 'text-slate-400'}`}>
                        TENSION: {activeNode.tension}% {activeNode.isBlock ? '(BLOCK)' : activeNode.isFlow ? '(FLOW)' : ''}
                    </span>
                </div>
            </div>

            {/* GRAPH AREA */}
            <div className="relative h-28 w-full z-10 mt-2" onMouseLeave={() => setFocusedNode(null)}>
                {/* THRESHOLD LINES */}
                <div className="absolute top-[30%] left-0 w-full h-px border-t border-dashed border-red-500/20 pointer-events-none"></div>
                <div className="absolute top-[70%] left-0 w-full h-px border-t border-dashed border-emerald-500/20 pointer-events-none"></div>
                
                <div className="flex items-end gap-1 h-full w-full">
                    {pulse.map((node, i) => {
                        // Color logic based on Domain
                        const color = node.domain === 'foundation' ? 'bg-emerald-400' :
                                      node.domain === 'agency' ? 'bg-indigo-400' :
                                      node.domain === 'money' ? 'bg-amber-400' : 'bg-slate-300';
                        
                        const height = Math.max(5, (node.tension / maxTension) * 100);
                        const isSpike = node.tension > 70;
                        const isSelected = focusedNode?.id === node.id;
                        const isBreakdown = breakdownNode.id === node.id && !focusedNode;

                        return (
                            <div 
                                key={i} 
                                className="flex-1 flex flex-col justify-end relative h-full cursor-pointer touch-none"
                                onMouseEnter={() => { setFocusedNode(node); PlatformBridge.haptic.selection(); }}
                                onClick={() => { setFocusedNode(node); PlatformBridge.haptic.impact('light'); }}
                            >
                                <div 
                                    className={`w-full rounded-t-sm transition-all duration-300 ${color} 
                                        ${isBreakdown || isSelected ? 'opacity-100 scale-y-105' : 'opacity-60'} 
                                        ${isSpike ? 'shadow-[0_0_10px_rgba(239,68,68,0.4)]' : ''}`} 
                                    style={{ height: `${height}%` }}
                                ></div>
                                
                                {/* Active Indicator Line */}
                                {(isSelected || isBreakdown) && (
                                    <div className="absolute bottom-0 w-full h-1 bg-slate-900 rounded-full mb-[-6px]"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-between text-[8px] text-slate-400 font-mono relative z-10 pt-2 border-t border-slate-100">
                <span>START</span>
                <span className="text-red-400">
                    BREAKDOWN AT {Math.round((breakdownNode.id / pulse.length) * 100)}% Timeline
                </span>
                <span>END</span>
            </div>
            
            <p className="text-[9px] text-slate-500 italic leading-tight relative z-10">
                {t.results.session_ekg_desc}
            </p>
        </div>
    );
});

const SignalDecoderItem: React.FC<{ item: any, t: Translations }> = ({ item, t }) => {
    const isResistance = item.type === 'resistance';
    return (
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${isResistance ? 'bg-amber-50 border-amber-100' : 'bg-indigo-50 border-indigo-100'}`}>
            <div className="flex items-center gap-3">
                <span className="text-xl">{isResistance ? '🐢' : '⚡'}</span>
                <div>
                    <span className={`text-[8px] font-black uppercase tracking-widest block ${isResistance ? 'text-amber-500' : 'text-indigo-500'}`}>
                        {isResistance ? t.results.signal_resistance : t.results.signal_resonance}
                    </span>
                    <span className="text-[10px] font-bold text-slate-800 leading-tight block">
                       {t.beliefs[item.descriptionKey.replace('correlation_resistance_', '').replace('correlation_resonance_', '') as keyof typeof t.beliefs] || 'Pattern'}
                    </span>
                </div>
            </div>
            <span className={`text-[9px] font-mono font-bold ${isResistance ? 'text-amber-700' : 'text-indigo-700'}`}>
                {isResistance ? '> 5s' : 'SYNC'}
            </span>
        </div>
    );
};

const PatternCard: React.FC<{ beliefKey: BeliefKey, t: Translations }> = ({ beliefKey, t }) => {
    const [isOpen, setIsOpen] = useState(false);
    const data = t.pattern_library[beliefKey] || t.pattern_library.default;
    const label = t.beliefs[beliefKey];

    const toggle = () => {
        PlatformBridge.haptic.selection();
        setIsOpen(!isOpen);
    };

    return (
        <div onClick={toggle} className={`border rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer ${isOpen ? 'bg-slate-900 border-slate-800 shadow-2xl scale-[1.02]' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'}`}>
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
                    <div className="h-px bg-slate-800 w-full mb-3"></div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block">{t.results.protection_label}</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{data.protection}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 block">{t.results.cost_label}</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{data.cost}</p>
                    </div>
                    <div className="bg-emerald-900/20 p-3 rounded-xl border border-emerald-500/20 mt-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block mb-1">{t.results.antidote_label}</span>
                        <p className="text-[11px] text-emerald-100 italic leading-relaxed">"{data.antidote}"</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const ClientGuideCard: React.FC<{ t: Translations, lang: 'ru' | 'ka', result: AnalysisResult, onShare: () => void, copySuccess: boolean }> = ({ t, lang, result, onShare, copySuccess }) => {
    
    // Deterministic summary generation
    const getSummary = () => {
        if (result.state.foundation < 40) {
            return lang === 'ru' 
                ? "Ваша система в режиме выживания. Главный приоритет сейчас — восстановление безопасности."
                : "თქვენი სისტემა გადარჩენის რეჟიმშია. მთავარი პრიორიტეტი უსაფრთხოების აღდგენაა.";
        }
        if (result.state.agency > 80 && result.state.foundation < 50) {
            return lang === 'ru'
                ? "Вы держитесь на силе воли, но фундамент истощен. Есть риск выгорания."
                : "თქვენ ნებისყოფით მოძრაობთ, მაგრამ ფუნდამენტი გამოფიტულია. გადაწვის რისკია.";
        }
        if (result.state.entropy > 60) {
            return lang === 'ru'
                ? "В системе много шума и тревоги. Решения даются сложнее, чем обычно."
                : "სისტემაში ბევრი ხმაური და შფოთვაა. გადაწყვეტილებების მიღება გართულებულია.";
        }
        return lang === 'ru'
            ? "Система стабильна, но есть точки напряжения, которые стоит обсудить."
            : "სისტემა სტაბილურია, მაგრამ არის დაძაბულობის წერტილები.";
    };

    return (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem] space-y-6 shadow-sm">
            <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                    <span className="text-sm">🧭</span> {t.results.human_readable_summary}
                </span>
                <p className="text-sm font-bold text-slate-800 leading-snug">
                    {getSummary()}
                </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-indigo-200/50">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {t.results.next_steps_title}
                </span>
                
                <div className="space-y-3">
                    <button onClick={onShare} className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all active:scale-98 ${copySuccess ? 'bg-emerald-100 border-emerald-200' : 'bg-white border-indigo-100'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${copySuccess ? 'bg-emerald-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}>1</div>
                        <div className="flex-1">
                            <span className="text-[10px] font-bold text-slate-700 block">{t.results.step_1}</span>
                            <span className="text-[9px] font-mono text-slate-400 block">{result.shareCode.substring(0, 12)}...</span>
                        </div>
                        {copySuccess && <span className="text-emerald-600 font-bold text-xs">✓</span>}
                    </button>

                    <div className="w-full text-left p-3 rounded-xl border bg-white border-slate-100 flex items-center gap-3 opacity-80">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-slate-100 text-slate-500">2</div>
                        <span className="text-[10px] font-medium text-slate-600">{t.results.step_2}</span>
                    </div>

                    <div className="w-full text-left p-3 rounded-xl border bg-white border-slate-100 flex items-center gap-3 opacity-80">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-slate-100 text-slate-500">3</div>
                        <span className="text-[10px] font-medium text-slate-600">{t.results.step_3}</span>
                    </div>
                </div>
            </div>
            
            <p className="text-[9px] text-slate-400 italic text-center">
                {t.results.next_steps_body}
            </p>
        </div>
    );
};

export const ResultsView = memo<ResultsViewProps>(({ 
  lang, t, result, isGlitchMode, onContinue, onShare, onBack, getSceneText, onOpenBriefExplainer, onNewCycle
}) => {
  const [showPrep, setShowPrep] = useState(false);
  const [activeMetricHelp, setActiveMetricHelp] = useState<string | null>(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const narrative = useMemo(() => generateClinicalNarrative(result, lang), [result, lang]);
  const clientBrief = narrative.level1;

  const history: ScanHistory = useMemo(() => StorageService.getScanHistory(), []);
  const previousScan = useMemo(() => {
      if (!history || history.scans.length === 0) return undefined;
      const curIdx = history.scans.findIndex(s => s.createdAt === result.createdAt);
      return curIdx > 0 ? history.scans[curIdx - 1] : undefined;
  }, [history, result]);

  const archetype = useMemo(() => t.archetypes[result.archetypeKey] || { title: 'Unknown', desc: 'Analysis ongoing' }, [t, result.archetypeKey]);

  const handleCopyCode = () => {
      navigator.clipboard.writeText(result.shareCode);
      setCopySuccess(true);
      PlatformBridge.haptic.notification('success');
      setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!disclaimerAccepted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in px-4 text-center">
         <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-3xl shadow-inner border border-indigo-100/50 animate-pulse">⚖️</div>
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

  const sessionPrepQuestions = SessionPrepService.generate(result, t);

  return (
    <div className={`space-y-10 pb-32 animate-in px-1 pt-2 font-sans ${isGlitchMode ? 'glitch' : ''}`}>
      
      <header className="dark-glass-card p-8 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden border-b-4 border-indigo-500/30">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        {/* BIO SIGNATURE: The Digital Fingerprint (Layer 4 Defense) */}
        <div className="absolute top-4 right-4 opacity-40 mix-blend-screen pointer-events-none">
            <BioSignature 
                f={result.state.foundation} 
                a={result.state.agency} 
                r={result.state.resource} 
                e={result.state.entropy} 
                width={80} 
                height={40}
            />
        </div>

        <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-indigo-400 border-indigo-500/20 uppercase tracking-[0.4em] bg-white/5 px-3 py-1.5 rounded-full border">BLUEPRINT</span>
              <span className={`text-[10px] font-mono font-bold ${result.confidenceScore > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{result.confidenceScore}% CONFIDENCE</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black italic uppercase text-white leading-none tracking-tighter">{archetype.title}</h1>
              <p className="text-sm text-slate-400 font-medium leading-relaxed opacity-85 pt-2 border-l-2 border-indigo-500/50 pl-4">{archetype.desc}</p>
            </div>
            <div className="pt-4">
                <RadarChart points={result.graphPoints} onLabelClick={(m) => setActiveMetricHelp(m)} lang={lang} />
            </div>
        </div>
      </header>

      {/* NEW ACTION COMPASS - HUMAN TRANSLATION LAYER */}
      <ClientGuideCard t={t} lang={lang} result={result} onShare={handleCopyCode} copySuccess={copySuccess} />

      <section className="bg-white border border-slate-100 p-6 rounded-[2.5rem] space-y-4 shadow-sm relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 ${clientBrief.tone === 'alert' ? 'bg-amber-400' : 'bg-indigo-400'}`}></div>
          <div className="flex justify-between items-start">
              <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">STATUS</span>
                  <h3 className="text-lg font-black uppercase text-slate-900 leading-tight">{clientBrief.statusTag}</h3>
              </div>
              {clientBrief.tone === 'alert' && <span className="text-xl">🛡️</span>}
          </div>
          <p className="text-sm font-medium text-slate-600 leading-relaxed">{clientBrief.summary}</p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400 block mb-1">{lang === 'ru' ? 'ФОКУС СЕССИИ' : 'სესიის ფოკუსი'}</span>
              <p className="text-[11px] font-bold text-slate-800 italic">"{clientBrief.focusQuestion}"</p>
          </div>
      </section>

      {/* SESSION EKG (NEW) */}
      <SessionPulseGraph pulse={result.sessionPulse} t={t} />

      {/* PSYCHOMETRIC SIGNATURE (For Mathematicians) */}
      {result.mathSignature && (
          <section className="px-2">
              <div className="p-4 bg-slate-900/5 border border-slate-900/10 rounded-2xl flex items-center justify-between">
                  <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">
                          {lang === 'ru' ? 'ПСИХОМЕТРИЧЕСКАЯ ПОДПИСЬ' : 'ფსიქომეტრიული ხელმოწერა'}
                      </span>
                      <div className="flex gap-4 font-mono text-[10px] font-bold text-slate-600">
                          <span>σ: {result.mathSignature.sigma}ms</span>
                          <span>μ: {result.mathSignature.friction}</span>
                      </div>
                  </div>
                  <div className="text-right">
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">CONSISTENCY</span>
                      <div className={`text-[12px] font-black ${result.mathSignature.volatilityScore > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {result.mathSignature.volatilityScore}%
                      </div>
                  </div>
              </div>
          </section>
      )}

      <EvolutionDashboard history={history} lang={lang} />

      {/* NEW CYCLE TRIGGER */}
      {onNewCycle && (
          <section className="px-2 animate-in">
              <button 
                onClick={onNewCycle}
                className="w-full p-4 bg-slate-900 rounded-[2rem] border border-slate-800 shadow-xl group active:scale-95 transition-all relative overflow-hidden"
              >
                  <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-center relative z-10">
                      <div className="text-left pl-2">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 block mb-1">
                              {t.results.start_new_cycle_btn}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium block">
                              {t.results.new_cycle_desc}
                          </span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg">
                          ↻
                      </div>
                  </div>
              </button>
          </section>
      )}

      {(result.activePatterns && result.activePatterns.length > 0) && (
          <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">{t.results.active_patterns_title}</h3>
                  <span className="text-[8px] font-bold text-indigo-500 animate-pulse">{t.results.tap_to_decode}</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                  {result.activePatterns.map((patternKey) => (
                      <PatternCard key={patternKey} beliefKey={patternKey} t={t} />
                  ))}
              </div>
          </section>
      )}

      {(result.correlations && result.correlations.length > 0) && (
          <section className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">{t.results.decoder_title}</h3>
                  <span className="text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono font-bold">{result.correlations.length} SIGNALS</span>
              </div>
              <div className="space-y-2">
                  {result.correlations.map((item, idx) => (
                      <SignalDecoderItem key={idx} item={item} t={t} />
                  ))}
              </div>
          </section>
      )}

      <div className="space-y-6 px-2">
         {[
            { label: t.results.integrity, value: result.integrity, origin: t.results.origin_measured, color: 'bg-emerald-500', key: 'integrity', previous: previousScan?.integrity },
            { label: t.results.neuro_sync, value: result.neuroSync, origin: t.results.origin_reported, color: 'bg-indigo-500', key: 'neuro_sync', previous: previousScan?.neuroSync }
         ].map(m => (
            <div key={m.label} className="space-y-2" onClick={() => setActiveMetricHelp(activeMetricHelp === m.key ? null : m.key)}>
                <div className="flex justify-between items-end cursor-pointer group">
                    <div className="flex flex-col">
                        <span className="origin-label bg-slate-100 text-slate-400">{m.origin}</span>
                        <div className="flex items-center gap-2">
                             <span className="text-[12px] font-black text-slate-800 uppercase tracking-tighter mt-1">{m.label}</span>
                             <span className="text-[10px] text-slate-300 group-hover:text-indigo-500">?</span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <DeltaBadge current={m.value} previous={m.previous} />
                        <span className="text-lg font-black text-slate-900 ml-2">{m.value}%</span>
                    </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} transition-all duration-1000`} style={{ width: `${m.value}%` }}></div>
                </div>
                {activeMetricHelp === m.key && (
                    <div className="bg-slate-50 p-3 rounded-xl text-[10px] text-slate-600 font-medium leading-tight animate-in border border-slate-100">
                        {t.metric_definitions[m.key === 'neuro_sync' ? 'foundation' : 'integrity']}
                    </div>
                )}
            </div>
         ))}
      </div>

      <section className="bg-indigo-950 p-8 rounded-[2.5rem] border border-white/10 space-y-5 shadow-2xl">
          <button onClick={() => { setShowPrep(!showPrep); PlatformBridge.haptic.impact('light'); }} className="w-full flex justify-between items-center text-left">
            <div className="flex flex-col">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400">{t.results.session_prep}</h3>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">{t.results.session_prep_desc}</span>
            </div>
            <span className={`text-white/40 transition-transform ${showPrep ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {showPrep && (
            <div className="space-y-4 animate-in">
                {sessionPrepQuestions.map((q, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-[10px] font-mono font-black text-indigo-400">Q{i+1}</span>
                     <p className="text-[11px] text-white/90 font-medium leading-relaxed italic">{q}</p>
                  </div>
                ))}
            </div>
          )}
      </section>

      <div className="grid grid-cols-2 gap-3 pt-6">
          <button onClick={onShare} className="py-5 bg-slate-950 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all">{t.results.share_button}</button>
          <button onClick={onBack} className="py-5 bg-white text-slate-900 border border-slate-300 rounded-[2rem] font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">{t.results.back}</button>
      </div>
    </div>
  );
});
