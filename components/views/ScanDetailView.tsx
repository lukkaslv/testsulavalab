
import { useState, useEffect, memo, useMemo } from 'react';
import { AnalysisResult, Translations, DomainType, ForecastMetrics } from '../../types';
import { SupervisorService } from '../../services/supervisorService';
import { PlatformBridge } from '../../utils/helpers';
import { RadarChart } from '../RadarChart';
import { HorizonScanner } from '../HorizonScanner';
import { ForensicTimeline } from '../ForensicTimeline';
import { ResonanceLattice } from '../ResonanceLattice';
import { FractureMap } from '../FractureMap';
import { LatticeEngine } from '../../services/latticeEngine';
import { calculateForecast } from '../../services/psychologyService';

interface ScanDetailViewProps {
  scan: AnalysisResult;
  t: Translations;
  onBack: () => void;
}

export const ScanDetailView = memo<ScanDetailViewProps>(({ scan, t, onBack }) => {
    const [activeTab, setActiveTab] = useState<'blueprint' | 'lattice' | 'forensic' | 'simulator' | 'dossier'>('blueprint');
    const [isLoading, setIsLoading] = useState(false);
    const [supervisionData, setSupervisionData] = useState<any>(null);

    // Simulation State
    const [simF, setSimF] = useState(scan.state.foundation);
    const [simA, setSimA] = useState(scan.state.agency);
    const [simR, setSimR] = useState(scan.state.resource);
    const [simE, setSimE] = useState(scan.state.entropy);

    const simulatedScan = useMemo(() => ({
        ...scan,
        state: { foundation: simF, agency: simA, resource: simR, entropy: simE },
        domainProfile: { ...scan.domainProfile, foundation: simF, agency: simA, money: simR }
    }), [scan, simF, simA, simR, simE]);

    const lattice = useMemo(() => LatticeEngine.calculate(simulatedScan), [simulatedScan]);
    const simForecast = useMemo(() => calculateForecast(simF, simA, simR, simE), [simF, simA, simR, simE]);

    useEffect(() => {
        if (activeTab === 'dossier' && !supervisionData) {
            setIsLoading(true);
            SupervisorService.generateClinicalSupervision(scan, t).then(data => {
                setSupervisionData(data);
                setIsLoading(false);
            });
        }
    }, [activeTab]);

    const handleResetSim = () => {
        setSimF(scan.state.foundation);
        setSimA(scan.state.agency);
        setSimR(scan.state.resource);
        setSimE(scan.state.entropy);
        PlatformBridge.haptic.impact('medium');
    };

    const tabs = {
        blueprint: 'СЛЕПОК',
        lattice: 'РЕШЕТКА',
        forensic: 'ФОРЕНЗИКА',
        simulator: 'СИМУЛЯТОР',
        dossier: 'ДОСЬЕ'
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white p-4 space-y-4 animate-in font-mono pb-24 overflow-y-auto no-scrollbar">
            <header className="flex justify-between items-center border-b border-indigo-900/30 pb-4">
                <div className="flex flex-col">
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-indigo-400">ЛОГ СЕССИИ</h2>
                    <span className="text-[8px] text-slate-500">ID: {scan.shareCode.substring(0, 12)}</span>
                </div>
                <button onClick={onBack} className="px-4 py-2 bg-slate-900 rounded-xl text-[10px] font-black uppercase border border-slate-800">← {t.global.back}</button>
            </header>

            <nav className="flex gap-1 bg-slate-900/50 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar shrink-0">
                {(['blueprint', 'lattice', 'forensic', 'simulator', 'dossier'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[75px] py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>
                        {tabs[tab]}
                    </button>
                ))}
            </nav>

            <div className="flex-1">
                {activeTab === 'blueprint' && (
                    <div className="space-y-6 animate-in">
                        <div className="bg-[#020617] border border-indigo-900/30 p-6 rounded-[3rem] shadow-2xl">
                             <RadarChart points={scan.graphPoints || []} t={t} onLabelClick={() => {}} />
                        </div>
                        <div className="p-6 rounded-[2rem] bg-slate-900/50 border border-white/5">
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase mb-2">{t.archetypes[scan.archetypeKey]?.title}</h4>
                            <p className="text-[11px] text-slate-300 italic leading-relaxed">{t.archetypes[scan.archetypeKey]?.desc}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'lattice' && (
                    <div className="space-y-6 animate-in">
                        <ResonanceLattice lattice={lattice} pulse={scan.sessionPulse} t={t} className="h-80" />
                        <div className="p-6 bg-indigo-950/20 border border-indigo-500/20 rounded-[2rem] space-y-2 text-center">
                            <span className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">Системная Когерентность: {lattice.coherence}%</span>
                        </div>
                    </div>
                )}

                {activeTab === 'forensic' && (
                    <div className="space-y-6 animate-in">
                        <FractureMap fractures={scan.fractures} t={t} />
                        <ForensicTimeline result={scan} t={t} className="mt-8 opacity-60" />
                    </div>
                )}

                {activeTab === 'simulator' && (
                    <div className="space-y-6 animate-in">
                        <div className="p-6 bg-slate-900 rounded-[2.5rem] border border-indigo-500/20 space-y-6">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">ПЕСОЧНИЦА ИНТЕРВЕНЦИЙ</h4>
                                <button onClick={handleResetSim} className="text-[8px] bg-slate-800 px-2 py-1 rounded border border-white/5 uppercase">Сброс</button>
                            </div>
                            
                            <div className="space-y-4">
                                {[
                                    { label: 'Фундамент', val: simF, set: setSimF, color: 'bg-emerald-500' },
                                    { label: 'Воля', val: simA, set: setSimA, color: 'bg-indigo-500' },
                                    { label: 'Ресурс', val: simR, set: setSimR, color: 'bg-amber-500' },
                                    { label: 'Энтропия', val: simE, set: setSimE, color: 'bg-red-500' }
                                ].map(s => (
                                    <div key={s.label} className="space-y-1">
                                        <div className="flex justify-between text-[8px] font-black uppercase text-slate-500">
                                            <span>{s.label}</span>
                                            <span className="text-white">{s.val}%</span>
                                        </div>
                                        <input 
                                            type="range" min="5" max="95" value={s.val} 
                                            onChange={e => s.set(parseInt(e.target.value))}
                                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none accent-indigo-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <HorizonScanner forecast={scan.forecast!} simulatedForecast={simForecast} t={t} className="scale-95 origin-top" />
                    </div>
                )}

                {activeTab === 'dossier' && (
                    <div className="animate-in">
                        {isLoading ? <div className="p-20 text-center animate-pulse text-[10px]">ДЕШИФРОВКА...</div> : (
                            <div className="bg-black/60 p-6 rounded-[2rem] border border-emerald-500/20 text-[10px] leading-relaxed whitespace-pre-wrap font-mono">{supervisionData?.report}</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
});
