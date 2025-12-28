import React from 'react';
import { ClinicalSynthesis, SynthesisInsight, Translations } from '../../types';

interface ClinicalSynthesisViewProps {
    synthesis: ClinicalSynthesis;
    t: Translations;
    onClose: () => void;
}

const InsightCard: React.FC<{ insight: SynthesisInsight }> = ({ insight }) => (
    <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl space-y-3">
        <div className="flex items-center gap-3">
            <span className="text-xl">{insight.icon}</span>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">{insight.title}</h4>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">{insight.analysis}</p>
    </div>
);

export const ClinicalSynthesisView: React.FC<ClinicalSynthesisViewProps> = ({ synthesis, t, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl p-4 flex flex-col animate-in">
            <header className="flex justify-between items-center pb-4 border-b border-slate-800 shrink-0">
                <h2 className="text-sm font-black uppercase text-white tracking-widest">
                    {t.synthesis.synthesis_title || 'Clinical Synthesis'}
                </h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center">✕</button>
            </header>

            <div className="flex-1 overflow-y-auto py-6 space-y-6">
                <InsightCard insight={synthesis.coreTension} />
                <InsightCard insight={synthesis.behavioralPrediction} />
                <InsightCard insight={synthesis.therapeuticFocus} />

                <div className="bg-emerald-950/30 border border-emerald-500/30 p-5 rounded-2xl space-y-2">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
                        {t.synthesis.key_question}
                    </h4>
                    <p className="text-sm text-white font-bold italic">"{synthesis.keyQuestion}"</p>
                </div>
            </div>
        </div>
    );
};
