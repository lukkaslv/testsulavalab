import React, { useState, memo, useMemo, useEffect, useRef } from 'react';
import { Translations, GameHistoryItem, LicenseRecord } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { SecurityCore } from '../../utils/crypto';
import { StorageService, STORAGE_KEYS } from '../../services/storageService';

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
  const [activeTab, setActiveTab] = useState<'kernel' | 'registry' | 'telemetry' | 'integrity'>('kernel');
  const [genTier, setGenTier] = useState<string>('CLINICAL');
  const [genDays, setGenDays] = useState<number>(30);
  const [clientName, setClientName] = useState<string>('');
  const [lastGeneratedKey, setLastGeneratedKey] = useState<string>('');
  const [registry, setRegistry] = useState<LicenseRecord[]>([]);
  
  // NEW: Ledger Configuration States
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      setRegistry(StorageService.getLicenseRegistry());
  }, [activeTab]);

  const telemetry = useMemo(() => StorageService.getTelemetry(), []);

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
      setClientName(''); // Clear name but keep settings
      PlatformBridge.haptic.notification('success');
  };

  const handleRevoke = (key: string) => {
      if (window.confirm("Mark this key as revoked? This will update your local registry status.")) {
          StorageService.updateLicenseStatus(key, 'REVOKED');
          setRegistry(prev => prev.map(r => r.key === key ? { ...r, status: 'REVOKED' } : r));
      }
  };

  // Generates the JSON file content to be pushed to GitHub with System Controls
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
      // FULL SYSTEM BACKUP: Includes correct keys for injectState recovery
      const exportData = {
          version: "Genesis_v9.9",
          timestamp: new Date().toISOString(),
          [STORAGE_KEYS.TELEMETRY_DATA]: StorageService.getTelemetry(),
          [STORAGE_KEYS.CLINICAL_FEEDBACK]: StorageService.getFeedback(),
          [STORAGE_KEYS.SCAN_HISTORY]: StorageService.getScanHistory(),
          genesis_license_registry: StorageService.getLicenseRegistry() // Matches string key in StorageService
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
    <div className="flex flex-col h-full bg-[#020617] text-emerald-400 font-mono p-4 space-y-6 overflow-hidden select-none border-4 border-emerald-500/20">
      <header className="flex justify-between items-center shrink-0 border-b border-emerald-900/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-xl animate-pulse">⚡</div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">{t.admin.panel_title}</h2>
            <span className="text-[8px] text-emerald-500/60 font-bold tracking-[0.2em]">{t.admin.oversight_layer}_v9.9</span>
          </div>
        </div>
        <button onClick={onExit} className="bg-red-950/20 text-red-500 border border-red-900/30 px-4 py-2 rounded-xl text-[10px] font-black uppercase">{t.admin.exit}</button>
      </header>

      <nav className="flex gap-1 shrink-0 p-1 bg-slate-900/50 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
        {(['kernel', 'registry', 'telemetry', 'integrity'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 rounded-lg text-[8px] font-black uppercase transition-all ${activeTab === tab ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'opacity-40 text-slate-400'}`}>
                {t.admin[tab]}
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
             </div>

             <button 
                onClick={() => onSetView('compatibility')}
                className="w-full py-4 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 rounded-xl text-[9px] font-black uppercase hover:bg-indigo-600/20 transition-all flex items-center justify-center gap-2"
             >
                <span>📟</span> {t.admin.access_clinical}
             </button>

             <section className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 space-y-4">
                <h4 className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{t.admin.master_overrides}</h4>
                <button onClick={onUnlockAll} className="w-full py-4 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-[9px] font-black uppercase hover:bg-emerald-600/20 transition-all">
                    {t.admin.force_unlock}
                </button>
                <button onClick={onToggleGlitch} className={`w-full py-4 border rounded-xl text-[9px] font-black uppercase transition-all ${glitchEnabled ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-slate-900 border-white/5 text-slate-500'}`}>
                    {t.admin.glitch_sim}: {glitchEnabled ? 'ACTIVE' : 'INACTIVE'}
                </button>
             </section>
          </div>
        )}

        {activeTab === 'registry' && (
            <div className="space-y-6 animate-in">
                {/* GLOBAL CONTROL */}
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
                            <span className="text-[9px] font-bold text-white block">{t.admin.maintenance_mode}</span>
                            <span className="text-[8px] text-slate-500">Block all non-admin access</span>
                        </div>
                    </div>
                </section>

                {/* GENERATOR */}
                <section className="bg-indigo-900/20 p-5 rounded-2xl border border-indigo-500/30 space-y-4">
                    <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{t.admin.issue_license}</h4>
                    <input 
                        type="text" 
                        value={clientName} 
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none placeholder:text-slate-600"
                        placeholder={t.admin.client_name}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <select 
                            value={genTier} 
                            onChange={(e) => setGenTier(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none"
                        >
                            <option value="SOLO">SOLO</option>
                            <option value="CLINICAL">CLINICAL</option>
                            <option value="LAB">LAB</option>
                        </select>
                        <input 
                            type="number" 
                            value={genDays} 
                            onChange={(e) => setGenDays(parseInt(e.target.value))}
                            className="bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none"
                            placeholder="Days"
                        />
                    </div>
                    <button onClick={handleGenerateKey} className="w-full py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-xl active:scale-95 transition-all">
                        {t.admin.generate_btn}
                    </button>
                    {lastGeneratedKey && (
                        <div className="p-4 bg-black/60 border border-emerald-500/30 rounded-xl space-y-2">
                            <span className="text-[7px] text-emerald-500 uppercase block">Ready_for_distribution:</span>
                            <p className="text-[10px] text-white font-mono break-all select-all p-2 bg-white/5 rounded cursor-copy" onClick={() => {
                                navigator.clipboard.writeText(lastGeneratedKey);
                                PlatformBridge.haptic.notification('success');
                            }}>{lastGeneratedKey}</p>
                        </div>
                    )}
                </section>

                {/* LEDGER & EXPORT */}
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

        {activeTab === 'telemetry' && (
            <div className="space-y-4 animate-in">
                <div className="flex justify-between items-center">
                    <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">{t.admin.data_vault}</h4>
                    
                    <div className="flex gap-2">
                        {/* RESTORE BUTTON */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImportData} 
                            className="hidden" 
                            accept=".json"
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-indigo-900/30 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase hover:bg-indigo-800/30 transition-colors"
                        >
                            {t.admin.import_state}
                        </button>

                        <button 
                            onClick={handleExportData}
                            className="bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase hover:bg-emerald-800/30 transition-colors"
                        >
                            {t.admin.export_backup}
                        </button>
                    </div>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {telemetry.length === 0 && <p className="text-[9px] text-slate-700 italic">No telemetry data captured in current buffer.</p>}
                    {telemetry.slice().reverse().map((t, idx) => (
                        <div key={idx} className={`p-3 rounded-lg border text-[9px] flex justify-between items-center group transition-colors ${t.isOutlier ? 'bg-red-950/20 border-red-500/30' : 'bg-slate-900/30 border-white/5'}`}>
                            <div className="space-y-1">
                                <div className="flex gap-2 items-center">
                                    <span className={`font-bold uppercase ${t.isOutlier ? 'text-red-400' : 'text-emerald-500'}`}>{t.nodeId}</span>
                                    <span className="text-slate-600">[{t.domain.toUpperCase()}]</span>
                                    {t.isOutlier && <span className="text-[7px] bg-red-900 text-red-200 px-1 rounded font-bold">OUTLIER</span>}
                                </div>
                                <div className="text-slate-400">Lat: <span className={t.isOutlier ? 'text-red-500 font-bold' : 'text-indigo-400'}>{t.latency}ms</span> | Bel: {t.beliefKey}</div>
                            </div>
                            <span className="text-[8px] text-slate-800 font-mono group-hover:text-slate-600 transition-colors">Var_{t.variantId}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {activeTab === 'integrity' && (
            <div className="space-y-4 animate-in">
                <button onClick={() => onSetView('system_integrity')} className="w-full py-4 bg-indigo-600/10 border border-indigo-500/50 text-indigo-400 rounded-xl text-[9px] font-black uppercase">
                    {t.admin.launch_audit}
                </button>
            </div>
        )}
      </div>

      <footer className="shrink-0 border-t border-white/5 pt-4 text-center">
          <p className="text-[8px] text-slate-700 uppercase tracking-widest italic opacity-50">Authorized Dev Access Only // Genesis Core v9.9</p>
      </footer>
    </div>
  );
});
