
import React, { useState, useEffect } from 'react';
import { AnalysisResult, Translations, PhaseType, TaskKey } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { StorageService, STORAGE_KEYS } from '../../services/storageService';

interface IntegrationProtocolViewProps {
  t: Translations;
  result: AnalysisResult;
  onBack: () => void;
}

const PhaseHeader = ({ phase, t }: { phase: PhaseType, t: Translations }) => {
    const phaseKey = phase as keyof typeof t.roadmap.phases;
    const title = t.roadmap.phases[phaseKey] || phase;
    
    let colorClass = 'text-white';
    let subColorClass = 'text-slate-500';
    let borderColor = 'border-slate-800';
    let bgGradient = 'from-slate-900 to-slate-950';

    if (phase === 'SANITATION') {
        colorClass = 'text-amber-400';
        subColorClass = 'text-amber-600';
        borderColor = 'border-amber-900/30';
        bgGradient = 'from-amber-950/20 to-slate-950';
    } else if (phase === 'STABILIZATION') {
        colorClass = 'text-indigo-400';
        subColorClass = 'text-indigo-600';
        borderColor = 'border-indigo-900/30';
        bgGradient = 'from-indigo-950/20 to-slate-950';
    } else if (phase === 'EXPANSION') {
        colorClass = 'text-emerald-400';
        subColorClass = 'text-emerald-600';
        borderColor = 'border-emerald-900/30';
        bgGradient = 'from-emerald-950/20 to-slate-950';
    }

    return (
        <div className={`p-6 rounded-[2rem] border ${borderColor} bg-gradient-to-b ${bgGradient} mb-6 relative overflow-hidden shadow-xl`}>
            <div className="relative z-10">
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${subColorClass}`}>ACTIVE_PHASE</span>
                <h2 className={`text-2xl font-black italic uppercase tracking-tighter ${colorClass} mt-1`}>{title}</h2>
                <p className="text-[10px] text-slate-400 font-medium mt-3 leading-relaxed max-w-[250px]">
                    "Следуйте протоколу последовательно. Один день — одна задача. Не ускоряйте процесс."
                </p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl pointer-events-none filter grayscale">
                {phase === 'SANITATION' ? '🧹' : phase === 'STABILIZATION' ? '⚓' : '🚀'}
            </div>
        </div>
    );
};

interface DayCardProps {
    day: number;
    taskKey: string;
    targetMetric: string;
    t: Translations;
    isDone: boolean;
    onToggle: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, taskKey, targetMetric, t, isDone, onToggle }) => {
    // Correctly accessing the task translation
    const taskText = (t.roadmap.tasks as any)[taskKey] || "Task detail unavailable.";
    const isLocked = day > 1 && !isDone; // Simple visual cue, strictly logic handles check

    return (
        <div 
            onClick={onToggle}
            className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                isDone 
                ? 'bg-emerald-950/20 border-emerald-500/30 shadow-lg' 
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
            }`}
        >
            <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-colors ${
                        isDone ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
                    }`}>
                        {isDone ? '✓' : day}
                    </div>
                    <div>
                        <span className={`text-[8px] font-black uppercase tracking-widest block ${isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                            DAY {day.toString().padStart(2, '0')} // {targetMetric}
                        </span>
                    </div>
                </div>
                {isDone && <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded uppercase font-black tracking-wider">COMPLETE</span>}
            </div>
            
            <p className={`mt-3 text-[11px] font-bold leading-relaxed transition-colors ${isDone ? 'text-emerald-100 line-through opacity-60' : 'text-slate-300'}`}>
                {taskText}
            </p>

            {/* Checkbox Visual */}
            <div className={`absolute bottom-4 right-4 w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                isDone ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700'
            }`}>
                {isDone && <span className="text-white text-xs font-bold">✓</span>}
            </div>
        </div>
    );
};

export const IntegrationProtocolView: React.FC<IntegrationProtocolViewProps> = ({ t, result, onBack }) => {
    const { roadmap } = result;
    const phase = roadmap && roadmap.length > 0 ? roadmap[0].phase : 'STABILIZATION';
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    // Load progress from local storage
    useEffect(() => {
        try {
            const saved = StorageService.load<string[]>(`roadmap_progress_${result.shareCode}`, []);
            setCompletedTasks(saved);
        } catch (e) {
            console.error("Failed to load roadmap progress", e);
        }
    }, [result.shareCode]);

    const handleToggleTask = (taskKey: string) => {
        PlatformBridge.haptic.selection();
        const newCompleted = completedTasks.includes(taskKey)
            ? completedTasks.filter(k => k !== taskKey)
            : [...completedTasks, taskKey];
        
        setCompletedTasks(newCompleted);
        StorageService.save(`roadmap_progress_${result.shareCode}`, newCompleted);
        
        if (!completedTasks.includes(taskKey)) {
            PlatformBridge.haptic.notification('success');
        }
    };

    const progressPercent = Math.round((completedTasks.length / 7) * 100);

    return (
        <div className="h-full bg-[#020617] text-slate-300 flex flex-col font-mono animate-in select-none">
            <header className="flex justify-between items-center p-4 border-b border-slate-900 shrink-0 bg-[#020617]/90 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="w-10 h-10 bg-slate-900 rounded-xl border border-slate-800 text-slate-500 hover:text-white transition-all active:scale-90 flex items-center justify-center">
                        ←
                    </button>
                    <div>
                        <h1 className="text-xs font-black uppercase tracking-widest text-white">{t.roadmap.title}</h1>
                        <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">{t.roadmap.subtitle}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black uppercase text-indigo-400 tracking-widest">{progressPercent}% DONE</span>
                    <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-24">
                <PhaseHeader phase={phase} t={t} />
                
                <div className="space-y-3 relative">
                    {/* Vertical connector line */}
                    <div className="absolute left-[26px] top-6 bottom-6 w-0.5 bg-slate-800/50 -z-10"></div>
                    
                    {roadmap.map((step: any, index: number) => (
                        <DayCard 
                            key={step.taskKey}
                            day={index + 1}
                            taskKey={step.taskKey}
                            targetMetric={step.targetMetricKey}
                            t={t}
                            isDone={completedTasks.includes(step.taskKey)}
                            onToggle={() => handleToggleTask(step.taskKey)}
                        />
                    ))}
                </div>

                <div className="mt-8 p-6 bg-slate-900/30 rounded-[2rem] border border-slate-800 text-center space-y-2">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest">
                        PROTOCOL_INTEGRITY_CHECK
                    </p>
                    <p className="text-[8px] text-slate-600 italic">
                        "Изменения нейронных связей требуют времени и повторения. Не переходите к следующему дню, пока не почувствуете завершенность."
                    </p>
                </div>
            </div>
        </div>
    );
};
