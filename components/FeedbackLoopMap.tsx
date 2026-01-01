
import React, { memo } from 'react';
import { FeedbackLoopReport, FeedbackLoop } from '../services/psychologyService';
import { Translations, DomainType } from '../types';

interface FeedbackLoopMapProps {
    report: FeedbackLoopReport;
    t: Translations;
    className?: string;
}

const DOMAIN_ICONS: Record<DomainType, string> = {
    foundation: '⚓',
    agency: '⚡',
    money: '💎',
    social: '👥',
    legacy: '🌳'
};

const LoopCard: React.FC<{ loop: FeedbackLoop, t: Translations }> = ({ loop, t }) => {
    const isVicious = loop.type === 'ЗАМКНУТЫЙ_КРУГ';
    const accentColor = isVicious ? 'text-amber-400 border-amber-500/30' : 'text-indigo-400 border-indigo-500/30';

    return (
        <div className={`p-6 rounded-[2.5rem] border bg-slate-950/60 shadow-xl relative overflow-hidden group animate-in ${isVicious ? 'border-amber-900/20' : 'border-indigo-900/20'}`}>
            {/* Анимированный фон петли */}
            <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[80px] opacity-10 transition-all duration-1000 ${isVicious ? 'bg-amber-500 group-hover:opacity-20' : 'bg-indigo-500 group-hover:opacity-20'}`}></div>

            <div className="relative z-10 space-y-6">
                <header className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest w-fit ${accentColor}`}>
                            {loop.type.replace('_', ' ')}
                        </div>
                        <h4 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none mt-2">
                            {loop.id === 'exhaustion' ? 'Петля Истощения' : loop.id === 'manic' ? 'Маниакальный Цикл' : 'Спираль Роста'}
                        </h4>
                    </div>
                    <div className="text-right">
                        <span className="text-[7px] text-slate-500 uppercase tracking-widest block">Инерция сценария</span>
                        <span className={`text-xl font-mono font-black ${isVicious ? 'text-red-500' : 'text-emerald-500'}`}>{loop.inertia}%</span>
                    </div>
                </header>

                <div className="flex items-center justify-between px-4 py-2 bg-black/40 rounded-2xl border border-white/5 relative">
                    {loop.nodes.map((node, idx) => (
                        <React.Fragment key={idx}>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-lg">{DOMAIN_ICONS[node.domain]}</span>
                                <span className="text-[7px] font-black text-slate-500 uppercase">{t.domains[node.domain].substring(0,3)}</span>
                            </div>
                            {idx < loop.nodes.length - 1 && (
                                <div className={`flex-1 h-px mx-2 border-t border-dashed ${isVicious ? 'border-amber-500/30' : 'border-indigo-500/30'} relative`}>
                                    <div className={`absolute inset-0 flex items-center justify-center text-[10px] ${isVicious ? 'text-amber-500' : 'text-indigo-500'} animate-pulse`}>→</div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                    {/* Замыкающая стрелка */}
                    <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-full h-4 border-b border-x rounded-b-xl border-dashed opacity-20 ${isVicious ? 'border-amber-500' : 'border-indigo-500'}`}></div>
                </div>

                <div className="space-y-4">
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic font-serif">
                        "{loop.description}"
                    </p>
                    <div className="p-4 bg-emerald-950/10 border border-emerald-500/20 rounded-2xl space-y-1">
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest block">Точка Разрыва:</span>
                        <p className="text-[10px] text-emerald-200 font-bold leading-tight uppercase tracking-tight">
                            {loop.breakingPoint}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const FeedbackLoopMap: React.FC<FeedbackLoopMapProps> = memo(({ report, t, className }) => {
    return (
        <div className={`space-y-8 animate-in py-2 ${className}`}>
            <header className="px-2 space-y-1">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Psychic_Feedback_Mapping</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Динамика Петель</h3>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {report.loops.length === 0 ? (
                    <div className="p-10 text-center opacity-30 text-[9px] font-black uppercase tracking-widest text-slate-500">
                        Циклические паттерны не обнаружены. Система находится в линейном режиме.
                    </div>
                ) : (
                    report.loops.map(loop => (
                        <LoopCard key={loop.id} loop={loop} t={t} />
                    ))
                )}
            </div>

            <div className="p-6 bg-slate-900 border border-white/5 rounded-[2.5rem] flex justify-between items-center shadow-inner">
                <div className="space-y-1">
                    <span className="text-[8px] text-slate-500 uppercase tracking-widest block">Глобальная Устойчивость</span>
                    <div className="text-xl font-black text-white">{report.globalStability}%</div>
                </div>
                <div className="text-right space-y-1">
                    <span className="text-[8px] text-slate-500 uppercase tracking-widest block">Доминанта</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${report.dominantDynamic === 'ЭВОЛЮЦИЯ' ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400' : 'bg-red-900/30 border-red-500/30 text-red-400'}`}>
                        {report.dominantDynamic}
                    </span>
                </div>
            </div>

            <footer className="px-4 text-center opacity-30">
                <p className="text-[7px] text-slate-600 uppercase leading-relaxed font-mono">
                    Анализ петель самоподкрепления Ст. 6.1 // Logic_V21.0_Feedback
                </p>
            </footer>
        </div>
    );
});
