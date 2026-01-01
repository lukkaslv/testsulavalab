
import React, { memo, useState, useMemo, useEffect } from 'react';
import { ParableRegistry, Притча } from '../services/parableEngine';
import { PlatformBridge } from '../utils/helpers';

type Category = 'ВСЕ' | 'ИС' | 'НЧ' | 'ТН' | 'ЗК' | 'ПЛ' | 'ТР' | 'СН' | 'ЦЛ' | 'СВ' | 'МС';

interface ParableVaultProps {
    onOpenLogic?: (category: string) => void;
    initialCategory?: string | null;
}

export const ParableVault: React.FC<ParableVaultProps> = memo(({ onOpenLogic, initialCategory }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<Category>('ВСЕ');

    useEffect(() => {
        if (initialCategory) setFilter(initialCategory as Category);
    }, [initialCategory]);

    const filtered = useMemo(() => {
        if (filter === 'ВСЕ') return ParableRegistry;
        return ParableRegistry.filter(p => p.уровеньКод === filter);
    }, [filter]);

    const handleSelect = (id: string) => {
        setSelectedId(selectedId === id ? null : id);
        PlatformBridge.haptic.impact('medium');
    };

    const categories: { key: Category, label: string }[] = [
        { key: 'ВСЕ', label: 'ВСЕ' },
        { key: 'ИС', label: 'ИСТОК' },
        { key: 'НЧ', label: 'НАЧАЛА' },
        { key: 'ТН', label: 'ТЕНЬ' },
        { key: 'ЗК', label: 'ЗАКОНЫ' },
        { key: 'ПЛ', label: 'ПОЛЕ' },
        { key: 'ТР', label: 'СДВИГ' },
        { key: 'СН', label: 'СИНТЕЗ' },
        { key: 'ЦЛ', label: 'ИТОГ' },
        { key: 'СВ', label: 'ВНЕШНЕЕ' },
        { key: 'МС', label: 'ПРЕДЕЛ' }
    ];

    return (
        <div className="space-y-6 animate-in py-2">
            <header className="px-2 space-y-1">
                <span className="text-[8px] font-black text-amber-500 uppercase tracking-[0.4em]">Chronicles_Of_Meaning_v3</span>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Хроники Смыслов</h3>
            </header>

            <div className="flex gap-1 bg-amber-950/20 p-1 rounded-xl border border-amber-500/10 mx-2 overflow-x-auto no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat.key}
                        onClick={() => { setFilter(cat.key); PlatformBridge.haptic.selection(); }}
                        className={`flex-1 min-w-[75px] py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${filter === cat.key ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' : 'text-amber-700 hover:text-amber-500'}`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 px-2 pb-24">
                {filtered.map((p) => {
                    const isSelected = selectedId === p.id;
                    const isMeta = p.уровеньКод === 'МС';
                    
                    return (
                        <div 
                            key={p.id}
                            onClick={() => handleSelect(p.id)}
                            className={`transition-all duration-700 cursor-pointer overflow-hidden border rounded-[2.5rem] relative ${
                                isSelected 
                                ? isMeta ? 'bg-white/10 border-white p-8 shadow-[0_0_50px_rgba(255,255,255,0.15)]' : 'bg-amber-950/30 border-amber-500/40 p-8 shadow-2xl' 
                                : 'bg-slate-950/40 border-slate-800 p-6 hover:bg-slate-900'
                            }`}
                        >
                            <div className="absolute -top-2 -right-2 opacity-5 text-7xl font-black italic pointer-events-none text-white">
                                {p.уровеньКод}
                            </div>

                            <div className="relative z-10 space-y-4">
                                <header className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg border transition-all ${isSelected ? 'bg-amber-600 border-amber-400 rotate-12' : 'bg-slate-900 border-slate-800 grayscale'}`}>
                                            📖
                                        </div>
                                        <div>
                                            <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                                {p.название}
                                            </h4>
                                            <span className="text-[7px] font-mono text-amber-700 uppercase tracking-widest">УРОВЕНЬ: {p.целевойУровень}</span>
                                        </div>
                                    </div>
                                    {!isSelected && <span className="text-amber-900 text-xs font-black tracking-widest animate-pulse">РАСКРЫТЬ</span>}
                                </header>
                                
                                {isSelected && (
                                    <div className="space-y-6 animate-in">
                                        <div className="relative">
                                            <div className="absolute left-[-15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 to-transparent opacity-30"></div>
                                            <p className="text-[14px] text-slate-200 leading-relaxed font-serif italic py-2">
                                                "{p.содержание}"
                                            </p>
                                        </div>
                                        
                                        <div className="pt-6 border-t border-white/5 space-y-4">
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest block">Ключ к расшифровке:</span>
                                                <p className="text-[10px] text-slate-500 font-mono italic leading-tight">
                                                    {p.ключСвязи}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onOpenLogic?.(p.уровеньКод); }}
                                                className="text-[8px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 hover:text-indigo-300 transition-colors"
                                            >
                                                <span>⚙️ Смотреть логику уровня</span>
                                                <span className="text-xs">→</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
