
import React, { useState, useMemo } from 'react';
import { AnalysisResult, Translations, SessionStep } from '../../types';
import { CompatibilityEngine } from '../../services/compatibilityEngine';
import { generateClinicalNarrative } from '../../services/clinicalNarratives';
import { PlatformBridge } from '../../utils/helpers';
import { ClinicalDecoder } from '../../services/clinicalDecoder';
import { GeminiService } from '../../services/geminiService';

interface CompatibilityViewProps {
  lang: 'ru' | 'ka';
  userResult: AnalysisResult | null;
  isProSession: boolean;
  onUnlockPro: () => void;
  t: Translations;
  onBack: () => void;
}

const NarrativeSection = ({ title, content, highlight = false, alert = false, special = false, icon }: { title: string, content: string, highlight?: boolean, alert?: boolean, special?: boolean, icon?: string }) => (
    <div className={`space-y-2 ${highlight ? 'bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10' : alert ? 'bg-red-950/20 p-4 rounded-xl border border-red-900/30' : special ? 'bg-emerald-950/10 p-4 rounded-xl border border-emerald-900/20' : 'py-3 border-b border-slate-800/50'}`}>
        <h4 className={`text-[9px] font-black uppercase tracking-widest pb-1 flex items-center gap-2 ${alert ? 'text-red-400' : special ? 'text-emerald-400' : highlight ? 'text-indigo-300' : 'text-slate-500'}`}>
            {icon && <span className="text-sm opacity-80">{icon}</span>}
            {title}
        </h4>
        <div className="whitespace-pre-wrap text-[10px] text-slate-300 leading-relaxed font-mono pl-1 opacity-90">
            {content}
        </div>
    </div>
);

const SupervisionCard = ({ title, children, type = 'info' }: { title: string, children?: React.ReactNode, type?: 'info' | 'alert' | 'secret' | 'trap' | 'system' }) => (
    <div className={`rounded-xl border relative overflow-hidden ${
        type === 'alert' ? 'bg-red-950/10 border-red-500/30' : 
        type === 'trap' ? 'bg-fuchsia-950/20 border-fuchsia-500/30' :
        type === 'secret' ? 'bg-indigo-950/30 border-indigo-500/30' : 
        type === 'system' ? 'bg-emerald-950/20 border-emerald-500/30' :
        'bg-slate-900/30 border-slate-700/50'
    }`}>
        {type === 'secret' && <div className="absolute top-0 right-0 p-2 text-[40px] opacity-5 pointer-events-none">🔒</div>}
        {type === 'trap' && <div className="absolute top-0 right-0 p-2 text-[40px] opacity-5 pointer-events-none">🕸️</div>}
        {type === 'system' && <div className="absolute top-0 right-0 p-2 text-[40px] opacity-10 pointer-events-none">⚙️</div>}
        <div className={`px-3 py-2 border-b text-[8px] font-black uppercase tracking-[0.2em] flex justify-between items-center ${
             type === 'alert' ? 'border-red-500/20 text-red-400' : 
             type === 'trap' ? 'border-fuchsia-500/20 text-fuchsia-400' :
             type === 'secret' ? 'border-indigo-500/20 text-indigo-300' : 
             type === 'system' ? 'border-emerald-500/20 text-emerald-400' :
             'border-slate-700/50 text-slate-500'
        }`}>
            <span>{title}</span>
            <span>{type === 'alert' ? '⚠️' : type === 'trap' ? 'TRAP' : type === 'secret' ? 'CONFIDENTIAL' : type === 'system' ? 'LOGIC_CORE' : 'INFO'}</span>
        </div>
        <div className="p-3">
            {children}
        </div>
    </div>
);

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

const QualityControlHUD = ({ result }: { result: AnalysisResult }) => {
    // Determine Protocol Version based on label
    const isLegacy = result.integrityBreakdown?.label === 'LEGACY_PROTOCOL';
    const isBreach = result.validity === 'BREACH' || result.validity === 'INVALID';
    const density = result.clarity; // Mapped from clarity (approx) or actual calculation
    
    // Calculate Data Reliability Score
    let reliability = 100;
    if (result.skippedCount > 5) reliability -= 20;
    if (result.flags.isSocialDesirabilityBiasDetected) reliability -= 15;
    if (isLegacy) reliability -= 5;
    if (density < 60) reliability -= 30;

    const reliabilityColor = reliability > 80 ? 'text-emerald-400' : reliability > 50 ? 'text-amber-400' : 'text-red-400';

    return (
        <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-slate-900/50 border border-slate-800 p-2 rounded-lg text-center">
                <span className="text-[6px] text-slate-500 uppercase tracking-widest block mb-1">PROTOCOL</span>
                <span className={`text-[8px] font-black uppercase ${isLegacy ? 'text-amber-500' : isBreach ? 'text-red-500' : 'text-indigo-400'}`}>
                    {isLegacy ? 'v9.0 (LEGACY)' : isBreach ? 'CORRUPTED' : 'v9.8 (LATEST)'}
                </span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-2 rounded-lg text-center">
                <span className="text-[6px] text-slate-500 uppercase tracking-widest block mb-1">RELIABILITY</span>
                <span className={`text-[8px] font-black uppercase ${reliabilityColor}`}>
                    {Math.max(0, reliability)}% {reliability < 60 ? '⚠️' : ''}
                </span>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-2 rounded-lg text-center">
                <span className="text-[6px] text-slate-500 uppercase tracking-widest block mb-1">DATA DENSITY</span>
                <span className={`text-[8px] font-black uppercase ${density < 60 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {density < 60 ? 'LOW' : 'OPTIMAL'}
                </span>
            </div>
        </div>
    );
};

const SomaticHeatmap = ({ result }: { result: AnalysisResult }) => {
    const { somaticProfile, neuroSync } = result;
    const total = somaticProfile.blocks + somaticProfile.resources + 1; // avoid div 0
    const blockPct = Math.round((somaticProfile.blocks / total) * 100);
    const flowPct = Math.round((somaticProfile.resources / total) * 100);
    
    return (
        <div className="bg-slate-900/30 border border-slate-800 p-3 rounded-xl mb-4 flex gap-4 items-center">
            <div className="space-y-1 flex-1">
                <span className="text-[7px] text-slate-500 uppercase tracking-widest">SOMATIC_PROFILE</span>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-red-500/80" style={{ width: `${blockPct}%` }} title="Blocks"></div>
                    <div className="h-full bg-emerald-500/80" style={{ width: `${flowPct}%` }} title="Resources"></div>
                </div>
                <div className="flex justify-between text-[7px] font-mono text-slate-400">
                    <span>BLOCK: {blockPct}%</span>
                    <span>FLOW: {flowPct}%</span>
                </div>
            </div>
            <div className="text-right">
                <span className="text-[7px] text-slate-500 uppercase tracking-widest block">SYNC_RATE</span>
                <span className={`text-[12px] font-black ${neuroSync < 50 ? 'text-red-400' : 'text-indigo-400'}`}>{neuroSync}%</span>
            </div>
        </div>
    );
};

export const CompatibilityView: React.FC<CompatibilityViewProps> = ({ userResult, isProSession, onUnlockPro, t, onBack, lang }) => {
  const [partnerCode, setPartnerCode] = useState('');
  const [clientResult, setClientResult] = useState<AnalysisResult | null>(null);
  const [systemReport, setSystemReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const currentLang = lang; 
  const cd = t.clinical_decoder;

  const handleAnalyze = () => {
    const decodedClient = CompatibilityEngine.decodeSmartCode(partnerCode);
    if (decodedClient) {
        if (decodedClient.validity === 'BREACH' || decodedClient.validity === 'INVALID') {
            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('warning');
            PlatformBridge.haptic.impact('heavy');
        } else {
            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success');
        }
        setClientResult(decodedClient);
        setSystemReport(null);
    } else {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('error');
    }
  };

  const runSupervisorProtocol = async () => {
      if (!clientResult) return;
      setLoadingReport(true);
      PlatformBridge.haptic.impact('medium');
      
      const report = await GeminiService.generateClinicalSupervision(clientResult, currentLang);
      
      setSystemReport(report);
      setLoadingReport(false);
      PlatformBridge.haptic.notification('success');
  };

  const interpretation = useMemo(() => {
      if (!clientResult || clientResult.validity === 'BREACH') return null;
      
      const legacy = ClinicalDecoder.decode(clientResult, t);
      const narrative = generateClinicalNarrative(clientResult, currentLang);
      
      let priority = "";
      let priorityLevel: 'low' | 'medium' | 'high' = 'low';
      
      if (clientResult.state.foundation < 30) {
          priority = currentLang === 'ru' ? "🛑 АВАРИЙНЫЙ РЕЖИМ (CRITICAL)" : "🛑 ავარიული რეჟიმი";
          priorityLevel = 'high';
      } else if (clientResult.state.agency > 80 && clientResult.state.foundation < 40) {
          priority = currentLang === 'ru' ? "⚠️ РИСК СРЫВА (MANIC DEFENSE)" : "⚠️ ჩავარდნის რისკი";
          priorityLevel = 'high';
      } else if (clientResult.state.agency > 90 && clientResult.state.entropy < 10) {
          priority = currentLang === 'ru' ? "🛡️ ARMORED DEFENSE (GOD MODE)" : "🛡️ დაცული რეჟიმი";
          priorityLevel = 'high';
      } else if (clientResult.neuroSync < 40) {
          priority = currentLang === 'ru' ? "🧊 ДИССОЦИАЦИЯ (FREEZE)" : "🧊 დისოციაცია";
          priorityLevel = 'medium';
      } else {
          priority = currentLang === 'ru' ? "✅ ШТАТНЫЙ РЕЖИМ (STABLE)" : "✅ შტატური რეჟიმი";
          priorityLevel = 'low';
      }

      return {
          ...legacy,
          narrative: narrative.level2,
          priority,
          priorityLevel
      };
  }, [clientResult, t, currentLang]);

  return (
    <section className="space-y-6 animate-in py-4 flex flex-col h-full bg-white">
        {/* TOP BAR */}
        <div className="flex justify-between items-center px-1 pb-2 border-b border-indigo-100/50 shrink-0">
            <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-600 active:scale-95 transition-all">
                ← {t.global.back}
            </button>
            <div className="flex flex-col items-end">
                 <span className="text-[10px] font-mono text-indigo-600 font-black tracking-widest">{t.pro_terminal.title}</span>
                 <span className="text-[7px] font-mono text-slate-400 uppercase">Supervisor OS v5.3</span>
            </div>
        </div>

        {/* INPUT FIELD (Visible only when no result) */}
        {!clientResult && (
            <div className="space-y-4 animate-in">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-sm">
                        🔐
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase text-slate-900">{t.pro_terminal.access_restricted}</h3>
                        <p className="text-[10px] text-slate-500 font-medium mt-1 max-w-[200px] mx-auto">
                            {t.pro_terminal.enter_code}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                    <input 
                        type="text" 
                        placeholder={t.pro_terminal.paste_placeholder}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-mono text-xs uppercase text-indigo-600 outline-none focus:border-indigo-500 transition-colors placeholder-indigo-900/30 resize-none leading-relaxed"
                        value={partnerCode}
                        onChange={e => setPartnerCode(e.target.value)}
                    />
                    <button 
                        onClick={handleAnalyze} 
                        className="bg-indigo-600 text-white px-6 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-indigo-200 active:scale-95 transition-all"
                    >
                        {t.pro_terminal.decrypt_btn}
                    </button>
                </div>

                {/* ACTIVE SESSION SHORTCUT */}
                {userResult && (
                    <div className="mt-4 pt-4 border-t border-slate-100/50 animate-in">
                        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-3">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-emerald-700 tracking-widest">{t.pro_terminal.active_session}</span>
                                </div>
                                <span className="text-[8px] font-mono text-emerald-600/60">{new Date(userResult.timestamp).toLocaleTimeString()}</span>
                             </div>
                             
                             <button 
                                onClick={() => {
                                    setClientResult(userResult);
                                    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success');
                                }}
                                className="w-full py-3 bg-white border border-emerald-200 rounded-xl text-[9px] font-black text-emerald-600 uppercase shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                             >
                                <span>⚡</span> {t.pro_terminal.decode_current}
                             </button>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* SECURITY BREACH VIEW (Red Screen of Death) */}
        {clientResult && (clientResult.validity === 'BREACH' || clientResult.validity === 'INVALID') && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-red-950 text-red-500 font-mono rounded-[2rem] border-4 border-red-600 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgNDBMMzAgMEw0MCAwTDEwIDQwWiIgZmlsbD0icmdiYSgwLDAsMCwwLjMpIi8+PC9zdmc+')] opacity-20"></div>
                <div className="relative z-10 text-center space-y-6">
                    <div className="text-6xl">⚠️</div>
                    <h2 className="text-2xl font-black uppercase tracking-widest">{t.pro_terminal.security_breach}</h2>
                    <p className="text-xs uppercase font-bold">{t.pro_terminal.tamper_detected}</p>
                    <div className="bg-black/50 p-4 rounded-xl text-[9px] text-red-300 font-mono">
                        ERR_CHECKSUM_MISMATCH<br/>
                        SIGNATURE_REJECTED
                    </div>
                    <button onClick={() => setClientResult(null)} className="mt-8 px-6 py-3 border border-red-500 rounded hover:bg-red-900/50 uppercase text-[10px] font-black tracking-widest">
                        {t.pro_terminal.terminate_session}
                    </button>
                </div>
            </div>
        )}

        {/* CLINICAL REPORT VIEW */}
        {clientResult && interpretation && (
            <div className="bg-slate-950 text-slate-400 p-5 rounded-[2rem] space-y-6 border border-slate-800 shadow-2xl relative animate-in flex-1 overflow-y-auto custom-scrollbar font-mono">
                
                {/* 1. STATUS HEADER & VITAL MONITORS */}
                <div className="border-b border-slate-800 pb-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                            <span className="text-[8px] text-emerald-500 font-black uppercase tracking-widest block">CLIENT_ID</span>
                            <span className="text-[10px] text-emerald-500 font-mono font-bold tracking-wider">{clientResult.shareCode.substring(0, 8)}</span>
                        </div>
                        
                        {/* QUICK TAGS */}
                        <div className="flex gap-1">
                            {interpretation.priorityLevel === 'high' && <span className="bg-red-950/50 text-red-400 border border-red-900/50 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-wider">{t.pro_terminal.risk_high}</span>}
                            {clientResult.neuroSync < 50 && <span className="bg-indigo-950/50 text-indigo-400 border border-indigo-900/50 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-wider">{t.pro_terminal.dissociated}</span>}
                            {clientResult.flags?.entropyType === 'CREATIVE' && <span className="bg-emerald-950/50 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-wider">{t.pro_terminal.creative_chaos}</span>}
                        </div>
                    </div>

                    {/* QUALITY CONTROL HUD (New) */}
                    <QualityControlHUD result={clientResult} />

                    {/* PRIORITY BANNER */}
                    <div className={`p-3 rounded-xl border-l-4 shadow-lg flex items-center gap-3 ${
                        interpretation.priorityLevel === 'high' ? 'bg-red-950/20 border-red-500/50 text-red-200' :
                        interpretation.priorityLevel === 'medium' ? 'bg-amber-950/20 border-amber-500/50 text-amber-200' :
                        'bg-emerald-950/20 border-emerald-500/50 text-emerald-200'
                    }`}>
                        <span className="text-xl">{interpretation.priorityLevel === 'high' ? '🛑' : interpretation.priorityLevel === 'medium' ? '⚠️' : '✅'}</span>
                        <div>
                            <span className="text-[7px] font-black uppercase tracking-widest opacity-60 block">{t.pro_terminal.verdict_protocol}</span>
                            <p className="text-[10px] font-bold leading-tight">{interpretation.priority}</p>
                        </div>
                    </div>

                    {/* VITAL MONITORS GRID */}
                    <div className="grid grid-cols-4 gap-2">
                        <VitalMonitor label="FND" value={Math.round(clientResult.state.foundation)} color="text-slate-200" />
                        <VitalMonitor label="AGC" value={Math.round(clientResult.state.agency)} color="text-blue-400" />
                        <VitalMonitor label="RES" value={Math.round(clientResult.state.resource)} color="text-amber-400" />
                        <VitalMonitor label="ENT" value={Math.round(clientResult.state.entropy)} color={clientResult.state.entropy > 40 && clientResult.flags?.entropyType !== 'CREATIVE' ? 'text-red-400' : 'text-emerald-400'} />
                    </div>
                </div>

                {/* 2. SOMATIC PROFILE (New Visual) */}
                <SomaticHeatmap result={clientResult} />

                {/* 3. SESSION FLOW ARC */}
                <div>
                    <h4 className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em] pl-1 mb-2">SESSION_FLOW_ARC</h4>
                    <SessionArc steps={interpretation.narrative.sessionFlow} />
                </div>

                {/* 4. SUPERVISION DOSSIER */}
                <div className="space-y-3">
                    <h4 className="text-[9px] font-black uppercase text-slate-600 tracking-[0.2em] pl-1">SUPERVISION_LAYER</h4>
                    
                    {/* DETERMINISTIC EXPERT SYSTEM BLOCK */}
                    {!systemReport ? (
                        <button 
                            onClick={runSupervisorProtocol}
                            disabled={loadingReport}
                            className="w-full py-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-[9px] font-black text-emerald-400 uppercase hover:bg-emerald-950/50 transition-all flex items-center justify-center gap-2"
                        >
                            {loadingReport ? t.pro_terminal.calculating : `⚡ ${t.pro_terminal.run_protocol}`}
                        </button>
                    ) : (
                        <SupervisionCard title={t.pro_terminal.supervisor_note} type="system">
                            <div className="whitespace-pre-wrap text-[10px] text-emerald-100 leading-relaxed font-mono opacity-90">
                                {systemReport}
                            </div>
                        </SupervisionCard>
                    )}

                    <div className="grid grid-cols-1 gap-3">
                        <SupervisionCard title="RESISTANCE" type="alert">
                            <p className="text-[10px] text-slate-300 leading-relaxed">{interpretation.narrative.resistanceProfile}</p>
                        </SupervisionCard>

                        <SupervisionCard title="ALLIANCE" type="info">
                            <p className="text-[10px] text-indigo-200 leading-relaxed">{interpretation.narrative.therapeuticAlliance}</p>
                        </SupervisionCard>

                        <SupervisionCard title="CONTRACT" type="secret">
                            <p className="text-[10px] text-slate-300 italic leading-relaxed">"{interpretation.narrative.shadowContract}"</p>
                        </SupervisionCard>
                    </div>
                </div>

                {/* 5. CLINICAL DATA STREAM */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <NarrativeSection title="01. DEEP ANALYSIS" content={interpretation.narrative.deepAnalysis} highlight />
                    <NarrativeSection title="BEHAVIORAL MARKERS" content={interpretation.narrative.behavioralMarkers} icon="👀" />
                    <NarrativeSection title="SYSTEMIC ROOT" content={interpretation.narrative.systemicRoot} icon="🌳" />
                    
                    {/* Clinical Hypotheses */}
                    <div className="bg-amber-950/10 p-4 rounded-xl border-l-2 border-amber-500/50">
                        <h4 className="text-[9px] font-black uppercase text-amber-500 tracking-widest mb-2 flex items-center gap-2">
                            <span>⚡</span> {t.pro_terminal.clinical_hypotheses}
                        </h4>
                        <div className="whitespace-pre-wrap text-[10px] text-slate-300 leading-relaxed font-mono opacity-90">
                            {interpretation.narrative.clinicalHypotheses}
                        </div>
                    </div>

                    {/* Verdict */}
                    <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                         <h4 className="text-[9px] font-black uppercase text-emerald-500 tracking-widest mb-2">{t.pro_terminal.verdict_protocol}</h4>
                         <div className="whitespace-pre-wrap text-[10px] text-emerald-100/90 leading-relaxed font-mono">
                            {interpretation.narrative.verdictAndRecommendations}
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="pt-6 border-t border-slate-800 text-center space-y-4">
                     <p className="text-[8px] text-slate-600 uppercase max-w-[220px] mx-auto border border-slate-800 p-2 rounded leading-relaxed">
                        {cd.disclaimer}
                     </p>
                     <button 
                        onClick={() => setClientResult(null)} 
                        className="text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors bg-red-950/20 px-4 py-3 rounded-lg border border-red-900/30 w-full"
                     >
                        [ {t.pro_terminal.close_session} ]
                     </button>
                </div>
            </div>
        )}
    </section>
  );
};
