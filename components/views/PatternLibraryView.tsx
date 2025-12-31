
import React, { useState, useMemo } from 'react';
import { Translations, BeliefKey } from '../../types';
import { ALL_BELIEFS } from '../../constants';
import { WEIGHTS } from '../../services/psychologyService';
import { PlatformBridge } from '../../utils/helpers';

interface PatternLibraryViewProps {
  t: Translations;
  onBack: () => void;
}

const ImpactVisualizer = ({ weights }: { weights: any }) => {
    if (!weights) return null;
    
    const metrics = [
        { key: 'f', label: 'FND', val: weights.f || 0, color: 'bg-emerald-500' },
        { key: 'a', label: 'AGC', val: weights.a || 0, color: 'bg-indigo-500' },
        { key: 'r', label: 'RES', val: weights.r || 0, color: 'bg-amber-500' },
        { key: 'e', label: 'ENT', val: weights.e || 0, color: 'bg-red-500' },
    ];

    return (
        <div className="flex gap-2 items-end h-16 pt-4 border-t border-white/5 mt-4">
            {metrics.map(m => {
                const height = Math.abs(m.val) * 10 + 10; // Scale for visual
                const isNegative = m.val < 0;
                return (
                    <div key={m.key} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="relative w-full flex justify-center items-end h-full">
                            <div 
                                className={`w-2 rounded-full transition-all duration-500 ${isNegative ? 'bg-slate-700' : m.color} ${m.val === 0 ? 'opacity-20 h-1' : ''}`}
                                style={{ height: `${height}%` }}
                            ></div>
                        </div>
                        <span className="text-[6px] font-mono text-slate-500 uppercase">{m.label}</span>
                        <span className={`text-[7px] font-black ${m.val > 0 ? 'text-white' : 'text-slate-600'}`}>
                            {m.val > 0 ? '+' : ''}{m.val}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export const PatternLibraryView: React.FC<PatternLibraryViewProps> = ({ t, onBack }) => {
  const [selectedPattern, setSelectedPattern] = useState<BeliefKey | null>(null);
  const [filter, setFilter] = useState('');

  const filteredBeliefs = useMemo(() => {
      if (!t || !t.beliefs) return [];
      
      return ALL_BELIEFS.filter(b => {
          if (b === 'default') return false;
          const label = t.beliefs[b];
          if (!label) return false;
          
          return label.toLowerCase().includes(filter.toLowerCase()) || 
                 b.toLowerCase().includes(filter.toLowerCase());
      });
  }, [filter, t]);

  // Safe access to pattern library with fallback
  const pl = t.clinical_narratives?.pattern_library || t.pattern_library || {};

  return (
    <div className="h-full bg-[#020617] text-slate-300 p-6 overflow-hidden flex flex-col font-mono animate-in select-none">
        <header className="mb-6 border-b border-slate-800 pb-4 flex justify-between items-center shrink-0 bg-[#020617]/90 backdrop-blur z-20">
            <div className="space-y-1">
                <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">КОДЕКС</h1>
                <p className="text-[8px] font-mono text-indigo-400 uppercase tracking-[0.4em]">Библиотека Паттернов</p>
            </div>
            <button onClick={onBack} className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 border border-slate-800 transition-all active:scale-90">✕</button>
        </header>

        {/* SEARCH */}
        <div className="mb-6 shrink-0">
            <input 
                type="text" 
                placeholder="ПОИСК ПО БАЗЕ..." 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-[10px] uppercase text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-all"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar custom-scrollbar space-y-3 pb-20">
            {filteredBeliefs.length === 0 ? (
                <div className="text-center opacity-40 pt-10">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Паттерны не найдены</p>
                </div>
            ) : (
                filteredBeliefs.map((key) => {
                    const isSelected = selectedPattern === key;
                    const info = (pl as any)[key] || { protection: "Данные загружаются...", cost: "...", antidote: "..." };
                    const weights = (WEIGHTS as any)[key] || WEIGHTS.default || { f:0, a:0, r:0, e:0 };
                    const label = t.beliefs[key] || key;

                    return (
                        <div 
                            key={key} 
                            onClick={() => { setSelectedPattern(isSelected ? null : key); PlatformBridge.haptic.selection(); }}
                            className={`border rounded-2xl transition-all duration-500 overflow-hidden ${isSelected ? 'bg-slate-900 border-indigo-500/30 shadow-2xl' : 'bg-slate-950 border-slate-800/50'}`}
                        >
                            <div className="p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border ${isSelected ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                                        {label[0] || "?"}
                                    </div>
                                    <div>
                                        <h4 className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                            {label}
                                        </h4>
                                        <span className="text-[7px] font-mono text-slate-600 uppercase">{key}</span>
                                    </div>
                                </div>
                                <span className={`transition-transform duration-300 ${isSelected ? 'rotate-180 text-indigo-500' : 'text-slate-700'}`}>▼</span>
                            </div>

                            {isSelected && (
                                <div className="px-4 pb-6 pt-2 animate-in border-t border-slate-800/50 bg-black/20">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-2">
                                            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                                <span className="text-[7px] text-indigo-400 uppercase tracking-widest block mb-1">Механизм Защиты</span>
                                                <p className="text-[10px] text-slate-300 italic leading-relaxed">"{info.protection}"</p>
                                            </div>
                                            <div className="bg-red-950/10 p-3 rounded-xl border border-red-900/20">
                                                <span className="text-[7px] text-red-400 uppercase tracking-widest block mb-1">Цена (Cost)</span>
                                                <p className="text-[10px] text-red-200/80 leading-relaxed font-bold">{info.cost}</p>
                                            </div>
                                            <div className="bg-emerald-950/10 p-3 rounded-xl border border-emerald-900/20">
                                                <span className="text-[7px] text-emerald-400 uppercase tracking-widest block mb-1">Антидот</span>
                                                <p className="text-[10px] text-emerald-200/80 leading-relaxed font-bold">{info.antidote}</p>
                                            </div>
                                        </div>

                                        <ImpactVisualizer weights={weights} />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>

        <footer className="shrink-0 pt-4 border-t border-slate-900 text-center opacity-30">
            <p className="text-[7px] uppercase tracking-[0.5em]">Education Layer Art. 27</p>
        </footer>
    </div>
  );
};
