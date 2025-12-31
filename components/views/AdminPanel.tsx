
import { useState, memo, useMemo, useEffect } from 'react';
import { Translations, GameHistoryItem, LicenseRecord, IntegrityReport, BeliefKey } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { SecurityCore } from '../../utils/crypto';
import { StorageService } from '../../services/storageService';
import { IntegrityService } from '../../services/integrityService';
import { WEIGHTS, recalibrateWeights } from '../../services/psychologyService';
import { ALL_BELIEFS, SYSTEM_METADATA } from '../../constants';
import { useAppContext } from '../../hooks/useAppContext';

interface AdminPanelProps {
  t: Translations;
  onExit: () => void;
  history: GameHistoryItem[];
  onUnlockAll: () => void;
  glitchEnabled: boolean;
  onToggleGlitch: () => void;
  onSetView: (view: any) => void;
}

// --- SUB-COMPONENTS ---

const StatusBeacon = ({ status, score }: { status: string, score: number }) => {
    const color = status === 'healthy' ? 'bg-emerald-500 shadow-emerald-500/50' 
                : status === 'warning' ? 'bg-amber-500 shadow-amber-500/50' 
                : 'bg-red-500 shadow-red-500/50';
    
    return (
        <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5">
            <div className="relative">
                <div className={`w-2.5 h-2.5 rounded-full ${color} animate-pulse`}></div>
                <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${color} animate-ping opacity-75`}></div>
            </div>
            <div className="flex flex-col">
                <span className="text-[7px] font-black uppercase tracking-widest text-slate-500">INTEGRITY_LEVEL</span>
                <span className="text-[10px] font-mono font-bold text-white">{score}% // {status.toUpperCase()}</span>
            </div>
        </div>
    );
};

const HapticToggle = ({ active, onToggle, label }: { active: boolean, onToggle: () => void, label: string }) => (
    <button 
        onClick={() => { PlatformBridge.haptic.impact('heavy'); onToggle(); }}
        className={`w-full p-4 rounded-2xl border flex justify-between items-center transition-all duration-300 group
            ${active ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-900/40 border-slate-800'}`}
    >
        <div className="text-left">
            <span className={`text-[9px] font-black uppercase tracking-widest block transition-colors ${active ? 'text-emerald-400' : 'text-slate-500'}`}>
                {label}
            </span>
            <span className="text-[7px] opacity-60 uppercase font-mono">{active ? 'ACTIVE' : 'DISABLED'}</span>
        </div>
        
        <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full shadow-md transition-all duration-300 
                ${active ? 'left-7 bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'left-1 bg-slate-600'}`}>
            </div>
        </div>
    </button>
);

const FaderControl = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
    <div className="space-y-1">
        <div className="flex justify-between items-center">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
            <span className={`text-[8px] font-mono font-bold ${value === 0 ? 'text-slate-600' : value > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {value > 0 ? '+' : ''}{value}
            </span>
        </div>
        <input 
            type="range" min="-10" max="10" step="1"
            value={value}
            onChange={(e) => { PlatformBridge.haptic.selection(); onChange(parseInt(e.target.value)); }}
            className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-indigo-500 cursor-pointer hover:bg-slate-700 transition-colors"
        />
    </div>
);

// --- MAIN COMPONENTS ---

const EvolutionarySandbox = ({ t, history }: { t: Translations, history: GameHistoryItem[] }) => {
    const [selectedBelief, setSelectedBelief] = useState<BeliefKey>(ALL_BELIEFS[0]);
    const [localWeights, setLocalWeights] = useState(WEIGHTS[selectedBelief]);
    const [drift, setDrift] = useState<number>(0);

    const handleWeightChange = (metric: 'f'|'a'|'r'|'e', val: number) => {
        setLocalWeights(prev => ({ ...prev, [metric]: val }));
    };

    const runSimulation = () => {
        recalibrateWeights({ [selectedBelief]: localWeights });
        const newDrift = (Math.random() * 4) - 2; // Simulated drift calculation
        setDrift(newDrift);
        PlatformBridge.haptic.notification('success');
    };

    return (
        <div className="bg-slate-900/30 border border-indigo-500/20 p-5 rounded-[2rem] space-y-5 animate-in">
            <header className="flex justify-between items-center">
                <h4 className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em]">WEIGHT_RECALIBRATION</h4>
                <div className="px-2 py-1 bg-indigo-500/10 rounded text-[7px] font-mono text-indigo-300">SANDBOX_MODE</div>
            </header>

            <div className="space-y-4">
                <select 
                    value={selectedBelief}
                    onChange={(e) => {
                        const key = e.target.value as BeliefKey;
                        setSelectedBelief(key);
                        setLocalWeights(WEIGHTS[key]);
                        PlatformBridge.haptic.selection();
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] text-white font-mono outline-none focus:border-indigo-500 uppercase tracking-wide"
                >
                    {ALL_BELIEFS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                    <FaderControl label="FOUNDATION" value={localWeights.f} onChange={v => handleWeightChange('f', v)} />
                    <FaderControl label="AGENCY" value={localWeights.a} onChange={v => handleWeightChange('a', v)} />
                    <FaderControl label="RESOURCE" value={localWeights.r} onChange={v => handleWeightChange('r', v)} />
                    <FaderControl label="ENTROPY" value={localWeights.e} onChange={v => handleWeightChange('e', v)} />
                </div>

                <button 
                    onClick={runSimulation}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-lg active:scale-95 transition-all"
                >
                    APPLY & SIMULATE
                </button>

                {drift !== 0 && (
                    <div className="flex justify-between items-center px-2 pt-2 border-t border-white/5">
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest">SYSTEM_DRIFT</span>
                        <span className={`text-[9px] font-mono font-black ${drift > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {drift > 0 ? '+' : ''}{drift.toFixed(3)}σ
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export const AdminPanel = memo<AdminPanelProps>(({ t, onExit, history, onSetView }) => {
  const { isSafeDevMode, setSafeDevMode } = useAppContext();
  const [activeTab, setActiveTab] = useState<'core' | 'registry' | 'logs' | 'lab'>('core');
  const [integrityReport, setIntegrityReport] = useState<IntegrityReport | null>(null);
  
  // Registry State
  const [clientName, setClientName] = useState('');
  const [genTier] = useState('CLINICAL');
  const [registry, setRegistry] = useState<LicenseRecord[]>([]);
  const [lastKey, setLastKey] = useState('');

  useEffect(() => {
      const beat = () => setIntegrityReport(IntegrityService.runAudit(t));
      beat();
      const interval = setInterval(beat, 5000);
      return () => clearInterval(interval);
  }, [t]);

  useEffect(() => {
      setRegistry(StorageService.getLicenseRegistry());
  }, [activeTab]);

  const telemetry = useMemo(() => StorageService.getTelemetry(), []);

  const handleGenerate = () => {
      if (!clientName.trim()) { PlatformBridge.haptic.notification('error'); return; }
      const key = SecurityCore.generateLicense(genTier, 30);
      const record: LicenseRecord = {
          id: Date.now().toString(36), clientName: clientName.trim(), key, tier: genTier,
          issuedAt: Date.now(), expiresAt: Date.now() + 2592000000, status: 'ACTIVE'
      };
      StorageService.saveLicenseRecord(record);
      setRegistry((prev: LicenseRecord[]) => [record, ...prev]);
      setLastKey(key);
      setClientName('');
      PlatformBridge.haptic.notification('success');
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] text-slate-300 font-mono select-none overflow-hidden">
      
      {/* HEADER: OVERSIGHT */}
      <header className="shrink-0 p-5 pb-2 border-b border-white/5 bg-[#020617]/95 backdrop-blur z-20">
          <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">GENESIS_OVERSIGHT</h2>
                  <p className="text-[7px] font-mono text-slate-600 uppercase tracking-widest">
                      Protocol v{SYSTEM_METADATA.VERSION} // {t.admin.oversight_layer}
                  </p>
              </div>
              <button 
                  onClick={() => { PlatformBridge.haptic.impact('medium'); onExit(); }}
                  className="bg-red-950/20 text-red-500 border border-red-900/30 px-3 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-900/30 transition-all active:scale-95"
              >
                  SECURE_EXIT
              </button>
          </div>
          
          <div className="flex justify-between items-center">
              <StatusBeacon status={integrityReport?.status || 'init'} score={integrityReport?.overallScore || 0} />
              <div className="flex gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/5">
                  {(['core', 'lab', 'registry', 'logs'] as const).map(tab => (
                      <button 
                          key={tab} 
                          onClick={() => { setActiveTab(tab); PlatformBridge.haptic.selection(); }}
                          className={`px-3 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                          {tab}
                      </button>
                  ))}
              </div>
          </div>
      </header>

      {/* CONTENT SCROLL AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
        
        {/* TAB: CORE */}
        {activeTab === 'core' && (
            <div className="space-y-6 animate-in">
                <section className="space-y-3">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest pl-2">System_Directives</span>
                    <HysteresisToggle active={isSafeDevMode} onToggle={() => setSafeDevMode(!isSafeDevMode)} label="SAFETY_SANCTUARY_PROTOCOL" />
                </section>

                <section className="grid grid-cols-2 gap-3">
                    <button onClick={() => onSetView('system_simulation')} className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-indigo-900/20 hover:border-indigo-500/30 transition-all group active:scale-95">
                        <span className="text-2xl group-hover:scale-110 transition-transform">🔮</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-300">ORACLE_SIM</span>
                    </button>
                    <button onClick={() => onSetView('pro_terminal')} className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-emerald-900/20 hover:border-emerald-500/30 transition-all group active:scale-95">
                        <span className="text-2xl group-hover:scale-110 transition-transform">📟</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-300">CLINICAL_TERM</span>
                    </button>
                    <button onClick={() => onSetView('dev_sanctuary')} className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-teal-900/20 hover:border-teal-500/30 transition-all group active:scale-95">
                        <span className="text-2xl group-hover:scale-110 transition-transform">🌊</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-teal-300">DECOMPRESSION</span>
                    </button>
                    <button onClick={() => onSetView('academy')} className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-amber-900/20 hover:border-amber-500/30 transition-all group active:scale-95">
                        <span className="text-2xl group-hover:scale-110 transition-transform">🎓</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-amber-300">KNOWLEDGE_BASE</span>
                    </button>
                </section>

                <div className="p-4 rounded-xl border border-white/5 bg-black/20 flex justify-between items-center">
                    <span className="text-[8px] text-slate-500 uppercase tracking-widest">Active_Nodes_Memory</span>
                    <span className="text-xs font-mono font-black text-white">{history.length}</span>
                </div>
            </div>
        )}

        {/* TAB: LAB (Alpha) */}
        {activeTab === 'lab' && <EvolutionarySandbox t={t} history={history} />}

        {/* TAB: REGISTRY */}
        {activeTab === 'registry' && (
            <div className="space-y-6 animate-in">
                <div className="bg-indigo-950/20 border border-indigo-500/30 p-5 rounded-[2rem] space-y-4 shadow-lg">
                    <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{t.admin.issue_license}</h4>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="CLIENT_ID" 
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white font-mono uppercase focus:border-indigo-500 outline-none"
                        />
                        <button onClick={handleGenerate} className="bg-indigo-600 text-white px-6 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">MINT</button>
                    </div>
                    {lastKey && (
                        <div 
                            onClick={() => navigator.clipboard.writeText(lastKey)}
                            className="bg-black/60 p-3 rounded-xl border border-emerald-500/30 text-[9px] font-mono text-emerald-400 break-all cursor-copy active:opacity-50"
                        >
                            {lastKey}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest pl-2">Local_Ledger</span>
                    {registry.map((rec) => (
                        <div key={rec.id} className="bg-slate-900/40 border border-white/5 p-3 rounded-xl flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-200">{rec.clientName}</span>
                                <span className="text-[7px] font-mono text-slate-500">{new Date(rec.issuedAt).toLocaleDateString()}</span>
                            </div>
                            <span className={`text-[7px] font-black px-2 py-1 rounded ${rec.status === 'ACTIVE' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
                                {rec.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* TAB: LOGS */}
        {activeTab === 'logs' && (
            <div className="space-y-2 animate-in font-mono text-[8px]">
                {telemetry.slice().reverse().map((ev, i) => (
                    <div key={i} className="flex gap-3 p-2 border-b border-white/5 text-slate-400">
                        <span className="text-slate-600">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                        <span className={ev.isOutlier ? 'text-amber-500 font-bold' : 'text-emerald-500'}>
                            {ev.domain.substring(0,3).toUpperCase()}
                        </span>
                        <span className="text-white">NODE_{ev.nodeId}</span>
                        <span className="ml-auto opacity-50">{ev.latency}ms</span>
                    </div>
                ))}
            </div>
        )}

      </div>

      <footer className="shrink-0 p-4 border-t border-white/5 text-center bg-[#020617]">
          <p className="text-[7px] text-slate-700 uppercase tracking-[0.4em]">Restricted Access Area // Art. 26</p>
      </footer>
    </div>
  );
});

// Helper shim for re-used toggle component
const HysteresisToggle = HapticToggle;
