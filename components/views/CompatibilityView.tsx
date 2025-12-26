
import React, { useState, useMemo } from 'react';
import { AnalysisResult, Translations, SessionStep } from '../../types';
import { CompatibilityEngine } from '../../services/compatibilityEngine';
import { generateClinicalNarrative } from '../../services/clinicalNarratives';
import { ClinicalDecoder } from '../../services/clinicalDecoder';

interface CompatibilityViewProps {
  userResult: AnalysisResult | null;
  t: Translations;
  onBack: () => void;
}

const NarrativeSection = ({ title, content, highlight = false, alert = false, special = false, icon }: { title: string, content: string, highlight?: boolean, alert?: boolean, special?: boolean, icon?: string }) => (
    <div className={`space-y-2 ${highlight ? 'bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10' : alert ? 'bg-red-950/20 p-4 rounded-xl border border-red-900/30' : special ? 'bg-emerald-950/10 p-4 rounded-xl border border-emerald-900/20' : 'py-3 border-b border-slate-800/50'}`}>
        <h4 className={`text-[9px] font-black uppercase tracking-widest pb-1 flex items-center gap-2 ${alert ? 'text-red-400' : special ? 'text-emerald-400' : highlight ? 'text-indigo-300' : 'text-slate-50'}`}>
            {icon && <span className="text-sm opacity-80">{icon}</span>}
            {title}
        </h4>
        <div className="whitespace-pre-wrap text-[10px] text-slate-300 leading-relaxed font-mono pl-1 opacity-90">
            {content}
        </div>
    </div>
);

const SupervisionCard = ({ title, children, type = 'info' }: { title: string, children?: React.ReactNode, type?: 'info' | 'alert' | 'secret' }) => (
    <div className={`rounded-xl border relative overflow-hidden ${
        type === 'alert' ? 'bg-red-950/10 border-red-500/30' : 
        type === 'secret' ? 'bg-indigo-950/30 border-indigo-500/30' : 
        'bg-slate-900/30 border-slate-700/50'
    }`}>
        {type === 'secret' && <div className="absolute top-0 right-0 p-2 text-[40px] opacity-5 pointer-events-none">🔒</div>}
        <div className={`px-3 py-2 border-b text-[8px] font-black uppercase tracking-[0.2em] flex justify-between items-center ${
             type === 'alert' ? 'border-red-500/20 text-red-400' : 
             type === 'secret' ? 'border-indigo-500/20 text-indigo-300' : 
             'border-slate-700/50 text-slate-500'
        }`}>
            <span>{title}</span>
            <span>{type === 'alert' ? '⚠️' : type === 'secret' ? 'SECRET' : 'INFO'}</span>
        </div>
        <div className="p-3">
            {children}
        </div>
    </div>
);

const SessionArc = ({ steps, t }: { steps: SessionStep[], t: Translations }) => (
    <div className="grid grid-cols-1 gap-2 my-4">
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

export const CompatibilityView: React.FC<CompatibilityViewProps> = ({ userResult, t, onBack }) => {
  const [partnerCode, setPartnerCode] = useState('');
  const [clientResult, setClientResult] = useState<AnalysisResult | null>(null);

  const currentLang = t.subtitle.includes('LUKA') && t.onboarding.title.includes('ნავიგატორი') ? 'ka' : 'ru';
  const cd = t.clinical_decoder;

  const handleAnalyze = () => {
    const decodedClient = CompatibilityEngine.decodeSmartCode(partnerCode);
    if (decodedClient) {
        setClientResult(decodedClient);
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success');
    } else {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('error');
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
    <section className="space-y-6 animate-in py-4 flex flex-col h-full bg-white">
        <div className="flex justify-between items-center px-1 pb-2 border-b border-indigo-100/50 shrink-0">
            <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-600 active:scale-95 transition-all">
                ← {t.global.back}
            </button>
            <div className="flex flex-col items-end">
                 <span className="text-[10px] font-mono text-indigo-600 font-black tracking-widest">{t.dashboard.open_terminal}</span>
                 <span className="text-[7px] font-mono text-slate-400 uppercase">Analyzer v5.2</span>
            </div>
        </div>

        {!clientResult && (
            <div className="space-y-4 animate-in">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-sm">🔐</div>
                    <div>
                        <h3 className="text-sm font-black uppercase text-slate-900">{t.ui.access_restricted}</h3>
                        <p className="text-[10px] text-slate-500 font-medium mt-1 max-w-[200px] mx-auto">
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
                            <span className="text-[8px] text-emerald-500 font-black uppercase tracking-widest block">ID_СИСТЕМЫ</span>
                            <span className="text-[10px] text-emerald-500 font-mono font-bold tracking-wider">{clientResult.shareCode.substring(0, 10)}</span>
                        </div>
                        <div className="flex gap-1">
                            {interpretation.priorityLevel === 'high' && <span className="bg-red-950/50 text-red-400 border border-red-900/50 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-wider">RISK_HIGH</span>}
                        </div>
                    </div>

                    <div className={`p-3 rounded-xl border-l-4 shadow-lg flex items-center gap-3 ${
                        interpretation.priorityLevel === 'high' ? 'bg-red-950/20 border-red-500/50 text-red-200' :
                        interpretation.priorityLevel === 'medium' ? 'bg-amber-950/20 border-amber-500/50 text-amber-200' :
                        'bg-emerald-950/20 border-emerald-500/50 text-emerald-200'
                    }`}>
                        <span className="text-xl">{interpretation.priorityLevel === 'high' ? '🛑' : interpretation.priorityLevel === 'medium' ? '⚠️' : '✅'}</span>
                        <div>
                            <span className="text-[7px] font-black uppercase tracking-widest opacity-60 block">{t.ui.status_protocol}</span>
                            <p className="text-[10px] font-bold leading-tight">{interpretation.priority}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        <VitalMonitor label="FND" value={Math.round(clientResult.state.foundation)} color="text-slate-200" />
                        <VitalMonitor label="AGC" value={Math.round(clientResult.state.agency)} color="text-blue-400" />
                        <VitalMonitor label="RES" value={Math.round(clientResult.state.resource)} color="text-amber-400" />
                        <VitalMonitor label="ENT" value={Math.round(clientResult.state.entropy)} color="text-red-400" />
                    </div>
                </div>

                <div>
                    <h4 className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em] pl-1 mb-2">{t.ui.architecture_session}</h4>
                    <SessionArc steps={interpretation.narrative.sessionFlow} t={t} />
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <NarrativeSection title={cd.headers.mechanism} content={interpretation.narrative.deepAnalysis} highlight />
                    <NarrativeSection title={t.ui.behavioral_markers} content={interpretation.narrative.behavioralMarkers} icon="👀" />
                    <NarrativeSection title={t.ui.systemic_root} content={interpretation.narrative.systemicRoot} icon="🌳" />
                    
                    <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30">
                         <h4 className="text-[9px] font-black uppercase text-emerald-500 tracking-widest mb-2">{t.ui.verdict_protocol}</h4>
                         <div className="whitespace-pre-wrap text-[10px] text-emerald-100/90 leading-relaxed font-mono">
                            {interpretation.narrative.verdictAndRecommendations}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800 text-center space-y-4">
                     <p className="text-[8px] text-slate-600 uppercase max-w-[220px] mx-auto border border-slate-800 p-2 rounded leading-relaxed italic">
                        {cd.disclaimer}
                     </p>
                     <button 
                        onClick={() => setClientResult(null)} 
                        className="text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors bg-red-950/20 px-4 py-3 rounded-lg border border-red-900/30 w-full"
                     >
                        {t.ui.close_session_btn}
                     </button>
                </div>
            </div>
        )}
    </section>
  );
};
