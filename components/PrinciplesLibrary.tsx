
import React, { memo, useState, useMemo, useEffect } from 'react';
import { PrinciplesRegistry } from '../services/principlesEngine';
import { PlatformBridge } from '../utils/helpers';

type Category = 'ВСЕ' | 'ИС' | 'НЧ' | 'ТН' | 'ЗК' | 'ПЛ' | 'ТР' | 'СН' | 'ЦЛ' | 'СВ' | 'МС';

interface PrinciplesLibraryProps {
    onOpenMetaphor?: (category: string) => void;
    initialCategory?: string | null;
}

export const PrinciplesLibrary: React.FC<PrinciplesLibraryProps> = memo(({ onOpenMetaphor, initialCategory }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<Category>('ВСЕ');

    useEffect(() => {
        if (initialCategory) setFilter(initialCategory as Category);
    }, [initialCategory]);

    const filtered = useMemo(() => {
        if (filter === 'ВСЕ') return PrinciplesRegistry;
        return PrinciplesRegistry.filter(p => p.id.startsWith(filter));
    }, [filter]);

    const handleSelect = (id: string) => {
        setSelectedId(selectedId === id ? null : id);
        PlatformBridge.haptic.selection();
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
            <header className="px-2 flex justify-between items-end">
                <div className="space-y-1">
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em]">БАЗА_ЗНАНИЙ_V10_FINAL</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Аксиомы Генезиса</h3>
                </div>
            </header>

            <div className="flex gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/5 mx-2 overflow-x-auto no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat.key}
                        onClick={() => { setFilter(cat.key); PlatformBridge.haptic.selection(); }}
                        className={`flex-1 min-w-[75px] py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${filter === cat.key ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="space-y-3 px-2 pb-20">
                {filtered.map((p) => {
                    const levelCode = p.id.substring(0, 2);
                    const isSelected = selectedId === p.id;
                    
                    let activeTheme = 'bg-slate-950/40 border-slate-800';
                    if (isSelected) {
                        const levelThemes: Record<string, string> = {
                            'ИС': 'bg-cyan-950/30 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.15)]',
                            'ЗК': 'bg-amber-950/20 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.1)]',
                            'ПЛ': 'bg-indigo-950/30 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.1)]',
                            'ТР': 'bg-fuchsia-950/30 border-fuchsia-500 shadow-[0_0_30px_rgba(192,38,211,0.1)]',
                            'СН': 'bg-yellow-950/40 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.15)]',
                            'ЦЛ': 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]',
                            'СВ': 'bg-violet-950/40 border-violet-400 shadow-[0_0_50px_rgba(139,92,246,0.25)]',
                            'МС': 'bg-white/10 border-white shadow-[0_0_60px_rgba(255,255,255,0.2)] backdrop-blur-md'
                        };
                        activeTheme = (levelThemes[levelCode] || 'bg-slate-900 border-indigo-500') + ' p-6 rounded-r-3xl';
                    }

                    return (
                        <div 
                            key={p.id}
                            onClick={() => handleSelect(p.id)}
                            className={`border-l-2 transition-all duration-500 cursor-pointer overflow-hidden ${activeTheme} ${!isSelected ? 'p-4 rounded-r-xl hover:bg-slate-900' : ''}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                                    {p.id} // {p.title}
                                </span>
                                <span className="text-indigo-500 opacity-30 text-xs">
                                    {isSelected ? '▲' : '▼'}
                                </span>
                            </div>
                            
                            {isSelected && (
                                <div className="mt-4 space-y-4 animate-in">
                                    <p className="text-[13px] leading-relaxed font-serif italic border-l pl-4 border-white/20 text-slate-200">
                                        "{p.content}"
                                    </p>
                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onOpenMetaphor?.(levelCode); }}
                                            className="text-[8px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 hover:text-amber-400 transition-colors"
                                        >
                                            <span>📖 Смотреть притчу уровня</span>
                                            <span className="text-xs">→</span>
                                        </button>
                                        {levelCode === 'МС' && <span className="text-[7px] text-amber-400 font-black uppercase tracking-widest animate-pulse">АБСОЛЮТНЫЙ_ДЕКОДЕР</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
