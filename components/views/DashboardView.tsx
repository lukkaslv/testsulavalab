
import { memo, useMemo } from 'react';
import { DomainType, Translations, AnalysisResult, ScanHistory, LifeContext } from '../../types';
import { SYSTEM_METADATA, STORAGE_KEYS } from '../../constants';
import { StorageService } from '../../services/storageService';
import { PlatformBridge } from '../../utils/helpers';
import { DomainNavigator } from '../DomainNavigator';
import { useAppContext } from '../../hooks/useAppContext';

export interface NodeUI {
  id: number;
  domain: DomainType;
  active: boolean;
  done: boolean;
}

interface DashboardViewProps {
  t: Translations;
  isDemo: boolean;
  globalProgress: number;
  result: AnalysisResult | null;
  currentDomain: DomainType | null;
  nodes: NodeUI[];
  completedNodeIds: number[];
  onSetView: (view: any) => void;
  onSetCurrentDomain: (domain: DomainType | null) => void;
  onStartNode: (id: number, domain: DomainType) => void;
  scanHistory: ScanHistory | null;
  onResume?: () => void;
}

// Integrated Mini Context Switcher
const CompactContextControl = ({ t }: { t: Translations }) => {
    const { sessionContext, setSessionContext, history } = useAppContext();
    const isLocked = history.length > 0;
    
    const contexts: Array<{ key: LifeContext, icon: string, label: string }> = [
        { key: 'NORMAL', icon: '🍃', label: 'NORM' },
        { key: 'HIGH_LOAD', icon: '🔥', label: 'LOAD' },
        { key: 'CRISIS', icon: '🛡️', label: 'CRIT' },
        { key: 'TRANSITION', icon: '🔄', label: 'FLOW' }
    ];

    return (
        <div className="flex bg-black/20 rounded-xl p-1 gap-1" onClick={(e) => e.stopPropagation()}>
            {contexts.map(ctx => {
                const isActive = sessionContext === ctx.key;
                if (isLocked && !isActive) return null;
                
                return (
                    <button
                        key={ctx.key}
                        disabled={isLocked}
                        onClick={() => setSessionContext(ctx.key)}
                        className={`
                            px-2 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all
                            ${isActive ? 'bg-white/20 shadow-sm text-white' : 'hover:bg-white/10 text-white/40'}
                            ${isLocked ? 'w-full justify-center' : ''}
                        `}
                    >
                        <span className="text-xs sm:text-sm filter drop-shadow-sm">{ctx.icon}</span>
                        {isActive && <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-wider">{ctx.label}</span>}
                    </button>
                );
            })}
        </div>
    );
};

const ProtocolWidget = memo(({ result, t, onOpen }: { result: AnalysisResult, t: Translations, onOpen: () => void }) => {
    const roadmapProgress = StorageService.load<string[]>(`roadmap_progress_${result.shareCode}`, []);
    const progressCount = roadmapProgress.length;
    const phase = result.roadmap[0]?.phase || 'STABILIZATION';
    
    const theme = phase === 'SANITATION' ? 'from-amber-900/40 border-amber-500/30' : 
                  phase === 'EXPANSION' ? 'from-emerald-900/40 border-emerald-500/30' : 
                  'from-indigo-900/40 border-indigo-500/30';

    return (
        <section onClick={onOpen} className={`p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden shrink-0 group cursor-pointer transition-all active:scale-[0.98] border-t border-white/10 bg-gradient-to-br ${theme} to-slate-950`}>
             <div className="flex justify-between items-start relative z-10 mb-4">
                <div className="space-y-1">
                   <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-70 text-white">{t.dashboard.protocol_active}</span>
                   <div className="text-xl font-black italic uppercase tracking-tighter text-white leading-none pt-1">
                      {t.roadmap.phases[phase as keyof typeof t.roadmap.phases]}
                   </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl border border-white/10">
                    {phase === 'SANITATION' ? '🧹' : phase === 'STABILIZATION' ? '⚓' : '🚀'}
                </div>
             </div>
             <div className="space-y-2 relative z-10">
                 <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-white/60">
                    <span>{t.dashboard.days_complete}</span>
                    <span className="text-white">{progressCount} / 7</span>
                 </div>
                 <div className="h-1.5 bg-slate-900/50 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-white/80 transition-all duration-1000" style={{ width: `${(progressCount / 7) * 100}%` }}></div>
                 </div>
             </div>
        </section>
    );
});

export const DashboardView = memo<DashboardViewProps>((props) => {
    const { t, globalProgress, onResume, completedNodeIds, result, onSetView, nodes, onStartNode } = props;
    const { sessionContext } = useAppContext();

    const isTestComplete = globalProgress >= 100;
    
    // Theme logic based on Context (Art. 11.7)
    const contextTheme = useMemo(() => {
        switch(sessionContext) {
            case 'CRISIS': return { bg: 'from-red-900/40 to-slate-900', border: 'border-red-500/30', accent: 'bg-red-500' };
            case 'HIGH_LOAD': return { bg: 'from-amber-900/40 to-slate-900', border: 'border-amber-500/30', accent: 'bg-amber-500' };
            case 'TRANSITION': return { bg: 'from-sky-900/40 to-slate-900', border: 'border-sky-500/30', accent: 'bg-sky-500' };
            default: return { bg: 'from-indigo-900/40 to-slate-900', border: 'border-indigo-500/30', accent: 'bg-indigo-500' };
        }
    }, [sessionContext]);

    // Knowledge Base Items
    const knowledgeItems = [
        { id: 'brief_explainer', icon: '🧬', label: 'Экскурс', color: 'emerald' },
        { id: 'archetypes', icon: '🏆', label: 'Атлас', color: 'amber' },
        { id: 'codex', icon: '🔮', label: 'Кодекс', color: 'indigo' },
        { id: 'guide', icon: '🧭', label: t.dashboard.manual_btn, color: 'slate' },
    ];

    return (
        <div className="space-y-5 animate-in flex flex-col relative text-slate-100 pb-24">
          
          {/* Main Action Area (Integrated) */}
          <div className="space-y-3">
              {result && isTestComplete ? (
                  <ProtocolWidget result={result} t={t} onOpen={() => onSetView('protocol')} />
              ) : (
                  <section 
                    onClick={() => isTestComplete ? onSetView('processing') : (onResume && onResume())} 
                    className={`
                        relative p-5 rounded-[2.5rem] shadow-2xl overflow-hidden shrink-0 group cursor-pointer transition-all active:scale-[0.98] border-t 
                        bg-gradient-to-br ${contextTheme.bg} ${contextTheme.border} border-white/10
                    `}
                  >
                     {/* Living Pulse Effect */}
                     {!isTestComplete && <div className={`absolute inset-0 opacity-10 blur-3xl animate-pulse-slow ${contextTheme.accent}`}></div>}
                     
                     <div className="relative z-10 flex flex-col space-y-4">
                        {/* Top Control Bar */}
                        <div className="flex justify-between items-start">
                            <CompactContextControl t={t} />
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-lg bg-white/10 border border-white/10 backdrop-blur-sm`}>
                                {isTestComplete ? '🏁' : '⚡'}
                            </div>
                        </div>

                        {/* Title Block */}
                        <div className="space-y-0.5">
                            <span className={`text-[9px] font-black uppercase tracking-[0.3em] text-white/50`}>
                                {isTestComplete ? 'ANALYSIS_COMPLETE' : 'SYSTEM_READY'}
                            </span>
                            <div className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">
                               {isTestComplete ? "РЕЗУЛЬТАТ" : completedNodeIds.length > 0 ? t.ui.resume_session_btn : "ЗАПУСК ЯДРА"}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
                                <span>{t.ui.progress_label}</span>
                                <span className="font-mono text-white">{globalProgress}%</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden bg-black/20 border border-white/5">
                                <div className={`h-full transition-all duration-1000 ${contextTheme.accent}`} style={{ width: `${globalProgress}%` }}></div>
                            </div>
                        </div>
                     </div>
                  </section>
              )}
          </div>

          {/* Domain Map - Restricted Height */}
          <div className="mx-auto w-full max-w-[320px]">
             <DomainNavigator nodes={nodes} onStartNode={onStartNode} t={t} />
          </div>

          {/* Knowledge Grid */}
          <div className="space-y-2">
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.3em] pl-2 border-l-2 border-slate-700 ml-1">
                  БАЗА ЗНАНИЙ
              </span>
              <div className="grid grid-cols-4 gap-2 px-1">
                  {knowledgeItems.map((item) => (
                      <button 
                        key={item.id} 
                        onClick={() => onSetView(item.id)} 
                        className={`
                            flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all active:scale-95
                            bg-${item.color}-900/10 border-${item.color}-500/20 hover:bg-${item.color}-900/20
                        `}
                      >
                          <span className="text-lg filter drop-shadow-md">{item.icon}</span>
                          <span className={`text-[7px] font-black uppercase tracking-widest text-${item.color}-300 leading-none`}>
                              {item.label}
                          </span>
                      </button>
                  ))}
              </div>
          </div>

          <footer className="pt-2 text-center opacity-30">
              <p className="text-[7px] font-black uppercase tracking-[0.5em] text-slate-500">Genesis OS // Sovereign Logic</p>
          </footer>
        </div>
    );
});
