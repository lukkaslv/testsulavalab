
import React, { useState } from 'react';
import { Translations } from '../../types';
import { PlatformBridge } from '../../utils/helpers';

interface SpecialistAtlasViewProps {
  t: Translations;
  onBack: () => void;
}

const AtlasChapter = ({ title, icon, sections, color = "indigo" }: { title: string, icon: string, sections: any[], color?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const borderClass = color === "emerald" ? "border-emerald-500/30" : "border-indigo-500/30";
    const textClass = color === "emerald" ? "text-emerald-400" : "text-indigo-400";
    const shadowClass = color === "emerald" ? "shadow-emerald-500/10" : "shadow-indigo-500/10";

    return (
        <div className={`border rounded-[2.5rem] transition-all duration-500 overflow-hidden ${isOpen ? `bg-slate-900 ${borderClass} shadow-2xl ${shadowClass}` : 'bg-slate-950 border-slate-800'}`}>
            <button onClick={() => { setIsOpen(!isOpen); PlatformBridge.haptic.impact('light'); }} className="w-full p-6 flex justify-between items-center group">
                <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl transition-all ${isOpen ? 'bg-indigo-500/10 scale-110' : 'bg-slate-900 grayscale'}`}>
                        {icon}
                    </div>
                    <h3 className={`text-sm font-black uppercase ${isOpen ? 'text-white' : 'text-slate-400'} tracking-[0.2em]`}>{title}</h3>
                </div>
                <span className={`text-indigo-500 transition-transform duration-500 ${isOpen ? 'rotate-180 opacity-100' : 'opacity-30'}`}>▼</span>
            </button>
            {isOpen && (
                <div className="px-8 pb-10 space-y-8 animate-in">
                    {sections.map((s, i) => (
                        <div key={i} className="space-y-3 relative pl-6 border-l border-slate-800">
                            <div className="absolute left-[-1px] top-0 w-px h-6 bg-indigo-500"></div>
                            <h4 className={`text-[10px] font-black uppercase tracking-widest ${textClass}`}>{s.title}</h4>
                            <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic">"{s.content}"</p>
                            {s.math && (
                                <div className="bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-[9px] text-indigo-300/80">
                                    <span className="text-[7px] text-slate-600 block mb-1 uppercase">Математическая модель (Ст. 18.2):</span>
                                    {s.math}
                                </div>
                            )}
                            {s.behavior && (
                                <div className="flex gap-2 items-start mt-2">
                                    <span className="text-[10px]">👁️</span>
                                    <p className="text-[9px] text-slate-500 uppercase font-bold leading-tight">{s.behavior}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const SpecialistAtlasView: React.FC<SpecialistAtlasViewProps> = ({ t, onBack }) => {
  const guide = t.pro_guide;
  const ax = t.academy_extra;

  return (
    <div className="h-full bg-slate-950 text-slate-300 p-6 overflow-y-auto no-scrollbar font-mono animate-in select-none">
        <header className="mb-10 border-b border-slate-800 pb-6 flex justify-between items-center sticky top-0 bg-slate-950/90 backdrop-blur-md z-30">
            <div className="space-y-1">
                <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">{guide.title}</h1>
                <p className="text-[8px] font-mono text-indigo-400 uppercase tracking-[0.4em]">{guide.subtitle} // V12.5</p>
            </div>
            <button onClick={onBack} className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 border border-slate-800 transition-all active:scale-90">✕</button>
        </header>

        <div className="space-y-6 pb-24">
            {/* Meta-Intro based on Constitution */}
            <div className="p-8 rounded-[3rem] bg-gradient-to-br from-indigo-950/30 to-slate-950 border border-indigo-500/20 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 text-6xl opacity-5 grayscale pointer-events-none">📖</div>
                <div className="relative z-10 space-y-4">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Клинический стандарт</span>
                    <p className="text-sm text-slate-100 leading-relaxed font-serif italic">
                        "Слова лгут. Паузы и тело — никогда. Данный Атлас обучает специалиста видеть структуру сопротивления за фасадом речи."
                    </p>
                    <div className="pt-2 border-t border-indigo-500/20">
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                            Соблюдайте Статью 27.2: Не выдавайте результат клиенту без контекста. Атлас — это карта, а не приговор.
                        </p>
                    </div>
                </div>
            </div>

            {/* Chapter 1: Core Metrics with Math */}
            <AtlasChapter 
                title="Архитектура Сигнала" 
                icon="🧬" 
                sections={[
                    { 
                        title: "Z-Score (Латентность)", 
                        content: "Индикатор когнитивного трения. Показывает, насколько тема 'фонит' для сознания клиента.",
                        math: "Z = (X_latency - μ_baseline) / σ",
                        behavior: "При Z > 1.8 клиент обычно начинает интеллектуализировать или менять тему."
                    },
                    { 
                        title: "Hysteresis Index", 
                        content: "Скорость 'застревания' системы. Чем выше индекс, тем сильнее психика держится за защиты прошлого.",
                        math: "H = ∫(State_path) dA - (Potential_Energy)",
                        behavior: "Высокий индекс требует медленной, поддерживающей работы (Ст. 17.2)."
                    },
                    { 
                        title: "NeuroSync (Когерентность)", 
                        content: "Связь Ум-Тело. Если клиент говорит о росте, но выбирает 'Живот/Страх' — сигнал расщеплен.",
                        math: "Sync = ∑(V_word ∩ V_soma) / N",
                        behavior: "При Sync < 40% вербальные инсайты клиента не будут иметь терапевтического эффекта."
                    }
                ]}
            />

            {/* Chapter 2: Metaphors for Psychology */}
            <AtlasChapter 
                title="Атлас Метафор" 
                icon="🌳" 
                color="emerald"
                sections={[
                    { title: t.domains.foundation, content: ax.m_foundation },
                    { title: t.domains.agency, content: ax.m_agency },
                    { title: t.domains.money, content: ax.m_resource },
                    { title: "Энтропия", content: ax.m_entropy },
                    { title: "NeuroSync", content: ax.m_neurosync }
                ]}
            />

            {/* Chapter 3: Transference & Alliance */}
            <AtlasChapter 
                title="Динамика Альянса" 
                icon="🎭" 
                sections={[
                    { 
                        title: "Маниакальная Защита", 
                        content: "Высокая воля при низком фундаменте. Клиент 'бежит' по тесту, имитируя всемогущество.",
                        behavior: "В сессии: обесценивание глубины, спешка, запрос на 'волшебную таблетку'."
                    },
                    { 
                        title: "Соматическая Стена", 
                        content: "Тотальное отсутствие телесного отклика (S0). Диссоциация как способ выживания.",
                        behavior: "В сессии: 'ничего не чувствую', пустой взгляд, идеальная вежливость."
                    },
                    { 
                        title: "Системное Слепое Пятно", 
                        content: "Исключение паттернов лояльности. Система видит конфликт, клиент — нет.",
                        behavior: "В сессии: внезапная потеря нити разговора при упоминании родителей."
                    }
                ]}
            />

            <footer className="pt-16 pb-12 border-t border-slate-900 text-center space-y-4">
                <div className="inline-block px-4 py-1.5 bg-indigo-950/30 border border-indigo-500/30 rounded-full">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em]">SOVEREIGN_PROTOCOL_CERTIFIED</span>
                </div>
                <p className="text-[7px] font-mono text-slate-700 uppercase tracking-[0.5em] leading-relaxed">
                    Beyond Probabilities // Deterministic Insight<br/>
                    Genesis OS Development Group © 2025
                </p>
            </footer>
        </div>
    </div>
  );
};
