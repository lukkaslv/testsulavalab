import React, { memo } from 'react';
import { ShadowContract } from '../services/shadowEngine';
import { Translations } from '../types';

interface ShadowRevealProps {
    contract: ShadowContract;
    t: Translations;
    className?: string;
}

/**
 * ГЕНЕЗИС: Теневой Контракт (Ст. 7.3)
 * Обнажает вторичные выгоды сопротивления.
 */
export const ShadowReveal: React.FC<ShadowRevealProps> = memo(({ contract, t, className }) => {
    return (
        <div className={`space-y-6 animate-in py-2 ${className}`}>
            <header className="px-2 space-y-1">
                <span className="text-[8px] font-black text-purple-500 uppercase tracking-[0.4em] animate-pulse">Shadow_Contract_Decoded</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Теневая Сделка</h3>
            </header>

            <div className="bg-purple-950/20 border border-purple-500/30 p-8 rounded-[2.5rem] relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                <div className="absolute top-0 right-0 p-6 opacity-5 text-8xl font-black grayscale pointer-events-none">☯</div>
                
                <div className="relative z-10 space-y-6">
                    <div className="space-y-2">
                        <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.2em]">Теневой Архетип:</span>
                        <div className="text-2xl font-black italic text-white uppercase tracking-tighter">
                            {t.archetypes[contract.archetype]?.title}
                        </div>
                    </div>

                    <div className="h-px bg-purple-500/20 w-full"></div>

                    <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-1.5">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                Вторичная выгода:
                            </span>
                            <p className="text-sm font-bold text-emerald-100">{contract.gain}</p>
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-red-500"></span>
                                Системная цена:
                            </span>
                            <p className="text-sm font-bold text-red-400">{contract.cost}</p>
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                        <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest block">Логика Сопротивления (Ст. 18.2):</span>
                        <p className="text-[13px] text-slate-300 leading-relaxed font-medium italic font-serif">
                            "{contract.logic}"
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-6 text-center opacity-40">
                <p className="text-[7px] text-slate-500 uppercase leading-relaxed font-mono">
                    Данный контракт является бессознательным механизмом защиты гомеостаза. 
                    Осознание этой сделки — обязательное условие для разрыва деструктивного сценария.
                </p>
            </div>
        </div>
    );
});