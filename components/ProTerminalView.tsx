
import React, { useState, useMemo } from 'react';
import { AnalysisResult, Translations } from '../../types';
import { CompatibilityEngine } from '../../services/compatibilityEngine';
import { ClinicalDecoder } from '../../services/clinicalDecoder';
import { PlatformBridge } from '../../utils/helpers';
import { SupervisorService } from '../../services/supervisorService';
import { AutopoiesisNucleus } from '../AutopoiesisNucleus';

interface ProTerminalViewProps {
  t: Translations;
  onBack: () => void;
}

// --- SUB-COMPONENTS ---

const MonitorCard = ({ label, value, sub, color = "text-white", warning = false }: { label: string, value: string | number, sub: string, color?: string, warning?: boolean }) => (
    <div className={`p-4 rounded-2xl border flex flex-col justify-between h-28 relative overflow-hidden group ${warning ? 'bg-red-950/20 border-red-500/30' : 'bg-slate-900/60 border-white/5'}`}>
        {warning && <div className="absolute top-0 right-0 p-2 text-red-500 opacity-20 text-4xl font-black">!</div>}
        <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.2em] relative z-10">{label}</span>
        <div className="relative z-10">
            <span className={`text-2xl font-black font-mono tracking-tighter ${color}`}>{value}</span>
            <div className={`h-1 w-8 rounded-full mt-2 ${warning ? 'bg-red-500' : 'bg-slate-700'}`}></div>
        </div>
        <p className="text-[8px] text-slate-500 uppercase font-bold tracking-wider relative z-10">{sub}</p>
    </div>
);

const DecryptionCore = ({ onDecrypt, onBack }: { onDecrypt: (code: string) => void, onBack: () => void }) => {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'ANALYZING' | 'INVALID'>('IDLE');

    const handleSubmit = async () => {
        if (!code.trim()) return;
        setStatus('ANALYZING');
        PlatformBridge.haptic.impact('medium');
        
        // Artificial delay for "processing" feel (Art. 4.3 Aesthetics)
        await new Promise(r => setTimeout(r, 800));
        
        const result = CompatibilityEngine.decodeSmartCode(code);
        if (result && result.validity !== 'BREACH') {
            PlatformBridge.haptic.notification('success');
            onDecrypt(code);
        } else {
            PlatformBridge.haptic.notification('error');
            setStatus('INVALID');
            setTimeout(() => setStatus('IDLE'), 1500);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-[#020617] animate-in relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

            <div className="w-full max-w-sm space-y-8 relative z-10">
                <div className="text-center space-y-2">
                    <div className="w-20 h-20 mx-auto bg-slate-900 border border-slate-700 rounded-3xl flex items-center justify-center text-4xl shadow-2xl relative group">
                        <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-3xl animate-pulse"></div>
                        🔑
                    </div>
                    <h2 className="text-lg font-black uppercase text-indigo-400 tracking-[0.3em]">Лаборатория Криминалистики</h2>
                    <p className="text-[9px] text-slate-500 font-mono uppercase">Блок Дешифровки Клинических Данных</p>
                </div>

                <div className="space-y-4">
                    <div className={`relative transition-all duration-300 ${status === 'INVALID' ? 'animate-shake' : ''}`}>
                        <input 
                            type="text" 
                            value={code}
                            onChange={(e) => { setCode(e.target.value); setStatus('IDLE'); }}
                            placeholder="ВСТАВИТЬ ХЕШ СЕССИИ" 
                            className={`w-full bg-slate-950/80 border-2 rounded-2xl p-5 text-center font-mono text-xs uppercase outline-none transition-all placeholder-slate-700
                                ${status === 'INVALID' ? 'border-red-500 text-red-400' : 'border-slate-800 text-indigo-300 focus:border-indigo-500'}`}
                        />
                        {status === 'ANALYZING' && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleSubmit} 
                        disabled={status === 'ANALYZING' || !code}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'INVALID' ? 'ОШИБКА КОНТРОЛЬНОЙ СУММЫ' : 'ЗАПУСК ДЕКОДЕРА'}
                    </button>
                </div>

                <button onClick={onBack} className="w-full text-[9px] font-black uppercase text-slate-600 hover:text-slate-400 transition-colors tracking-widest">
                    [ ОТМЕНА ОПЕРАЦИИ ]
                </button>
            </div>
        </div>
    );
};

export const ProTerminalView: React.FC<ProTerminalViewProps> = ({ t, onBack }) => {
  const [clientResult, setClientResult] = useState<AnalysisResult | null>(null);
  const [dossier, setDossier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'report' | 'stats' | 'neuro' | 'tactics'>('report');

  const interpretation = useMemo(() => clientResult ? ClinicalDecoder.decode(clientResult, t) : null, [clientResult, t]);

  const handleDecrypt = (code: string) => {
    const result = CompatibilityEngine.decodeSmartCode(code);
    if (result) setClientResult(result);
  };

  const copyToClipboard = () => {
      if (dossier) {
          navigator.clipboard.writeText(dossier);
          PlatformBridge.haptic.notification('success');
      }
  };

  if (!clientResult || !interpretation) {
      return <DecryptionCore onDecrypt={handleDecrypt} onBack={onBack} />;
  }

  return (
    <section className="flex flex-col h-full bg-[#020617] text-slate-400 font-mono overflow-hidden select-none">
        
        {/* HEADER: SESSION CONTROL */}
        <header className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl shrink-0 z-20">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">СЕССИЯ АКТИВНА</span>
                    <span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">ID: {clientResult.shareCode.substring(0, 8)}</span>
                </div>
            </div>
            <button 
                onClick={() => { PlatformBridge.haptic.impact('heavy'); setClientResult(null); }} 
                className="px-4 py-2 bg-red-950/20 text-red-500 border border-red-500/20 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-950/40 transition-all active:scale-95"
            >
                ИЗВЛЕЧЬ
            </button>
        </header>

        {/* NAVIGATION DECK */}
        <nav className="p-2 bg-slate-900 shrink-0 overflow-x-auto no-scrollbar border-b border-white/5">
            <div className="flex gap-1 min-w-max">
                {(['report', 'stats', 'neuro', 'tactics'] as const).map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => { setActiveTab(tab); PlatformBridge.haptic.selection(); }} 
                        className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2
                            ${activeTab === tab 
                                ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                                : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <span>{tab === 'report' ? '📂' : tab === 'stats' ? '📊' : tab === 'neuro' ? '🧠' : '⚡'}</span>
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>
        </nav>

        {/* WORKBENCH AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8 pb-32">
            
            {activeTab === 'report' && (
                <div className="space-y-6 animate-in">
                    {/* PRIMARY DIAGNOSIS */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-500/20 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 text-6xl font-black">?</div>
                        <div className="relative z-10 space-y-4">
                            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em]">Конфигурация Ядра</span>
                            <h2 className="text-xl font-black text-white italic uppercase tracking-tight leading-none">
                                {interpretation.systemConfiguration.title}
                            </h2>
                            <div className="h-px bg-indigo-500/20 w-full"></div>
                            <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic">
                                "{interpretation.systemConfiguration.description}"
                            </p>
                            
                            <div className="flex gap-2 pt-2">
                                <span className={`text-[8px] px-2 py-1 rounded font-black uppercase tracking-widest border
                                    ${interpretation.priorityLevel === 'high' ? 'bg-red-950/30 text-red-400 border-red-500/20' : 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20'}`}>
                                    {interpretation.priority}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* VITAL GRID */}
                    <div className="grid grid-cols-2 gap-3">
                        <MonitorCard 
                            label="Энтропийная Нагрузка" 
                            value={`${interpretation.extra.homeostasisCost}%`} 
                            sub="Потеря Энергии" 
                            color="text-amber-400" 
                        />
                        <MonitorCard 
                            label="Сопротивление" 
                            value={`${interpretation.extra.prognosis.allianceRisk}%`} 
                            sub="Риск Альянса" 
                            color={interpretation.extra.prognosis.allianceRisk > 60 ? 'text-red-400' : 'text-emerald-400'} 
                            warning={interpretation.extra.prognosis.allianceRisk > 60}
                        />
                    </div>

                    {/* TRANSFERENCE PREDICTION */}
                    <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-950/10 space-y-2">
                        <span className="text-[7px] font-black text-indigo-300 uppercase tracking-widest">Прогноз Переноса (Art. 27.2)</span>
                        <p className="text-[10px] text-indigo-100 font-bold leading-relaxed border-l-2 border-indigo-500 pl-3">
                            {interpretation.extra.transference}
                        </p>
                    </div>
                </div>
            )}

            {activeTab === 'stats' && (
                <div className="space-y-6 animate-in">
                    <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Скан Когнитивного Трения</span>
                            <span className="text-[10px] font-mono text-slate-400">{interpretation.stats?.standardDeviation}ms σ</span>
                        </div>
                        
                        {/* Z-SCORE HISTOGRAM */}
                        <div className="flex gap-1 h-32 items-end px-2">
                            {interpretation.stats?.zScoreDistribution.map((z: number, i: number) => {
                                const height = Math.min(100, Math.abs(z * 30));
                                const isSpike = z > 1.8;
                                return (
                                    <div key={i} className="flex-1 flex flex-col justify-end group relative">
                                        <div 
                                            className={`w-full rounded-t-sm transition-all duration-500 ${isSpike ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-indigo-500/40'}`} 
                                            style={{ height: `${height}%` }}
                                        ></div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="flex justify-between text-[7px] text-slate-600 font-mono uppercase tracking-widest">
                            <span>НАЧАЛО</span>
                            <span>КОНЕЦ</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-1">
                            <span className="text-[7px] text-slate-500 uppercase">Асимметрия</span>
                            <span className="text-xl font-mono text-white">{interpretation.stats?.skewness}</span>
                        </div>
                        <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-1">
                            <span className="text-[7px] text-slate-500 uppercase">Дисперсия</span>
                            <span className="text-xl font-mono text-white">{interpretation.stats?.variance}</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'neuro' && (
                <div className="space-y-6 animate-in">
                    {/* ALEXITHYMIA GAUGE */}
                    <div className={`p-6 rounded-[2.5rem] border relative overflow-hidden flex items-center gap-6 ${interpretation.neuro?.alexithymiaIndex && interpretation.neuro.alexithymiaIndex > 60 ? 'bg-red-950/20 border-red-500/30' : 'bg-slate-900 border-white/5'}`}>
                        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path 
                                    className={`${interpretation.neuro?.alexithymiaIndex && interpretation.neuro.alexithymiaIndex > 60 ? 'text-red-500' : 'text-emerald-500'}`} 
                                    strokeDasharray={`${interpretation.neuro?.alexithymiaIndex}, 100`} 
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                    fill="none" stroke="currentColor" strokeWidth="3" 
                                />
                            </svg>
                            <span className="absolute text-lg font-black text-white">{interpretation.neuro?.alexithymiaIndex}%</span>
                        </div>
                        <div>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-1">Индекс Алекситимии</span>
                            <h3 className="text-sm font-bold text-slate-200 uppercase leading-tight">
                                {interpretation.neuro?.alexithymiaIndex && interpretation.neuro.alexithymiaIndex > 60 ? 'ВЫСОКАЯ ДИССОЦИАЦИЯ' : 'НОМИНАЛЬНАЯ СВЯЗЬ'}
                            </h3>
                            <p className="text-[8px] text-slate-500 mt-2 leading-relaxed">
                                Процент "Нейтральных" ответов в телесном чек-ине. Высокий уровень блокирует аффект.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Ресурс Самовосстановления</h4>
                        <AutopoiesisNucleus metrics={interpretation.extra.autopoiesis} t={t} className="h-64" />
                    </div>
                </div>
            )}

            {activeTab === 'tactics' && (
                <div className="space-y-8 animate-in">
                    
                    {/* DIRECTIVES LIST */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                            <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Протокол Интервенций</h4>
                        </div>
                        {interpretation.extra.directives.map((d: string, i: number) => (
                            <div key={i} className="bg-slate-900 border-l-2 border-indigo-500 p-4 rounded-r-xl shadow-sm">
                                <p className="text-[10px] text-slate-300 font-bold leading-relaxed">{d}</p>
                            </div>
                        ))}
                    </div>

                    {/* DOSSIER GENERATOR */}
                    {!dossier ? (
                        <button 
                            onClick={async () => {
                                setIsProcessing(true);
                                PlatformBridge.haptic.impact('medium');
                                await new Promise(r => setTimeout(r, 2000)); // Cinematic delay
                                const data = await SupervisorService.generateClinicalSupervision(clientResult, t);
                                setDossier(data.report);
                                setIsProcessing(false);
                                PlatformBridge.haptic.notification('success');
                            }} 
                            disabled={isProcessing}
                            className="w-full py-6 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(16,185,129,0.1)] active:scale-95 transition-all flex flex-col items-center gap-2 hover:bg-emerald-600/20"
                        >
                            {isProcessing ? (
                                <span className="animate-pulse">КОМПИЛЯЦИЯ НЕЙРОСЛЕДА...</span>
                            ) : (
                                <>
                                    <span className="text-xl">🖨️</span>
                                    <span>СГЕНЕРИРОВАТЬ ПРОТОКОЛ (20K)</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="space-y-4 animate-in">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">ОТЧЕТ ГОТОВ</span>
                                <button onClick={copyToClipboard} className="text-[8px] bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                                    КОПИРОВАТЬ
                                </button>
                            </div>
                            <div className="bg-black/80 border border-emerald-500/20 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 text-[80px] pointer-events-none">📝</div>
                                <pre className="whitespace-pre-wrap text-[9px] text-emerald-100/80 leading-relaxed font-mono overflow-x-hidden h-64 overflow-y-auto custom-scrollbar">
                                    {dossier}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    </section>
  );
};
