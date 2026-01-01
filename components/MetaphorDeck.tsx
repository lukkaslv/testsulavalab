
import React, { memo, useState } from 'react';
import { MetaPattern } from '../services/metaphorEngine';
import { PlatformBridge } from '../utils/helpers';

interface MetaphorDeckProps {
    patterns: MetaPattern[];
    className?: string;
}

const MetaCard: React.FC<{ pattern: MetaPattern, index: number }> = ({ pattern, index }) => {
    const [flipped, setFlipped] = useState(false);

    const handleFlip = () => {
        setFlipped(!flipped);
        PlatformBridge.haptic.impact('medium');
    };

    return (
        <div 
            onClick={handleFlip}
            className={`relative w-full min-h-[220px] perspective-1000 cursor-pointer transition-all duration-700 ${flipped ? 'scale-105' : 'hover:scale-[1.02]'}`}
            style={{ animationDelay: `${index * 0.15}s` }}
        >
            <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
                
                {/* FRONT: THE SEAL */}
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-900 to-black border-2 border-indigo-500/20 rounded-[2.5rem] flex flex-col items-center justify-center p-8 shadow-2xl">
                    <div className="w-16 h-16 rounded-full border border-indigo-500/30 flex items-center justify-center mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                        <span className="text-2xl opacity-50 grayscale group-hover:grayscale-0 transition-all">🗝️</span>
                    </div>
                    <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-2">Existential_Cipher</span>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest text-center italic">{pattern.title}</h4>
                    <div className="absolute bottom-6 flex gap-1">
                        {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-indigo-500/20"></div>)}
                    </div>
                </div>

                {/* BACK: THE TRUTH */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-950 border-2 border-amber-500/30 rounded-[2.5rem] p-8 flex flex-col justify-center shadow-[0_0_40px_rgba(245,158,11,0.1)]">
                    <div className="space-y-4">
                        <header className="flex justify-between items-center border-b border-amber-500/20 pb-2">
                            <span className="text-[10px] font-black text-amber-500 uppercase italic">{pattern.title}</span>
                            <span className="text-[8px] font-mono text-slate-500">{pattern.id}</span>
                        </header>
                        <p className="text-[12px] text-slate-200 leading-relaxed font-serif italic">
                            "{pattern.content}"
                        </p>
                        <div className="pt-2">
                            <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest block mb-1">Клинический маркер:</span>
                            <p className="text-[9px] text-slate-500 font-mono leading-tight">{pattern.clinicalContext}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export const MetaphorDeck: React.FC<MetaphorDeckProps> = memo(({ patterns, className }) => {
    return (
        <div className={`space-y-8 animate-in py-2 ${className}`}>
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>

            <header className="px-2 space-y-1 text-center">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.4em]">Deep_Metaphor_Synthesis</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Шифры Личности</h3>
                <p className="text-[9px] text-slate-500 italic max-w-[240px] mx-auto pt-2">
                    "Слова лгут. Метафоры указывают на то, что за словами."
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6 px-2">
                {patterns.map((p, i) => (
                    <MetaCard key={p.id} pattern={p} index={i} />
                ))}
            </div>

            <footer className="px-4 text-center opacity-30 pt-4">
                <p className="text-[7px] text-slate-500 uppercase leading-relaxed font-mono">
                    Синтез экзистенциальных узлов Ст. 3.1 // Art. 7.2
                </p>
            </footer>
        </div>
    );
});
