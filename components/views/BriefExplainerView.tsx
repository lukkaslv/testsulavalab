
import React from 'react';
import { Translations } from '../../types';
import { PlatformBridge } from '../../utils/helpers';

interface BriefExplainerViewProps {
  t: Translations;
  onBack: () => void;
}

export const BriefExplainerView: React.FC<BriefExplainerViewProps> = ({ t, onBack }) => {
  const content = t.brief_explainer;

  const BlockCard = ({ label, desc, color }: { label: string, desc: string, color: string }) => (
    <div className={`p-4 rounded-2xl border ${color} bg-opacity-10 space-y-1`}>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{label}</span>
        <p className="text-xs font-medium leading-tight opacity-90">{desc}</p>
    </div>
  );

  return (
    <section className="space-y-8 animate-in py-4 flex flex-col h-full bg-slate-950 text-slate-200">
        {/* HEADER */}
        <div className="flex justify-between items-center px-1 pb-4 border-b border-slate-800 sticky top-0 bg-slate-950/80 backdrop-blur-md z-20">
            <button 
                onClick={() => {
                    onBack();
                    PlatformBridge.haptic.impact('light');
                }} 
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-300 active:scale-95 transition-all"
            >
                ← {t.global.back}
            </button>
            <div className="flex flex-col items-end">
                 <span className="text-[10px] font-mono text-indigo-400 font-black tracking-widest">{content.title}</span>
                 <span className="text-[7px] font-mono text-slate-500 uppercase">{content.subtitle}</span>
            </div>
        </div>

        <div className="space-y-8 px-1 pb-20 overflow-y-auto no-scrollbar">
            
            {/* 1. INTRO */}
            <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-200 border-l-4 border-indigo-500 pl-3">
                    {content.intro_title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {content.intro_text}
                </p>
            </div>

            {/* 2. BLOCKS */}
            <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-200 border-l-4 border-emerald-500 pl-3">
                    {content.blocks_title}
                </h3>
                
                {/* ARCHETYPE */}
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <span className="text-[10px] font-black uppercase text-indigo-400 block mb-1">{content.archetype_label}</span>
                    <p className="text-xs text-slate-300 leading-snug">{content.archetype_desc}</p>
                </div>

                {/* METRICS GRID */}
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] block pt-2">{content.metrics_title}</span>
                <div className="grid grid-cols-1 gap-3">
                    <BlockCard label={t.brief_explainer.metric_labels.foundation} desc={content.foundation_desc} color="border-emerald-500/30 bg-emerald-950 text-emerald-300" />
                    <BlockCard label={t.brief_explainer.metric_labels.agency} desc={content.agency_desc} color="border-blue-500/30 bg-blue-950 text-blue-300" />
                    <BlockCard label={t.brief_explainer.metric_labels.resource} desc={content.resource_desc} color="border-amber-500/30 bg-amber-950 text-amber-300" />
                    <BlockCard label={t.brief_explainer.metric_labels.entropy} desc={content.entropy_desc} color="border-red-500/30 bg-red-950 text-red-300" />
                </div>

                {/* NEUROSYNC & LATENCY */}
                <div className="grid grid-cols-1 gap-3 pt-2">
                    <div className="bg-indigo-900/40 text-white p-4 rounded-2xl shadow-lg border border-indigo-500/30">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 block mb-1">{content.neurosync_label}</span>
                        <p className="text-xs font-medium leading-snug opacity-90">{content.neurosync_desc}</p>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{content.latency_label}</span>
                        <p className="text-xs text-slate-400 font-medium leading-snug">{content.latency_desc}</p>
                    </div>
                </div>
            </div>

            {/* 3. COMBINATIONS */}
            <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-200 border-l-4 border-amber-500 pl-3">
                    {content.combinations_title}
                </h3>
                <p className="text-xs text-amber-300 leading-relaxed font-medium bg-amber-950/20 p-4 rounded-2xl border border-amber-500/20">
                    {content.combinations_text}
                </p>
            </div>

            {/* 4. ACTION */}
            <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-200 border-l-4 border-indigo-500 pl-3">
                    {content.action_title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {content.action_text}
                </p>
            </div>

            {/* 5. LIMITS */}
            <div className="bg-slate-900 p-5 rounded-3xl space-y-2 border border-slate-800">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {content.limits_title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                    {content.limits_text}
                </p>
            </div>

            {/* CLOSING */}
            <div className="text-center px-4 pt-4">
                <p className="text-[10px] font-medium text-indigo-400 italic leading-relaxed opacity-70">
                    {content.closing}
                </p>
            </div>

        </div>
    </section>
  );
};
