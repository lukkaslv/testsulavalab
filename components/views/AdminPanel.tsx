
import { HealthMetric, TelemetryEvent, NodeInsight, FeedbackEntry } from '../../types';
import React, { useState, memo, useEffect, useMemo, useRef } from 'react';
import { Translations, AnalysisResult, GameHistoryItem, BeliefKey, SystemLogEntry } from '../../types';
import { StorageService, STORAGE_KEYS } from '../../services/storageService';
import { ALL_BELIEFS, TOTAL_NODES, MODULE_REGISTRY, DOMAIN_SETTINGS, SYSTEM_METADATA, PSYCHO_CONFIG } from '../../constants';
import { PlatformBridge } from '../../utils/helpers';
import { translations } from '../../translations';
import { calculateRawMetrics } from '../../services/psychologyService';

interface AdminPanelProps {
  t: Translations;
  onExit: () => void;
  result: AnalysisResult | null;
  history: GameHistoryItem[];
  onUnlockAll: () => void;
  glitchEnabled: boolean;
  onToggleGlitch: () => void;
  onSetView: (view: any) => void;
}

const AuditCard = ({ title, status, details, errorCount = 0 }: { title: string; status: 'OK' | 'ERROR' | 'WARNING'; details: string[] | string, errorCount?: number }) => (
    <div className={`p-4 rounded-xl border transition-all ${status === 'OK' ? 'bg-emerald-950/20 border-emerald-900/30' : status === 'WARNING' ? 'bg-amber-950/20 border-amber-900/30' : 'bg-red-950/20 border-red-900/30'}`}>
        <div className="flex justify-between items-center mb-2">
            <h4 className={`text-[9px] font-black uppercase tracking-widest ${status === 'OK' ? 'text-emerald-400' : status === 'WARNING' ? 'text-amber-400' : 'text-red-400'}`}>{title}</h4>
            <div className="flex gap-2">
                {errorCount > 0 && <span className="text-[8px] bg-red-500 text-white px-1.5 rounded-full font-bold">{errorCount}</span>}
                <span className={`text-[8px] font-mono px-2 py-0.5 rounded ${status === 'OK' ? 'bg-emerald-500/20 text-emerald-300' : status === 'WARNING' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>{status}</span>
            </div>
        </div>
        <div className="max-h-32 overflow-y-auto text-[8px] font-mono space-y-1 pr-2 custom-scrollbar">
            {Array.isArray(details) ? (
                details.length > 0 ? details.map((item, index) => <div key={index} className="bg-slate-900/50 p-1 rounded border border-white/5">{item}</div>) : <div className="text-slate-600 italic">No issues detected.</div>
            ) : (
                <p className="text-[9px] font-mono text-slate-400">{details}</p>
            )}
        </div>
    </div>
);

export const AdminPanel = memo<AdminPanelProps>(({ t, onExit, result, history, onUnlockAll, glitchEnabled, onToggleGlitch, onSetView }) => {
  const [activeTab, setActiveTab] = useState<'kernel' | 'learning' | 'integrity' | 'health' | 'logs' | 'recovery'>('kernel');
  const [logs, setLogs] = useState<SystemLogEntry[]>(() => StorageService.load<SystemLogEntry[]>(STORAGE_KEYS.AUDIT_LOG, []));
  const [telemetry, setTelemetry] = useState<TelemetryEvent[]>(() => StorageService.getTelemetry());
  const [feedback, setFeedback] = useState<FeedbackEntry[]>(() => StorageService.getFeedback());
  const [uptime, setUptime] = useState('00:00:00');
  const [importData, setImportData] = useState('');
  
  const logScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
        const diff = Math.floor((Date.now() - start) / 1000);
        const h = Math.floor(diff / 3600).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        setUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleImport = () => {
    const success = StorageService.injectState(importData);
    if (success) {
        PlatformBridge.haptic.notification('success');
        alert("KERNEL STATE INJECTED. RELOADING...");
        window.location.reload();
    } else {
        PlatformBridge.haptic.notification('error');
        alert("INVALID DATA STRUCTURE");
    }
  };

  const nodeInsights = useMemo(() => {
      if (telemetry.length < 3) return [];
      const nodeData: Record<string, TelemetryEvent[]> = {};
      telemetry.forEach(e => {
          if (!nodeData[e.nodeId]) nodeData[e.nodeId] = [];
          nodeData[e.nodeId].push(e);
      });

      const insights: NodeInsight[] = Object.entries(nodeData).map(([id, events]) => {
          const avgLat = events.reduce((a, b) => a + b.latency, 0) / events.length;
          const conflictCount = events.filter(e => e.sensation !== 's0' && e.sensation !== 's2').length;
          const conflictRate = conflictCount / events.length;
          const friction = avgLat / 2000;
          let reliability = 1.0;
          let rec = "";

          if (friction > SYSTEM_METADATA.LEARNING_CONFIG.FRICTION_THRESHOLD) { reliability -= 0.2; rec = "High Latency: Check translation clarity."; }
          if (conflictRate > SYSTEM_METADATA.LEARNING_CONFIG.CONFLICT_THRESHOLD) { reliability -= 0.3; rec = (rec ? rec + " " : "") + "Somatic Dissonance: Likely semantic noise."; }

          return { nodeId: id, avgLatency: avgLat, frictionIndex: friction, somaticConflictRate: conflictRate, reliability, recommendation: rec };
      });

      return insights.sort((a, b) => a.reliability - b.reliability);
  }, [telemetry]);

  const abPerformance = useMemo(() => {
      const stats: Record<string, { total: number, accurate: number }> = { "CORE_WEIGHTS_V2": { total: 0, accurate: 0 } };
      feedback.forEach(f => {
          stats["CORE_WEIGHTS_V2"].total++;
          if (f.isAccurate) stats["CORE_WEIGHTS_V2"].accurate++;
      });
      return stats;
  }, [feedback]);

  const integrityAudit = useMemo(() => {
      const issues: string[] = [];
      const usedBeliefs = new Set<string>();
      Object.values(MODULE_REGISTRY).forEach(domain => {
          Object.values(domain).forEach(scene => { scene.choices.forEach(choice => usedBeliefs.add(choice.beliefKey)); });
      });
      const orphaned = ALL_BELIEFS.filter(b => !usedBeliefs.has(b));
      orphaned.forEach(b => issues.push(`[ORPHAN] BeliefKey ${b.toUpperCase()} not found in Scenes`));
      return { status: (issues.length > 0 ? 'WARNING' : 'OK') as 'OK' | 'WARNING' | 'ERROR', issues };
  }, []);

  const handleCopyBundle = () => {
    const bundle = {
        meta: SYSTEM_METADATA,
        timestamp: new Date().toISOString(),
        kernelState: result?.state,
        history,
        telemetry: telemetry.slice(0, 100),
        feedback: feedback.slice(0, 50),
        integrity: integrityAudit.status
    };
    navigator.clipboard.writeText(JSON.stringify(bundle, null, 2));
    PlatformBridge.haptic.notification('success');
    alert("OVERSIGHT BUNDLE COPIED.");
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] text-emerald-400 font-mono p-4 space-y-6 overflow-hidden select-none">
      <header className="flex justify-between items-center border-b border-emerald-900/30 pb-4 shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black border border-emerald-500/20 animate-pulse">G</div>
            <div>
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-500">SLC_ADMIN_v{SYSTEM_METADATA.VERSION}</h2>
                <span className="text-[7px] opacity-40 uppercase">{SYSTEM_METADATA.CODENAME}</span>
            </div>
        </div>
        <button onClick={onExit} className="bg-red-900/20 px-4 py-2 rounded border border-red-900/50 text-red-500 text-[10px] uppercase font-black tracking-widest">TERMINATE</button>
      </header>

      <nav className="flex gap-1 shrink-0 p-1 bg-slate-900/50 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
        {(['kernel', 'learning', 'integrity', 'health', 'logs', 'recovery'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 rounded-lg text-[8px] font-black uppercase whitespace-nowrap transition-all ${activeTab === tab ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'opacity-40 text-slate-400'}`}>
                {tab}
            </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
        {activeTab === 'kernel' && (
            <div className="space-y-6 animate-in">
                <section className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 border-b border-white/5 pb-2 italic">Active Kernel Status</h3>
                    <div className="grid grid-cols-2 gap-y-4">
                        <div><span className="text-[7px] text-slate-500 block uppercase">Version</span><span className="text-xs">{SYSTEM_METADATA.VERSION}</span></div>
                        <div><span className="text-[7px] text-slate-500 block uppercase">Uptime</span><span className="text-xs font-bold text-emerald-400">{uptime}</span></div>
                        <div><span className="text-[7px] text-slate-500 block uppercase">Last Updated</span><span className="text-xs">{SYSTEM_METADATA.LAST_UPDATED}</span></div>
                        <div><span className="text-[7px] text-slate-500 block uppercase">Diagnostic Stack</span><span className="text-xs">{history.length} nodes</span></div>
                    </div>
                </section>
                
                <section className="bg-indigo-950/20 p-5 rounded-2xl border border-indigo-500/20 space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">A/B Experiments</h3>
                    {Object.entries(SYSTEM_METADATA.EXPERIMENTS).map(([id, config]) => (
                        <div key={id} className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-indigo-300">{id}</span>
                                <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-2 rounded uppercase font-bold">LIVE</span>
                            </div>
                            <p className="text-[9px] text-slate-500 italic">{config.description}</p>
                            <div className="flex justify-between items-end pt-1">
                                <div>
                                    <span className="text-[7px] text-slate-600 block uppercase">Validation Accuracy</span>
                                    <span className="text-xs font-bold text-emerald-400">{((abPerformance[id]?.accurate / abPerformance[id]?.total || 0) * 100).toFixed(1)}%</span>
                                </div>
                                <span className="text-[9px] text-slate-600 font-mono">{abPerformance[id]?.total} samples</span>
                            </div>
                        </div>
                    ))}
                </section>
                
                <div className="grid grid-cols-2 gap-4 pb-6">
                    <button onClick={onUnlockAll} className="bg-indigo-600/20 p-5 rounded-2xl border border-indigo-600/30 text-center space-y-2 hover:bg-indigo-600/40">
                        <div className="text-xl">🔓</div>
                        <span className="block text-[8px] font-black text-indigo-400 uppercase tracking-widest">Bypass Onboarding</span>
                    </button>
                    <button onClick={onToggleGlitch} className={`${glitchEnabled ? 'bg-amber-600/40 border-amber-500/50' : 'bg-slate-800/40 border-white/10'} p-5 rounded-2xl border text-center space-y-2`}>
                        <div className="text-xl">{glitchEnabled ? '⚠️' : '🛡️'}</div>
                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Chaos: {glitchEnabled ? 'ON' : 'OFF'}</span>
                    </button>
                    <button onClick={() => onSetView('system_integrity')} className="col-span-2 bg-emerald-600/10 p-5 rounded-2xl border border-emerald-500/20 text-center space-y-2 hover:bg-emerald-600/20 flex flex-col items-center">
                        <div className="text-xl">📡</div>
                        <span className="block text-[8px] font-black text-emerald-400 uppercase tracking-widest">Deep Kernel Integrity</span>
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'learning' && (
            <div className="space-y-4 animate-in">
                <div className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border-b border-emerald-500/20 pb-2">Clinical Accuracy Stream</h3>
                    <div className="max-h-40 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                        {feedback.length === 0 ? <p className="text-[10px] text-slate-600 italic">No feedback entries.</p> : feedback.map((f, i) => (
                            <div key={i} className="flex justify-between items-center p-2 bg-black/20 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{f.isAccurate ? '✅' : '❌'}</span>
                                    <span className="text-[9px] text-slate-400 font-mono">#{f.scanId.substring(0,6)}</span>
                                </div>
                                <span className="text-[8px] text-slate-600 font-mono">{new Date(f.timestamp).toLocaleTimeString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-500 border-b border-amber-500/20 pb-2">Node Friction Insights</h3>
                    <div className="space-y-3">
                        {nodeInsights.map((insight) => (
                            <div key={insight.nodeId} className="p-3 bg-black/20 rounded-xl border border-white/5 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase">{insight.nodeId}</span>
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black ${insight.reliability > 0.8 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>REL: {(insight.reliability * 100).toFixed(0)}%</span>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <span className="text-[7px] text-slate-500 uppercase block">Friction</span>
                                        <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, insight.frictionIndex * 20)}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[7px] text-slate-500 uppercase block">Conflict</span>
                                        <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full bg-red-500" style={{ width: `${insight.somaticConflictRate * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                                {insight.recommendation && <p className="text-[8px] text-amber-400 italic font-mono">{insight.recommendation}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'integrity' && <div className="space-y-4 animate-in"><AuditCard title="Belief Reachability" status={integrityAudit.status} details={integrityAudit.issues} errorCount={integrityAudit.issues.length} /></div>}

        {activeTab === 'health' && (
            <div className="space-y-6 animate-in">
                <div className="grid grid-cols-1 gap-4">
                    {['registry', 'telemetry', 'feedback', 'engine'].map((key) => (
                        <div key={key} className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-white/5">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">{key}</span>
                                <p className="text-[8px] text-slate-500 italic">Diagnostic subsystem active</p>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-emerald-400">OPERATIONAL</div>
                                <span className="text-[7px] opacity-40 uppercase font-mono">STATUS_OK</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'logs' && (
            <div className="bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden flex-1 flex flex-col min-h-[300px]">
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar" ref={logScrollRef}>
                    {logs.map((log, i) => (
                        <div key={i} className="text-[9px] font-mono border-l-2 border-white/10 pl-3 py-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className={`font-black ${log.level === 'ERROR' ? 'text-red-500' : log.level === 'WARN' ? 'text-amber-500' : 'text-indigo-400'}`}>[{log.level}] {log.action}</span>
                                <span className="text-slate-600 text-[7px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div className="text-slate-500 text-[8px] uppercase">{log.module}</div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'recovery' && (
            <div className="space-y-6 animate-in pb-10">
                <button onClick={handleCopyBundle} className="w-full bg-indigo-900/20 p-8 rounded-2xl border border-indigo-500/30 flex flex-col items-center justify-center gap-3 group">
                    <span className="text-4xl group-hover:scale-110 transition-transform">📦</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Generate Evolution Bundle</span>
                    <span className="text-[7px] text-slate-500 mt-2 italic">Exports telemetry, SLC insights & A/B stats</span>
                </button>
                
                <section className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-[10px] font-black uppercase text-indigo-400 border-b border-indigo-500/20 pb-2 flex items-center gap-2"><span>📥</span> SESSION_STATE_INJECTOR</h3>
                    <textarea 
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[9px] font-mono text-emerald-500 h-24 outline-none focus:border-indigo-500/50"
                        placeholder="Paste JSON state string here..."
                        value={importData}
                        onChange={e => setImportData(e.target.value)}
                    />
                    <button onClick={handleImport} className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase shadow-lg shadow-indigo-900/40">INJECT_STATE</button>
                    <p className="text-[8px] text-slate-500 italic text-center leading-tight">CAUTION: This bypasses normal session logic. Use only for clinical recovery.</p>
                </section>

                <div className="bg-red-950/10 p-5 rounded-2xl border border-red-900/30 text-center space-y-3">
                    <h3 className="text-[10px] font-black uppercase text-red-500">System Wipe</h3>
                    <button onClick={() => confirm("FACTORY RESET?") && StorageService.clear()} className="w-full py-3 bg-red-600/20 text-red-500 rounded-xl text-[9px] font-black uppercase border border-red-600/30">Factory_Reset_Kernel</button>
                </div>
            </div>
        )}
      </div>

      <footer className="shrink-0 bg-slate-900/80 rounded-2xl p-4 border border-emerald-900/20 flex justify-between items-center shadow-inner">
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">SLC_DAEMON_ACTIVE</span>
        </div>
        <span className="text-[9px] font-black text-emerald-900 uppercase italic">Clinical Bridge Oversight</span>
      </footer>
    </div>
  );
});
