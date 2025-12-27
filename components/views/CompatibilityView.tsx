
import React, { useState, useMemo } from 'react';
import { AnalysisResult, Translations, SessionStep, LifeContext } from '../../types';
import { CompatibilityEngine } from '../../services/compatibilityEngine';
import { generateClinicalNarrative } from '../../services/clinicalNarratives';
import { PlatformBridge } from '../../utils/helpers';
import { ClinicalDecoder } from '../../services/clinicalDecoder';
import { GeminiService } from '../../services/geminiService';

interface CompatibilityViewProps {
  lang: 'ru' | 'ka';
  onUnlockPro: () => void;
  t: Translations;
  onBack: () => void;
}

const NarrativeSection = ({ title, content, highlight = false, alert = false, special = false, icon, proNote, lang }: { title: string, content: string, highlight?: boolean, alert?: boolean, special?: boolean, icon?: string, proNote?: string, lang: 'ru' | 'ka' }) => (
    <div className={`space-y-2 ${highlight ? 'bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10' : alert ? 'bg-red-950/20 p-4 rounded-xl border border-red-900/30' : special ? 'bg-emerald-950/10 p-4 rounded-xl border border-emerald-900/20' : 'py-3 border-b border-slate-800/50'}`}>
        <h4 className={`text-[9px] font-black uppercase tracking-widest pb-1 flex items-center gap-2 ${alert ? 'text-red-400' : special ? 'text-emerald-400' : highlight ? 'text-indigo-300' : 'text-slate-500'}`}>
            {icon && <span className="text-sm opacity-80">{icon}</span>}
            {title}
        </h4>
        <div className="whitespace-pre-wrap text-[10px] text-slate-300 leading-relaxed font-mono pl-1 opacity-90">
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
        <p className="text-[9px] text-slate-500 leading-relaxed font-mono italic">{content}</p>
    </div>
);

const SupervisionCard = ({ title, children, type = 'info', proNote, lang }: { title: string, children?: React.ReactNode, type?: 'info' | 'alert' | 'secret' | 'trap' | 'system' | 'target', proNote?: string, lang: 'ru' | 'ka' }) => (
    <div className={`rounded-xl border relative overflow-hidden transition-all duration-300 ${
        type === 'alert' ? 'bg-red-950/10 border-red-500/30' : 
        type === 'trap' ? 'bg-fuchsia-950/20 border-fuchsia-500/30' :
        type === 'secret' ? 'bg-indigo-950/30 border-indigo-500/30' : 
        type === 'system' ? 'bg-emerald-950/20 border-emerald-500/30' :
        type === 'target' ? 'bg-indigo-900/20 border-indigo-400/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]' :
        'bg-slate-900/30 border-slate-700/50'
    }`}>
        {type === 'secret' && <div className="absolute top-0 right-0 p-2 text-[40px] opacity-5 pointer-events-none">🔒</div>}
        {type === 'trap' && <div className="absolute top-0 right-0 p-2 text-[40px] opacity-5 pointer-events-none">🕸️</div>}
        {type === 'target' && <div className="absolute top-0 right-0 p-2 text-[40px] opacity-10 pointer-events-none">🎯</div>}
        <div className={`px-3 py-2 border-b text-[8px] font-black uppercase tracking-[0.2em] flex justify-between items-center ${
             type === 'alert' ? 'border-red-500/20 text-red-400' : 
             type === 'trap' ? 'border-fuchsia-500/20 text-fuchsia-400' :
             type === 'secret' ? 'border-indigo-500/20 text-indigo-300' : 
             type === 'system' ? 'border-emerald-500/20 text-emerald-400' :
             type === 'target' ? 'border-indigo-400/20 text-indigo-300' :
             'border-slate-700/50 text-slate-500'
        }`}>
            <span>{title}</span>
            <span>{type === 'alert' ? '⚠️' : type === 'trap' ? 'TRAP' : type === 'target' ? 'GOAL' : 'INFO'}</span>
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
                <span className="text-[7px] font-black uppercase text-indigo-400 tracking-widest block">LENS_CONTEXT_VERIFIED</span>
                <span className="text-[10px] font-bold text-white uppercase">{current.label}</span>
                <p className="text-[8px] text-slate-500 italic leading-none mt-0.5">{current.sub}</p>
            </div>
        </div>
    );
};

export const CompatibilityView: React.FC<CompatibilityViewProps> = ({ lang, t, onBack }) => {
  const [partnerCode, setPartnerCode] = useState('');
  const [clientResult, setClientResult] = useState<AnalysisResult | null>(null);
  const [systemReport, setSystemReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const cd = t.clinical_decoder;
  const ph = t.pro_headers;

  const handleAnalyze = () => {
    const decodedClient = CompatibilityEngine.decodeSmartCode(partnerCode);
    if (decodedClient) {
        setClientResult(decodedClient);
        setSystemReport(null);
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success');
    } else {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('error');
    }
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

  return (
    <section className="space-y-6 animate-in py-4 flex flex-col h-full bg-white">
        <div className="flex justify-between items-center px-1 pb-2 border-b border-indigo-100/50 shrink-0">
            <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-600 active:scale-95 transition-all">
                ← {t.global.back}
            </button>
            <div className="flex flex-col items-end">
                 <span className="text-[10px] font-mono text-indigo-600 font-black tracking-widest">{t.pro_terminal.title}</span>
                 <span className="text-[7px] font-mono text-slate-400 uppercase">Supervisor OS v6.0</span>
            </div>
        </div>

        {!clientResult && (
            <div className="space-y-4 animate-in">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-sm">🔐</div>
                    <div>
                        <h3 className="text-sm font-black uppercase text-slate-900">{t.pro_terminal.access_restricted}</h3>
                        <p className="text-[10px] text-slate-500 font-medium mt-1 max-w-[200px] mx-auto">{t.pro_terminal.enter_code}</p>
                    </div>
                </div>
                <div className="flex gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                    <input 
                        type="text" 
                        placeholder={t.pro_terminal.paste_placeholder}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-mono text-xs uppercase text-indigo-600 outline-none"
                        value={partnerCode}
                        onChange={e => setPartnerCode(e.target.value)}
                    />
                    <button onClick={handleAnalyze} className="bg-indigo-600 text-white px-6 rounded-xl font-black text-[10px] uppercase shadow-lg">
                        {t.pro_terminal.decrypt_btn}
                    </button>
                </div>
            </div>
        )}

        {clientResult && interpretation && (
            <div className="bg-slate-950 text-slate-400 p-5 rounded-[2rem] space-y-6 border border-slate-800 shadow-2xl relative animate-in flex-1 overflow-y-auto custom-scrollbar font-mono">
                
                <div className="border-b border-slate-800 pb-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                            <span className="text-[8px] text-emerald-500 font-black uppercase tracking-widest block">CLIENT_ID</span>
                            <span className="text-[10px] text-emerald-500 font-mono font-bold tracking-wider">{clientResult.shareCode.substring(0, 8)}</span>
                        </div>
                        <div className="flex gap-1">
                            {interpretation.priorityLevel === 'high' && <span className="bg-red-950/50 text-red-400 border border-red-900/50 px-2 py-0.5 rounded text-[7px] font-black uppercase">{t.pro_terminal.risk_high}</span>}
                        </div>
                    </div>

                    <ContextBadge ctx={clientResult.context} t={t} />

                    <div className={`p-3 rounded-xl border-l-4 shadow-lg flex items-center gap-3 ${
                        interpretation.priorityLevel === 'high' ? 'bg-red-950/20 border-red-500/50 text-red-200' :
                        'bg-emerald-950/20 border-emerald-500/50 text-emerald-200'
                    }`}>
                        <span className="text-xl">{interpretation.priorityLevel === 'high' ? '🛑' : '✅'}</span>
                        <div>
                            <span className="text-[7px] font-black uppercase tracking-widest opacity-60 block">{t.pro_terminal.verdict_protocol}</span>
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

                <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl space-y-3">
                    <h4 className="text-[9px] font-black uppercase text-red-400 tracking-widest">{ph.signal_check}</h4>
                    <p className="text-[10px] text-slate-300 italic">Code: {clientResult.validity}</p>
                    <ExpertNote content={interpretation.narrative.validityExpl} lang={lang} />
                </div>

                <div className="space-y-3">
                    <h4 className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em] pl-1">{ph.evolution_vector}</h4>
                    <SupervisionCard title={ph.target_state} type="target" proNote={interpretation.narrative.evolutionProcess} lang={lang}>
                        <p className="text-[10px] text-indigo-100 font-bold leading-relaxed">{interpretation.narrative.evolutionGoal}</p>
                    </SupervisionCard>
                </div>

                <div className="space-y-3">
                    <h4 className="text-[9px] font-black uppercase text-slate-600 tracking-[0.2em] pl-1">{ph.supervision_layer}</h4>
                    {!systemReport ? (
                        <button onClick={runSupervisorProtocol} disabled={loadingReport} className="w-full py-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-[9px] font-black text-emerald-400 uppercase hover:bg-emerald-950/50 transition-all flex items-center justify-center gap-2">
                            {loadingReport ? t.pro_terminal.calculating : `⚡ ${t.pro_terminal.run_protocol}`}
                        </button>
                    ) : (
                        <SupervisionCard title={t.pro_terminal.supervisor_note} type="system" lang={lang}>
                            <div className="whitespace-pre-wrap text-[10px] text-emerald-100 leading-relaxed font-mono opacity-90">{systemReport}</div>
                        </SupervisionCard>
                    )}
                    
                    <div className="grid grid-cols-1 gap-3">
                        <SupervisionCard title={ph.shadow_contract} type="secret" proNote={interpretation.narrative.shadowContractExpl} lang={lang}>
                            <p className="text-[8px] text-indigo-400 uppercase font-black mb-1">Unconscious Sabotage Mechanic:</p>
                            <p className="text-[10px] text-slate-300 italic leading-relaxed">"{interpretation.narrative.shadowContract}"</p>
                        </SupervisionCard>

                        <SupervisionCard title={ph.differential_diagnosis} type="info" proNote={interpretation.narrative.diffExpl} lang={lang}>
                            <div className="space-y-2">
                                {interpretation.narrative.differentialHypotheses.map((h, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-1">
                                        <span className="text-[9px] text-slate-300">{h.label}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500" style={{ width: `${h.probability * 100}%` }}></div>
                                            </div>
                                            <span className="text-[8px] text-indigo-400 font-mono">{(h.probability * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SupervisionCard>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-[9px] font-black uppercase text-emerald-500 tracking-[0.2em] pl-1">{ph.systemic_forces}</h4>
                    {interpretation.narrative.systemicVectors.map((v, i) => (
                        <SupervisionCard key={i} title={v.origin} type="system" proNote={v.proNote} lang={lang}>
                             <p className="text-[10px] text-emerald-100 font-bold">{v.description}</p>
                             <div className="flex items-center gap-2 mt-2">
                                 <span className="text-[7px] text-emerald-400 uppercase font-black tracking-widest">STRENGTH</span>
                                 <span className="text-[9px] font-mono text-emerald-500">{v.strength}%</span>
                             </div>
                        </SupervisionCard>
                    ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <NarrativeSection title={ph.deep_analysis} content={interpretation.narrative.deepAnalysis} highlight proNote={interpretation.narrative.deepExpl} lang={lang} />
                    <NarrativeSection title={ph.behavior_markers} content={interpretation.narrative.behavioralMarkers} icon="👀" proNote={interpretation.narrative.behaviorExpl} lang={lang} />
                    
                    <div className="bg-amber-950/10 p-4 rounded-xl border-l-2 border-amber-500/50">
                        <h4 className="text-[9px] font-black uppercase text-amber-500 tracking-widest mb-2 flex items-center gap-2"><span>⚡</span> {t.pro_terminal.clinical_hypotheses}</h4>
                        <div className="whitespace-pre-wrap text-[10px] text-slate-300 leading-relaxed font-mono opacity-90 mb-3">{interpretation.narrative.clinicalHypotheses}</div>
                        <ExpertNote content={interpretation.narrative.hypoExpl} lang={lang} />
                    </div>

                    <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30">
                         <h4 className="text-[9px] font-black uppercase text-emerald-400 tracking-widest mb-3">{ph.clinical_interventions}</h4>
                         <div className="space-y-3">
                            {interpretation.narrative.interventions.map((int, i) => (
                                <div key={i} className="p-2 bg-black/40 rounded border border-emerald-500/20">
                                    <span className="text-[7px] text-emerald-500 uppercase font-black block mb-1">{int.type} // {int.purpose}</span>
                                    <p className="text-[10px] text-emerald-100 italic leading-snug">"{int.text}"</p>
                                </div>
                            ))}
                         </div>
                         <div className="mt-4 border-t border-emerald-500/20 pt-3">
                            <ExpertNote content={interpretation.narrative.interExpl} lang={lang} />
                         </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800 text-center space-y-4">
                     <p className="text-[8px] text-slate-600 uppercase max-w-[220px] mx-auto border border-slate-800 p-2 rounded leading-relaxed">{cd.disclaimer}</p>
                     <button onClick={() => setClientResult(null)} className="text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors bg-red-950/20 px-4 py-3 rounded-lg border border-red-900/30 w-full">[ {t.pro_terminal.close_session} ]</button>
                </div>
            </div>
        )}
    </section>
  );
};
