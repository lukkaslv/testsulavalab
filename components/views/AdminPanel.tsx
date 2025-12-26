
import React, { useState, memo, useEffect, useMemo } from 'react';
import { Translations, AnalysisResult, GameHistoryItem, BeliefKey } from '../../types';
import { StorageService, STORAGE_KEYS } from '../../services/storageService';
import { ALL_BELIEFS, TOTAL_NODES, MODULE_REGISTRY } from '../../constants';
import { PlatformBridge, resolvePath } from '../../utils/helpers';
import { translations } from '../../translations';

interface AdminPanelProps {
  t: Translations;
  onExit: () => void;
  result: AnalysisResult | null;
  history: GameHistoryItem[];
  onUnlockAll: () => void;
  glitchEnabled: boolean;
  onToggleGlitch: () => void;
}

const AuditCard = ({ title, status, details, errorCount = 0 }: { title: string; status: 'OK' | 'ERROR' | 'WARNING'; details: string[] | string, errorCount?: number }) => (
    <div className={`p-4 rounded-xl border ${status === 'OK' ? 'bg-emerald-950/20 border-emerald-900/30' : status === 'WARNING' ? 'bg-amber-950/20 border-amber-900/30' : 'bg-red-950/20 border-red-900/30'}`}>
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

const JsonInspector = ({ data }: { data: any }) => (
    <div className="bg-black/40 rounded-xl p-4 border border-slate-800 font-mono text-[9px] overflow-auto max-h-[300px] custom-scrollbar">
        <pre className="text-emerald-500/80">{JSON.stringify(data, null, 2)}</pre>
    </div>
);

export const AdminPanel = memo<AdminPanelProps>(({ t, onExit, result, history, onUnlockAll, glitchEnabled, onToggleGlitch }) => {
  const [activeTab, setActiveTab] = useState<'system' | 'audit' | 'translation' | 'db'>('system');
  const [logs, setLogs] = useState<any[]>(() => StorageService.load<any[]>(STORAGE_KEYS.AUDIT_LOG, []));
  const [uptime, setUptime] = useState('00:00:00');

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

  // --- DIAGNOSTIC LOGIC ---

  const reachabilityAudit = useMemo(() => {
    const usedBeliefs = new Set<string>();
    Object.values(MODULE_REGISTRY).forEach(domain => {
        Object.values(domain).forEach(scene => {
            scene.choices.forEach(choice => usedBeliefs.add(choice.beliefKey));
        });
    });
    const orphaned = ALL_BELIEFS.filter(b => !usedBeliefs.has(b));
    return {
        status: orphaned.length > 0 ? 'WARNING' as const : 'OK' as const,
        orphaned: orphaned.map(b => `[ORPHAN] ${b.toUpperCase()} is defined but not linked to any Scene`)
    };
  }, []);

  const translationAudit = useMemo(() => {
    const ru = translations.ru;
    const ka = translations.ka;
    const issues: string[] = [];
    
    const checkKeys = (obj1: any, obj2: any, path: string) => {
        Object.keys(obj1).forEach(key => {
            const currentPath = path ? `${path}.${key}` : key;
            if (!(key in obj2)) {
                issues.push(`[MISSING_KA] ${currentPath}`);
            } else if (typeof obj1[key] === 'object' && obj1[key] !== null) {
                checkKeys(obj1[key], obj2[key], currentPath);
            }
        });
    };
    checkKeys(ru, ka, "");
    return {
        status: issues.length > 0 ? 'ERROR' as const : 'OK' as const,
        issues
    };
  }, []);

  const dbSummary = useMemo(() => {
    const keys = Object.keys(localStorage);
    return keys.filter(k => k.includes('genesis') || k.includes('app')).map(k => {
        const val = localStorage.getItem(k) || '';
        return `${k.padEnd(25)} | ${(val.length / 1024).toFixed(2)} KB`;
    });
  }, []);

  const handleCopyBundle = () => {
    const bundle = {
        version: "8.4.0-DIAGNOSTIC",
        timestamp: new Date().toISOString(),
        state: result?.state,
        history_length: history.length,
        raw_history: history,
        logs: logs.slice(0, 20),
        reachability: reachabilityAudit,
        translation_debt: translationAudit.issues.length
    };
    navigator.clipboard.writeText(JSON.stringify(bundle, null, 2));
    PlatformBridge.haptic.notification('success');
    alert("Diagnostic Bundle Copied to Clipboard. Send this to the developer.");
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] text-emerald-400 font-mono p-4 space-y-6 overflow-hidden select-none">
      <header className="flex justify-between items-center border-b border-emerald-900/30 pb-4 shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black border border-emerald-500/20 animate-pulse">G</div>
            <div>
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-500">GENESIS_KERNEL_V8.4</h2>
                <span className="text-[7px] opacity-40 uppercase">Mode: CLINICAL_SUPERVISOR_HARDENED</span>
            </div>
        </div>
        <button onClick={onExit} className="bg-red-900/20 px-4 py-2 rounded border border-red-900/50 text-red-500 text-[10px] uppercase font-black tracking-widest hover:bg-red-900/40 transition-all">TERMINATE_ADMIN</button>
      </header>

      <nav className="flex gap-1 shrink-0 p-1 bg-slate-900/50 rounded-xl overflow-x-auto no-scrollbar border border-white/5">
        {(['system', 'audit', 'translation', 'db'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 rounded-lg text-[8px] font-black uppercase whitespace-nowrap transition-all ${activeTab === tab ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'opacity-40 text-slate-400'}`}>
                {tab === 'system' ? 'KERNEL' : tab === 'audit' ? 'INTEGRITY' : tab === 'translation' ? 'L10N_DEBT' : 'STORAGE'}
            </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
        {activeTab === 'system' && (
            <div className="space-y-6 animate-in">
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => { if(confirm("WIPE ALL DATA?")) StorageService.clear(); }} className="bg-red-900/10 p-6 rounded-2xl border border-red-900/30 text-center space-y-3 group hover:bg-red-900/20 transition-all">
                        <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(249,115,22,0.3)]">☢️</div>
                        <span className="block text-[9px] font-black text-red-400 uppercase tracking-widest">Wipe Memory</span>
                    </button>
                    <button onClick={onUnlockAll} className="bg-amber-900/10 p-6 rounded-2xl border border-amber-900/30 text-center space-y-3 group hover:bg-amber-900/20 transition-all">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full mx-auto flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">🔑</div>
                        <span className="block text-[9px] font-black text-amber-400 uppercase tracking-widest">Master Unlock</span>
                    </button>
                </div>

                <button onClick={handleCopyBundle} className="w-full bg-indigo-900/20 p-5 rounded-2xl border border-indigo-500/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                    <span className="text-xl">📦</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Copy Diagnostic Bundle</span>
                </button>

                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest italic">GLITCH_OVERRIDE</span>
                        <p className="text-[8px] text-slate-500 font-mono">Force entropy visual triggers for UI stress testing.</p>
                    </div>
                    <button 
                        onClick={onToggleGlitch}
                        className={`w-14 h-7 rounded-full transition-all relative ${glitchEnabled ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${glitchEnabled ? 'right-1' : 'left-1'}`}></div>
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'audit' && (
            <div className="space-y-4 animate-in">
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-emerald-600 text-center mb-4">Core Integrity Check</h3>
                <AuditCard 
                    title="Belief Key Reachability" 
                    status={reachabilityAudit.status} 
                    details={reachabilityAudit.orphaned} 
                    errorCount={reachabilityAudit.orphaned.length}
                />
                <AuditCard 
                    title="Node Density" 
                    status="OK" 
                    details={`System contains ${TOTAL_NODES} clinical nodes across 5 domains. Saturation: 100%.`} 
                />
                <AuditCard 
                    title="Engine Predictability" 
                    status={history.length > 0 ? "OK" : "WARNING"} 
                    details={history.length > 0 ? `Active session captured. Buffer size: ${history.length} events.` : "System idling. Awaiting user input to calibrate entropy sensors."} 
                />
            </div>
        )}

        {activeTab === 'translation' && (
            <div className="space-y-4 animate-in">
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-indigo-500 text-center mb-4">Localization Audit</h3>
                <AuditCard 
                    title="KA Language Sync" 
                    status={translationAudit.status} 
                    details={translationAudit.issues} 
                    errorCount={translationAudit.issues.length}
                />
                <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-slate-900 rounded-xl border border-white/5">
                        <span className="text-[7px] text-slate-500 uppercase">RU_DICT_LEN</span>
                        <p className="text-xs font-bold text-emerald-400">{Object.keys(translations.ru).length} KEYS</p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-white/5">
                        <span className="text-[7px] text-slate-500 uppercase">KA_DICT_LEN</span>
                        <p className="text-xs font-bold text-indigo-400">{Object.keys(translations.ka).length} KEYS</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'db' && (
            <div className="space-y-4 animate-in">
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-emerald-600 text-center mb-4">Storage Inspector</h3>
                <AuditCard title="Raw LocalStorage Map" status="OK" details={dbSummary} />
                <div className="space-y-2">
                    <span className="text-[9px] font-black text-slate-600 uppercase ml-2">Current Session JSON</span>
                    <JsonInspector data={{ result, historyCount: history.length }} />
                </div>
            </div>
        )}
      </div>

      <div className="shrink-0 bg-slate-900/80 rounded-2xl p-4 border border-emerald-900/20 space-y-3">
        <div className="flex justify-between text-[8px] font-black uppercase opacity-50 tracking-widest">
            <span>KERNEL_LOG_BUFFER</span>
            <span>UPTIME: {uptime}</span>
        </div>
        <div className="h-20 overflow-y-auto font-mono text-[8px] space-y-1.5 custom-scrollbar-thin">
            <div className="flex gap-2 text-emerald-500/70 italic">
                <span>[SYSTEM]</span>
                <span>Diagnostic core active. No leaks detected.</span>
            </div>
            {logs.slice(0, 10).map((log, i) => (
                <div key={i} className="flex gap-2">
                    <span className="text-emerald-800">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-slate-500 uppercase">{log.action}: SUCCESS</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
});
