
import React, { useState, useEffect } from 'react';
import { PlatformBridge } from '../../utils/helpers';
import { useAppContext } from '../../hooks/useAppContext';

interface DevSanctuaryViewProps {
  onBack: () => void;
}

export const DevSanctuaryView: React.FC<DevSanctuaryViewProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<'intro' | 'breathing' | 'complete'>('intro');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (phase === 'breathing') {
        interval = setInterval(() => {
            setTimer(t => {
                if (t >= 60) {
                    setPhase('complete');
                    PlatformBridge.haptic.notification('success');
                    return 60;
                }
                if (t % 10 === 0) PlatformBridge.haptic.impact('soft');
                return t + 1;
            });
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="h-full bg-slate-950 flex flex-col items-center justify-center p-8 font-mono animate-in text-center select-none overflow-hidden">
        {phase === 'intro' && (
            <div className="space-y-8 animate-in">
                <div className="w-20 h-20 bg-teal-500/10 rounded-[2rem] border-2 border-teal-500/30 flex items-center justify-center text-4xl mx-auto shadow-2xl">🌊</div>
                <div className="space-y-4">
                    <h2 className="text-lg font-black text-teal-400 uppercase tracking-[0.3em]">ENGINEERING_SANCTUARY</h2>
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                        Ты работал с паттернами сопротивления. Система зафиксировала когнитивную нагрузку. Пройди декомпрессию перед возвращением в реальность.
                    </p>
                </div>
                <button 
                    onClick={() => { setPhase('breathing'); PlatformBridge.haptic.impact('medium'); }}
                    className="w-full py-5 bg-teal-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
                >
                    ЗАПУСТИТЬ ЦИКЛ (60s)
                </button>
                <button onClick={onBack} className="text-[9px] text-slate-600 font-black uppercase tracking-widest pt-4 block w-full">ПРОПУСТИТЬ</button>
            </div>
        )}

        {phase === 'breathing' && (
            <div className="space-y-12 animate-in w-full max-w-xs">
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 bg-teal-500/5 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
                    <div className="w-32 h-32 rounded-full border-4 border-teal-500/20 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 bg-teal-500/30 transition-all duration-1000" style={{ height: `${(timer/60)*100}%` }}></div>
                        <span className="text-2xl font-black text-teal-400 relative z-10">{60 - timer}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest animate-pulse">
                        {timer % 8 < 4 ? 'ВДОХ' : 'ВЫДОХ'}
                    </p>
                    <p className="text-[8px] text-slate-500 uppercase">Оставь код внутри системы. Твоё Я отдельно.</p>
                </div>
            </div>
        )}

        {phase === 'complete' && (
            <div className="space-y-10 animate-in">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] border-2 border-emerald-500/30 flex items-center justify-center text-4xl mx-auto shadow-2xl">✨</div>
                <div className="space-y-3">
                    <h2 className="text-lg font-black text-emerald-400 uppercase tracking-[0.3em]">ЦЕЛОСТНОСТЬ ВОССТАНОВЛЕНА</h2>
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                        Связь разорвана. Ты свободен от системных проекций.
                    </p>
                </div>
                <button 
                    onClick={onBack}
                    className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
                >
                    ВЕРНУТЬСЯ
                </button>
            </div>
        )}

        <footer className="absolute bottom-10 left-0 right-0 opacity-10">
             <p className="text-[7px] uppercase tracking-[0.5em]">Engineering Mental Health Protocol Art. 29</p>
        </footer>
    </div>
  );
};
