
import React, { useState, useMemo } from 'react';
import { AnalysisResult, Translations, SessionStep } from '../../types';
import { CompatibilityEngine } from '../../services/compatibilityEngine';
import { generateClinicalNarrative } from '../../services/clinicalNarratives';
import { ClinicalDecoder } from '../../services/clinicalDecoder';
import { PlatformBridge } from '../../utils/helpers';

interface CompatibilityViewProps {
  userResult: AnalysisResult | null;
  isProSession: boolean;
  onUnlockPro: () => void;
  t: Translations;
  onBack: () => void;
}

const NarrativeSection = ({ title, content, highlight = false, alert = false, special = false, icon, isLocked = false }: { title: string, content: string, highlight?: boolean, alert?: boolean, special?: boolean, icon?: string, isLocked?: boolean }) => (
    <div className={`space-y-2 relative ${highlight ? 'bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10' : alert ? 'bg-red-950/20 p-4 rounded-xl border border-red-900/30' : special ? 'bg-emerald-950/10 p-4 rounded-xl border border-emerald-900/20' : 'py-3 border-b border-slate-800/50'}`}>
        <h4 className={`text-[9px] font-black uppercase tracking-widest pb-1 flex items-center gap-2 ${alert ? 'text-red-400' : special ? 'text-emerald-400' : highlight ? 'text-indigo-300' : 'text-slate-50'}`}>
            {icon && <span className="text-sm opacity-80">{icon}</span>}
            {title}
        </h4>
        <div className={`whitespace-pre-wrap text-[10px] text-slate-300 leading-relaxed font-mono pl-1 opacity-90 transition-all ${isLocked ? 'blur-[3.5px] select-none pointer-events-none opacity-20' : ''}`}>
            {isLocked ? 'ENCRYPTED_CLINICAL_DATA_STREAM_LOCKED_BY_SUPERVISOR_OS_INTEGRITY_CHECK_REQUIRED' : content}
        </div>
        {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[7px] font-black uppercase bg-slate-900 text-slate-600 px-2 py-0.5 rounded border border-white/5 opacity-50">SYSTEM_RESTRICTED</span>
            </div>
        )}
    </div>
);

const SessionArc = ({ steps, t, isLocked = false }: { steps: SessionStep[], t: Translations, isLocked?: boolean }) => (
    <div className={`grid grid-cols-1 gap-2 my-4 relative ${isLocked ? 'opacity-30 blur-[2px]' : ''}`}>
        {steps.map((step, idx) => (
            <div key={idx} className="flex gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800 items-start">
                <div className={`flex flex-col items-center justify-center w-8 shrink-0 space-y-1 pt-1`}>
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-indigo-500' : 'bg-slate-500'}`}></div>
                    <div className="w-0.5 h-6 bg-slate-800 last:hidden"></div>
                </div>
                <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 block mb-0.5">{t.ui.day_label} {idx + 1}: {step.phase}</span>
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

export const CompatibilityView: React.FC<CompatibilityViewProps> = ({ userResult, isProSession, onUnlockPro, t, onBack }) => {
  const [partnerCode, setPartnerCode] = useState('');
  const [clientResult, setClientResult] = useState<AnalysisResult | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockPwd, setUnlockPwd] = useState('');

  const currentLang = t.subtitle.includes('LUKA') && t.onboarding.title.includes('ნავიგატორი') ? 'ka' : 'ru';
  const cd = t.clinical_decoder;

  const handleAnalyze = () => {
    const decodedClient = CompatibilityEngine.decodeSmartCode(partnerCode);
    if (decodedClient) {
        setClientResult(decodedClient);
        PlatformBridge.haptic.notification('success');
    } else {
        PlatformBridge.haptic.notification('error');
    }
  };

  const handleUnlock = () => {
    const cleanPwd = unlockPwd.toLowerCase().trim();
    if (cleanPwd === 'genesis_prime' || cleanPwd === 'genesis_lab_entry') {
        onUnlockPro();
        setShowUnlockModal(false);
        PlatformBridge.haptic.notification('success');
    } else {
        PlatformBridge.haptic.notification('error');
        setUnlockPwd('');
        setShowUnlockModal(false); // Stealth: hide on fail
    }
  };

  const interpretation = useMemo(() => {
      if (!clientResult) return null;
      const legacy = ClinicalDecoder.decode(clientResult, t);
      const narrative = generateClinicalNarrative(clientResult, currentLang);
      
      let priority = "";
      let priorityLevel: 'low' | 'medium' | 'high' = 'low';
      
      if (clientResult.state.foundation < 30) {
          priority = currentLang === 'ru' ? "🛑 КРИТИЧЕСКИЙ ДЕФИЦИТ" : "🛑 კრიტიკული დეფიციტი";
          priorityLevel = 'high';
      } else if (clientResult.state.agency > 80 && clientResult.state.foundation < 40) {
          priority = currentLang === 'ru' ? "⚠️ МАНИАКАЛЬНАЯ ЗАЩИТА" : "⚠️ მანიაკალური დაცვა";
          priorityLevel = 'high';
      } else if (clientResult.neuroSync < 40) {
          priority = currentLang === 'ru' ? "🧊 ВЫРАЖЕННАЯ ДИССОЦИАЦИЯ" : "🧊 გამოხატული დისოციაცია";
          priorityLevel = 'medium';
      } else {
          priority = currentLang === 'ru' ? "✅ СТАБИЛЬНАЯ ИНТЕГРАЦИЯ" : "✅ სტაბილური ინტეგრაცია";
          priorityLevel = 'low';
      }

      return { ...legacy, narrative: narrative.level2, priority, priorityLevel };
  }, [clientResult, t, currentLang]);

  return (
    <section className="space-y-6 animate-in py-4 flex flex-col h-full bg-white relative">
        {showUnlockModal && (
            <div className="absolute inset-0 z-[100] bg-slate-950/98 flex items-center justify-center p-6 backdrop-blur-md animate-in rounded-3xl">
                <div className="w-full max-w-xs space-y-4">
                    <div className="text-center text-slate-600">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] mb-4 block opacity-40">BRIDGE_SEC_LAYER_v5</span>
                    </div>
                    <input 
                        type="password" 
                        autoFocus
                        className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-emerald-400 font-mono text-center outline-none focus:border-white/20 text-sm"
                        placeholder="••••••••"
                        value={unlockPwd}
                        onChange={e => setUnlockPwd(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                    />
                    <div className="flex justify-center">
                        <button onClick={() => setShowUnlockModal(false)} className="py-2 px-4 text-slate-800 text-[8px] font-black uppercase tracking-widest">ABORT</button>
                    </div>
                </div>
            </div>
        )}

        <div className="flex justify-between items-center px-1 pb-2 border-b border-indigo-100/50 shrink-0">
            <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-600 active:scale-95 transition-all">
                ← {t.global.back}
            </button>
            <div className="flex flex-col items-end">
                 <span className="text-[10px] font-mono text-indigo-600 font-black tracking-widest">{t.dashboard.open_terminal}</span>
                 <span className="text-[7px] font-mono text-slate-400 uppercase">Analyzer Core v5.2</span>
            </div>
        </div>

        {!clientResult && (
            <div className="space-y-4 animate-in">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-sm">🔐</div>
                    <div>
                        <h3 className="text-sm font-black uppercase text-slate-900">{t.ui.access_restricted}</h3>
                        <p className="text-[10px] text-slate-500 font-medium mt-1 max-w-[200px] mx-auto opacity-70">
                            {t.auth_hint}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                    <input 
                        type="text" 
                        placeholder={t.ui.paste_code}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-mono text-xs uppercase text-indigo-600 outline-none focus:border-indigo-500 transition-colors placeholder-indigo-900/30 leading-relaxed"
                        value={partnerCode}
                        onChange={e => setPartnerCode(e.target.value)}
                    />
                    <button 
                        onClick={handleAnalyze} 
                        className="bg-indigo-600 text-white px-6 rounded-xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all"
                    >
                        {t.ui.decrypt_btn}
                    </button>
                </div>
            </div>
        )}

        {clientResult && interpretation && (
            <div className="bg-slate-950 text-slate-400 p-5 rounded-[2rem] space-y-6 border border-slate-800 shadow-2xl relative animate-in flex-1 overflow-y-auto custom-scrollbar font-mono">
                <div className="border-b border-slate-800 pb-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                            <span className="text-[8px] text-emerald-500 font-black uppercase tracking-widest block opacity-50">NODE_ID</span>
                            <span className="text-[10px] text-emerald-500 font-mono font-bold tracking-wider">{clientResult.shareCode.substring(0, 10)}</span>
                        </div>
                        <div className="flex gap-1">
                            {interpretation.priorityLevel === 'high' && <span className="bg-red-950/30 text-red-500/70 border border-red-900/30 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-wider">ALERT_P1</span>}
                            {/* CAMOUFLAGED BUTTON */}
                            {!isProSession && (
                                <button 
                                    onClick={() => setShowUnlockModal(true)} 
                                    className="text-slate-800 border border-slate-900 px-2 py-0.5 rounded text-[6px] font-black uppercase tracking-widest hover:opacity-100 transition-opacity"
                                >
                                    BUILD_098.OS.BRIDGE
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={`p-3 rounded-xl border-l-4 shadow-lg flex items-center gap-3 ${
                        interpretation.priorityLevel === 'high' ? 'bg-red-950/10 border-red-500/30 text-red-200/80' :
                        interpretation.priorityLevel === 'medium' ? 'bg-amber-950/10 border-amber-500/30 text-amber-200/80' :
                        'bg-emerald-950/10 border-emerald-500/30 text-emerald-200/80'
                    }`}>
                        <span className="text-xl opacity-60">{interpretation.priorityLevel === 'high' ? '🛑' : interpretation.priorityLevel === 'medium' ? '⚠️' : '✅'}</span>
                        <div>
                            <span className="text-[7px] font-black uppercase tracking-widest opacity-40 block">{t.ui.status_protocol}</span>
                            <p className="text-[10px] font-bold leading-tight">{interpretation.priority}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        <VitalMonitor label="FND" value={Math.round(clientResult.state.foundation)} color="text-slate-300" />
                        <VitalMonitor label="AGC" value={Math.round(clientResult.state.agency)} color="text-blue-500" />
                        <VitalMonitor label="RES" value={Math.round(clientResult.state.resource)} color="text-amber-500" />
                        <VitalMonitor label="ENT" value={Math.round(clientResult.state.entropy)} color="text-red-500" />
                    </div>
                </div>

                <div>
                    <h4 className="text-[9px] font-black uppercase text-indigo-500 tracking-[0.2em] pl-1 mb-2 opacity-50">{t.ui.architecture_session}</h4>
                    <SessionArc steps={interpretation.narrative.sessionFlow} t={t} isLocked={!isProSession} />
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <NarrativeSection title={cd.headers.mechanism} content={interpretation.narrative.deepAnalysis} highlight isLocked={!isProSession} />
                    <NarrativeSection title={t.ui.behavioral_markers} content={interpretation.narrative.behavioralMarkers} icon="👀" isLocked={!isProSession} />
                    <NarrativeSection title={t.ui.systemic_root} content={interpretation.narrative.systemicRoot} icon="🌳" isLocked={!isProSession} />
                    
                    {/* Fixed "isLocked" variable error by replacing it with "!isProSession" */}
                    <div className={`p-4 rounded-xl border transition-all ${!isProSession ? 'bg-slate-900/50 border-slate-800' : 'bg-emerald-950/10 border-emerald-500/20'}`}>
                         <h4 className={`text-[9px] font-black uppercase tracking-widest mb-2 ${!isProSession ? 'text-slate-700' : 'text-emerald-500'}`}>{t.ui.verdict_protocol}</h4>
                         <div className={`whitespace-pre-wrap text-[10px] text-emerald-100/90 leading-relaxed font-mono ${!isProSession ? 'blur-[5px] select-none opacity-10' : ''}`}>
                            {!isProSession ? 'PROTECTED_VERDICT_STREAM_LOCKED' : interpretation.narrative.verdictAndRecommendations}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800 text-center space-y-4">
                     <p className="text-[8px] text-slate-700 uppercase max-w-[220px] mx-auto border border-slate-900 p-2 rounded leading-relaxed italic">
                        {isProSession ? cd.disclaimer : "SUPERVISION_BRIDGE_OFFLINE: Interpretation by qualified personnel only. Do not self-diagnose."}
                     </p>
                     <button 
                        onClick={() => setClientResult(null)} 
                        className="text-[9px] font-black text-slate-700 uppercase tracking-widest hover:text-red-900 transition-colors bg-white/5 px-4 py-3 rounded-lg border border-white/5 w-full"
                     >
                        [ CLOSE_SESSION ]
                     </button>
                </div>
            </div>
        )}
    </section>
  );
};
