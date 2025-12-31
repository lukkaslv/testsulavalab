
import React, { useState } from 'react';
import { Translations } from '../../types';
import { SYSTEM_METADATA } from '../../constants';
import { PlatformBridge } from '../../utils/helpers';

interface SystemChangelogViewProps {
  t: Translations;
  onBack: () => void;
}

interface ChangelogEntry {
    version: string;
    date: string;
    type: 'MAJOR' | 'MINOR' | 'PATCH';
    lawReference: string;
    changes: string[];
    geneticDrift?: string;
}

const entries: ChangelogEntry[] = [
    {
        version: "12.8.0-TENSEGRITY",
        date: "2026-01-28",
        type: 'MINOR',
        lawReference: "Art. 4 (Wholeness), Art. 21 (Anti-Fragility)",
        changes: [
            "Внедрен модуль Tensegrity Structure (Архитектура Напряжения).",
            "Физическая симуляция баланса 'Сжатие (Foundation) vs Натяжение (Agency)'.",
            "Метрика Structural Strain: риск имплозии или ригидности системы."
        ],
        geneticDrift: "Переход от топографии к структурной инженерии психики."
    },
    {
        version: "12.7.0-RELIEF",
        date: "2026-01-24",
        type: 'MINOR',
        lawReference: "Art. 4 (Integrity), Art. 3 (Physics)",
        changes: [
            "Внедрен модуль Relief Map (Топография Воли).",
            "Визуализация ландшафта потенциальной энергии: Пики сопротивления vs Долины ресурса.",
            "Метрика Ruggedness Index: сложность 'путешествия' для психики."
        ],
        geneticDrift: "Переход от абстрактных векторов к физической метафоре местности."
    },
    {
        version: "12.6.0-ATTRACTOR",
        date: "2026-01-20",
        type: 'MINOR',
        lawReference: "Art. 5 (Butterfly Effect), Art. 7 (Emergence)",
        changes: [
            "Внедрен модуль Strange Attractor (Странный Аттрактор).",
            "3D-проекция фазового пространства личности на основе уравнений Лоренца.",
            "Метрика Lyapunov Exponent: определение режима (Хаос/Порядок)."
        ],
        geneticDrift: "Синтез психометрики и теории хаоса для визуализации 'формы личности'."
    },
    {
        version: "12.5.0-MOIRE",
        date: "2026-01-16",
        type: 'MINOR',
        lawReference: "Art. 4 (Wholeness), Art. 3 (Physics)",
        changes: [
            "Внедрен модуль Interference Moire (Муар Интерференции).",
            "Визуализация наложения волн: Намерение (Agency) vs Сопротивление (Shadow).",
            "Метрика Nullification Index: расчет энергии, теряемой на внутренний конфликт."
        ],
        geneticDrift: "Переход от анализа частей к анализу волнового взаимодействия."
    },
    {
        version: "12.4.0-HYSTERESIS",
        date: "2026-01-12",
        type: 'MINOR',
        lawReference: "Art. 5 (Sensitivity), Art. 3 (Physics)",
        changes: [
            "Внедрен модуль Hysteresis Loop (Петля Гистерезиса).",
            "Визуализация инерции психики: траектория 'Стресс vs Восстановление'.",
            "Расчет Dissipation Index: метрика потери энергии на обслуживание травмы."
        ],
        geneticDrift: "Переход от статических метрик к динамике упругости системы."
    },
    {
        version: "12.3.0-EKG",
        date: "2026-01-08",
        type: 'MINOR',
        lawReference: "Art. 4 (Living Organism), Art. 6 (Feedback)",
        changes: [
            "Внедрен модуль Session EKG (ЭКГ Сессии).",
            "Визуализация ритма напряжения: Латентность + Соматика в динамике.",
            "Детекторы ритма: Flatline (Диссоциация), Arrhythmia (Тревога), Stable Flow."
        ],
        geneticDrift: "Интеграция временной динамики в статический профиль."
    },
    {
        version: "12.2.0-HELIX",
        date: "2026-01-05",
        type: 'MINOR',
        lawReference: "Art. 7 (Emergence), Art. 4 (Holistic)",
        changes: [
            "Внедрена визуализация 'Спираль Когерентности': ДНК личности.",
            "Наложение слоев: Сознательный выбор (Alpha) vs Бессознательная реакция (Beta).",
            "Визуальная детекция диссоциативных разрывов (Gap Analysis) на временной шкале."
        ],
        geneticDrift: "Синтез двух потоков данных в единую биологическую метафору."
    },
    {
        version: "12.0.0-ATMOSPHERE",
        date: "2026-01-01",
        type: 'MAJOR',
        lawReference: "Art. 4 (Single Organism), Art. 6 (Feedback Loops)",
        changes: [
            "Внедрен модуль Atmospheric Biofeedback: интерфейс реагирует на психометрическое давление в реальном времени.",
            "Динамический градиент: цвет фона отражает состояние потока, замирания или турбулентности.",
            "Синхронизация ритма: пульсация Somatic Anchor подстраивается под темп ответов клиента."
        ],
        geneticDrift: "Переход от статического UI к иммерсивной био-среде."
    },
    {
        version: "11.9.0-ANCESTRY",
        date: "2025-12-31",
        type: 'MINOR',
        lawReference: "Art. 4 (Holistic), Art. 20 (Anti-Optimization)",
        changes: [
            "Внедрен Интерактивный Протокол Расстановок: Модуль Systemic Field теперь позволяет моделировать интервенции.",
            "Симуляция 'Принятия': Клик по узлу рассчитывает снижение энтропии поля.",
            "Визуализация потока: Трансформация связей при проработке исключенного."
        ],
        geneticDrift: "Сдвиг от статической диагностики к динамическому моделированию поля."
    },
    {
        version: "11.8.0-INTERRUPT",
        date: "2025-12-30",
        type: 'MINOR',
        lawReference: "Art. 6 (Feedback Loops), Art. 17 (No Harm)",
        changes: [
            "Активация протокола Mirror Break: Активная интервенция при детекции опасных состояний.",
            "Новые детекторы реального времени: Somatic Wakeup (Диссоциация) и Manic Break (Маниакальная защита).",
            "Блокировка теста до стабилизации состояния пользователя."
        ],
        geneticDrift: "Переход от наблюдения к активной регуляции гомеостаза."
    },
    {
        version: "11.7.0-CONTEXT",
        date: "2025-12-29",
        type: 'MINOR',
        lawReference: "Art. 5 (Initial Conditions), Art. 3 (Clinical Validity)",
        changes: [
            "Внедрен Протокол Контекстного Резонанса: Пользователь задает контекст сессии (Норма, Кризис, Нагрузка).",
            "Модификация ядра: Z-Score и Энтропия теперь калибруются относительно выбранного контекста.",
            "Обновлен Dashboard: Добавлен селектор состояния."
        ],
        geneticDrift: "Переход от линейной оценки к ситуативной адаптивности."
    },
    {
        version: "11.6.0-COHERENCE",
        date: "2025-12-28",
        type: 'MINOR',
        lawReference: "Art. 6 (Feedback Loops), Art. 4.3 (Holistic)",
        changes: [
            "Активация протокола Adaptive Pacing: система принудительно замедляет интерфейс при обнаружении спешки.",
            "Внедрен 'Breathing UI': визуальная пауза для синхронизации ритма.",
            "Обновлен алгоритм детекции Robotic Timing для учета серий быстрых ответов."
        ],
        geneticDrift: "Сдвиг фокуса с пассивного измерения на активную регуляцию состояния."
    },
    {
        version: "11.5.0-CRYPTOGRAPHY",
        date: "2025-12-26",
        type: 'MINOR',
        lawReference: "Art. 22 (Evolution), Art. 7 (Emergence)",
        changes: [
            "Внедрен модуль Somatic Spectrum: визуализация частотного распределения телесных реакций.",
            "Обновлен протокол Scan Detail: добавлена вкладка SOMA для глубокого анализа телесности.",
            "Синхронизация данных BodySync 2.0 с клиническим отчетом."
        ],
        geneticDrift: "Переход от сбора соматических данных к их структурной интерпретации."
    },
    {
        version: "11.4.0-COHERENCE",
        date: "2025-12-24",
        type: 'MINOR',
        lawReference: "Art. 6 (Feedback Loops), Art. 7.1",
        changes: [
            "Внедрение протокола Adaptive Pacing UI: принудительная регуляция ритма при обнаружении Robotic Timing.",
            "BodySync 2.0: Переход от текстовых кнопок к интерактивной Соматической Топографии.",
            "Haptic Signatures v1.0: Уникальные тактильные паттерны для разных зон тела."
        ],
        geneticDrift: "Синхронизация цифрового ввода с биологическими ритмами пользователя."
    },
    {
        version: "11.3.1-IMMUNITY",
        date: "2025-12-21",
        type: 'PATCH',
        lawReference: "Art. 26.2 (Bug Protocol)",
        changes: [
            "Устранена критическая ошибка импорта языкового пакета (Translations Binding).",
            "Integrity Service: добавлен ESM.sh в белый список для сред разработки.",
            "Принудительная рекалибровка модуля локализации."
        ],
        geneticDrift: "Стабилизация синтаксического ядра."
    },
    {
        version: "11.3.0-ADAMANTINE",
        date: "2025-12-20",
        type: 'MINOR',
        lawReference: "Art. 28, 26",
        changes: [
            "Активация протокола 'Adamantine Anchor': глубокий аудит целостности.",
            "Реализация активного мониторинга метаболизма данных (Storage Check).",
            "Защита от внедрения сторонних скриптов в DOM (Structure Guard)."
        ],
        geneticDrift: "Усиление иммунной системы приложения против внешних инъекций."
    },
    {
        version: "11.2.0-BIFURCATION",
        date: "2025-12-15",
        type: 'MINOR',
        lawReference: "Art. 5, 18",
        changes: [
            "Внедрение карты бифуркаций (Bifurcation Map) в Topology View.",
            "Визуализация точек слома архетипической стратегии.",
            "Обновление протокола прозрачности для отображения динамики сессии."
        ],
        geneticDrift: "Повышена чувствительность к микро-сдвигам стратегии (Butterfly Index)."
    },
    {
        version: "11.1.0-EMERGENCE",
        date: "2025-12-10",
        type: 'MINOR',
        lawReference: "Art. 7, 21",
        changes: [
            "Реализация визуализации эмергентных состояний (Emergence Tab) в Pro Hub.",
            "Удаление устаревшего монолитного сервиса (Code Sanitation).",
            "Усиление протокола отображения сложных паттернов сопротивления."
        ],
        geneticDrift: "Калибровка чувствительности детектора 'Маниакальной брони' и 'Соматической стены'."
    },
    {
        version: "11.0.0-SOVEREIGN",
        date: "2025-12-05",
        type: 'MAJOR',
        lawReference: "Art. 2, 4, 13",
        changes: [
            "Внедрение Sovereign Kernel v11.0: полный отказ от внешних API.",
            "Реализация Adamantine Anchor (Ст. 28) для контроля целостности ядра.",
            "Система переведена в режим Local-First с аппаратным шифрованием."
        ],
        geneticDrift: "Миграция весов: Sigmoid-коэффициент адаптирован под Z-Score 2.0."
    },
    {
        version: "10.2.1-ADAMANTINE",
        date: "2025-11-20",
        type: 'PATCH',
        lawReference: "Art. 5.1",
        changes: [
            "Калибровка Butterfly Effect Index: снижение шума на 12%.",
            "Исправлен баг 'ложной латентности' при переключении доменов.",
            "Усиление Somatic Firewall для защиты от симуляции отклика."
        ]
    },
    {
        version: "10.0.0-GENESIS",
        date: "2025-10-15",
        type: 'MAJOR',
        lawReference: "Art. 1, 3",
        changes: [
            "Первая публичная версия детерминированного ядра.",
            "Запуск 5-осевой матрицы Resonance Lattice.",
            "Реализация 6 базовых клинических архетипов."
        ],
        geneticDrift: "Начальное состояние: Базовые веса установлены согласно клиническому стандарту."
    }
];

// Fix: Type VersionCard as React.FC to handle the 'key' prop and ensure proper typing for 't'
const VersionCard: React.FC<{ entry: ChangelogEntry; t: Translations }> = ({ entry, t }) => {
    const cv = t.changelog;
    const typeLabel = cv.types[entry.type];
    
    const typeColor = 
        entry.type === 'MAJOR' ? 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5' :
        entry.type === 'MINOR' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' :
        'text-amber-400 border-amber-500/30 bg-amber-500/5';

    return (
        <div className="relative pl-8 pb-10 group">
            {/* Timeline Line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-800 group-last:bg-transparent"></div>
            {/* Timeline Dot */}
            <div className={`absolute left-[-4px] top-1 w-2 h-2 rounded-full border-2 border-slate-950 transition-all duration-500 ${entry.version === SYSTEM_METADATA.VERSION ? 'bg-indigo-500 scale-150 shadow-[0_0_10px_#6366f1]' : 'bg-slate-700'}`}></div>

            <div className="space-y-4">
                <header className="flex flex-wrap items-center gap-3">
                    <span className="text-[11px] font-black text-white font-mono tracking-tighter">v.{entry.version}</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase">{entry.date}</span>
                    <div className={`px-2 py-0.5 border rounded text-[7px] font-black uppercase tracking-widest ${typeColor}`}>
                        {typeLabel}
                    </div>
                </header>

                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-[1.8rem] space-y-4 shadow-lg">
                    <div className="space-y-2">
                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{cv.legal_compliance}: <span className="text-slate-300">{entry.lawReference}</span></span>
                        <ul className="space-y-2">
                            {entry.changes.map((c, i) => (
                                <li key={i} className="flex items-start gap-2 text-[10px] text-slate-400 leading-relaxed italic">
                                    <span className="text-indigo-500 mt-1">•</span>
                                    <span>{c}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {entry.geneticDrift && (
                        <div className="pt-4 border-t border-slate-800 space-y-2">
                            <span className="text-[8px] font-black text-amber-500 uppercase tracking-[0.2em]">{cv.genetic_memory}</span>
                            <p className="text-[9px] text-amber-200/70 font-mono italic leading-relaxed">{entry.geneticDrift}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const SystemChangelogView: React.FC<SystemChangelogViewProps> = ({ t, onBack }) => {
  // Fix: Property 'changelog' now exists on Translations type
  const cv = t.changelog;

  return (
    <div className="h-full bg-slate-950 text-slate-300 p-6 overflow-y-auto no-scrollbar font-mono animate-in select-none">
        <header className="mb-10 border-b border-slate-800 pb-6 flex justify-between items-start">
            <div className="space-y-1">
                <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">{cv.title}</h1>
                <p className="text-[8px] font-mono text-amber-400 uppercase tracking-[0.4em]">{cv.subtitle}</p>
            </div>
            <button onClick={onBack} className="p-3 bg-slate-900 rounded-2xl text-white text-xs border border-slate-800 transition-all active:scale-90">✕</button>
        </header>

        <div className="pb-20">
            <div className="bg-indigo-950/20 border border-indigo-500/20 p-6 rounded-[2.5rem] mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl">🕰️</div>
                <p className="text-[10px] leading-relaxed text-indigo-200 italic relative z-10">
                    "Согласно Статье 23 Конституции, любые изменения алгоритма фиксируются в Хронике Эволюции. Целостность прошлого — гарантия точности настоящего."
                </p>
            </div>

            <div className="space-y-2">
                {entries.map((e, i) => (
                    // Fix: React components within map correctly handle key prop when properly typed
                    <VersionCard key={i} entry={e} t={t} />
                ))}
            </div>

            <footer className="mt-10 pt-10 border-t border-slate-900 text-center space-y-3 opacity-30">
                <p className="text-[7px] uppercase tracking-[0.5em]">Genesis OS Lifecycle Tracker</p>
                <p className="text-[6px]">Sovereign Algorithm // Deterministic Proof</p>
            </footer>
        </div>
    </div>
  );
};
