
import React, { memo } from 'react';
import { EmergentPattern } from '../services/emergenceEngine';

interface EmergenceMatrixProps {
    patterns: EmergentPattern[];
    className?: string;
}

export const EmergenceMatrix: React.FC<EmergenceMatrixProps> = memo(({ patterns, className }) => {
    if (patterns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 rounded-[3rem] border border-white/5 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-3xl mb-4 border border-white/10 opacity-30">🔍</div>
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-relaxed">
                    Сложные паттерны не обнаружены.<br/>Система в режиме линейного гомеостаза.
                </h4>
            </div>
        );
    }

    return (
        <div className={`space-y-6 animate-in ${className}`}>
            <header className="px-2 space-y-1">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Emergence_Map_Topology</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Синтез Состояний</h3>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {patterns.map((p) => (
                    <div key={p.id} className="bg-slate-950/60 border border-white/5 p-6 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
                        {/* Status Icon */}
                        <div className={`absolute top-0 right-0 px-4 py-1.5 text-[7px] font-black uppercase tracking-widest rounded-bl-xl
                            ${p.impact === 'DECAY' ? 'bg-red-600 text-white' : p.impact === 'PROTECTION' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
                            {p.impact}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Complex_ID: {p.id}</span>
                                <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">{p.label}</h4>
                            </div>

                            <p className="text-[11px] text-slate-300 leading-relaxed font-bold border-l-2 border-indigo-500/20 pl-4 italic">
                                "{p.description}"
                            </p>

                            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-2">
                                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] block">Клиническая Заметка (Art. 18.2):</span>
                                <p className="text-[10px] text-slate-400 leading-relaxed">{p.clinicalNote}</p>
                            </div>

                            <div className="flex justify-between items-end pt-2">
                                <div className="space-y-1">
                                    <span className="text-[7px] text-slate-500 uppercase font-black">Intensity_Level</span>
                                    <div className="flex gap-1">
                                        {Array.from({length: 10}).map((_, idx) => (
                                            <div key={idx} className={`w-3 h-1 rounded-full ${idx < (p.intensity/10) ? 'bg-indigo-500 shadow-[0_0_5px_#6366f1]' : 'bg-slate-800'}`}></div>
                                        ))}
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono font-black text-indigo-300">{p.intensity}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="pt-4 px-2 opacity-30 text-center">
                <p className="text-[7px] text-slate-600 uppercase font-mono tracking-[0.2em]">
                    Forensic State Synthesis v1.0 // Art. 7 Compliant
                </p>
            </footer>
        </div>
    );
});
