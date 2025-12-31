
import React, { memo } from 'react';
import { Translations } from '../types';
import { BifurcationNode } from '../services/butterflyEngine';

interface BifurcationTreeProps {
    nodes: BifurcationNode[];
    t: Translations;
    className?: string;
}

export const BifurcationTree: React.FC<BifurcationTreeProps> = memo(({ nodes, t, className }) => {
    if (nodes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 rounded-[3rem] border border-white/5 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-3xl mb-4 border border-white/10 opacity-30">🦋</div>
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-relaxed">
                    Линейная стабильность.<br/>Точки бифуркации не обнаружены.
                </h4>
            </div>
        );
    }

    return (
        <div className={`space-y-6 animate-in ${className}`}>
            <header className="px-2 space-y-1">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Path_Space_Topology</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Древо Альтернатив</h3>
            </header>

            <div className="relative space-y-4">
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-800/50"></div>
                
                {nodes.map((node, i) => (
                    <div key={i} className="relative pl-12 group transition-all duration-500">
                        {/* Pivot Point */}
                        <div className="absolute left-[15px] top-4 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-950 z-10 shadow-[0_0_10px_#6366f1]"></div>
                        
                        {/* Branch Visual */}
                        <div className="absolute left-5 top-5 w-6 h-px bg-indigo-500/30"></div>

                        <div className="bg-slate-900/60 border border-white/5 p-5 rounded-[2rem] space-y-3 shadow-xl">
                            <div className="flex justify-between items-start">
                                <div className="space-y-0.5">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Node_{node.id} // {t.beliefs[node.belief] || node.belief}</span>
                                    <div className="text-[10px] font-black text-indigo-300 uppercase">Точка Перелома</div>
                                </div>
                                <span className="text-[9px] font-mono font-black text-emerald-400">Δ INTEGRITY: {node.delta}%</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="p-3 bg-black/40 rounded-xl border border-indigo-500/20">
                                    <span className="text-[7px] text-slate-500 uppercase block mb-1">Actual:</span>
                                    <div className="text-[9px] font-black text-white uppercase truncate">{t.archetypes[node.actualArchetype]?.title}</div>
                                </div>
                                <div className="p-3 bg-indigo-950/20 rounded-xl border border-dashed border-indigo-500/30 relative">
                                    <div className="absolute -top-2 -right-1 bg-indigo-600 text-white text-[6px] px-1 rounded font-black">IF_OTHER_PATH</div>
                                    <span className="text-[7px] text-indigo-400 uppercase block mb-1">Shadow:</span>
                                    <div className="text-[9px] font-black text-indigo-200 uppercase truncate">{t.archetypes[node.shadowArchetype]?.title}</div>
                                </div>
                            </div>

                            <p className="text-[8px] text-slate-500 leading-relaxed italic border-l border-white/10 pl-3">
                                В этой точке малейший сдвиг в сторону "{t.beliefs[node.belief]}" изменил бы доминирующую стратегию всей системы.
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="pt-4 px-2 opacity-30 text-center">
                <p className="text-[7px] text-slate-600 uppercase font-mono tracking-[0.2em]">
                    Butterfly Protocol v14.0 // Sensitivity Threshold: {nodes[0].sensitivity}μ
                </p>
            </footer>
        </div>
    );
});
