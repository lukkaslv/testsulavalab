
import React, { useState, useMemo } from 'react';
import { AnalysisResult, Translations } from '../../types';
import { CompatibilityEngine } from '../../services/compatibilityEngine';
import { generateClinicalNarrative } from '../../services/clinicalNarratives';
import { ClinicalDecoder } from '../../services/clinicalDecoder';
import { SupervisorService } from '../../services/supervisorService';
import { PlatformBridge } from '../../utils/helpers';

interface CompatibilityViewProps {
  lang: 'ru' | 'ka';
  t: Translations;
  onBack: () => void;
}

const VitalMonitor = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="bg-slate-900 rounded p-2 min-w-[50px] border border-slate-800/50">
        <span className="text-[7px] uppercase text-slate-500 block tracking-widest mb-1">{label}</span>
        <div className="flex items-end gap-1">
            <span className={`text-[12px] font-bold font-mono leading-none ${color}`}>{value}</span>
            <div className="flex-1 h-1.5 bg-slate-800 rounded-sm overflow-hidden mb-0.5">
                <div className={`h-full ${color.replace('text-', 'bg-')} opacity-80`} style={{ width: `${Math.min(100, value)}%` }}></div>
            </div>
        </div>
    </div>
);

const ProbabilityMatrix = ({ probs }: { probs: any }) => (
    <div className="grid grid-cols-2 gap-2">
        {Object.entries(probs || {}).map(([key, val]: [string, any]) => (
            <div key={key} className="bg-black/40 border border-slate-800 p-3 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-black text-slate-500 uppercase">{key}</span>
                    <span className={`text-[10px] font-bold ${val > 70 ? 'text-red-400' : 'text-emerald-400'}`}>{Math.round(val)}%</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${val > 70 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${val}%` }}></div>
                </div>
            </div>
        ))}
    </div>
);

const CollapsibleBlock = ({ title, icon, children, badge, isOpenDefault = false }: { title: any, icon: string, children?: React.ReactNode, badge?: string, isOpenDefault?: boolean }) => {
    const [isOpen, setIsOpen] = useState(isOpenDefault);
    return (
        <div className={`border rounded-2xl transition-all duration-300 overflow-hidden ${isOpen ? 'bg-slate-900 border-indigo-500/30 shadow-2xl' : 'bg-slate-950 border-slate-800 shadow-sm'}`}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex justify-between items-center group">
                <div className="flex items-center gap-3">
                    <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
                    <div className="text-left">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">{title}</h4>
                        {badge && <span className="text-[7px] text-indigo-400 font-mono font-bold uppercase">{badge}</span>}
                    </div>
                </div>
                <span className={`text-sm transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && <div className="px-4 pb-5 pt-1 space-y-4 animate-in">{children}</div>}
        </div>
    );
};

export const CompatibilityView: React.FC<CompatibilityViewProps> = ({ lang, t, onBack }) => {
  const [partnerCode, setPartnerCode] = useState('');
  const [clientResult, setClientResult] = useState<AnalysisResult | null>(null);
  const [supervisionReport, setSupervisionReport] = useState<string | null>(null);
  const [loadingSupervision, setLoadingSupervision] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const pt = t.pro_terminal;
  const ph = t.pro_headers;
  
  const handleAnalyze = () => {
    const decodedClient = CompatibilityEngine.decodeSmartCode(partnerCode);
    if (decodedClient) {
        setClientResult(decodedClient);
        setSupervisionReport(null);
        PlatformBridge.haptic.notification('success');
    } else {
        PlatformBridge.haptic.notification('error');
    }
  };

  const handleRunSupervision = async () => {
      if (!clientResult) return;
      setLoadingSupervision(true);
      const report = await SupervisorService.generateClinicalSupervision(clientResult, lang, t);
      setSupervisionReport(report);
      setLoadingSupervision(false);
      PlatformBridge.haptic.notification('success');
  };

  const handleCopyDossier = () => {
      if (!supervisionReport) return;
      navigator.clipboard.writeText(supervisionReport);
      setCopySuccess(true);
      PlatformBridge.haptic.notification('success');
      setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleExportMarkdown = () => {
      if (!clientResult || !interpretation) return;
      const md = `
# GENESIS OS // CLINICAL REPORT
**Client ID:** ${clientResult.shareCode.substring(0, 12)}
**Status:** ${interpretation.priority}

## Vitals
- Foundation: ${clientResult.state.foundation}%
- Agency: ${clientResult.state.agency}%
- Resource: ${clientResult.state.resource}%
- Entropy: ${clientResult.state.entropy}%

## Profile
- Archetype: ${interpretation.archetype.title}
- Verdict: ${interpretation.verdict.label}
- Primary Defense: ${interpretation.narrative.primaryDefense}

## Clinical Strategy
${interpretation.narrative.clinicalStrategy.map((s: string, i: number) => `${i+1}. ${s}`).join('\n')}

---
Generated by Genesis OS v4.0
      `;
      navigator.clipboard.writeText(md.trim());
      PlatformBridge.haptic.notification('success');
      alert(lang === 'ru' ? "Краткий отчет скопирован как Markdown" : "მოკლე ანგარიში კოპირებულია Markdown ფორმატში");
  };

  const interpretation = useMemo(() => {
      if (!clientResult) return null;
      const rawInterpretation = ClinicalDecoder.decode(clientResult, t) as any;
      const narrative = generateClinicalNarrative(clientResult, lang);
      
      const archetype = t.archetypes[clientResult.archetypeKey] || t.archetypes.THE_ARCHITECT;
      const verdict = t.verdicts[clientResult.verdictKey] || t.verdicts.HEALTHY_SCALE;

      // Priority Logic
      let priority = "";
      let priorityLevel: 'low' | 'medium' | 'high' = 'low';
      if (clientResult.state.foundation < 35 || clientResult.state.entropy > 75) {
          priority = lang === 'ru' ? "🛑 ВЫСОКИЙ РИСК" : "🛑 მაღალი რისკი";
          priorityLevel = 'high';
      } else if (clientResult.neuroSync < 45) {
          priority = lang === 'ru' ? "⚠️ ДИССОЦИАЦИЯ" : "⚠️ დისოციაცია";
          priorityLevel = 'medium';
      } else {
          priority = lang === 'ru' ? "✅ НОМИНАЛЬНО" : "✅ ნომინალური";
          priorityLevel = 'low';
      }

      return { 
          ...rawInterpretation, 
          narrative: narrative.level2,
          archetype,
          verdict,
          priority,
          priorityLevel
      };
  }, [clientResult, t, lang]);

  return (
    <section className={`animate-in py-4 flex flex-col h-full overflow-hidden bg-slate-950 text-slate-400 font-mono`}>
        
        {/* HEADER BAR */}
        <div className={`flex justify-between items-center px-4 pb-4 border-b border-slate-800 shrink-0`}>
            <button onClick={onBack} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase active:scale-95 transition-all bg-emerald-900/10 text-emerald-500 border border-emerald-500/20`}>
                ← {t.global.back}
            </button>
            <div className="flex flex-col items-end">
                 <span className={`text-[10px] font-mono font-black tracking-widest text-emerald-500 italic`}>NEURAL_SCALPEL_v6.0</span>
                 <span className="text-[7px] text-slate-600 uppercase">{pt.diagnostic_protocol}</span>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar scrolling-touch">
            {!clientResult ? (
                <div className="h-full flex flex-col items-center justify-center p-6 space-y-6 max-w-sm mx-auto animate-in">
                    <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl shadow-2xl animate-pulse">🔬</div>
                    <div className="text-center space-y-3 w-full">
                        <input 
                            type="text" 
                            placeholder={pt.paste_placeholder}
                            className={`w-full rounded-xl px-5 py-4 font-mono text-xs uppercase outline-none text-center bg-black border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]`}
                            value={partnerCode}
                            onChange={e => setPartnerCode(e.target.value)}
                        />
                        <button onClick={handleAnalyze} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black text-[11px] uppercase transition-all active:scale-95 shadow-xl">
                            {pt.initiate_decrypt}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-4 space-y-4 animate-in pb-32">
                    
                    {/* PRIORITY INDICATOR */}
                    <div className={`p-4 rounded-2xl border-l-4 shadow-xl flex items-center justify-between ${interpretation.priorityLevel === 'high' ? 'bg-red-950/20 border-red-500' : interpretation.priorityLevel === 'medium' ? 'bg-amber-950/20 border-amber-500' : 'bg-emerald-950/20 border-emerald-500'}`}>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{interpretation.priorityLevel === 'high' ? '🚨' : interpretation.priorityLevel === 'medium' ? '⚠️' : '🛡️'}</span>
                            <div>
                                <span className="text-[7px] font-black text-slate-500 uppercase">Current Priority</span>
                                <p className="text-xs font-black text-white">{interpretation.priority}</p>
                            </div>
                        </div>
                        <button onClick={handleExportMarkdown} className="bg-white/5 p-2 rounded-lg hover:bg-white/10" title="Export as Markdown">📋</button>
                    </div>

                    {/* 1. VITALS BLOCK */}
                    <div className="grid grid-cols-4 gap-2 bg-black/40 p-4 rounded-2xl border border-slate-800">
                        <VitalMonitor label="FND" value={Math.round(clientResult.state.foundation)} color="text-slate-100" />
                        <VitalMonitor label="AGC" value={Math.round(clientResult.state.agency)} color="text-indigo-400" />
                        <VitalMonitor label="RES" value={Math.round(clientResult.state.resource)} color="text-amber-400" />
                        <VitalMonitor label="ENT" value={Math.round(clientResult.state.entropy)} color="text-red-400" />
                    </div>

                    {/* 2. FAULT LINE MATRIX (Differential) */}
                    <CollapsibleBlock title={ph.differential} icon="⚖️" badge={ph.badge_prob_map} isOpenDefault>
                         <ProbabilityMatrix probs={interpretation?.extra?.diffProb} />
                    </CollapsibleBlock>

                    {/* 3. NEURAL HEATMAP */}
                    <CollapsibleBlock title={ph.heatmap} icon="🎯" badge={ph.badge_latency}>
                        <div className="flex flex-wrap gap-2">
                            {(interpretation?.extra?.criticalNodes || []).length > 0 ? interpretation.extra.criticalNodes.map((nId: number) => (
                                <div key={nId} className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-[10px] font-bold text-red-100 shadow-inner">
                                    {nId}
                                </div>
                            )) : (
                                <span className="text-[9px] text-slate-600 italic">{pt.no_latency_anomalies}</span>
                            )}
                        </div>
                        <p className="text-[9px] text-red-400/80 leading-tight italic">
                            * {pt.latency_hint}
                        </p>
                    </CollapsibleBlock>

                    {/* 4. ALLIANCE SABOTAGE */}
                    <CollapsibleBlock title={ph.sabotage} icon="🕸️" badge={ph.badge_contact}>
                         <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl">
                            <span className="text-[10px] font-black text-red-400 block mb-2">{interpretation?.extra?.trapType || "STANDARD"}</span>
                            <p className="text-[11px] leading-relaxed text-slate-200">
                                {pt[`sabotage_${(interpretation?.extra?.trapType || 'standard').toLowerCase().split('_')[1]}`] || interpretation?.extra?.trapType}
                            </p>
                         </div>
                    </CollapsibleBlock>

                    {/* 5. BELIEF SYSTEM & SOMATIC */}
                    <div className="grid grid-cols-1 gap-4">
                        <CollapsibleBlock title={ph.beliefs} icon="🧠" badge={ph.badge_schemas}>
                             <div className="space-y-2">
                                {clientResult.activePatterns.map(p => (
                                    <div key={p} className="text-[10px] border-l-2 border-indigo-500/50 pl-3 py-1 bg-white/5">
                                        <span className="font-bold text-indigo-300">{t.beliefs[p] || p}</span>
                                        <p className="text-[9px] text-slate-500 opacity-80 mt-0.5">{t.pattern_library[p]?.protection || pt.resistance_label}</p>
                                    </div>
                                ))}
                             </div>
                        </CollapsibleBlock>
                    </div>

                    {/* 9. THE MONOLITH DOSSIER */}
                    <div className="pt-6">
                        {!supervisionReport ? (
                            <button 
                                onClick={handleRunSupervision}
                                disabled={loadingSupervision}
                                className={`w-full py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all ${loadingSupervision ? 'bg-slate-800 text-slate-600 animate-pulse' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)]'}`}
                            >
                                {loadingSupervision ? pt.decrypting_msg : pt.dossier_btn}
                            </button>
                        ) : (
                            <div className="space-y-4 animate-in">
                                <div className="bg-black/80 border-2 border-emerald-500/30 p-8 rounded-[2rem] shadow-inner text-slate-100">
                                    <div className="flex items-center gap-3 mb-8 border-b border-emerald-900/50 pb-4">
                                        <span className="text-3xl">📋</span>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">{pt.monolith_output}</span>
                                            <span className="text-[7px] text-slate-600 uppercase">{pt.monolith_precision}</span>
                                        </div>
                                    </div>
                                    <div className="whitespace-pre-wrap text-[14px] leading-[1.8] font-sans">
                                        {supervisionReport}
                                    </div>
                                </div>
                                <button onClick={handleCopyDossier} className="w-full py-4 bg-slate-900 border border-emerald-500/30 text-emerald-400 rounded-xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">
                                    {copySuccess ? pt.copy_success : pt.export_crm}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="text-center opacity-30 pt-10">
                        <span className="text-[7px] uppercase tracking-[0.8em]">--- AUTHORIZED CLINICAL DATA STREAM END ---</span>
                    </div>
                </div>
            )}
        </div>
    </section>
  );
};
