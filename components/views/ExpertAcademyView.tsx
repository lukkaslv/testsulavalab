
import React, { useState } from 'react';
import { Translations, ArchetypeKey, BeliefKey } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { WEIGHTS } from '../../services/psychologyService';
import { ALL_BELIEFS } from '../../constants';

// --- SUB-COMPONENTS ---

const PipelineNode = ({ label, desc, type, isLast = false }: { label: string, desc: string, type: 'INPUT'|'PROCESS'|'OUTPUT', isLast?: boolean }) => {
    const color = type === 'INPUT' ? 'border-emerald-500/30 text-emerald-400' : 
                  type === 'PROCESS' ? 'border-indigo-500/30 text-indigo-400' : 
                  'border-amber-500/30 text-amber-400';
    
    return (
        <div className="relative pl-8 pb-8 last:pb-0">
            {/* Connection Line */}
            {!isLast && <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-800/50"></div>}
            
            {/* Node Point */}
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

const LogicPipeline = () => {
    return (
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
            
            <div className="p-5 bg-emerald-950/10 border border-emerald-500/20 rounded-2xl flex gap-4 items-center">
                <span className="text-2xl">⚖️</span>
                <p className="text-[9px] text-emerald-400/80 uppercase font-mono leading-relaxed">
                    "Система исключает вариативность вывода при идентичности входных векторов. Это фундамент детерминизма."
                </p>
            </div>
        </div>
    );
};

const WeightBar = ({ val, color }: { val: number, color: string }) => {
    const height = Math.abs(val) * 4 + 4; // Scale 1-5 to px
    const isNeg = val < 0;
    return (
        <div className="w-1.5 bg-slate-800 rounded-full h-6 relative flex items-center justify-center">
            <div 
                className={`w-full rounded-full transition-all ${isNeg ? 'bg-slate-600' : color}`}
                style={{ height: `${height}px` }}
            ></div>
        </div>
    );
};

const WeightMatrix = ({ t }: { t: Translations }) => {
    const [selected, setSelected] = useState<BeliefKey | null>(null);
    const [search, setSearch] = useState('');

    const filtered = ALL_BELIEFS.filter(b => 
        (t.beliefs[b] || b).toLowerCase().includes(search.toLowerCase()) || 
        b.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4 animate-in h-full flex flex-col">
            <input 
                type="text" 
                placeholder="ПОИСК ПАТТЕРНА..." 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-[10px] font-mono uppercase text-white outline-none focus:border-indigo-500 transition-all shrink-0"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 pr-1 custom-scrollbar">
                {filtered.map(b => {
                    const w = WEIGHTS[b] || WEIGHTS.default;
                    const isSelected = selected === b;
                    const label = t.beliefs[b] || b;
                    const info = t.pattern_library[b];

                    return (
                        <div key={b} className="group">
                            <button 
                                onClick={() => { setSelected(isSelected ? null : b); PlatformBridge.haptic.selection(); }}
                                className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${isSelected ? 'bg-indigo-900/20 border-indigo-500/40' : 'bg-slate-900/30 border-transparent hover:bg-slate-900 hover:border-slate-800'}`}
                            >
                                <div className="text-left">
                                    <span className={`text-[10px] font-black uppercase tracking-wide ${isSelected ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                        {label}
                                    </span>
                                    <span className="text-[7px] font-mono text-slate-600 block">{b.toUpperCase()}</span>
                                </div>
                                
                                {/* Micro Visualizer */}
                                <div className="flex gap-1 items-center">
                                    <WeightBar val={w.f} color="bg-emerald-500" />
                                    <WeightBar val={w.a} color="bg-indigo-500" />
                                    <WeightBar val={w.r} color="bg-amber-500" />
                                    <WeightBar val={w.e} color="bg-red-500" />
                                </div>
                            </button>

                            {isSelected && info && (
                                <div className="mx-2 mb-2 p-4 bg-black/40 border-x border-b border-indigo-500/20 rounded-b-xl space-y-3 animate-in">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 bg-indigo-950/30 rounded border border-indigo-500/20">
                                            <span className="text-[7px] text-indigo-400 uppercase font-black block">Механизм</span>
                                            <p className="text-[9px] text-indigo-200 leading-tight">{info.protection}</p>
                                        </div>
                                        <div className="p-2 bg-emerald-950/30 rounded border border-emerald-500/20">
                                            <span className="text-[7px] text-emerald-400 uppercase font-black block">Антидот</span>
                                            <p className="text-[9px] text-emerald-200 leading-tight">{info.antidote}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 font-mono text-[8px] text-slate-500 justify-center pt-1">
                                        <span>F:{w.f}</span><span>A:{w.a}</span><span>R:{w.r}</span><span>E:{w.e}</span><span>S:{w.s}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ProtocolLibrary = ({ t }: { t: Translations }) => {
    const ax = t.academy_extra;
    const archetypes: ArchetypeKey[] = ['THE_ARCHITECT', 'THE_DRIFTER', 'THE_BURNED_HERO', 'THE_GOLDEN_PRISONER', 'THE_CHAOS_SURFER', 'THE_GUARDIAN'];
    const [selected, setSelected] = useState<ArchetypeKey | null>(null);

    return (
        <div className="space-y-6 animate-in">
            <div className="grid grid-cols-2 gap-3">
                {archetypes.map(a => (
                    <button 
                        key={a}
                        onClick={() => { setSelected(a); PlatformBridge.haptic.selection(); }}
                        className={`p-4 rounded-2xl border text-left transition-all ${selected === a ? 'bg-indigo-600 border-indigo-400 shadow-lg' : 'bg-slate-900/40 border-white/5 hover:border-white/10'}`}
                    >
                        <span className={`text-[8px] font-black uppercase tracking-widest block mb-1 ${selected === a ? 'text-indigo-200' : 'text-slate-500'}`}>
                            Протокол ID_{a.split('_')[1].substring(0,3)}
                        </span>
                        <span className={`text-[10px] font-bold uppercase ${selected === a ? 'text-white' : 'text-slate-300'}`}>
                            {t.archetypes[a].title}
                        </span>
                    </button>
                ))}
            </div>

            {selected && (
                <div className="bg-slate-950 border border-indigo-500/30 p-6 rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden animate-in">
                    <div className="absolute top-0 right-0 p-6 opacity-5 text-6xl pointer-events-none">⚠</div>
                    
                    <div className="space-y-2 relative z-10">
                        <span className="text-[8px] font-black text-red-400 uppercase tracking-[0.2em] bg-red-950/30 px-2 py-1 rounded w-fit">
                            {ax.transference_risk}
                        </span>
                        <h3 className="text-lg font-black text-white italic tracking-tight uppercase leading-none">
                            {t.archetypes[selected].title}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Провокация специалиста</span>
                            <p className="text-[10px] text-slate-300 leading-relaxed font-bold border-l-2 border-slate-700 pl-3">
                                {selected === 'THE_ARCHITECT' ? "Попытка 'переиграть' терапевта интеллектуально. Борьба за экспертную власть." :
                                 selected === 'THE_DRIFTER' ? "Уход в абстракции. Провоцирует специалиста на роль 'Спасателя' или 'Родителя'." :
                                 selected === 'THE_BURNED_HERO' ? "Запрос на 'быстрый результат'. Обесценивание медленных процессов." :
                                 selected === 'THE_GOLDEN_PRISONER' ? "Бесконечные жалобы без запроса на изменение ('Да, но...')." :
                                 selected === 'THE_CHAOS_SURFER' ? "Атака на сеттинг. Опоздания, отмены, хаотичная речь." :
                                 "Ригидность. Отказ от экспериментов под предлогом 'безопасности'."}
                            </p>
                        </div>
                        
                        <div className="p-4 bg-emerald-950/10 border border-emerald-500/20 rounded-2xl">
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Стратегия (Ст. 27.2)</span>
                            <p className="text-[9px] text-emerald-200/80 leading-relaxed italic">
                                "Не поддерживайте симптом. {selected === 'THE_ARCHITECT' ? 'Возвращайте в тело.' : 'Держите границы.'}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SemanticMap = ({ t }: { t: Translations }) => {
    const ax = t.academy_extra;
    const items = [
        { icon: '🌳', label: 'ФУНДАМЕНТ', text: ax.m_foundation, color: 'text-emerald-400', border: 'border-emerald-500/20' },
        { icon: '🏹', label: 'ВОЛЯ', text: ax.m_agency, color: 'text-indigo-400', border: 'border-indigo-500/20' },
        { icon: '🏺', label: 'РЕСУРС', text: ax.m_resource, color: 'text-amber-400', border: 'border-amber-500/20' },
        { icon: '🌫️', label: 'ЭНТРОПИЯ', text: ax.m_entropy, color: 'text-red-400', border: 'border-red-500/20' },
        { icon: '🌉', label: 'НЕЙРОСИНК', text: ax.m_neurosync, color: 'text-cyan-400', border: 'border-cyan-500/20' },
    ];

    return (
        <div className="space-y-3 animate-in">
            {items.map((item, i) => (
                <div key={i} className={`bg-slate-900/40 border ${item.border} p-5 rounded-3xl flex gap-4 items-start`}>
                    <span className="text-2xl filter drop-shadow-lg">{item.icon}</span>
                    <div className="space-y-1">
                        <h5 className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.color}`}>{item.label}</h5>
                        <p className="text-[10px] text-slate-300 leading-relaxed font-medium">{item.text.split('//')[1]}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const ExpertAcademyView: React.FC<{ t: Translations; onBack: () => void; }> = ({ t, onBack }) => {
  const [mode, setMode] = useState<'LOGIC' | 'CODEX' | 'PROTO' | 'SEMANTICS'>('LOGIC');

  return (
    <div className="flex flex-col h-full bg-[#020617] text-slate-300 font-mono text-[10px] p-5 space-y-6 overflow-hidden select-none">
      
      {/* HEADER: KNOWLEDGE CORE */}
      <header className="flex justify-between items-start border-b border-indigo-900/30 pb-5 shrink-0 bg-[#020617] z-20">
        <div className="space-y-1">
            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-white">ЯДРО ЗНАНИЙ</h1>
            <p className="text-[8px] text-indigo-400 font-mono uppercase tracking-widest">Только для персонала // V12.5</p>
        </div>
        <button onClick={onBack} className="bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800 text-slate-500 font-black uppercase text-[8px] tracking-widest hover:text-white transition-all active:scale-95">
            ВЫХОД
        </button>
      </header>

      {/* NAV: DATA PRISM */}
      <nav className="grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded-xl border border-white/5 shrink-0">
          {(['LOGIC', 'CODEX', 'PROTO', 'SEMANTICS'] as const).map(m => (
              <button 
                key={m} 
                onClick={() => { setMode(m); PlatformBridge.haptic.selection(); }}
                className={`py-3 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                  {m === 'LOGIC' ? 'ЛОГИКА' : m === 'CODEX' ? 'КОДЕКС' : m === 'PROTO' ? 'ПРОТОКОЛ' : 'МЕТА'}
              </button>
          ))}
      </nav>

      {/* CONTENT: SCROLLABLE VAULT */}
      <div className="flex-1 overflow-hidden overflow-y-auto no-scrollbar custom-scrollbar pb-20 relative">
        {mode === 'LOGIC' && <LogicPipeline />}
        {mode === 'CODEX' && <WeightMatrix t={t} />}
        {mode === 'PROTO' && <ProtocolLibrary t={t} />}
        {mode === 'SEMANTICS' && <SemanticMap t={t} />}
      </div>

      <footer className="shrink-0 border-t border-indigo-900/20 pt-4 text-center opacity-30">
        <p className="text-[7px] text-slate-600 tracking-[0.4em] uppercase">Genesis OS Academy Layer</p>
      </footer>
    </div>
  );
};
