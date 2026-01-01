
import React, { memo } from 'react';
import { Миф } from '../services/MythosEngine';

interface props {
    данные: Миф;
    className?: string;
}

export const MythosMirror: React.FC<props> = memo(({ данные, className }) => {
    return (
        <div className={`space-y-8 animate-in py-4 ${className}`}>
            <header className="text-center space-y-2">
                <div className="text-5xl mb-4 filter drop-shadow-[0_0_15px_rgba(250,204,21,0.4)] animate-pulse-slow">
                    {данные.символ}
                </div>
                <span className="text-[8px] font-black text-amber-500 uppercase tracking-[0.5em]">Протокол_Мифодизайна</span>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Зеркало Мифа</h3>
            </header>

            <div className="relative p-10 bg-gradient-to-br from-amber-950/20 to-slate-950 border border-amber-500/20 rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
                
                <div className="relative z-10 space-y-10">
                    <section className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-amber-600">/ ИСТОК</span>
                            <div className="h-px flex-1 bg-amber-500/10"></div>
                        </div>
                        <p className="text-base text-slate-200 leading-relaxed font-serif italic pl-4 border-l border-amber-500/30">
                            {данные.корень}
                        </p>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-indigo-400">/ ПУТЬ</span>
                            <div className="h-px flex-1 bg-indigo-500/10"></div>
                        </div>
                        <p className="text-base text-slate-200 leading-relaxed font-serif italic pl-4 border-l border-indigo-500/30">
                            {данные.вызов}
                        </p>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-purple-400">/ ПОРОГ</span>
                            <div className="h-px flex-1 bg-purple-500/10"></div>
                        </div>
                        <p className="text-base text-slate-200 leading-relaxed font-serif italic pl-4 border-l border-purple-500/30">
                            {данные.порог}
                        </p>
                    </section>
                </div>

                <div className="absolute bottom-4 right-8 opacity-5 text-8xl font-black text-white pointer-events-none">
                    Σ
                </div>
            </div>

            <p className="text-[7px] text-slate-600 text-center uppercase tracking-[0.3em] font-mono">
                Текст детерминирован вектором состояния субъекта // Ст. 1.1
            </p>
        </div>
    );
});
