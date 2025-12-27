
import React, { memo, useMemo, useState, useEffect } from 'react';
import { DomainType, Translations, AnalysisResult, ScanHistory, LifeContext, SubscriptionTier } from '../../types';
import { DOMAIN_SETTINGS, SYSTEM_METADATA } from '../../constants';
import { EvolutionDashboard } from '../EvolutionDashboard';
import { PlatformBridge } from '../../utils/helpers';

export interface NodeUI {
  id: number;
  domain: DomainType;
  active: boolean;
  done: boolean;
}

interface DashboardViewProps {
  lang: 'ru' | 'ka';
  t: Translations;
  isDemo: boolean;
  globalProgress: number;
  result: AnalysisResult | null;
  currentDomain: DomainType | null;
  nodes: NodeUI[];
  completedNodeIds: number[];
  onSetView: (view: 'results' | 'auth' | 'compatibility' | 'guide') => void;
  onSetCurrentDomain: (domain: DomainType | null) => void;
  onStartNode: (id: number, domain: DomainType) => void;
  onLogout: () => void;
  scanHistory: ScanHistory | null;
  onResume?: () => void; 
  licenseTier?: SubscriptionTier;
}

const ContextCheckModal = ({ t, onSelect }: { t: Translations, onSelect: (c: LifeContext) => void }) => {
    const opts = t.context_check.options;
    return (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col justify-center px-6 animate-in">
            <div className="space-y-4 mb-8 text-center">
                <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">{t.context_check.title}</h2>
                <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs mx-auto">{t.context_check.desc}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {(Object.keys(opts) as LifeContext[]).map(key => (
                    <button 
                        key={key} 
                        onClick={() => {
                            PlatformBridge.haptic.selection();
                            onSelect(key);
                        }}
                        className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm active:scale-[0.98] transition-all text-left hover:border-indigo-400 group"
                    >
                        <span className="text-[10px] font-black uppercase text-indigo-600 block mb-1 group-hover:text-indigo-800">{opts[key].label}</span>
                        <span className="text-xs font-medium text-slate-500 leading-tight block">{opts[key].sub}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export const DashboardView = memo<DashboardViewProps>(({
  lang, t, isDemo, globalProgress, result, currentDomain, nodes, completedNodeIds,
  onSetView, onSetCurrentDomain, onStartNode, onLogout, scanHistory, onResume, licenseTier = 'FREE'
}) => {
  
  const systemMessage = localStorage.getItem('genesis_system_message');
  const [showContextCheck, setShowContextCheck] = useState(false);

  useEffect(() => {
      // Trigger context check if not set and session has barely started
      if (!localStorage.getItem('genesis_context') && globalProgress < 5) {
          setShowContextCheck(true);
      }
  }, [globalProgress]);

  const handleContextSelect = (c: LifeContext) => {
      localStorage.setItem('genesis_context', c);
      setShowContextCheck(false);
      PlatformBridge.haptic.notification('success');
  };

  const humanInsight = useMemo(() => {
    if (!result) return t.dashboard.desc;
    if (globalProgress === 100) return t.global.complete + ". " + t.dashboard.insight_coherence;
    
    const { entropyScore, neuroSync, integrity } = result;
    if (entropyScore > 60) return t.dashboard.insight_noise;
    if (neuroSync < 45) return t.dashboard.insight_somatic_dissonance;
    if (integrity > 75) return t.dashboard.insight_coherence;
    return t.dashboard.desc;
  }, [result, t, globalProgress]);

  const activeDomainCount = useMemo(() => 
    DOMAIN_SETTINGS.filter(d => nodes.filter(n => n.domain === d.key && n.done).length === d.count).length
  , [nodes]);

  const needsRetest = useMemo(() => {
      if (!scanHistory || scanHistory.scans.length === 0) return false;
      const latest = scanHistory.scans[scanHistory.scans.length - 1];
      return latest.createdAt ? (Date.now() - latest.createdAt > 7 * 24 * 60 * 60 * 1000) : false;
  }, [scanHistory]);

  const usageStats = useMemo(() => {
      const limits: Record<SubscriptionTier, number> = { FREE: 1, SOLO: 10, CLINICAL: 50, LAB: 9999 };
      const used = scanHistory?.scans.length || 0;
      const limit = limits[licenseTier];
      const isUnlimited = limit > 9000;
      return { used, limit, isUnlimited };
  }, [licenseTier, scanHistory]);

  const isSessionActive = globalProgress > 0 && globalProgress < 100 && !result;

  return (
    <div className="space-y-6 animate-in flex flex-col h-full relative">
      
      {showContextCheck && <ContextCheckModal t={t} onSelect={handleContextSelect} />}

      <header className="space-y-3 shrink-0">
        <div className="flex justify-between items-center px-1">
            <div className="flex flex-col">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 italic">
                    {t.ui.status_report_title}
                </h2>
                <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-1">
                    LICENSE: {licenseTier} 
                    {!usageStats.isUnlimited && <span className={usageStats.used >= usageStats.limit ? 'text-red-500' : 'text-slate-400'}> ({usageStats.used}/{usageStats.limit})</span>}
                </span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-tighter">OVERSIGHT_v{SYSTEM_METADATA.VERSION.split('-')[0]}</span>
            </div>
        </div>
        
        {/* GLOBAL BROADCAST */}
        {systemMessage && (
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-[1.5rem] shadow-sm animate-in">
                <h4 className="text-[9px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <span>📡</span> SYSTEM BROADCAST
                </h4>
                <p className="text-[11px] font-medium text-slate-700 leading-tight italic">"{systemMessage}"</p>
            </div>
        )}

        {needsRetest && (
            <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-[1.5rem] space-y-1 shadow-lg shadow-amber-200/20 animate-pulse">
                <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-2">
                    <span>⚠️</span> {t.dashboard.retest_ready}
                </h4>
                <p className="text-[11px] font-bold text-amber-900 italic leading-tight">{t.dashboard.retest_desc}</p>
            </div>
        )}

        {isSessionActive && onResume ? (
            <button 
                onClick={onResume}
                className="w-full bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-500/20 border border-indigo-500/50 flex justify-between items-center group active:scale-[0.98] transition-all"
            >
                <div className="text-left">
                    <h4 className="text-[9px] font-black text-indigo-200 uppercase tracking-widest flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        {t.ui.resume_session_title}
                    </h4>
                    <p className="text-sm font-black text-white italic">{t.ui.resume_session_btn} →</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                    ▶
                </div>
            </button>
        ) : (
            <div className={`p-4 rounded-2xl border transition-all duration-500 ${result && result.entropyScore > 60 ? 'bg-red-50 border-red-100 shadow-red-100/50' : 'bg-indigo-50/50 border-indigo-100/30'}`}>
               <p className={`text-[11px] font-bold italic leading-relaxed ${result && result.entropyScore > 60 ? 'text-red-700' : 'text-indigo-700'}`}>
                  {humanInsight}
               </p>
            </div>
        )}
      </header>

      <EvolutionDashboard history={scanHistory} lang={lang} />

      <section 
        className={`p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden shrink-0 group cursor-pointer transition-all active:scale-[0.98] ${globalProgress === 100 ? 'bg-indigo-600 ring-4 ring-indigo-500/20' : 'dark-glass-card'}`} 
        onClick={() => {
            if (result) onSetView('results');
            else if (onResume && isSessionActive) onResume();
        }}
      >
         <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 animate-pulse"></div>
         
         <div className="flex justify-between items-end relative z-10">
            <div className="space-y-1">
               <span className={`text-[10px] font-black uppercase tracking-widest ${globalProgress === 100 ? 'text-indigo-200' : 'text-slate-500'}`}>{t.ui.system_audit_title}</span>
               <div className={`text-2xl font-black italic uppercase tracking-tighter ${globalProgress === 100 ? 'text-white' : 'text-white'}`}>
                  {t.ui.progress_label} <span className={globalProgress === 100 ? 'text-emerald-300' : 'text-indigo-400'}>{globalProgress}%</span>
               </div>
            </div>
            {result && (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${globalProgress === 100 ? 'bg-white text-indigo-600' : 'bg-white/5 text-white/40 border border-white/10 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                    ➜
                </div>
            )}
         </div>

         <div className="mt-6 space-y-4 relative z-10">
            {[
              { label: t.results.integrity, val: result?.integrity || 0, color: globalProgress === 100 ? 'bg-emerald-300' : 'bg-emerald-400' },
              { label: t.results.neuro_sync, val: result?.neuroSync || 0, color: globalProgress === 100 ? 'bg-white' : 'bg-indigo-400' }
            ].map(m => (
              <div key={m.label} className="space-y-1.5">
                 <div className={`flex justify-between text-[8px] font-black uppercase tracking-widest ${globalProgress === 100 ? 'text-indigo-100' : 'text-slate-500'}`}>
                    <span>{m.label}</span>
                    <span>{m.val}%</span>
                 </div>
                 <div className={`h-1.5 rounded-full overflow-hidden ${globalProgress === 100 ? 'bg-white/20' : 'bg-white/5'}`}>
                    <div className={`h-full ${m.color} transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.2)]`} style={{ width: `${m.val}%` }}></div>
                 </div>
              </div>
            ))}
         </div>
      </section>

      <div className="grid grid-cols-2 gap-3 px-1">
          <button 
            onClick={() => onSetView('compatibility')} 
            className="py-4 bg-slate-900 rounded-2xl flex flex-col items-center justify-center px-4 active:scale-95 transition-all shadow-lg border border-slate-800"
          >
             <span className="text-xl mb-1">📟</span>
             <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{t.dashboard.open_terminal}</span>
          </button>

          <button 
            onClick={() => onSetView('guide')} 
            className="py-4 bg-white rounded-2xl flex flex-col items-center justify-center px-4 active:scale-95 transition-all shadow-md border border-slate-200 group"
          >
             <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🧭</span>
             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t.dashboard.manual_btn}</span>
          </button>
      </div>

      {!currentDomain ? (
        <div className="space-y-3 flex-1">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t.dashboard.select_domain}</h3>
            <span className="text-[9px] font-mono font-bold text-slate-300 uppercase">{activeDomainCount} / 5 {t.ui.secured_label}</span>
          </div>
          <div className="grid grid-cols-1 gap-3 pb-8">
            {DOMAIN_SETTINGS.map(config => {
                const domainNodes = nodes.filter(n => n.domain === config.key);
                const doneCount = domainNodes.filter(n => n.done).length;
                const totalCount = domainNodes.length;
                const domainProgress = Math.round((doneCount / totalCount) * 100);

                return (
                    <button 
                        key={config.key} 
                        onClick={() => onSetCurrentDomain(config.key)} 
                        className={`p-5 rounded-2xl border flex items-center justify-between transition-all active:scale-[0.98] group relative overflow-hidden ${domainProgress === 100 ? 'bg-slate-900 border-indigo-500 shadow-indigo-500/10' : 'bg-white border-slate-100 shadow-sm'}`}
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black transition-transform group-hover:scale-110 ${domainProgress === 100 ? 'bg-indigo-600 text-white' : ''}`} style={domainProgress < 100 ? { backgroundColor: config.color, color: config.color.replace('0.08', '0.8') } : {}}>
                                {config.key[0].toUpperCase()}
                            </div>
                            <div className="text-left">
                                <span className={`text-sm font-black uppercase tracking-tight ${domainProgress === 100 ? 'text-white' : 'text-slate-900'}`}>{t.domains[config.key]}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className={`w-16 h-1 rounded-full overflow-hidden ${domainProgress === 100 ? 'bg-white/10' : 'bg-slate-100'}`}>
                                        <div className={`h-full ${domainProgress === 100 ? 'bg-emerald-400' : 'bg-indigo-500/50'}`} style={{ width: `${domainProgress}%` }}></div>
                                    </div>
                                    <span className={`text-[8px] font-bold ${domainProgress === 100 ? 'text-indigo-300' : 'text-slate-400'}`}>{doneCount}/{totalCount}</span>
                                </div>
                            </div>
                        </div>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${domainProgress === 100 ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300'}`}>➜</span>
                    </button>
                );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in flex-1 flex flex-col">
          <div className="flex justify-between items-center shrink-0">
            <button onClick={() => onSetCurrentDomain(null)} className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-2 rounded-xl hover:bg-indigo-100 transition-colors">
                <span className="text-xs">←</span> {t.global.back}
            </button>
            <h3 className="text-lg font-black italic uppercase text-slate-900 tracking-tight">{t.domains[currentDomain]}</h3>
          </div>
          
          <div className="bg-slate-50/50 rounded-[2rem] p-6 flex-1 border border-slate-100/50">
              <div className="grid grid-cols-5 gap-3">
                 {nodes.filter(n => n.domain === currentDomain).map(n => (
                    <button 
                      key={n.id} 
                      disabled={!n.active || n.done} 
                      onClick={() => onStartNode(n.id, n.domain)}
                      className={`aspect-square rounded-xl border transition-all flex items-center justify-center text-xs font-bold relative overflow-hidden ${
                        n.done ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' :
                        n.active ? 'bg-white border-indigo-100 text-indigo-600 shadow-sm active:scale-90 hover:border-indigo-300' :
                        'bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed opacity-40'
                      }`}
                    >
                       <span className="relative z-10">{n.done ? '✔' : n.id + 1}</span>
                       {n.active && !n.done && <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>}
                    </button>
                 ))}
              </div>
          </div>
        </div>
      )}
    </div>
  );
});
