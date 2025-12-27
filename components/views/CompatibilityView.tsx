
import React, { useState, useMemo } from 'react';
import { AnalysisResult, Translations, LifeContext, SessionStep, SubscriptionTier, BeliefKey } from '../../types';
import { CompatibilityEngine } from '../../services/compatibilityEngine';
import { generateClinicalNarrative } from '../../services/clinicalNarratives';
import { ClinicalDecoder } from '../../services/clinicalDecoder';
import { GeminiService } from '../../services/geminiService';
import { PlatformBridge } from '../../utils/helpers';

interface CompatibilityViewProps {
  lang: 'ru' | 'ka';
  licenseTier: SubscriptionTier;
  t: Translations;
  onBack: () => void;
}

const NarrativeSection = ({ title, content, highlight = false, alert = false, special = false, icon, proNote, lang }: { title: string, content: string, highlight?: boolean, alert?: boolean, special?: boolean, icon?: string, proNote?: string, lang: 'ru' | 'ka' }) => (
    <div className={`space-y-2 ${highlight ? 'bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10' : alert ? 'bg-red-950/20 p-4 rounded-xl border border-red-900/30' : special ? 'bg-emerald-950/10 p-4 rounded-xl border border-emerald-900/20' : 'py-3 border-b border-slate-800/50'}`}>
        <h4 className={`text-[9px] font-black uppercase tracking-widest pb-1 flex items-center gap-2 ${alert ? 'text-red-400' : special ? 'text-emerald-400' : highlight ? 'text-indigo-300' : 'text-slate-500'}`}>
            {icon && <span className="text-sm opacity-80">{icon}</span>}
            {title}
        </h4>
        <div className="whitespace-pre-wrap text-[11px] text-slate-300 leading-relaxed font-mono pl-1 opacity-90">
            {content}
        </div>
        {proNote && <ExpertNote content={proNote} lang={lang} />}
    </div>
);

const ExpertNote = ({ content, lang }: { content: string, lang: 'ru' | 'ka' }) => (
    <div className="mt-3 p-3 bg-indigo-500/5 border-l-2 border-indigo-500/40 rounded-r-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-1 opacity-10 pointer-events-none text-[20px]">👨‍🏫</div>
        <span className="text-[7px] font-black uppercase text-indigo-400 tracking-widest block mb-1">
            {lang === 'ru' ? '💡 КОММЕНТАРИЙ СУПЕРВИЗОРА' : '💡 სუპერვაიზერის შენიშვნა'}
        </span>
        <p className="text-[11px] text-slate-500 leading-relaxed font-mono italic">{content}</p>
    </div>
);

const NeuralHeatmap = ({ result, t }: { result: AnalysisResult, t: Translations }) => {
    // Simulated pause detection for LAB
    const pauseZones = result.sessionPulse.filter(p => p.tension > 65);
    return (
        <div className="bg-slate-900/50 border border-indigo-500/30 p-4 rounded-2xl space-y-3">
            <h4 className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">{t.ui.neural_heatmap_title}</h4>
            <div className="grid grid-cols-1 gap-2">
                {pauseZones.length > 0 ? pauseZones.map((p, i) => (
                    <div key={i} className="flex justify-between items-center bg-black/40 p-2 rounded border border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[8px] text-slate-500 uppercase">NODE_{p.id+1} // {p.domain}</span>
                            <span className="text-[10px] text-red-400 font-bold tracking-tight">{t.ui.hesitation_zone} (+{p.tension}%)</span>
                        </div>
                        <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: `${p.tension}%` }}></div>
                        </div>
                    </div>
                )) : <p className="text-[9px] text-slate-600 italic">No significant neural latency detected.</p>}
            </div>
        </div>
    );
};

interface SupervisionCardProps {
    title: string;
    children?: React.ReactNode;
    type?: 'info' | 'alert' | 'secret' | 'trap' | 'system' | 'target';
    proNote?: string;
    lang: 'ru' | 'ka';
}

const SupervisionCard: React.FC<SupervisionCardProps> = ({ title, children, type = 'info', proNote, lang }) => (
    <div className={`rounded-xl border relative overflow-hidden transition-all duration-300 ${
        type === 'alert' ? 'bg-red-950/10 border-red-500/30' : 
        type === 'trap' ? 'bg-fuchsia-950/20 border-fuchsia-500/30' :
        type === 'secret' ? 'bg-indigo-950/30 border-indigo-500/30' : 
        type === 'system' ? 'bg-emerald-950/20 border-emerald-500/30' :
        type === 'target' ? 'bg-indigo-900/20 border-indigo-400/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]' :
        'bg-slate-900/30 border-slate-700/50'
    }`}>
        <div className={`px-3 py-2 border-b text-[8px] font-black uppercase tracking-[0.2em] flex justify-between items-center ${
             type === 'alert' ? 'border-red-500/20 text-red-400' : 
             type === 'trap' ? 'border-fuchsia-500/20 text-fuchsia-400' :
             type === 'secret' ? 'border-indigo-500/20 text-indigo-300' : 
             type === 'system' ? 'border-emerald-500/20 text-emerald-400' :
             type === 'target' ? 'border-indigo-400/20 text-indigo-300' :
             'border-slate-700/50 text-slate-500'
        }`}>
            <span>{title}</span>
            <span>{type === 'alert' ? '⚠️' : 'INFO'}</span>
        </div>
        <div className="p-3">
            {children}
            {proNote && <ExpertNote content={proNote} lang={lang} />}
        </div>
    </div>
);

const VitalMonitor = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="bg-slate-900 rounded p-1.5 min-w-[40px] border border-slate-800/50">
        <span className="text-[6px] uppercase text-slate-500 block tracking-widest mb-0.5">{label}</span>
        <div className="flex items-end gap-1">
            <span className={`text-[10px] font-bold font-mono leading-none ${color}`}>{value}</span>
            <div className="flex-1 h-1 bg-slate-800 rounded-sm overflow-hidden mb-0.5">
                <div className={`h-full ${color.replace('text-', 'bg-')} opacity-60`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    </div>
);

const ContextBadge = ({ ctx, t }: { ctx: LifeContext, t: Translations }) => {
    const opts = t.context_check.options;
    const current = opts[ctx] || opts.NORMAL;
    return (
        <div className="bg-indigo-900/40 border border-indigo-500/30 p-3 rounded-xl mb-4 flex items-center gap-3">
            <span className="text-xl">🕶️</span>
            <div>
                <span className="text-[7px] font-black uppercase text-indigo-400 tracking-widest block">CONTEXT_VERIFIED</span>
                <span className="text-[10px] font-bold text-white uppercase">{current.label}</span>
                <p className="text-[8px] text-slate-500 italic leading-none mt-0.5">{current.sub}</p>
            </div>
        </div>
    );
};

const SessionArc = ({ steps }: { steps: SessionStep[] }) => (
    <div className="grid grid-cols-1 gap-2 my-4">
        {steps.map((step, idx) => (
            <div key={idx} className="flex gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800 items-start">
                <div className={`flex flex-col items-center justify-center w-8 shrink-0 space-y-1 pt-1`}>
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-indigo-500' : 'bg-slate-500'}`}></div>
                    <div className="w-0.5 h-6 bg-slate-800 last:hidden"></div>
                </div>
                <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 block mb-0.5">Step {idx + 1}: {step.phase}</span>
                    <h5 className="text-[10px] font-bold text-slate-200 uppercase">{step.title}</h5>
                    <p className="text-[10px] text-slate-400 leading-tight mt-1 font-mono opacity-80">{step.action}</p>
                </div>
            </div>
        ))}
    </div>
);

export const CompatibilityView: React.FC<CompatibilityViewProps> = ({ lang, licenseTier, t, onBack }) => {
  const [partnerCode, setPartnerCode] = useState('');
  const [clientResult, setClientResult] = useState<AnalysisResult | null>(null);
  const [systemReport, setSystemReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const ph = t.pro_headers;
  const pt = t.pro_terminal;

  const handleAnalyze = () => {
    const decodedClient = CompatibilityEngine.decodeSmartCode(partnerCode);
    if (decodedClient) {
        setClientResult(decodedClient);
        setSystemReport(null);
        PlatformBridge.haptic.notification('success');
    } else {
        PlatformBridge.haptic.notification('error');
    }
  };

  const handleExportCRM = () => {
      if (!clientResult) return;
      const data = {
          clientId: clientResult.shareCode.substring(0, 12),
          timestamp: new Date().toISOString(),
          metrics: clientResult.state,
          archetype: clientResult.archetypeKey,
          verdict: clientResult.verdictKey,
          somaticDissonance: clientResult.somaticDissonance,
          telemetry: licenseTier === 'LAB' ? clientResult.sessionPulse : undefined
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GENESIS_CRM_EXPORT_${data.clientId}.json`;
      a.click();
      PlatformBridge.haptic.notification('success');
  };

  const runSupervisorProtocol = async () => {
      if (!clientResult) return;
      setLoadingReport(true);
      const report = await GeminiService.generateClinicalSupervision(clientResult, lang);
      setSystemReport(report);
      setLoadingReport(false);
  };

  const interpretation = useMemo(() => {
      if (!clientResult || clientResult.validity === 'BREACH') return null;
      const legacy = ClinicalDecoder.decode(clientResult, t);
      const narrative = generateClinicalNarrative(clientResult, lang);
      
      let priority = "";
      let priorityLevel: 'low' | 'medium' | 'high' = 'low';
      
      const f = clientResult.state.foundation;
      const a = clientResult.state.agency;
      const s = clientResult.neuroSync;

      if (f < 30) {
          priority = lang === 'ru' ? "🛑 АВАРИЙНЫЙ РЕЖИМ (CRITICAL)" : "🛑 ავარიული რეჟიმი";
          priorityLevel = 'high';
      } else if (a > 80 && f < 40) {
          priority = lang === 'ru' ? "⚠️ РИСК СРЫВА (MANIC DEFENSE)" : "⚠️ ჩავარდნის რისკი";
          priorityLevel = 'high';
      } else if (s < 40) {
          priority = lang === 'ru' ? "🧊 ДИССОЦИАЦИЯ (FREEZE)" : "🧊 დისოციაცია";
          priorityLevel = 'medium';
      } else {
          priority = lang === 'ru' ? "✅ ШТАТНЫЙ РЕЖИМ (STABLE)" : "✅ შტატური რეჟიმი";
          priorityLevel = 'low';
      }

      return {
          ...legacy,
          narrative: narrative.level2,
          priority,
          priorityLevel
      };
  }, [clientResult, t, lang]);

  const isLab = licenseTier === 'LAB';

  return (
    <section className={`space-y-6 animate-in py-4 flex flex-col h-full ${isLab ? 'bg-slate-950 text-emerald-400' : 'bg-white'}`}>
        <div className={`flex justify-between items-center px-1 pb-2 border-b shrink-0 ${isLab ? 'border-emerald-900/50' : 'border-indigo-100/50'}`}>
            <button onClick={onBack} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase active:scale-95 transition-all ${isLab ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-100 text-slate-600'}`}>
                ← {t.global.back}
            </button>
            <div className="flex flex-col items-end">
                 <span className={`text-[10px] font-mono font-black tracking-widest ${isLab ? 'text-emerald-500' : 'text-indigo-600'}`}>{isLab ? 'OVERSIGHT_STATION_v9.9' : pt.title}</span>
                 <span className={`text-[7px] font-mono uppercase ${isLab ? 'text-emerald-700' : 'text-slate-400'}`}>{isLab ? 'RESEARCH_MODE_ACTIVE' : 'Supervisor OS v6.8'}</span>
            </div>
        </div>

        {!clientResult && (
            <div className="space-y-4 animate-in">
                <div className={`p-6 rounded-[2rem] border text-center space-y-4 ${isLab ? 'bg-black/60 border-emerald-900' : 'bg-slate-50 border-slate-100'}`}>
                    <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-sm ${isLab ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-white'}`}>🔐</div>
                    <div>
                        <h3 className={`text-sm font-black uppercase ${isLab ? 'text-white' : 'text-slate-900'}`}>{pt.access_restricted}</h3>
                        <p className="text-[10px] text-slate-500 font-medium mt-1 max-w-[200px] mx-auto">{pt.enter_code}</p>
                    </div>
                </div>
                <div className={`flex gap-2 p-2 rounded-2xl border ${isLab ? 'bg-emerald-950/20 border-emerald-900' : 'bg-slate-50 border-slate-100'}`}>
                    <input 
                        type="text" 
                        placeholder={pt.paste_placeholder}
                        className={`flex-1 rounded-xl px-4 py-3 font-mono text-xs uppercase outline-none transition-all ${isLab ? 'bg-black border border-emerald-500/30 text-emerald-400' : 'bg-white border border-slate-200 text-indigo-600'}`}
                        value={partnerCode}
                        onChange={e => setPartnerCode(e.target.value)}
                    />
                    <button onClick={handleAnalyze} className={`px-6 rounded-xl font-black text-[10px] uppercase shadow-lg transition-all ${isLab ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-indigo-600 text-white'}`}>
                        {pt.decrypt_btn}
                    </button>
                </div>
            </div>
        )}

        {clientResult && interpretation && (
            <div className={`p-5 rounded-[2rem] space-y-6 border shadow-2xl relative animate-in flex-1 overflow-y-auto custom-scrollbar font-mono ${isLab ? 'bg-black border-emerald-500/30' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>
                
                <div className="border-b border-slate-800 pb-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                            <span className={`text-[8px] font-black uppercase tracking-widest block ${isLab ? 'text-emerald-600' : 'text-emerald-500'}`}>{pt.client_id_label}</span>
                            <span className={`text-[10px] font-mono font-bold tracking-wider ${isLab ? 'text-emerald-400' : 'text-emerald-500'}`}>{clientResult.shareCode.substring(0, 12)}...</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            {interpretation.priorityLevel === 'high' && <span className="bg-red-950/50 text-red-400 border border-red-900/50 px-2 py-0.5 rounded text-[7px] font-black uppercase">{pt.risk_high}</span>}
                            <button onClick={handleExportCRM} className={`text-[7px] font-black uppercase px-2 py-1 rounded border transition-colors ${isLab ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/40' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                {t.ui.export_crm_btn}
                            </button>
                        </div>
                    </div>

                    <ContextBadge ctx={clientResult.context} t={t} />

                    <div className={`p-3 rounded-xl border-l-4 shadow-lg flex items-center gap-3 ${
                        interpretation.priorityLevel === 'high' ? 'bg-red-950/20 border-red-500/50 text-red-200' :
                        'bg-emerald-950/20 border-emerald-500/50 text-emerald-200'
                    }`}>
                        <span className="text-xl">{interpretation.priorityLevel === 'high' ? '🛑' : '✅'}</span>
                        <div>
                            <span className="text-[7px] font-black uppercase tracking-widest opacity-60 block">{pt.verdict_protocol}</span>
                            <p className="text-[10px] font-bold leading-tight">{interpretation.priority}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        <VitalMonitor label="FND" value={Math.round(clientResult.state.foundation)} color="text-slate-200" />
                        <VitalMonitor label="AGC" value={Math.round(clientResult.state.agency)} color="text-blue-400" />
                        <VitalMonitor label="RES" value={Math.round(clientResult.state.resource)} color="text-amber-400" />
                        <VitalMonitor label="ENT" value={Math.round(clientResult.state.entropy)} color={clientResult.state.entropy > 40 ? 'text-red-400' : 'text-emerald-400'} />
                    </div>
                </div>

                {isLab && (
                    <div className="space-y-4 animate-in">
                        <div className="bg-emerald-950/10 p-4 rounded-xl border border-emerald-500/30 space-y-4">
                            <h4 className="text-[9px] font-black uppercase text-emerald-400 tracking-widest flex justify-between">
                                <span>{t.ui.semantic_audit_title}</span>
                                <span className="text-emerald-600">OVERSIGHT ACTIVE</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[7px] text-slate-500 uppercase">{t.ui.reliability_index}</span>
                                    <p className="text-[12px] text-white font-bold">{clientResult.confidenceScore}%</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[7px] text-slate-500 uppercase">{t.ui.semantic_drift}</span>
                                    <p className="text-[12px] text-red-400 font-bold">{100 - clientResult.confidenceScore}%</p>
                                </div>
                            </div>
                        </div>

                        <NeuralHeatmap result={clientResult} t={t} />
                        
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                            <h4 className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-3">{t.ui.differential_matrix}</h4>
                            <div className="space-y-2">
                                {interpretation.narrative.differentialHypotheses.map((h, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-[9px]">
                                            <span className="text-emerald-200">{h.label}</span>
                                            <span className="text-emerald-500 font-mono">w={(h.probability * 10).toFixed(1)}</span>
                                        </div>
                                        <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500" style={{ width: `${h.probability * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <h4 className={`text-[9px] font-black uppercase tracking-[0.2em] pl-1 ${isLab ? 'text-emerald-600' : 'text-indigo-400'}`}>{ph.evolution_vector}</h4>
                    <SupervisionCard title={ph.target_state} type="target" proNote={interpretation.narrative.evolutionProcess} lang={lang}>
                        <p className={`text-[10px] font-bold leading-relaxed ${isLab ? 'text-white' : 'text-indigo-100'}`}>{interpretation.narrative.evolutionGoal}</p>
                    </SupervisionCard>
                </div>

                <div className="space-y-3">
                    <h4 className={`text-[9px] font-black uppercase tracking-[0.2em] pl-1 ${isLab ? 'text-emerald-800' : 'text-slate-600'}`}>{ph.supervision_layer}</h4>
                    {!systemReport ? (
                        <button onClick={runSupervisorProtocol} disabled={loadingReport} className={`w-full py-3 border rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 ${isLab ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/50'}`}>
                            {loadingReport ? pt.calculating : `⚡ ${pt.run_protocol}`}
                        </button>
                    ) : (
                        <SupervisionCard title={pt.supervisor_note} type="system" lang={lang}>
                            <div className="whitespace-pre-wrap text-[11px] text-emerald-100 leading-relaxed font-mono opacity-90">{systemReport}</div>
                        </SupervisionCard>
                    )}
                    
                    <div className="grid grid-cols-1 gap-3">
                        <SupervisionCard title={ph.shadow_contract} type="secret" proNote={interpretation.narrative.shadowContractExpl} lang={lang}>
                            <p className="text-[8px] text-indigo-400 uppercase font-black mb-1">{pt.shadow_mechanic}:</p>
                            <p className={`text-[10px] italic leading-relaxed ${isLab ? 'text-emerald-100' : 'text-slate-300'}`}>"{interpretation.narrative.shadowContract}"</p>
                        </SupervisionCard>
                    </div>
                </div>

                <div className={`space-y-4 pt-4 border-t ${isLab ? 'border-emerald-900/50' : 'border-slate-800'}`}>
                    <NarrativeSection title={ph.deep_analysis} content={interpretation.narrative.deepAnalysis} highlight proNote={interpretation.narrative.deepExpl} lang={lang} />
                    <NarrativeSection title={ph.behavior_markers} content={interpretation.narrative.behavioralMarkers} icon="👀" proNote={interpretation.narrative.behaviorExpl} lang={lang} />
                    
                    <div className={`p-4 rounded-xl border-l-2 ${isLab ? 'bg-black/60 border-emerald-500' : 'bg-amber-950/10 border-amber-500/50'}`}>
                        <h4 className={`text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 ${isLab ? 'text-emerald-400' : 'text-amber-500'}`}><span>⚡</span> {pt.clinical_hypotheses}</h4>
                        <div className="whitespace-pre-wrap text-[11px] text-slate-300 leading-relaxed font-mono opacity-90 mb-3">{interpretation.narrative.clinicalHypotheses}</div>
                        <ExpertNote content={interpretation.narrative.hypoExpl} lang={lang} />
                    </div>

                    <div className={`p-4 rounded-xl border ${isLab ? 'bg-black/80 border-emerald-500/50' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
                         <h4 className={`text-[9px] font-black uppercase tracking-widest mb-3 ${isLab ? 'text-emerald-400' : 'text-emerald-400'}`}>{ph.clinical_interventions}</h4>
                         <div className="space-y-3">
                            {interpretation.narrative.interventions.map((int, i) => (
                                <div key={i} className={`p-2 rounded border ${isLab ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-black/40 border-emerald-500/20'}`}>
                                    <span className="text-[7px] text-emerald-500 uppercase font-black block mb-1">{int.type} // {int.purpose}</span>
                                    <p className="text-[10px] text-emerald-100 italic leading-snug">"{int.text}"</p>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800 text-center space-y-4">
                     <p className="text-[8px] text-slate-600 uppercase max-w-[220px] mx-auto border border-slate-800 p-2 rounded leading-relaxed">{t.clinical_decoder.disclaimer}</p>
                     <button onClick={() => setClientResult(null)} className={`text-[9px] font-black uppercase tracking-widest transition-all px-4 py-3 rounded-lg border w-full ${isLab ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-500' : 'bg-red-950/20 border-red-900/30 text-red-400 hover:text-red-300'}`}>[ {pt.close_session} ]</button>
                </div>
            </div>
        )}
    </section>
  );
};
