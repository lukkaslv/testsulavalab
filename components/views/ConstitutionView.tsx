
import React from 'react';
import { Translations } from '../../types';

interface ConstitutionViewProps {
    onBack: () => void;
    t: Translations;
}

export const ConstitutionView: React.FC<ConstitutionViewProps> = ({ onBack, t }) => (
    <div className="h-full bg-slate-950 text-slate-300 p-8 overflow-y-auto font-serif animate-in select-none">
        <header className="mb-12 border-b border-slate-800 pb-6 flex justify-between items-start">
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">{t.constitution.title}</h1>
                <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.3em]">{t.constitution.subtitle}</p>
            </div>
            <button onClick={onBack} className="p-3 bg-slate-900 rounded-2xl text-white text-xs border border-slate-800 transition-all active:scale-90">✕</button>
        </header>
        <article className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed">
            {Object.entries(t.constitution.articles).map(([key, title]: [string, any]) => (
                key.endsWith('_desc') ? null : (
                    <section key={key} className="space-y-4">
                        <h2 className="text-indigo-400 font-black uppercase text-xs tracking-widest font-mono">{title}</h2>
                        <p>{(t.constitution.articles as any)[`${key}_desc`]}</p>
                    </section>
                )
            ))}
        </article>
        <footer className="mt-20 pt-10 border-t border-slate-900 text-center text-[10px] font-mono text-slate-600 uppercase tracking-widest pb-10">
            DETERMINISTIC_LOCK // 2025
        </footer>
    </div>
);
