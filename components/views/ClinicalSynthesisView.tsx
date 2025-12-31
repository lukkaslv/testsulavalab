
import React from 'react';
import { ClinicalSynthesis, SynthesisInsight, Translations } from '../../types';

interface ClinicalSynthesisViewProps {
    synthesis: ClinicalSynthesis;
    t: Translations;
    className?: string;
}

const InsightCard: React.FC<{ insight: SynthesisInsight }> = ({ insight }) => (
    <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] space-y-4 shadow-xl animate-in">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-xl border border-indigo-500/20">
                {insight.icon}
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">{insight.title}</h4>
        </div>
        <div className="space-y-3">
            <p className="text-[12px] text-slate-200 leading-relaxed font-bold italic">
                "{insight.analysis}"
            </p>
            <div className="pt-3 border-t border-white/5 flex gap-2 items-start">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Focus:</span>
                <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tight leading-tight">{insight.recommendation}</p>
            </div>
        </div>
    </div>
);

export const ClinicalSynthesisView: React.FC<ClinicalSynthesisViewProps> = ({ synthesis, t, className }) => {
    return (
        <div className={`space-y-6 overflow-y-auto no-scrollbar pb-10 ${className}`}>
            <header className="px-2 space-y-1">
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em]">Forensic_Synthesis_Report</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Структурный Анализ Сопротивления</h3>
            </header>

            <div className="grid grid-cols-1 gap-4">
                <InsightCard insight={synthesis.coreTension} />
                <InsightCard insight={synthesis.behavioralPrediction} />
                <InsightCard insight={synthesis.therapeuticFocus} />

                <div className="bg-indigo-600/10 border-2 border-indigo-500/30 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl font-black">?</div>
                    <div className="relative z-10 space-y-3">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">
                            {t.synthesis.key_question}
                        </h4>
                        <p className="text-lg font-black text-white italic tracking-tight leading-tight">
                            "{synthesis.keyQuestion}"
                        </p>
                    </div>
                </div>
            </div>

            <footer className="pt-4 px-2 opacity-30">
                <p className="text-[7px] text-slate-500 leading-relaxed font-mono uppercase">
                    Deterministic Interpretation Layer // Art. 18.2 Compliance // Logic_V8.0_Glass
                </p>
            </footer>
        </div>
    );
};
