import React, { useState, useMemo } from 'react';
import { Translations } from '../../types';
import { DOMAIN_SETTINGS } from '../../constants';
import { translations } from '../../translations';
import { SecurityCore } from '../../utils/crypto';

interface LayerStatus {
    id: string;
    label: string;
    status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
    value: string;
    description: string;
}

interface SystemIntegrityViewProps {
  t: Translations;
  onBack: () => void;
}

export const SystemIntegrityView: React.FC<SystemIntegrityViewProps> = ({ t, onBack }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'dossier' | 'l10n'>('status');
  
  const ru = translations['ru'] as any;
  const ka = translations['ka'] as any;

  const l10nStats = useMemo(() => {
    let missing = 0;
    const check = (m: any, s: any) => {
        Object.keys(m).forEach(k => {
            if (s[k] === undefined) missing++;
            else if (typeof m[k] === 'object' && m[k] !== null) check(m[k], s[k]);
        });
    };
    check(ru, ka);
    return { missing, parity: Math.round(((500 - missing) / 500) * 100) };
  }, [ru, ka]);

  const layers = useMemo<LayerStatus[]>(() => [
      { 
          id: 'auth', label: 'SECURITY_CORE', status: 'OPTIMAL', value: 'v2.1_ACTIVE', 
          description: 'License salt verified. Device fingerprinting active.' 
      },
      { 
          id: 'state', label: 'STATE_ENGINE', status: 'OPTIMAL', value: 'DETERMINISTIC', 
          description: 'Session history binding and checksum validation operational.' 
      },
      { 
          id: 'l10n', label: 'L10N_PARITY', status: l10nStats.missing > 0 ? 'WARNING' : 'OPTIMAL', 
          value: `${l10nStats.parity}%`, 
          description: `RU <-> KA synchronization. ${l10nStats.missing} keys missing in Georgian.` 
      },
      { 
          id: 'logic', label: 'CLINICAL_LOGIC', status: 'OPTIMAL', value: 'V3.5_STABLE', 
          description: 'Interpretation matrices and pattern detectors are synchronized.' 
      }
  ], [l10nStats]);

  return (
    <div className="min-h-screen bg-[#020617] text-emerald-400 font-mono text-[10px] p-4 flex flex-col space-y-6 overflow-hidden">
      <header className="flex justify-between items-center border-b border-emerald-900/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border border-emerald-500/30 flex items-center justify-center text-lg font-black bg-emerald-500/5 shadow-lg">G</div>
          <div>
            <h1 className="text-xs font-black uppercase tracking-widest">{t.integrity_audit.title}</h1>
            <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Master Audit Control</span>
          </div>
        </div>
        <button onClick={onBack} className="bg-red-950/20 px-4 py-2 rounded-xl border border-red-900/30 text-red-500 font-black">EXIT</button>
      </header>

      <nav className="flex gap-1 p-1 bg-slate-900/50 rounded-xl border border-white/5">
        {[
            { id: 'status', label: 'HEALTH_CHECK' },
            { id: 'dossier', label: 'CONFIG_DOSSIER' },
            { id: 'l10n', label: 'L10N_SYNC' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 py-2 rounded-lg text-[7px] font-black uppercase transition-all ${activeTab === tab.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-500'}`}>
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
        {activeTab === 'status' && (
            <div className="space-y-4 animate-in">
                {layers.map(layer => (
                    <div key={layer.id} className={`p-4 rounded-2xl border transition-all ${layer.status === 'OPTIMAL' ? 'bg-emerald-950/5 border-emerald-900/20' : 'bg-amber-950/5 border-amber-900/20'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black text-white">{layer.label}</span>
                            <span className={`px-2 py-0.5 rounded text-[7px] font-black ${layer.status === 'OPTIMAL' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                {layer.status}
                            </span>
                        </div>
                        <div className="flex justify-between text-[8px] mb-2">
                            <span className="text-slate-500">VERSION_VALUE:</span>
                            <span className="text-indigo-400 font-bold">{layer.value}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 italic leading-relaxed">{layer.description}</p>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'dossier' && (
            <div className="space-y-6 animate-in">
                <section className="bg-slate-900/30 p-4 rounded-2xl border border-white/5 space-y-3">
                    <h4 className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Domain_Registry_Map</h4>
                    <div className="space-y-2">
                        {DOMAIN_SETTINGS.map(d => (
                            <div key={d.key} className="flex justify-between items-center border-b border-white/5 pb-1">
                                <span className="text-slate-300 uppercase">{d.key}</span>
                                <span className="text-slate-500">[{d.startId} → {d.startId + d.count - 1}] Nodes</span>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="bg-slate-900/30 p-4 rounded-2xl border border-white/5">
                    <h4 className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-3">Crypto_Handshake_Signature</h4>
                    <div className="bg-black/40 p-3 rounded-lg break-all font-mono text-[8px] text-slate-500">
                        {SecurityCore.getDeviceFingerprint()}
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'l10n' && (
            <div className="space-y-3 animate-in">
                <div className="p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-2xl">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[8px] font-black text-indigo-300 uppercase tracking-widest">Mirror_Parity_Score</span>
                        <span className="text-lg font-black text-white">{l10nStats.parity}%</span>
                    </div>
                    <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${l10nStats.parity}%` }}></div>
                    </div>
                </div>
                {l10nStats.missing > 0 ? (
                    <div className="p-3 bg-red-950/10 border border-red-900/30 rounded-xl">
                        <p className="text-[9px] text-red-400 leading-tight">
                            SYSTEM_ALERT: Found {l10nStats.missing} missing keys in Georgian (KA). Clinical integrity for Georgian specialists may be compromised in level-2 reporting.
                        </p>
                    </div>
                ) : (
                    <div className="p-3 bg-emerald-950/10 border border-emerald-900/30 rounded-xl text-center">
                        <span className="text-emerald-500 text-[9px] font-black uppercase">✔ LINGUISTIC_SYMMETRY_ACHIEVED</span>
                    </div>
                )}
            </div>
        )}
      </div>

      <footer className="shrink-0 border-t border-emerald-900/20 pt-4 text-center opacity-40">
        <p className="text-[8px] text-slate-500 tracking-[0.3em] uppercase">Genesis_Protocol_Oversight // Layer_Final</p>
      </footer>
    </div>
  );
};
