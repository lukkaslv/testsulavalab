
import React, { useState } from 'react';
import { Translations } from '../../types';
import { PlatformBridge } from '../../utils/helpers';

interface ScientificFoundationsViewProps {
  t: Translations;
  onBack: () => void;
}

const FormulaReadout = ({ label, formula }: { label: string, formula: string }) => (
    <div className="bg-black/60 border border-emerald-900/30 p-4 rounded-xl space-y-2 font-mono">
        <span className="text-[7px] text-emerald-600 uppercase tracking-widest">{label}</span>
        <div className="text-[10px] text-emerald-400 break-all leading-relaxed bg-emerald-950/20 p-2 rounded border border-emerald-900/20 italic">
            {formula}
        </div>
    </div>
);

const ScientificSection = ({ title, icon, sections, t }: { title: string, icon: string, sections: any[], t: Translations }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`border rounded-[2rem] transition-all duration-500 overflow-hidden ${isOpen ? 'bg-slate-900 border-emerald-500/30 shadow-2xl' : 'bg-slate-950 border-slate-800'}`}>
            <button onClick={() => { setIsOpen(!isOpen); PlatformBridge.haptic.impact('light'); }} className="w-full p-6 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                    <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{icon}</span>
                    <h3 className="text-sm font-black uppercase text-slate-100 tracking-widest">{title}</h3>
                </div>
                <span className={`text-emerald-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && (
                <div className="px-6 pb-8 space-y-10 animate-in font-serif">
                    {sections.map((s, i) => (
                        <div key={i} className="space-y-4">
                            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest font-mono">/ {s.title}</h4>
                            <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-slate-800 pl-4">
                                {s.content}
                            </p>
                            
                            {s.logic && (
                                <div className="bg-indigo-950/10 border border-indigo-500/20 p-4 rounded-2xl space-y-2">
                                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block">{t.scientific_foundations.clinical_logic_label}</span>
                                    <p className="text-[11px] text-indigo-100/80 leading-relaxed italic">
                                        "{s.logic}"
                                    </p>
                                </div>
                            )}

                            {s.math && <FormulaReadout label="Математическая модель" formula={s.math} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const ScientificFoundationsView: React.FC<ScientificFoundationsViewProps> = ({ t, onBack }) => {
  const sf = t.scientific_foundations;

  return (
    <div className="h-full bg-slate-950 text-slate-300 p-6 overflow-y-auto no-scrollbar font-mono animate-in select-none">
        <header className="mb-10 border-b border-slate-800 pb-6 flex justify-between items-start sticky top-0 bg-slate-950/90 backdrop-blur-md z-30">
            <div className="space-y-1">
                <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">{sf.title}</h1>
                <p className="text-[8px] font-mono text-emerald-400 uppercase tracking-[0.4em]">{sf.subtitle}</p>
            </div>
            <button onClick={onBack} className="p-3 bg-slate-900 rounded-2xl text-white text-xs border border-slate-800 transition-all active:scale-90">✕</button>
        </header>

        <div className="space-y-6 pb-24">
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-8 rounded-[3rem] mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 text-6xl opacity-5 grayscale pointer-events-none">🔬</div>
                <p className="text-xs leading-relaxed text-emerald-200 italic font-serif relative z-10">
                    "Согласно Статье 3 Конституции Genesis OS, система обязана исключать маркетинговые спекуляции. Данный раздел содержит доказательства клинической достоверности алгоритмов."
                </p>
            </div>

            <ScientificSection 
                title="Механика Отклика" 
                icon="⏱️" 
                t={t}
                sections={[
                    { 
                        title: sf.latency.title, 
                        content: sf.latency.desc,
                        logic: sf.latency.logic,
                        math: "ΔLatency = T_baseline + (R_friction * σ_neuro)" 
                    }
                ]}
            />

            <ScientificSection 
                title="Динамика Системы" 
                icon="🧬" 
                t={t}
                sections={[
                    { 
                        title: sf.dynamics.title, 
                        content: sf.dynamics.desc,
                        logic: sf.dynamics.logic,
                        math: "f(x) = 1 / (1 + exp(-k(x-x0)))" 
                    }
                ]}
            />

            <ScientificSection 
                title="Объективность" 
                icon="⚖️" 
                t={t}
                sections={[
                    { 
                        title: sf.determinism.title, 
                        content: sf.determinism.desc,
                        logic: sf.determinism.logic,
                        math: "SystemState_t+1 = G(SystemState_t, Input_t)" 
                    }
                ]}
            />

            <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] mt-10 space-y-4 shadow-inner">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Библиография проекта:</h4>
                <ul className="space-y-3 text-[10px] text-slate-500 italic leading-relaxed">
                    <li className="pl-4 border-l border-slate-800">• {sf.citations.stroup}</li>
                    <li className="pl-4 border-l border-slate-800">• {sf.citations.porges}</li>
                    <li className="pl-4 border-l border-slate-800">• {sf.citations.sigmoid}</li>
                </ul>
            </div>

            <footer className="pt-16 pb-12 border-t border-slate-900 text-center space-y-4">
                <div className="inline-block px-4 py-1.5 bg-emerald-950/30 border border-emerald-900/30 rounded-full">
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em]">SOVEREIGN_SCIENCE_VERIFIED</span>
                </div>
                <p className="text-[7px] font-mono text-slate-700 uppercase tracking-[0.5em] leading-relaxed">
                    DETERMINISTIC_PROOF // V2.0 COMPLIANT<br/>
                    Genesis OS Research Group © 2025
                </p>
            </footer>
        </div>
    </div>
  );
};
