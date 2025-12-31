
import React, { memo, useMemo, useState, useEffect, useRef } from 'react';
import { Translations, ScanHistory, SubscriptionTier, AnalysisResult } from '../../types';
import { PlatformBridge } from '../../utils/helpers';

interface ProHubViewProps {
  t: Translations;
  onSetView: (view: any) => void;
  onLogout: () => void;
  licenseTier?: SubscriptionTier;
  scanHistory: ScanHistory | null;
  onStartNode: (id: number, domain: any) => void;
  onSelectScan: (scan: AnalysisResult) => void;
  onCompareScans?: (scanA: AnalysisResult, scanB: AnalysisResult) => void;
  usageStats?: { used: number; limit: number; isUnlimited: boolean; canStart: boolean; }; // Added but optional to fix type, unused in component
}

// --- SUB-COMPONENTS ---

const BioLock = ({ onUnlock }: { onUnlock: () => void }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    const handleInput = (digit: string) => {
        PlatformBridge.haptic.impact('light');
        if (pin.length < 4) {
            const newPin = pin + digit;
            setPin(newPin);
            if (newPin.length === 4) {
                if (newPin === '2025') {
                    PlatformBridge.haptic.notification('success');
                    onUnlock();
                } else {
                    PlatformBridge.haptic.notification('error');
                    setError(true);
                    setTimeout(() => {
                        setPin('');
                        setError(false);
                    }, 500);
                }
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#020617] p-8 animate-in select-none">
            <div className="mb-12 relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse-slow"></div>
                <div className="relative w-28 h-28 rounded-[2.5rem] bg-slate-900 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                    {/* Fake Scan Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500/50 shadow-[0_0_20px_#6366f1] animate-scan"></div>
                    <span className="text-5xl grayscale opacity-80">🛡️</span>
                </div>
            </div>
            
            <div className="space-y-4 text-center mb-10">
                <div className="space-y-1">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">ПРОВЕРКА ЛИЧНОСТИ</h2>
                    <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Локальная Биометрия</p>
                </div>
                
                <div className="flex justify-center gap-4 h-4">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 border border-slate-700 ${i < pin.length ? (error ? 'bg-red-500 border-red-500' : 'bg-indigo-500 border-indigo-500 shadow-[0_0_10px_#6366f1]') : 'bg-transparent'}`}></div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                    <button 
                        key={n} 
                        onClick={() => handleInput(n.toString())}
                        className="h-16 rounded-2xl bg-slate-900/30 border border-white/5 text-xl font-bold text-slate-300 active:bg-indigo-600 active:text-white active:border-indigo-400 transition-all active:scale-95 hover:bg-slate-800"
                    >
                        {n}
                    </button>
                ))}
                <div className="col-start-2">
                    <button 
                        onClick={() => handleInput('0')}
                        className="w-full h-16 rounded-2xl bg-slate-900/30 border border-white/5 text-xl font-bold text-slate-300 active:bg-indigo-600 active:text-white active:border-indigo-400 transition-all active:scale-95 hover:bg-slate-800"
                    >
                        0
                    </button>
                </div>
                <div className="col-start-3 flex justify-center items-center">
                    <button onClick={() => setPin(prev => prev.slice(0, -1))} className="w-full h-16 rounded-2xl flex items-center justify-center text-slate-500 active:text-white hover:bg-slate-800 active:scale-95 transition-all">
                        ←
                    </button>
                </div>
            </div>
        </div>
    );
};

const FieldMonitor = memo(({ history, t }: { history: ScanHistory | null, t: Translations }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !history) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, h/2); ctx.lineTo(w, h/2); ctx.stroke();

        // Quadrant Labels
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'right'; ctx.fillText('ВОЛЯ +', w - 10, h/2 - 5);
        ctx.textAlign = 'left'; ctx.fillText('ФУНДАМЕНТ +', w/2 + 5, 10);

        history.scans.forEach(s => {
            const x = (s.state.agency / 100) * w; // X = Agency
            const y = h - (s.state.foundation / 100) * h; // Y = Foundation
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            
            // Color Logic: Red if Critical (Low F or High E), Green if Stable
            const isCritical = s.state.foundation < 35 || s.state.entropy > 75;
            ctx.fillStyle = isCritical ? '#ef4444' : '#10b981';
            ctx.shadowBlur = isCritical ? 5 : 0;
            ctx.shadowColor = '#ef4444';
            ctx.fill();
        });
    }, [history]);

    return (
        <div className="bg-black/40 border border-white/10 rounded-[2rem] p-4 relative overflow-hidden shrink-0">
            <div className="flex justify-between items-center mb-2 px-2">
                <h4 className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em]">{t.pro_hub.cohort_topology}</h4>
                <div className="flex gap-2 text-[7px] font-mono text-slate-500">
                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>СТАБИЛЬНО</span>
                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>РИСК</span>
                </div>
            </div>
            <canvas ref={canvasRef} width={340} height={160} className="w-full h-32 object-contain bg-[#050914] rounded-xl border border-white/5" />
        </div>
    );
});

const SessionCartridge: React.FC<{ scan: AnalysisResult, onClick: () => void }> = ({ scan, onClick }) => {
    // Mini-DNA Bar code
    const metrics = [scan.state.foundation, scan.state.agency, scan.state.resource, scan.state.entropy, scan.neuroSync];
    const isCritical = scan.state.foundation < 35 || scan.state.entropy > 75;
    const isManic = scan.state.agency > 80 && scan.state.foundation < 40;

    return (
        <button 
            onClick={() => { PlatformBridge.haptic.selection(); onClick(); }}
            className={`w-full relative group overflow-hidden p-4 rounded-2xl border transition-all active:scale-[0.98] flex items-center justify-between
                ${isCritical 
                    ? 'bg-red-950/10 border-red-500/30 hover:border-red-500/50' 
                    : isManic 
                        ? 'bg-amber-950/10 border-amber-500/30 hover:border-amber-500/50'
                        : 'bg-slate-900/40 border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/60'
                }`}
        >
            <div className="flex items-center gap-4">
                {/* Status Indicator */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border
                    ${isCritical ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                      isManic ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 
                      'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                    {isCritical ? '!' : isManic ? '⚡' : '✓'}
                </div>

                <div className="text-left space-y-0.5">
                    <span className="text-[10px] font-mono font-bold text-slate-300 block tracking-wider">
                        {scan.shareCode.substring(0, 8)}
                    </span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest block">
                        {new Date(scan.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Mini DNA */}
            <div className="flex items-end gap-0.5 h-6 opacity-60">
                {metrics.map((v, i) => (
                    <div key={i} className={`w-1 rounded-sm ${['bg-emerald-500','bg-indigo-500','bg-amber-500','bg-red-500','bg-sky-400'][i]}`} style={{ height: `${v}%` }}></div>
                ))}
            </div>
        </button>
    );
};

export const ProHubView: React.FC<ProHubViewProps> = memo(({ t, onSetView, onLogout, licenseTier, scanHistory, onSelectScan }) => {
    const ph = t.pro_hub;
    const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem('pro_pin_verified') === 'true');
    const isOathSigned = localStorage.getItem('genesis_oath_signed') === 'true';
    const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'TODAY'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const handleUnlock = () => {
        sessionStorage.setItem('pro_pin_verified', 'true');
        setIsUnlocked(true);
    };

    const recentScans = useMemo(() => {
        let scans = scanHistory?.scans.slice().reverse() || [];
        if (filter === 'CRITICAL') scans = scans.filter(s => s.state.foundation < 35 || s.state.entropy > 75);
        else if (filter === 'TODAY') scans = scans.filter(s => (Date.now() - s.timestamp) < 86400000);
        if (searchQuery.trim().length > 1) {
            const q = searchQuery.toLowerCase();
            scans = scans.filter(s => s.shareCode.toLowerCase().includes(q) || t.archetypes[s.archetypeKey]?.title.toLowerCase().includes(q));
        }
        return scans.slice(0, 50);
    }, [scanHistory, filter, searchQuery, t]);

    // --- GATEKEEPERS ---
    if (!isUnlocked) return <BioLock onUnlock={handleUnlock} />;
    
    if (!isOathSigned) return (
        <div className="flex flex-col items-center justify-center h-full bg-[#020617] p-8 space-y-8 animate-in font-serif text-center">
            <div className="w-20 h-20 bg-amber-900/20 border border-amber-500/30 rounded-full flex items-center justify-center text-4xl animate-pulse-slow">⚖️</div>
            <div className="space-y-4">
                <h2 className="text-lg font-black text-amber-500 uppercase tracking-widest">{ph.ethical_gate_title}</h2>
                <p className="text-xs text-slate-400 leading-relaxed italic max-w-xs mx-auto font-sans">
                    "{ph.ethical_gate_msg}"
                </p>
            </div>
            <button 
                onClick={() => onSetView('specialist_oath')}
                className="w-full max-w-xs py-5 bg-amber-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all font-sans"
            >
                {ph.ethical_gate_btn}
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-[#020617] text-white animate-in select-none overflow-hidden relative">
            
            {/* HEADER: CORTEX COMMAND */}
            <header className="shrink-0 p-5 pt-6 pb-2 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 z-20 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-white italic leading-none">КОРТЕКС</h2>
                    </div>
                    <span className="text-[7px] text-slate-500 font-mono mt-1 block uppercase tracking-widest">
                        Клинический Узел Управления // {licenseTier}
                    </span>
                </div>
                <button onClick={() => { PlatformBridge.haptic.impact('medium'); onLogout(); }} className="text-[8px] font-black uppercase text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    ВЫХОД
                </button>
            </header>

            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar pb-32">
                <div className="p-5 space-y-6">
                    {/* VISUALIZER */}
                    <FieldMonitor history={scanHistory} t={t} />

                    {/* CONTROLS */}
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="ПОИСК..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono text-white outline-none focus:border-indigo-500 transition-all uppercase placeholder-slate-600"
                            />
                            <button 
                                onClick={() => onSetView('pro_terminal')} 
                                className="bg-indigo-600 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg flex items-center justify-center border border-indigo-500"
                            >
                                ТЕРМИНАЛ
                            </button>
                        </div>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {(['ALL', 'CRITICAL', 'TODAY'] as const).map(f => (
                                <button 
                                    key={f} 
                                    onClick={() => { setFilter(f); PlatformBridge.haptic.selection(); }} 
                                    className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all whitespace-nowrap
                                        ${filter === f ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900/30 text-slate-500 border-slate-800'}`}
                                >
                                    {f === 'ALL' ? 'ВСЕ' : f === 'CRITICAL' ? 'КРИТИЧЕСКИЕ' : 'СЕГОДНЯ'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* DATA STREAM */}
                    <div className="space-y-2">
                        {recentScans.length === 0 ? (
                            <div className="py-10 text-center opacity-30 text-[9px] font-black uppercase tracking-widest">СИГНАЛ НЕ ОБНАРУЖЕН</div>
                        ) : (
                            recentScans.map(scan => (
                                <SessionCartridge key={scan.shareCode} scan={scan} onClick={() => onSelectScan(scan)} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* TACTICAL DOCK */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-[#020617]/90 backdrop-blur-2xl border-t border-white/10 z-30">
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { icon: '📜', label: 'КЛЯТВА', view: 'specialist_oath', color: 'text-amber-400' },
                        { icon: '📖', label: 'АТЛАС', view: 'specialist_atlas', color: 'text-indigo-400' },
                        { icon: '🎓', label: 'АКАДЕМИЯ', view: 'academy', color: 'text-slate-300' },
                        { icon: '🔬', label: 'НАУКА', view: 'scientific_foundations', color: 'text-emerald-400' }
                    ].map((btn) => (
                        <button 
                            key={btn.view} 
                            onClick={() => { PlatformBridge.haptic.selection(); onSetView(btn.view); }} 
                            className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-white/5 transition-all group"
                        >
                            <span className="text-xl filter drop-shadow-lg group-active:scale-90 transition-transform">{btn.icon}</span>
                            <span className={`text-[6px] font-black uppercase tracking-widest ${btn.color}`}>{btn.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
});
