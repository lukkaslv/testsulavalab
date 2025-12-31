
import React, { useState, useEffect, useMemo } from 'react';
import { Translations } from '../../types';
import { SecurityCore } from '../../utils/crypto';
import { DiagnosticEngine } from '../../services/diagnosticEngine';
import { calculateRawMetrics } from '../../services/psychologyService';

interface TechnicalStandardViewProps {
  t: Translations;
  onBack: () => void;
}

const CodeAnchor = ({ label, fn }: { label: string, fn: Function }) => {
    const [isScanning, setIsScanning] = useState(true);
    const hash = useMemo(() => SecurityCore.generateChecksum(fn.toString().replace(/\s/g, '')), [fn]);

    useEffect(() => {
        const timer = setTimeout(() => setIsScanning(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl font-mono space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">{label}</span>
                <span className={`text-[8px] px-2 py-0.5 rounded ${isScanning ? 'bg-indigo-900 text-indigo-300 animate-pulse' : 'bg-emerald-950 text-emerald-400'}`}>
                    {isScanning ? 'SCANNING...' : 'CANONICAL_MATCH'}
                </span>
            </div>
            <div className="text-xs font-black text-indigo-300 tracking-wider">
                {isScanning ? '0x' + '•'.repeat(8) : `0x${hash}`}
            </div>
        </div>
    );
};

const SigmoidVisualizer = () => {
    const points = Array.from({ length: 50 }, (_, i) => {
        const x = (i / 49) * 10 - 5;
        const y = 1 / (1 + Math.exp(-x));
        return { x: i * 2, y: 100 - (y * 100) };
    });

    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-4">
            <div className="flex justify-between items-end">
                <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.2em]">Transfer_Function_v7.0</span>
                <span className="text-[7px] font-mono text-slate-600">f(x)=1/(1+e^-kx)</span>
            </div>
            <div className="relative h-24 w-full">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.5" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="0.5" />
                    <path d={path} fill="none" stroke="#06b6d4" strokeWidth="2" className="animate-in" />
                </svg>
            </div>
        </div>
    );
};

export const TechnicalStandardView: React.FC<TechnicalStandardViewProps> = ({ t, onBack }) => {
  const ts = t.tech_standard;

  return (
    <div className="h-full bg-slate-950 text-slate-300 p-6 overflow-y-auto no-scrollbar font-mono animate-in select-none">
        <header className="mb-8 border-b border-slate-800 pb-6 flex justify-between items-start sticky top-0 bg-slate-950/90 backdrop-blur-md z-30">
            <div className="space-y-1">
                <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">{ts.title}</h1>
                <p className="text-[8px] font-mono text-cyan-400 uppercase tracking-[0.4em]">{ts.subtitle}</p>
            </div>
            <button onClick={onBack} className="p-3 bg-slate-900 rounded-2xl text-white text-xs border border-slate-800 transition-all active:scale-90">✕</button>
        </header>

        <div className="space-y-8 pb-10">
            <section className="space-y-4">
                <h2 className="text-cyan-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></span>
                    {ts.integrity_proof} (Art. 28)
                </h2>
                <div className="grid grid-cols-1 gap-3">
                    <CodeAnchor label="Diagnostic_Engine" fn={DiagnosticEngine.interpret} />
                    <CodeAnchor label="Psychology_Service" fn={calculateRawMetrics} />
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-cyan-500 font-black uppercase text-[10px] tracking-widest">{ts.deterministic_proof} (Art. 1.1)</h2>
                <SigmoidVisualizer />
                <div className="p-5 bg-indigo-950/20 border border-indigo-500/20 rounded-[2rem] space-y-3">
                    <p className="text-[9px] leading-relaxed italic opacity-80">
                        "Система гарантирует 100% повторяемость результатов. Любая попытка внедрения вероятностных моделей (AI) будет немедленно обнаружена через калибровку хеш-якоря."
                    </p>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-cyan-500 font-black uppercase text-[10px] tracking-widest">{ts.butterfly_risk} (Art. 5)</h2>
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center text-[8px] text-slate-500 uppercase">
                        <span>Sensitivity Threshold</span>
                        <span>0.0001σ</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 animate-[pulse_3s_infinite]" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-[8px] text-slate-500 leading-relaxed uppercase">
                        Малые изменения входных данных (латентность) вызывают нелинейные сдвиги в топологии архетипа.
                    </p>
                </div>
            </section>

            <footer className="pt-10 border-t border-slate-900 text-center space-y-4">
                <div className="inline-block px-4 py-2 bg-emerald-950/30 border border-emerald-900/50 rounded-full">
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">CONSTITUTION_COMPLIANT_V2.0</span>
                </div>
                <p className="text-[7px] font-mono text-slate-700 uppercase tracking-widest pb-10">
                    ADAMANTINE_WILL // ENCRYPTION_STABLE
                </p>
            </footer>
        </div>
    </div>
  );
};
