
import React, { useState, useMemo } from 'react';
import { AnalysisResult, Translations, SessionStep, SystemicVector, Intervention } from '../../types';
import { CompatibilityEngine } from '../../services/compatibilityEngine';
import { generateClinicalNarrative } from '../../services/clinicalNarratives';
import { PlatformBridge } from '../../utils/helpers';
import { ClinicalDecoder } from '../../services/clinicalDecoder';

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

const SupervisionCard = ({ title, children, type = 'info' }: { title: string, children?: React.ReactNode, type?: 'info' | 'alert' | 'secret' | 'trap' }) => (
    <div className={`rounded-xl border relative overflow-hidden ${
        type === 'alert' ? 'bg-red-950/10 border-red-500/30' : 
        type === 'trap' ? 'bg-fuchsia-950/20 border-fuchsia-500/30' :
        type === 'secret' ? 'bg-indigo-950/30 border-indigo-500/30' : 
        'bg-slate-900/30 border-slate-700/50'
    }`}>
        {type === 'secret' && <div className="absolute top-0 right-0 p-2 text-[40px] opacity-5 pointer-events-none">🔒</div>}
        {type === 'trap' && <div className="absolute top-0 right-0 p-2 text-[40px] opacity-5 pointer-events-none">🕸️</div>}
        <div className={`px-3 py-2 border-b text-[8px] font-black uppercase tracking-[0.2em] flex justify-between items-center ${
             type === 'alert' ? 'border-red-500/20 text-red-400' : 
             type === 'trap' ? 'border-fuchsia-500/20 text-fuchsia-400' :
             type === 'secret' ? 'border-indigo-500/20 text-indigo-300' : 
             'border-slate-700/50 text-slate-500'
        }`}>
            <span>{title}</span>
            <span>{type === 'alert' ? '⚠️' : type === 'trap' ? 'TRAP' : type === 'secret' ? 'CONFIDENTIAL' : 'INFO'}</span>
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

const ValidityPanel = ({ result }: { result: AnalysisResult }) => {
    const isSuspicious = result.validity !== 'VALID';
    const flags = result.flags || { isAlexithymiaDetected: false, isSocialDesirabilityBiasDetected: false, isSlowProcessingDetected: false };
    
    if (!isSuspicious && !flags.isAlexithymiaDetected && !flags.isSocialDesirabilityBiasDetected) return null;

    return (
        <div className="bg-red-950/20 border border-red-900/40 p-3 rounded-xl mb-4">
            <div className="flex justify-between items-center mb-2 border-b border-red-900/30 pb-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-red-400">SIGNAL QUALITY CHECK</span>
                <span className="text-[8px] font-mono text-red-500 bg-red-900/20 px-1 rounded">{result.validity}</span>
            </div>
            <div className="space-y-1">
                {flags.isAlexithymiaDetected && (
                    <div className="flex gap-2 items-center text-[9px] text-slate-300">
                        <span>🧊</span> 
                        <span><strong>Somatic Blindness:</strong> User reports 'Neutral' >75%. Sync metric unreliable.</span>
                    </div>
                )}
                {flags.isSocialDesirabilityBiasDetected && (
                    <div className="flex gap-2 items-center text-[9px] text-slate-300">
                        <span>🎭</span> 
                        <span><strong>Social Bias:</strong> Rapid response pattern detected. Risk of role-playing.</span>
                    </div>
                )}
                {flags.isSlowProcessingDetected && (
                    <div className="flex gap-2 items-center text-[9px] text-slate-300">
                        <span>🐢</span> 
                        <span><strong>Slow Processing:</strong> High cognitive load baseline. Entropy compensated.</span>
                    </div>
                )}
            </div>
        </div>
    );
}

const SomaticDissonancePanel = ({ result, t }: { result: AnalysisResult, t: Translations }) => {
    if (!result.somaticDissonance || result.somaticDissonance.length === 0) return null;

    return (
        <div className="bg-amber-950/10 border border-amber-900/30 p-4 rounded-xl mb-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                    <span className="text-xs">⚡</span> {t.clinical_decoder.somatic_dissonance_title}
                </span>
                <span className="text-[8px] bg-amber-900/40 text-amber-400 px-2 py-0.5 rounded font-mono">{result.somaticDissonance.length} CONFLICTS</span>
            </div>
            <p className="text-[9px] text-slate-400 mb-2 leading-tight">
                {t.clinical_decoder.somatic_dissonance_desc}
            </p>
            <div className="space-y-1">
                {result.somaticDissonance.map((key) => (
                    <div key={key} className="flex justify-between items-center border-b border-amber-900/20 pb-1">
                        <span className="text-[9px] font-mono text-amber-300/80 uppercase">{key}</span>
                        <span className="text-[8px] text-slate-500 italic">{t.beliefs[key]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const CompatibilityView: React.FC<CompatibilityViewProps> = ({ userResult, isProSession, onUnlockPro, t, onBack }) => {
  const [partnerCode, setPartnerCode] = useState('');
  const [clientResult, setClientResult] = useState<AnalysisResult | null>(null);
  const [authKey, setAuthKey] = useState('');
  const [authError, setAuthError] = useState(false);

  // If user is already in Pro Session (logged in via main screen), we consider them unlocked.
  // Otherwise, local unlock is required for this specific view.
  const [isLocallyUnlocked, setIsLocallyUnlocked] = useState(isProSession);

  const currentLang = t.subtitle.includes('LUKA') && t.onboarding.title.includes('ნავიგატორი') ? 'ka' : 'ru';
  const cd = t.clinical_decoder;

  const handleAnalyze = () => {
    const decodedClient = CompatibilityEngine.decodeSmartCode(partnerCode);
    if (decodedClient) {
        if (decodedClient.validity === 'BREACH') {
            // IMMEDIATE ALERT FOR RED TEAM
            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('error');
            PlatformBridge.haptic.impact('heavy');
        } else {
            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success');
        }
        setClientResult(decodedClient);
    } else {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('error');
    }
  };

  const handleUnlock = () => {
      const cleanKey = authKey.trim().toLowerCase();
      if (cleanKey === 'genesis_prime' || cleanKey === 'genesis_lab_entry') {
          setIsLocallyUnlocked(true);
          onUnlockPro(); // Sync up to app state if possible
          PlatformBridge.haptic.notification('success');
          setAuthError(false);
      } else {
          setAuthError(true);
          PlatformBridge.haptic.notification('error');
          setTimeout(() => setAuthError(false), 2000);
      }
  };

  const interpretation = useMemo(() => {
      if (!clientResult || clientResult.validity === 'BREACH') return null;
      
      const legacy = ClinicalDecoder.decode(clientResult, t);
      const narrative = generateClinicalNarrative(clientResult, currentLang);
      
      // Extract Urgent Priority based on metrics
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
                 <span className="text-[10px] font-mono text-indigo-600 font-black tracking-widest">CLINICAL_TERMINAL</span>
                 <span className="text-[7px] font-mono text-slate-400 uppercase">Supervisor OS v5.2</span>
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
                        <h3 className="text-sm font-black uppercase text-slate-900">Access Restricted</h3>
                        <p className="text-[10px] text-slate-500 font-medium mt-1 max-w-[200px] mx-auto">
                            Enter Client ID or Share Code to decrypt the clinical profile.
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                    <input 
                        type="text" 
                        placeholder="PASTE CODE (VEHFX...)"
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-mono text-xs uppercase text-indigo-600 outline-none focus:border-indigo-500 transition-colors placeholder-indigo-900/30 resize-none leading-relaxed"
                        value={partnerCode}
                        onChange={e => setPartnerCode(e.target.value)}
                    />
                    <button 
                        onClick={handleAnalyze} 
                        className="bg-indigo-600 text-white px-6 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-indigo-200 active:scale-95 transition-all"
                    >
                        DECRYPT
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
                                    <span className="text-[9px] font-black uppercase text-emerald-700 tracking-widest">ACTIVE_SESSION_BUFFER</span>
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
                                <span>⚡</span> DECODE_CURRENT_RESULT
                             </button>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* SECURITY BREACH VIEW (Red Screen of Death) */}
        {clientResult && clientResult.validity === 'BREACH' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-red-950 text-red-500 font-mono rounded-[2rem] border-4 border-red-600 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgNDBMMzAgMEw0MCAwTDEwIDQwWiIgZmlsbD0icmdiYSgwLDAsMCwwLjMpIi8+PC9zdmc+')] opacity-20"></div>
                <div className="relative z-10 text-center space-y-6">
                    <div className="text-6xl">☠️</div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white">PROTOCOL ICARUS</h2>
                        <span className="text-xs bg-red-600 text-white px-2 py-1 uppercase font-bold tracking-widest">INTRUSION DETECTED</span>
                    </div>
                    <div className="text-[10px] uppercase font-bold text-red-300 max-w-[200px] mx-auto border border-red-800 p-4 bg-black/40 rounded-xl">
                        Error: Statistical Impossibility. <br/>
                        Metrics indicate artificial fabrication of psychometric data.
                        <br/><br/>
                        Incident logged for forensic audit.
                    </div>
                    <button 
                        onClick={() => { setClientResult(null); setPartnerCode(''); }}
                        className="border border-red-500 text-red-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-red-900/50 transition-colors"
                    >
                        TERMINATE SESSION
                    </button>
                </div>
            </div>
        )}

        {/* ACCESS GATE: Requires unlock before showing deep data */}
        {clientResult && clientResult.validity !== 'BREACH' && !isLocallyUnlocked && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl animate-in text-center space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30"></div>
                
                <div className="relative z-10 space-y-2">
                    <div className="w-20 h-20 bg-red-950/50 rounded-2xl flex items-center justify-center text-4xl border border-red-900/50 mx-auto mb-4 animate-pulse">
                        🛡️
                    </div>
                    <h3 className="text-xl font-black uppercase text-white tracking-widest">RESTRICTED DATA</h3>
                    <p className="text-[10px] text-slate-400 font-mono max-w-[240px] mx-auto leading-relaxed">
                        This dossier contains raw clinical metrics and hypotheses. Direct exposure without professional interpretation may cause <span className="text-red-400">iatrogenic harm</span>.
                    </p>
                </div>

                <div className="w-full max-w-[240px] space-y-3 relative z-10">
                    <input 
                        type="password"
                        placeholder="SUPERVISOR KEY"
                        className={`w-full bg-black/50 border ${authError ? 'border-red-500 text-red-500' : 'border-slate-700 text-white'} rounded-xl p-4 text-center font-mono text-xs tracking-[0.2em] outline-none focus:border-indigo-500 transition-all`}
                        value={authKey}
                        onChange={e => setAuthKey(e.target.value)}
                    />
                    <button 
                        onClick={handleUnlock}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:bg-indigo-500"
                    >
                        AUTHORIZE ACCESS
                    </button>
                    <button 
                        onClick={() => setClientResult(null)}
                        className="text-[9px] text-slate-600 font-bold uppercase tracking-widest hover:text-slate-400 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )}

        {/* CLINICAL REPORT VIEW (Only shown if unlocked AND not breach) */}
        {clientResult && clientResult.validity !== 'BREACH' && isLocallyUnlocked && interpretation && (
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
                            {interpretation.priorityLevel === 'high' && <span className="bg-red-950/50 text-red-400 border border-red-900/50 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-wider">RISK_HIGH</span>}
                            {clientResult.neuroSync < 50 && <span className="bg-indigo-950/50 text-indigo-400 border border-indigo-900/50 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-wider">DISSOCIATED</span>}
                            {clientResult.flags?.entropyType === 'CREATIVE' && <span className="bg-emerald-950/50 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-wider">CREATIVE_CHAOS</span>}
                        </div>
                    </div>

                    {/* VALIDITY PANEL */}
                    <ValidityPanel result={clientResult} />

                    {/* PRIORITY BANNER */}
                    <div className={`p-3 rounded-xl border-l-4 shadow-lg flex items-center gap-3 ${
                        interpretation.priorityLevel === 'high' ? 'bg-red-950/20 border-red-500/50 text-red-200' :
                        interpretation.priorityLevel === 'medium' ? 'bg-amber-950/20 border-amber-500/50 text-amber-200' :
                        'bg-emerald-950/20 border-emerald-500/50 text-emerald-200'
                    }`}>
                        <span className="text-xl">{interpretation.priorityLevel === 'high' ? '🛑' : interpretation.priorityLevel === 'medium' ? '⚠️' : '✅'}</span>
                        <div>
                            <span className="text-[7px] font-black uppercase tracking-widest opacity-60 block">SESSION PROTOCOL</span>
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
                
                {/* 2. PSYCHODYNAMIC PROFILE (NEW JUICY PART) */}
                <div className="bg-indigo-950/20 border border-indigo-500/30 p-4 rounded-xl space-y-3">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-indigo-400 border-b border-indigo-500/20 pb-2">PSYCHODYNAMIC CORE</h4>
                    <p className="text-[10px] text-indigo-100/90 leading-relaxed font-medium">
                        {interpretation.narrative.psychodynamicProfile}
                    </p>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                            <span className="text-[7px] text-slate-500 uppercase block mb-1">Defense Mechanism</span>
                            <span className="text-[9px] text-slate-300 font-bold">{interpretation.narrative.primaryDefense}</span>
                        </div>
                        <div className="flex-1 bg-slate-900/50 p-2 rounded-lg border border-red-900/30">
                            <span className="text-[7px] text-slate-500 uppercase block mb-1">Fragility Point</span>
                            <span className="text-[9px] text-red-300 font-bold">{interpretation.narrative.fragilityPoint}</span>
                        </div>
                    </div>
                </div>

                {/* 3. SOMATIC DISSONANCE */}
                <SomaticDissonancePanel result={clientResult} t={t} />
                
                {/* 4. SUPERVISION & COUNTER-TRANSFERENCE (THE GOLD) */}
                <div className="space-y-3">
                    <h4 className="text-[9px] font-black uppercase text-slate-600 tracking-[0.2em] pl-1">SUPERVISION_LAYER</h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                        {/* THERAPEUTIC TRAP (NEW) */}
                        <SupervisionCard title="THERAPEUTIC TRAP" type="trap">
                            <p className="text-[10px] text-fuchsia-200 leading-relaxed italic">
                                "{interpretation.narrative.therapeuticTrap}"
                            </p>
                        </SupervisionCard>

                        {/* COUNTER-TRANSFERENCE CARD */}
                         <SupervisionCard title="COUNTER-TRANSFERENCE WARNING" type="alert">
                            <p className="text-[10px] text-amber-200 leading-relaxed italic">
                                "Therapist may feel: {interpretation.narrative.counterTransference}"
                            </p>
                        </SupervisionCard>

                        <SupervisionCard title="RESISTANCE PATTERN" type="info">
                            <p className="text-[10px] text-slate-300 leading-relaxed">{interpretation.narrative.resistanceProfile}</p>
                        </SupervisionCard>

                        <SupervisionCard title="SHADOW CONTRACT" type="secret">
                            <p className="text-[10px] text-slate-300 italic leading-relaxed">"{interpretation.narrative.shadowContract}"</p>
                        </SupervisionCard>
                    </div>
                </div>

                {/* 5. CLINICAL DATA STREAM */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                    
                    {/* TRACEABILITY MATRIX (NEW) */}
                    {interpretation.narrative.triggers.length > 0 && (
                        <div className="bg-slate-900/50 rounded-xl border border-white/5 p-4 space-y-3">
                            <h4 className="text-[9px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                                <span>📍</span> TRACEABILITY MATRIX
                            </h4>
                            <div className="space-y-2">
                                {interpretation.narrative.triggers.map((trigger, i) => (
                                    <div key={i} className="text-[9px] text-slate-400 font-mono border-l-2 border-red-900/50 pl-2 py-0.5">
                                        {trigger}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* BLIND SPOT MONITOR (NEW) */}
                    {interpretation.narrative.blindSpots.length > 0 && (
                        <div className="bg-black/40 rounded-xl border border-white/5 p-4 space-y-2">
                            <h4 className="text-[9px] font-black uppercase text-slate-600 tracking-widest">⚠️ SYSTEM BLIND SPOTS</h4>
                            <ul className="list-disc pl-4 space-y-1">
                                {interpretation.narrative.blindSpots.map((spot, i) => (
                                    <li key={i} className="text-[9px] text-slate-500 italic leading-tight">{spot}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <NarrativeSection title="DEEP ANALYSIS" content={interpretation.narrative.deepAnalysis} highlight />
                    <NarrativeSection title="BEHAVIORAL MARKERS" content={interpretation.narrative.behavioralMarkers} icon="👀" />
                    
                    {/* Clinical Hypotheses */}
                    <div className="bg-amber-950/10 p-4 rounded-xl border-l-2 border-amber-500/50">
                        <h4 className="text-[9px] font-black uppercase text-amber-500 tracking-widest mb-2 flex items-center gap-2">
                            <span>⚡</span> CLINICAL HYPOTHESES
                        </h4>
                        <div className="whitespace-pre-wrap text-[10px] text-slate-300 leading-relaxed font-mono opacity-90">
                            {interpretation.narrative.clinicalHypotheses}
                        </div>
                    </div>

                    {/* NEW CLINICAL PROTOCOL (STRATEGY) */}
                    {interpretation.narrative.clinicalStrategy.length > 0 && (
                        <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/30">
                            <h4 className="text-[9px] font-black uppercase text-indigo-400 tracking-widest mb-2 flex items-center gap-2">
                                <span>🛡️</span> CLINICAL PROTOCOL
                            </h4>
                            <div className="space-y-1.5">
                                {interpretation.narrative.clinicalStrategy.map((step, i) => (
                                    <p key={i} className="text-[10px] text-indigo-100/90 leading-relaxed font-mono">
                                        {step}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Verdict */}
                    <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                         <h4 className="text-[9px] font-black uppercase text-emerald-500 tracking-widest mb-2">VERDICT & PROTOCOL</h4>
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
                        [ CLOSE SESSION ]
                     </button>
                </div>
            </div>
        )}
    </section>
  );
};
