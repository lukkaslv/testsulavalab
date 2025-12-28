import { memo, useMemo, useState, useEffect } from 'react';
import { DomainType, Translations, AnalysisResult, ScanHistory, LifeContext, SubscriptionTier } from '../../types';
import { DOMAIN_SETTINGS, SYSTEM_METADATA, ONBOARDING_NODES_COUNT, TOTAL_NODES } from '../../constants';
import { EvolutionDashboard } from '../EvolutionDashboard';
import { PlatformBridge } from '../../utils/helpers';
import { ClinicalDecoder } from '../../services/clinicalDecoder';
import { useAppContext } from '../../hooks/useAppContext';

export interface NodeUI {
  id: number;
  domain: DomainType;
  active: boolean;
  done: boolean;
}

// Moved interface definition before usage to prevent module parsing errors.
interface DashboardViewProps {
  lang: 'ru' | 'ka';
  t: Translations;
  isDemo: boolean;
  isPro: boolean; 
  globalProgress: number;
  result: AnalysisResult | null;
  currentDomain: DomainType | null;
  nodes: NodeUI[];
  completedNodeIds: number[];
  onSetView: (view: any) => void;
  onSetCurrentDomain: (domain: DomainType | null) => void;
  onStartNode: (id: number, domain: DomainType) => void;
  onLogout: () => void;
  scanHistory: ScanHistory | null;
  onResume?: () => void; 
  licenseTier?: SubscriptionTier;
  usageStats: { used: number; limit: number; isUnlimited: boolean; canStart: boolean; };
}

const ContextCheckModal = ({ t, onSelect }: { t: Translations, onSelect: (c: LifeContext) => void }) => {
    const opts = t.context_check.options;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>
            <div className="bg-white w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl relative z-10 space-y-6 border border-slate-100">
                <div className="text-center space-y-3">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-inner">🕶️</div>
                    <h2 className="text-lg font-black uppercase text-slate-900 tracking-tight leading-tight">{t.context_check.title}</h2>
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">{t.context_check.desc}</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {(Object.keys(opts) as LifeContext[]).map(key => (
                        <button 
                            key={key} 
                            aria-label={`${opts[key].label}: ${opts[key].sub}`}
                            onClick={() => {
                                PlatformBridge.haptic.selection();
                                onSelect(key);
                            }}
                            className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-left hover:bg-indigo-50 hover:border-indigo-200 active:scale-[0.97] transition-all group"
                        >
                            <span className="text-[10px] font-black uppercase text-indigo-600 block mb-0.5 group-hover:text-indigo-700">{opts[key].label}</span>
                            <span className="text-[9px] font-bold text-slate-400 leading-tight block">{opts[key].sub}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProDashboard = memo<DashboardViewProps>(({ t, usageStats, onSetView, onLogout, licenseTier, scanHistory, onStartNode }) => {
    const ph = t.pro_hub;
    const recentScans = useMemo(() => scanHistory?.scans.slice().reverse().slice(0, 5) || [], [scanHistory]);
    const usagePercentage = usageStats.isUnlimited ? 0 : Math.round((usageStats.used / usageStats.limit) * 100);

    const interpretations = useMemo(() => 
        recentScans.map(scan => ClinicalDecoder.decode(scan, t)),
    [recentScans, t]);

    const riskLevelToColor: Record<string, string> = {
        critical: 'text-red-400 border-red-500/30',
        high: 'text-amber-400 border-amber-500/30',
        nominal: 'text-emerald-400 border-emerald-500/30'
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white p-4 space-y-4 animate-in select-none overflow-y-auto no-scrollbar">
            <header className="flex justify-between items-center border-b border-indigo-900/30 pb-3 shrink-0 px-2">
                <div className="flex flex-col">
                    <h2 className="text-lg font-black uppercase tracking-widest text-indigo-400">{ph.title}</h2>
                    <span className="text-[9px] text-slate-500 font-mono">GENESIS_OS_PRO // {licenseTier}</span>
                </div>
                <button onClick={onLogout} aria-label={t.ui.logout_btn} className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded-xl border border-slate-800 text-slate-500 hover:text-red-500 transition-colors">
                    <span className="text-sm">⏻</span>
                </button>
            </header>
            <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="bg-slate-900 p-3 rounded-2xl border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{ph.system_status}</span>
                    </div>
                    <div className="text-lg font-black text-emerald-400">{ph.risk_level_nominal}</div>
                    <div className="text-[8px] font-mono text-slate-600">{ph.license_expires}: 28 {ph.days_left}</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-2xl border border-white/5 space-y-1.5">
                    <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{ph.remaining_sessions}</span>
                    <div className="text-2xl font-black text-white tabular-nums">{usageStats.isUnlimited ? '∞' : (usageStats.limit - usageStats.used)}</div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={100 - usagePercentage} aria-valuemin={0} aria-valuemax={100}>
                        <div className="h-full bg-indigo-500" style={{width: `${usageStats.isUnlimited ? 100 : 100 - usagePercentage}%`}}></div>
                    </div>
                </div>
            </div>
            <button onClick={() => onSetView('compatibility')} className="w-full bg-indigo-600 p-6 rounded-2xl shadow-2xl shadow-indigo-500/20 border border-indigo-500 flex flex-col items-center justify-center gap-2 group active:scale-[0.98] transition-all relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-20"></div>
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">📟</span>
                <div className="text-center relative z-10">
                    <h3 className="text-base font-black uppercase tracking-widest text-white">{ph.access_terminal}</h3>
                    <p className="text-[9px] text-indigo-200 mt-1 font-medium">{ph.terminal_desc}</p>
                </div>
            </button>
            <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-1">{ph.recent_activity}</h4>
                <div className="space-y-2">
                    {recentScans.length > 0 ? (
                    recentScans.map((scan, index) => {
                        const interpretation = interpretations[index];
                        const riskColor = riskLevelToColor[interpretation.riskProfile.level];
                        return (
                        <div key={scan.shareCode} className="bg-slate-900 p-3 rounded-xl border border-white/5 flex justify-between items-center hover:bg-slate-800/50 transition-colors">
                            <div>
                                <span className="text-xs font-mono text-white font-bold">{ph.session_id} {scan.shareCode.substring(0, 8)}...</span>
                                <span className="text-[8px] font-mono text-slate-500 block">{new Date(scan.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className={`px-2 py-1 rounded border text-[8px] font-black ${riskColor}`}>
                                {interpretation.riskProfile.label}
                            </div>
                        </div>
                        );
                    })
                    ) : (
                    <div className="text-center py-6 bg-slate-900 rounded-xl border border-dashed border-slate-800">
                        <span className="text-[9px] text-slate-600 font-mono italic">{ph.no_sessions_found}</span>
                    </div>
                    )}
                </div>
            </div>
            <div className="space-y-3 shrink-0 pt-2 border-t border-slate-800/50">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-1">{ph.tools_panel}</h4>
                <div className="grid grid-cols-3 gap-2">
                    {/* FIX: Add onStartNode to destructured props to resolve reference error. */}
                    <button onClick={() => onStartNode(0, 'foundation')} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[8px] font-black uppercase text-slate-400 hover:text-white transition-colors flex flex-col items-center gap-1.5">
                        <span className="text-lg">🔬</span>{ph.calibrate_instrument}
                    </button>
                     <button onClick={() => onSetView('guide')} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[8px] font-black uppercase text-slate-400 hover:text-white transition-colors flex flex-col items-center gap-1.5">
                        <span className="text-lg">📖</span>{ph.pro_guide}
                    </button>
                    <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[8px] font-black uppercase text-slate-700 transition-colors flex flex-col items-center gap-1.5 cursor-not-allowed">
                        <span className="text-lg opacity-50">📦</span><span className="opacity-50">{ph.data_vault}</span>
                    </button>
                </div>
            </div>
        </div>
    );
});

const ClientDashboard = memo<DashboardViewProps>(({ lang, t, isPro, globalProgress, result, currentDomain, nodes, onSetView, onSetCurrentDomain, onStartNode, scanHistory, onResume, onLogout, completedNodeIds }) => {
    const { handleReset } = useAppContext();
    const activeDomainCount = useMemo(() => DOMAIN_SETTINGS.filter(d => nodes.filter(n => n.domain === d.key && n.done).length === d.count).length, [nodes]);

    const remainingNodes = TOTAL_NODES - completedNodeIds.length;
    const estMinutes = Math.ceil((remainingNodes * 18) / 60); 

    const humanInsight = useMemo(() => {
        if (!result) return t.dashboard?.desc;
        if (globalProgress === 100) return t.global.complete + ". " + t.dashboard.insight_coherence;
        const { entropyScore, neuroSync, integrity } = result;
        if (entropyScore > 60) return t.dashboard.insight_noise;
        if (neuroSync < 45) return t.dashboard.insight_somatic_dissonance;
        if (integrity > 75) return t.dashboard.insight_coherence;
        return t.dashboard?.desc;
    }, [result, t, globalProgress]);

    const systemMessage = localStorage.getItem('genesis_system_message');
    const isSessionActive = globalProgress > 0 && globalProgress < 100;
    const isTestComplete = globalProgress >= 100 && completedNodeIds.length >= 40;
    const isCalibrating = completedNodeIds.length < ONBOARDING_NODES_COUNT;

    return (
        <div className="space-y-6 animate-in flex flex-col h-full relative">
          <header className="space-y-3 shrink-0">
            <div className="flex justify-between items-center px-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 italic leading-tight">{t.ui.status_report_title}</h2>
                <div className="flex items-center gap-2">
                    {isPro && (
                        <button onClick={onLogout} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:text-red-500 transition-colors" title={t.ui.logout_btn}>
                            <span className="text-xs">👋</span>
                        </button>
                    )}
                    <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-tighter">v{SYSTEM_METADATA.VERSION.split('-')[0]}</span>
                    </div>
                </div>
            </div>
            {systemMessage && (
                <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-[1.5rem] shadow-sm animate-in" role="status">
                    <h4 className="text-[9px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2 mb-1"><span>📡</span> SYSTEM BROADCAST</h4>
                    <p className="text-[11px] font-medium text-slate-700 leading-tight italic">"{systemMessage}"</p>
                </div>
            )}
            {isSessionActive && onResume ? (
                <button onClick={onResume} className="w-full bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-500/20 border border-indigo-500/50 flex justify-between items-center group active:scale-[0.98] transition-all">
                    <div className="text-left">
                        <h4 className="text-[9px] font-black text-indigo-200 uppercase tracking-widest flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>{t.ui.resume_session_title}
                        </h4>
                        <p className="text-sm font-black text-white italic">{t.ui.resume_session_btn} →</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-indigo-600 transition-colors">▶</div>
                </button>
            ) : (
                <div className={`p-4 rounded-2xl border transition-all duration-500 ${result && result.entropyScore > 60 ? 'bg-red-50 border-red-100 shadow-red-100/50' : 'bg-indigo-50/50 border-indigo-100/30'}`}>
                   <p className={`text-[11px] font-bold italic leading-relaxed ${result && result.entropyScore > 60 ? 'text-red-700' : 'text-indigo-700'}`}>{humanInsight}</p>
                </div>
            )}
          </header>
          <EvolutionDashboard history={scanHistory} lang={lang} t={t} />
          
          <section 
            onClick={() => isTestComplete ? onSetView('results') : (onResume && onResume())} 
            className={`p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden shrink-0 group cursor-pointer transition-all active:scale-[0.98] ${isTestComplete ? 'bg-indigo-600 ring-4 ring-indigo-500/20' : 'dark-glass-card'}`}
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 animate-pulse"></div>
             <div className="flex justify-between items-end relative z-10">
                <div className="space-y-1">
                   <span className={`text-[10px] font-black uppercase tracking-widest ${isTestComplete ? 'text-indigo-200' : 'text-slate-500'}`}>{t.ui.system_audit_title}</span>
                   <div className={`text-2xl font-black italic uppercase tracking-tighter text-white`}>
                      {isTestComplete ? t.global.complete : t.ui.progress_label} <span className={`tabular-nums ${isTestComplete ? 'text-emerald-300' : 'text-indigo-400'}`}>{globalProgress}%</span>
                   </div>
                   {!isTestComplete && (
                       <span className="text-[8px] font-bold text-indigo-300 uppercase tracking-widest block pt-1 tabular-nums">
                           {t.safety.time_remaining} ~{estMinutes} {t.safety.minutes}
                       </span>
                   )}
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isTestComplete ? 'bg-white text-indigo-600' : 'bg-white/5 text-white/40 border border-white/10 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                    {isTestComplete ? '➜' : '▶'}
                </div>
             </div>
             <div className="mt-6 space-y-4 relative z-10">
                {[{ label: t.results.integrity, val: result?.integrity || 0, color: isTestComplete ? 'bg-emerald-300' : 'bg-emerald-400' }, { label: t.results.neuro_sync, val: result?.neuroSync || 0, color: isTestComplete ? 'bg-white' : 'bg-indigo-400' }].map(m => (
                  <div key={m.label} className="space-y-1.5" role="progressbar" aria-valuenow={m.val} aria-valuemin={0} aria-valuemax={100} aria-label={m.label}>
                     <div className={`flex justify-between text-[8px] font-black uppercase tracking-widest ${isTestComplete ? 'text-indigo-100' : 'text-slate-500'}`}><span>{m.label}</span><span className="tabular-nums">{m.val}%</span></div>
                     <div className={`h-1.5 rounded-full overflow-hidden ${isTestComplete ? 'bg-white/20' : 'bg-white/5'}`}><div className={`h-full ${m.color} transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.2)]`} style={{ width: `${m.val}%` }}></div></div>
                  </div>
                ))}
             </div>
          </section>

          <div className="grid grid-cols-2 gap-3">
              <button onClick={() => onSetView('guide')} className="w-full py-4 bg-white rounded-2xl flex flex-col items-center justify-center px-4 active:scale-95 transition-all shadow-md border border-slate-200 group">
                 <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🧭</span>
                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t.dashboard.manual_btn}</span>
              </button>
              <button onClick={() => handleReset(false)} className="w-full py-4 bg-white rounded-2xl flex flex-col items-center justify-center px-4 active:scale-95 transition-all shadow-md border border-slate-200 group">
                 <span className="text-xl mb-1 text-red-400 group-hover:scale-110 transition-transform">🗑️</span>
                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t.ui.reset_session_btn}</span>
              </button>
          </div>


          {isCalibrating && !currentDomain ? (
             <div className="space-y-4 flex-1 pb-10">
                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2.5rem] space-y-4 text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl mx-auto shadow-sm">🔬</div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-black uppercase text-indigo-900 tracking-tight">{t.global.calibrating}</h3>
                        <p className="text-[11px] font-medium text-indigo-700 leading-relaxed italic">{t.global.calib_desc}</p>
                    </div>
                    <button onClick={() => onStartNode(completedNodeIds.length, 'foundation')} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-200 active:scale-95 transition-all">
                        {t.onboarding.protocol_btn}
                    </button>
                </div>
                <div className="opacity-30 pointer-events-none grayscale">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 px-1">{t.dashboard.select_domain}</h3>
                    <div className="p-5 rounded-2xl border border-slate-100 bg-white flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-slate-100"></div><div className="h-4 bg-slate-100 rounded w-24"></div></div>
                </div>
             </div>
          ) : !currentDomain ? (
            <div className="space-y-3 flex-1 pb-10">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t.dashboard.select_domain}</h3>
                <span className="text-[9px] font-mono font-bold text-slate-300 uppercase tabular-nums">{activeDomainCount} / 5 {t.ui.secured_label}</span>
              </div>
              <div className="grid grid-cols-1 gap-3 pb-8">
                {DOMAIN_SETTINGS.map(config => {
                    const domainNodes = nodes.filter(n => n.domain === config.key);
                    const doneCount = domainNodes.filter(n => n.done).length;
                    const totalCount = domainNodes.length;
                    const domainProgress = Math.round((doneCount / totalCount) * 100);
                    return (
                        <button key={config.key} onClick={() => onSetCurrentDomain(config.key)} className={`p-5 rounded-2xl border flex items-center justify-between transition-all active:scale-[0.98] group relative overflow-hidden ${domainProgress === 100 ? 'bg-slate-900 border-indigo-500 shadow-indigo-500/10' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black transition-transform group-hover:scale-110 ${domainProgress === 100 ? 'bg-indigo-600 text-white' : ''}`} style={domainProgress < 100 ? { backgroundColor: config.color, color: config.color.replace('0.08', '0.8') } : {}}>{config.key[0].toUpperCase()}</div>
                                <div className="text-left">
                                    <span className={`text-sm font-black uppercase tracking-tight ${domainProgress === 100 ? 'text-white' : 'text-slate-900'}`}>{t.domains[config.key]}</span>
                                    <div className="flex items-center gap-2 mt-0.5"><div className={`w-16 h-1 rounded-full overflow-hidden ${domainProgress === 100 ? 'bg-white/10' : 'bg-slate-100'}`}><div className={`h-full ${domainProgress === 100 ? 'bg-emerald-400' : 'bg-indigo-500/50'}`} style={{ width: `${domainProgress}%` }}></div></div><span className={`text-[8px] font-bold tabular-nums ${domainProgress === 100 ? 'text-indigo-300' : 'text-slate-400'}`}>{doneCount}/{totalCount}</span></div>
                                </div>
                            </div>
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${domainProgress === 100 ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300'}`}>➜</span>
                        </button>
                    );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in flex-1 flex flex-col pb-10">
              <div className="flex justify-between items-center shrink-0">
                <button onClick={() => onSetCurrentDomain(null)} className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-2 rounded-xl hover:bg-indigo-100 transition-colors"><span className="text-xs">←</span> {t.global.back}</button>
                <h3 className="text-lg font-black italic uppercase text-slate-900 tracking-tight leading-none">{t.domains[currentDomain]}</h3>
              </div>
              <div className="bg-slate-50/50 rounded-[2rem] p-6 flex-1 border border-slate-100/50">
                  <div className="grid grid-cols-5 gap-3">
                     {nodes.filter(n => n.domain === currentDomain).map(n => (
                        <button key={n.id} disabled={!n.active || n.done} onClick={() => onStartNode(n.id, n.domain)} className={`aspect-square rounded-xl border transition-all flex items-center justify-center text-xs font-bold relative overflow-hidden ${n.done ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : n.active ? 'bg-white border-indigo-100 text-indigo-600 shadow-sm active:scale-90 hover:border-indigo-300' : 'bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed opacity-40'}`}>
                           <span className="relative z-10 tabular-nums">{n.done ? '✔' : n.id + 1}</span>
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

export const DashboardView = memo<DashboardViewProps>((props) => {
  const [showContextCheck, setShowContextCheck] = useState(false);

  useEffect(() => {
      if (!props.isPro && !localStorage.getItem('genesis_context') && props.completedNodeIds.length === 0) {
          setShowContextCheck(true);
      }
  }, [props.isPro, props.completedNodeIds.length]);

  const handleContextSelect = (c: LifeContext) => {
      localStorage.setItem('genesis_context', c);
      setShowContextCheck(false);
      PlatformBridge.haptic.notification('success');
  };

  const isProMode = props.licenseTier === 'CLINICAL' || props.licenseTier === 'LAB';

  return (
      <div className="h-full">
          {showContextCheck && <ContextCheckModal t={props.t} onSelect={handleContextSelect} />}
          {isProMode ? <ProDashboard {...props} /> : <ClientDashboard {...props} />}
      </div>
  );
});
