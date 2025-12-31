
import React, { useState, useMemo } from 'react';
import { Translations } from '../../types';
import { PlatformBridge } from '../../utils/helpers';

interface GuideViewProps {
  t: Translations;
  onBack: () => void;
}

type GuideMode = 'client' | 'pro' | 'transition';

export const GuideView: React.FC<GuideViewProps> = ({ t, onBack }) => {
  const [mode, setMode] = useState<GuideMode>('client');
  
  const content = useMemo(() => {
    if (mode === 'client') return t.guide;
    if (mode === 'pro') return t.pro_guide;
    return t.transition_protocol;
  }, [mode, t]);

  const sections = (content as any).sections || [];
  const closingText = (content as any).metaphor || (content as any).closing;

  return (
    <div className="flex flex-col h-full animate-in bg-slate-950 text-slate-200">
        <header className="px-4 pt-4 pb-4 flex justify-between items-center z-20 shrink-0 sticky top-0 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase active:scale-95 transition-all shadow-sm bg-slate-800 text-slate-300 border border-slate-700"
            >
                ← {t.global.back}
            </button>
            <div className="text-right">
                 <h2 className="text-sm font-black tracking-tight text-indigo-400">{content.title}</h2>
                 <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{content.subtitle}</p>
            </div>
        </header>

        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
            <div className="px-4 py-6 shrink-0">
                <div className="p-1.5 rounded-2xl flex shadow-sm border bg-slate-900 border-slate-700">
                    <button 
                        onClick={() => { setMode('client'); PlatformBridge.haptic.selection(); }}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'client' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
                    >
                        {t.ui.mode_client}
                    </button>
                    <button 
                        onClick={() => { setMode('pro'); PlatformBridge.haptic.selection(); }}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'pro' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
                    >
                        {t.ui.mode_pro}
                    </button>
                    <button 
                        onClick={() => { setMode('transition'); PlatformBridge.haptic.selection(); }}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'transition' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
                    >
                        {t.ui.mode_transition}
                    </button>
                </div>
            </div>

            <div className="space-y-10 px-4 pb-20">
                {sections.map((section: { title: string, content: string[] }, idx: number) => (
                    <div key={idx} className="space-y-4 animate-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono font-black text-indigo-400">/ 0{idx + 1}</span>
                            <h4 className="text-sm font-black uppercase tracking-tight text-indigo-200">
                                {section.title}
                            </h4>
                        </div>
                        <div className="p-6 rounded-[2rem] space-y-4 shadow-sm border bg-indigo-950/40 border-indigo-500/20 text-slate-300">
                            {section.content.map((point, pIdx) => (
                                <p key={pIdx} className="text-sm leading-relaxed font-medium italic">
                                    {point}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
                
                <div className="p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl transition-all duration-700 bg-indigo-950 border border-indigo-500/30 text-white">
                     <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl">{mode === 'transition' ? '🌊' : mode === 'pro' ? '⚡' : '🧭'}</div>
                     <p className="relative z-10 text-lg font-black uppercase italic leading-tight tracking-tight text-center">
                         {closingText}
                     </p>
                </div>
            </div>
        </div>
    </div>
  );
};
