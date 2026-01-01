
import React, { useState, useCallback } from 'react';
import { Translations, BeliefKey } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { WEIGHTS } from '../../services/psychologyService';
import { ALL_BELIEFS } from '../../constants';
import { PrinciplesLibrary } from '../PrinciplesLibrary';
import { ParableVault } from '../ParableVault';

type AcademyMode = 'LOGIC' | 'CODEX' | 'PRINCIPLES' | 'PARABLES';

const PipelineNode = ({ label, desc, type, isLast = false }: { label: string, desc: string, type: 'INPUT'|'PROCESS'|'OUTPUT', isLast?: boolean }) => {
    const color = type === 'INPUT' ? 'border-emerald-500/30 text-emerald-400' : 
                  type === 'PROCESS' ? 'border-indigo-500/30 text-indigo-400' : 
                  'border-amber-500/30 text-amber-400';
    
    return (
        <div className="relative pl-8 pb-8 last:pb-0">
            {!isLast && <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-800/50"></div>}
            <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-lg border ${color} bg-slate-900 flex items-center justify-center z-10 shadow-lg`}>
                <div className={`w-1.5 h-1.5 rounded-full ${color.replace('border', 'bg').replace('/30', '')}`}></div>
            </div>
            <div className={`bg-slate-900/50 border border-white/5 p-4 rounded-2xl ${type === 'OUTPUT' ? 'bg-indigo-900/10 border-indigo-500/20' : ''}`}>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">{label}</span>
                    <span className="text-[6px] font-mono uppercase text-slate-600 bg-black/30 px-1.5 py-0.5 rounded">
                        {type === 'INPUT' ? 'ВХОД' : type === 'PROCESS' ? 'ПРОЦЕСС' : 'ВЫХОД'}
                    </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono leading-tight">{desc}</p>
            </div>
        </div>
    );
};

const LogicPipeline = () => (
    <div className="space-y-6 animate-in">
        <div className="p-6 bg-slate-900/20 border border-white/5 rounded-[2.5rem]">
            <h4 className="text-[9px] font-black uppercase text-indigo-500 tracking-[0.3em] mb-6 pl-2">Алгоритмический Поток v12</h4>
            <div className="space-y-2">
                <PipelineNode label="СЫРОЙ СИГНАЛ" desc="Латентность (мс) + Телесный Ввод (s0-s4)" type="INPUT" />
                <PipelineNode label="Z-НОРМАЛИЗАЦИЯ" desc="Отклонения от базовой линии (σ)" type="PROCESS" />
                <PipelineNode label="СИГМОИДНОЕ ЯДРО" desc="Нелинейное обновление весов (1 / 1+e^-x)" type="PROCESS" />
                <PipelineNode label="СЛЕПОК" desc="Детерминированный Вектор [F, A, R, E]" type="OUTPUT" isLast />
            </div>
        </div>
    </div>
);

const WeightMatrix = ({ t }: { t: Translations }) => {
    const [selected, setSelected] = useState<BeliefKey | null>(null);
    const [search, setSearch] = useState('');
    const filtered = ALL_BELIEFS.filter(b => (t.beliefs[b] || b).toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-4 animate-in h-full flex flex-col">
            <input type="text" placeholder="ПОИСК ПАТТЕРНА..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-[10px] font-mono uppercase text-white outline-none focus:border-indigo-500 transition-all" value={search} onChange={e => setSearch(e.target.value)} />
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                {filtered.map(b => {
                    const w = WEIGHTS[b] || WEIGHTS.default;
                    const isSelected = selected === b;
                    return (
                        <div key={b}>
                            <button onClick={() => { setSelected(isSelected ? null : b); PlatformBridge.haptic.selection(); }} className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${isSelected ? 'bg-indigo-900/20 border-indigo-500/40' : 'bg-slate-900/30 border-transparent hover:bg-slate-900'}`}>
                                <div className="text-left">
                                    <span className={`text-[10px] font-black uppercase tracking-wide ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>{t.beliefs[b] || b}</span>
                                    <span className="text-[7px] font-mono text-slate-600 block">{b.toUpperCase()}</span>
                                </div>
                                <div className="flex gap-1">
                                    {[w.f, w.a, w.r, w.e].map((v, i) => <div key={i} className={`w-1 h-3 rounded-full ${v > 0 ? 'bg-emerald-500' : v < 0 ? 'bg-red-500' : 'bg-slate-800'}`}></div>)}
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const ExpertAcademyView: React.FC<{ t: Translations; onBack: () => void; }> = ({ t, onBack }) => {
  const [mode, setMode] = useState<AcademyMode>('PRINCIPLES');
  const [targetCategory, setTargetCategory] = useState<string | null>(null);

  const navigateToMetaphor = useCallback((category: string) => {
      setTargetCategory(category);
      setMode('PARABLES');
      PlatformBridge.haptic.impact('medium');
  }, []);

  const navigateToLogic = useCallback((category: string) => {
      setTargetCategory(category);
      setMode('PRINCIPLES');
      PlatformBridge.haptic.impact('medium');
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#020617] text-slate-300 font-mono text-[10px] p-5 space-y-6 overflow-hidden select-none">
      <header className="flex justify-between items-start border-b border-indigo-900/30 pb-5 shrink-0 bg-[#020617] z-20">
        <div className="space-y-1">
            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-white">ЯДРО ЗНАНИЙ</h1>
            <p className="text-[8px] text-indigo-400 font-mono uppercase tracking-widest">Knowledge_Base // V13.0</p>
        </div>
        <button onClick={onBack} className="bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800 text-slate-500 font-black uppercase text-[8px] tracking-widest hover:text-white transition-all">ВЫХОД</button>
      </header>

      <nav className="flex bg-slate-900 rounded-xl border border-white/5 shrink-0 overflow-x-auto no-scrollbar p-1 gap-1">
          {(['PRINCIPLES', 'PARABLES', 'LOGIC', 'CODEX'] as const).map(m => (
              <button 
                key={m} 
                onClick={() => { setMode(m); setTargetCategory(null); PlatformBridge.haptic.selection(); }}
                className={`px-4 py-3 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${mode === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                  {m === 'LOGIC' ? 'ЛОГИКА' : m === 'CODEX' ? 'ВЕСА' : m === 'PRINCIPLES' ? 'ЗНАНИЯ' : 'ПРИТЧИ'}
              </button>
          ))}
      </nav>

      <div className="flex-1 overflow-hidden overflow-y-auto no-scrollbar custom-scrollbar pb-20 relative">
        {mode === 'LOGIC' && <LogicPipeline />}
        {mode === 'CODEX' && <WeightMatrix t={t} />}
        {mode === 'PRINCIPLES' && <PrinciplesLibrary onOpenMetaphor={navigateToMetaphor} initialCategory={targetCategory} />}
        {mode === 'PARABLES' && <ParableVault onOpenLogic={navigateToLogic} initialCategory={targetCategory} />}
      </div>

      <footer className="shrink-0 border-t border-indigo-900/20 pt-4 text-center opacity-30">
        <p className="text-[7px] text-slate-600 tracking-[0.4em] uppercase">Genesis OS Academy Layer</p>
      </footer>
    </div>
  );
};
