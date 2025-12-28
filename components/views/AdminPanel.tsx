
import React, { useState, memo, useMemo, useEffect, useRef } from 'react';
import { Translations, GameHistoryItem, LicenseRecord, TelemetryEvent, IntegrityReport } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { SecurityCore } from '../../utils/crypto';
import { StorageService, STORAGE_KEYS } from '../../services/storageService';
import { IntegrityService } from '../../services/integrityService';

interface Anomaly {
    type: 'DUPLICATE_NODE' | 'TIME_GAP' | 'STATE_MISMATCH';
    message: string;
    nodeId?: string;
    details?: string;
}

const OrganMiniStatus = ({ report }: { report: IntegrityReport | null }) => {
    if (!report) return <div className="animate-pulse h-10 bg-white/5 rounded-xl"></div>;
    
    return (
        <div className="grid grid-cols-5 gap-1">
            {report.categories.map(cat => (
                <div key={cat.name} className={`h-1.5 rounded-full ${cat.score >= 90 ? 'bg-emerald-500' : cat.score > 70 ? 'bg-amber-500' : 'bg-red-500'}`} title={cat.name}></div>
            ))}
        </div>
    );
};

const SessionAnomalyAnalyzer: React.FC<{ history: GameHistoryItem[], completedNodeIds: number[], telemetry: TelemetryEvent[], t: Translations }> = ({ history, completedNodeIds, telemetry, t }) => {
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const runAnalysis = () => {
        setIsAnalyzing(true);
        setAnomalies([]);
        const foundAnomalies: Anomaly[] = [];

        for (let i = 0; i < history.length - 1; i++) {
            if (history[i].nodeId === history[i+1].nodeId) {
                foundAnomalies.push({
                    type: 'DUPLICATE_NODE',
                    nodeId: history[i].nodeId,
                    message: "Обнаружен дубликат узла в истории.",
                    details: `Узел ${history[i].nodeId} записан дважды подряд. Это признак сбоя при переходе.`
                });
            }
        }

        const uniqueNodesInHistory = new Set(history.map(h => parseInt(h.nodeId, 10))).size;
        if (uniqueNodesInHistory !== completedNodeIds.length) {
            foundAnomalies.push({
                type: 'STATE_MISMATCH',
                message: "Рассинхронизация состояния.",
                details: `Уникальных узлов в истории: ${uniqueNodesInHistory}, в completedNodeIds: ${completedNodeIds.length}.`
            });
        }
        
        const sortedTelemetry = [...telemetry].sort((a, b) => a.timestamp - b.timestamp);
        for (let i = 0; i < sortedTelemetry.length - 1; i++) {
            const gap = sortedTelemetry[i+1].timestamp - sortedTelemetry[i].timestamp;
            if (gap > 15000) { 
                 foundAnomalies.push({
                    type: 'TIME_GAP',
                    nodeId: sortedTelemetry[i].nodeId,
                    message: "Обнаружен аномальный временной разрыв.",
                    details: `Разрыв в ${Math.round(gap/1000)}с после узла ${sortedTelemetry[i].nodeId}. Возможная перезагрузка.`
                });
            }
        }

        setTimeout(() => {
            setAnomalies(foundAnomalies);
            setIsAnalyzing(false);
            PlatformBridge.haptic.notification(foundAnomalies.length > 0 ? 'warning' : 'success');
        }, 1000);
    };

    return (
        <div className="space-y-4">
            <button 
                onClick={runAnalysis} 
                disabled={isAnalyzing}
                className="w-full py-4 bg-amber-600/10 border border-amber-500/30 text-amber-400 rounded-xl text-[9px] font-black uppercase hover:bg-amber-600/20 transition-all disabled:opacity-50"
            >
                {isAnalyzing ? "АНАЛИЗ..." : "ЗАПУСТИТЬ АНАЛИЗАТОР АНОМАЛИЙ"}
            </button>

            {isAnalyzing && (
                 <div className="text-center p-4 text-xs text-slate-500 animate-pulse">Сканирование журнала сессии...</div>
            )}
            
            {!isAnalyzing && anomalies.length > 0 && (
                <div className="space-y-2">
                    {anomalies.map((a, i) => (
                        <div key={i} className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg">
                            <p className="text-[9px] font-bold text-red-400">{a.message} (Узел: {a.nodeId || 'N/A'})</p>
                            <p className="text-[8px] text-slate-400 italic mt-1">{a.details}</p>
                        </div>
                    ))}
                </div>
            )}
            {!isAnalyzing && anomalies.length === 0 && (
                 <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-center">
                    <p className="text-[9px] font-bold text-emerald-400">Аномалий не обнаружено. Система работает штатно.</p>
                 </div>
            )}
        </div>
    );
};


interface AdminPanelProps {
  t: Translations;
  onExit: () => void;
  history: GameHistoryItem[];
  onUnlockAll: () => void;
  glitchEnabled: boolean;
  onToggleGlitch: () => void;
  onSetView: (view: any) => void;
}

export const AdminPanel = memo<AdminPanelProps>(({ t, onExit, history, onUnlockAll, glitchEnabled, onToggleGlitch, onSetView }) => {
  const [activeTab, setActiveTab] = useState<'kernel' | 'registry' | 'telemetry' | 'anomaly' | 'integrity' | 'oracle'>('kernel');
  const [genTier] = useState<string>('CLINICAL'); 
  const [genDays, setGenDays] = useState<number>(30);
  const [clientName, setClientName] = useState<string>('');
  const [lastGeneratedKey, setLastGeneratedKey] = useState<string>('');
  const [registry, setRegistry] = useState<LicenseRecord[]>([]);
  const [integrityReport, setIntegrityReport] = useState<IntegrityReport | null>(null);
  
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live "Heartbeat" of the System
  useEffect(() => {
      const beat = () => {
          const report = IntegrityService.runAudit(t);
          setIntegrityReport(report);
      };
      beat();
      const interval = setInterval(beat, 5000); // Check every 5s
      return () => clearInterval(interval);
  }, [t]);

  useEffect(() => {
      setRegistry(StorageService.getLicenseRegistry());
  }, [activeTab]);

  const telemetry = useMemo(() => StorageService.getTelemetry(), []);
  const completedNodeIds = useMemo(() => {
      const state = StorageService.load<any>(STORAGE_KEYS.SESSION_STATE, { nodes: [] });
      return state.nodes || [];
  }, []);

  const handleGenerateKey = () => {
      if (!clientName.trim()) {
          PlatformBridge.haptic.notification('error');
          return;
      }
      
      const key = SecurityCore.generateLicense(genTier, genDays);
      const now = Date.now();
      const expiresAt = now + (genDays * 24 * 60 * 60 * 1000);
      
      const newRecord: LicenseRecord = {
          id: now.toString(36) + Math.random().toString(36).substr(2, 5),
          clientName: clientName.trim(),
          key: key,
          tier: genTier,
          issuedAt: now,
          expiresAt: expiresAt,
          status: 'ACTIVE'
      };

      StorageService.saveLicenseRecord(newRecord);
      setRegistry(prev => [newRecord, ...prev]);
      
      setLastGeneratedKey(key);
      setClientName(''); 
      PlatformBridge.haptic.notification('success');
  };

  const handleRevoke = (key: string) => {
      if (window.confirm(t.admin.mark_revoked)) {
          StorageService.updateLicenseStatus(key, 'REVOKED');
          setRegistry(prev => prev.map(r => r.key === key ? { ...r, status: 'REVOKED' } : r));
      }
  };

  const handleExportLedger = () => {
      const revokedKeys = registry.filter(r => r.status === 'REVOKED').map(r => r.key);
      const ledgerContent = {
          updatedAt: new Date().toISOString(),
          broadcastMessage: broadcastMessage.trim() || undefined,
          maintenanceMode: maintenanceMode,
          revokedKeys: revokedKeys
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ledgerContent, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `ledger.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      PlatformBridge.haptic.notification('success');
      alert("✅ Ledger Generated.\n\nACTION REQUIRED:\nCommit this 'ledger.json' to your GitHub repository to apply global changes.");
  };

  const handleExportData = () => {
      const exportData = {
          version: "Genesis_v9.9",
          timestamp: new Date().toISOString(),
          [STORAGE_KEYS.TELEMETRY_DATA]: StorageService.getTelemetry(),
          [STORAGE_KEYS.CLINICAL_FEEDBACK]: StorageService.getFeedback(),
          [STORAGE_KEYS.SCAN_HISTORY]: StorageService.getScanHistory(),
          genesis_license_registry: StorageService.getLicenseRegistry()
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `genesis_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      PlatformBridge.haptic.notification('success');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          const content = e.target?.result as string;
          if (content) {
              const success = StorageService.injectState(content);
              if (success) {
                  PlatformBridge.haptic.notification('success');
                  alert("✅ SYSTEM STATE RESTORED.\n\nReloading kernel...");
                  window.location.reload();
              } else {
                  PlatformBridge.haptic.notification('error');
                  alert("❌ CORRUPTED OR INVALID BACKUP FILE.");
              }
          }
      };
      reader.readAsText(file);
  };

  const stats = useMemo(() => {
    const total = history.length;
    const avgLat = history.reduce((acc, h) => acc + h.latency, 0) / Math.max(1, total);
    return { total, avgLat: Math.round(avgLat) };
  }, [history]);

  return (
    <div className={`flex flex-col h-full bg-[#020617] text-emerald-400 font-mono p-4 space-y-6 overflow-hidden select-none border-4 transition-colors ${integrityReport?.status === 'error' ? 'border-red-500/20' : integrityReport?.status === 'warning' ? 'border-amber-500/20' : 'border-emerald-500/20'}`}>
      <header className="flex justify-between items-center shrink-0 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-colors ${integrityReport?.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400 animate-pulse'}`}>⚡</div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">{t.admin.panel_title}</h2>
            <div className="flex items-center gap-2">
                <span className="text-[8px] text-slate-500 font-bold tracking-[0.2em]">{t.admin.oversight_layer}_v9.9</span>
                {integrityReport && <OrganMiniStatus report={integrityReport} />}
            </div>
          </div>
        </div>
        <button onClick={onExit} className="bg-red-950/20 text-red-500 border border-red-900/30 px-4 py-2 rounded-xl text-[10px] font-black uppercase">{t.admin.exit}</button>
      </header>

      <nav className="flex gap-1 shrink-0 p-1 bg-slate-900/50 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
        {(['kernel', 'registry', 'telemetry', 'anomaly', 'integrity', 'oracle'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 rounded-lg text-[8px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'opacity-40 text-slate-400'}`}>
                {t.admin[tab] || tab}
            </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
        
        {activeTab === 'kernel' && (
          <div className="space-y-6 animate-in">
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5">
                    <span className="text-[7px] text-slate-500 uppercase block mb-1">{t.admin.session_nodes}</span>
                    <span className="text-xl font-black text-white">{stats.total}</span>
                </div>
                <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5">
                    <span className="text-[7px] text-slate-500 uppercase block mb-1">{t.admin.avg_latency}</span>
                    <span className="text-xl font-black text-white">{stats.avgLat}ms</span>
                </div>
                {/* COMPLEXITY METRICS LIVE */}
                {integrityReport?.complexity && (
                    <>
                        <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5">
                            <span className="text-[7px] text-purple-400 uppercase block mb-1">{t.integrity_audit.metrics.emergence.toUpperCase()}</span>
                            <span className="text-lg font-black text-white">{integrityReport.complexity.emergenceIndex}%</span>
                        </div>
                        <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5">
                            <span className="text-[7px] text-emerald-400 uppercase block mb-1">{t.integrity_audit.metrics.synergy.toUpperCase()}</span>
                            <span className="text-lg font-black text-white">{integrityReport.complexity.synergyFactor}%</span>
                        </div>
                    </>
                )}
             </div>

             {/* PRO-DIAGNOSTIC BLOCK */}
             <section className="bg-indigo-950/20 p-5 rounded-2xl border border-indigo-500/30 space-y-4">
                <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{t.admin.diagnostic_protocols}</h4>
                <div className="grid grid-cols-1 gap-3">
                    <button 
                        onClick={() => onSetView('system_simulation')}
                        className="w-full py-5 bg-purple-600/10 border-2 border-purple-500/50 text-purple-300 rounded-xl text-[10px] font-black uppercase hover:bg-purple-600/20 transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                    >
                        <span className="text-lg">🔮</span> {t.admin.launch_oracle_protocol}
                    </button>
                    <button 
                        onClick={() => onSetView('system_integrity')}
                        className="w-full py-5 bg-indigo-600/10 border border-indigo-500/50 text-indigo-300 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600/20 transition-all flex items-center justify-center gap-3"
                    >
                        <span className="text-lg">⚡</span> {t.admin.launch_integrity_audit}
                    </button>
                </div>
                <button 
                    onClick={() => onSetView('compatibility')}
                    className="w-full py-3 bg-slate-900 border border-white/10 text-slate-400 rounded-xl text-[8px] font-black uppercase hover:text-white transition-all"
                >
                    {t.admin.access_clinical}
                </button>
             </section>

             <section className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 space-y-4 opacity-60 hover:opacity-100 transition-opacity">
                <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{t.admin.master_overrides}</h4>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={onUnlockAll} className="py-3 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-[8px] font-black uppercase hover:bg-emerald-600/20 transition-all">
                        {t.admin.force_unlock}
                    </button>
                    <button onClick={onToggleGlitch} className={`py-3 border rounded-xl text-[8px] font-black uppercase transition-all ${glitchEnabled ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-slate-900 border-white/5 text-slate-500'}`}>
                        {t.admin.glitch_sim}: {glitchEnabled ? 'ON' : 'OFF'}
                    </button>
                </div>
             </section>
          </div>
        )}
        
        {/* ... Registry Tab (unchanged) ... */}
        {activeTab === 'registry' && (
            <div className="space-y-6 animate-in">
                <section className="bg-slate-900/40 p-5 rounded-2xl border border-purple-500/30 space-y-4">
                    <h4 className="text-[9px] font-black text-purple-400 uppercase tracking-widest">{t.admin.global_control}</h4>
                    
                    <div className="space-y-2">
                        <span className="text-[8px] text-slate-500 uppercase">{t.admin.broadcast_msg}</span>
                        <input 
                            type="text" 
                            value={broadcastMessage}
                            onChange={(e) => setBroadcastMessage(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none placeholder:text-slate-600"
                            placeholder="e.g. 'Server maintenance at 22:00' (Leave empty to clear)"
                        />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl border border-white/5">
                        <button 
                            onClick={() => setMaintenanceMode(!maintenanceMode)}
                            className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${maintenanceMode ? 'bg-red-500' : 'bg-slate-700'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${maintenanceMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </button>
                        <div>
                            <span className="text-[9px] font-bold text-white block">{t.admin.block_all}</span>
                            <span className="text-[8px] text-slate-500">Kill-switch active</span>
                        </div>
                    </div>
                </section>

                <section className="bg-indigo-900/20 p-5 rounded-2xl border border-indigo-500/30 space-y-4">
                    <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{t.admin.issue_license}</h4>
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-3">
                        <span className="text-xl">💎</span>
                        <div>
                            <span className="text-[9px] font-black text-white block uppercase">Genesis Professional</span>
                            <span className="text-[8px] text-indigo-300 uppercase font-bold tracking-widest">30 Sessions // Full Terminal</span>
                        </div>
                    </div>
                    <input 
                        type="text" 
                        value={clientName} 
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none placeholder:text-slate-600"
                        placeholder={t.admin.client_name}
                    />
                    <div className="space-y-1">
                        <span className="text-[8px] text-slate-500 uppercase ml-1">{t.admin.license_duration}</span>
                        <input 
                            type="number" 
                            value={genDays} 
                            onChange={(e) => setGenDays(parseInt(e.target.value))}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none"
                            placeholder={t.admin.days}
                        />
                    </div>
                    <button onClick={handleGenerateKey} className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase shadow-xl active:scale-95 transition-all">
                        {t.admin.generate_btn}
                    </button>
                    {lastGeneratedKey && (
                        <div className="p-4 bg-black/60 border border-emerald-500/30 rounded-xl space-y-2">
                            <span className="text-[7px] text-emerald-500 uppercase block">{t.admin.ready_dist}</span>
                            <p className="text-[10px] text-white font-mono break-all select-all p-2 bg-white/5 rounded cursor-copy" onClick={() => {
                                navigator.clipboard.writeText(lastGeneratedKey);
                                PlatformBridge.haptic.notification('success');
                            }}>{lastGeneratedKey}</p>
                        </div>
                    )}
                </section>

                <section className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">{t.admin.license_ledger} ({registry.length})</h4>
                        <button 
                            onClick={handleExportLedger}
                            className="bg-purple-900/30 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase hover:bg-purple-800/30 transition-colors flex items-center gap-2"
                        >
                            <span>☁️</span> {t.admin.prepare_github}
                        </button>
                    </div>
                    <div className="space-y-2">
                        {registry.map((rec) => {
                            const isExpired = Date.now() > rec.expiresAt;
                            const isRevoked = rec.status === 'REVOKED';
                            return (
                                <div key={rec.id} className={`p-3 rounded-xl border flex flex-col gap-2 ${isRevoked ? 'bg-red-950/10 border-red-900/30 opacity-60' : isExpired ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-900/80 border-emerald-900/30'}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-[10px] font-bold text-white block">{rec.clientName}</span>
                                            <span className="text-[8px] font-mono text-slate-500">{rec.tier} // {new Date(rec.issuedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${isRevoked ? 'bg-red-900 text-red-400' : isExpired ? 'bg-slate-800 text-slate-400' : 'bg-emerald-900 text-emerald-400'}`}>
                                                {isRevoked ? 'REVOKED' : isExpired ? 'EXPIRED' : 'ACTIVE'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-black/30 p-2 rounded text-[8px] font-mono text-slate-400 break-all">
                                        {rec.key}
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-[8px] text-slate-600">Exp: {new Date(rec.expiresAt).toLocaleDateString()}</span>
                                        {!isRevoked && (
                                            <button onClick={() => handleRevoke(rec.key)} className="text-[8px] text-red-500 uppercase hover:text-red-400 font-bold">
                                                [ REVOKE ]
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {registry.length === 0 && <p className="text-[9px] text-slate-700 italic text-center py-4">No active licenses in local registry.</p>}
                    </div>
                </section>
            </div>
        )}

        {/* Oracle Tab */}
        {activeTab === 'oracle' && (
          <div className="space-y-4 animate-in">
              <button onClick={() => onSetView('system_simulation')} className="w-full py-10 bg-purple-600/10 border border-purple-500/50 text-purple-400 rounded-2xl text-[12px] font-black uppercase flex flex-col items-center gap-3">
                  <span className="text-4xl">🔮</span>
                  {t.admin.launch_oracle_protocol}
              </button>
          </div>
        )}

        {/* UPDATED: Integrity Tab with Mini Dashboard */}
        {activeTab === 'integrity' && (
            <div className="space-y-4 animate-in">
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {integrityReport?.categories.map((cat, i) => (
                        <div key={i} className={`p-3 rounded-xl border bg-slate-900/50 flex flex-col gap-1 ${cat.score < 90 ? 'border-amber-500/30' : 'border-white/5'}`}>
                            <span className="text-[7px] font-black uppercase text-slate-500 tracking-widest">{t.integrity_audit.organs[cat.name] || cat.name}</span>
                            <span className={`text-lg font-black ${cat.score >= 95 ? 'text-emerald-400' : cat.score > 75 ? 'text-amber-400' : 'text-red-500'}`}>{cat.score}%</span>
                        </div>
                    ))}
                </div>
                
                <button onClick={() => onSetView('system_integrity')} className="w-full py-6 bg-indigo-600/10 border border-indigo-500/50 text-indigo-400 rounded-2xl text-[12px] font-black uppercase flex items-center justify-center gap-3 hover:bg-indigo-600/20 transition-all">
                    <span className="text-2xl animate-pulse">⚡</span>
                    {t.admin.launch_integrity_audit}
                </button>
                
                {integrityReport?.status !== 'healthy' && (
                    <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-center">
                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">{t.admin.system_unstable}</p>
                        <p className="text-[8px] text-red-300/60">{t.admin.immediate_attention}</p>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'telemetry' && (
            <div className="space-y-4 animate-in">
                <div className="flex justify-between items-center">
                    <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">{t.admin.data_vault}</h4>
                    <div className="flex gap-2">
                        <input type="file" ref={fileInputRef} onChange={handleImportData} className="hidden" accept=".json" />
                        <button onClick={() => fileInputRef.current?.click()} className="bg-indigo-900/30 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase hover:bg-indigo-800/30 transition-colors">{t.admin.import_state}</button>
                        <button onClick={handleExportData} className="bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase hover:bg-emerald-800/30 transition-colors">{t.admin.export_backup}</button>
                    </div>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {telemetry.slice().reverse().map((t, idx) => (
                        <div key={idx} className={`p-3 rounded-lg border text-[9px] flex justify-between items-center group transition-colors ${t.isOutlier ? 'bg-red-950/20 border-red-500/30' : 'bg-slate-900/30 border-white/5'}`}>
                            <div className="space-y-1">
                                <div className="flex gap-2 items-center">
                                    <span className={`font-bold uppercase ${t.isOutlier ? 'text-red-400' : 'text-emerald-500'}`}>{t.nodeId}</span>
                                    <span className="text-slate-600">[{t.domain.toUpperCase()}]</span>
                                </div>
                                <div className="text-slate-400">Lat: <span className={t.isOutlier ? 'text-red-500 font-bold' : 'text-indigo-400'}>{t.latency}ms</span> | Bel: {t.beliefKey}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'anomaly' && (
            <div className="space-y-4 animate-in">
                <h4 className="text-[9px] font-black text-amber-400 uppercase tracking-widest pl-1">Анализатор Аномалий Сессии</h4>
                <SessionAnomalyAnalyzer history={history} completedNodeIds={completedNodeIds} telemetry={telemetry} t={t} />
            </div>
        )}
      </div>

      <footer className="shrink-0 border-t border-white/5 pt-4 text-center">
          <p className="text-[8px] text-slate-700 uppercase tracking-widest italic opacity-50">{t.admin.auth_access}</p>
      </footer>
    </div>
  );
});
