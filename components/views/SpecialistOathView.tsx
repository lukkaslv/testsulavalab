
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Translations } from '../../types';
import { PlatformBridge } from '../../utils/helpers';

interface SpecialistOathViewProps {
  t: Translations;
  onComplete: () => void;
}

const FleurDeLis = () => (
    <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2C11.5,4 10,5.5 8,6C9.5,7 10.5,8.5 11,10C10,10 8,9.5 7,8C6.5,10 7.5,12 9,13.5C7,13.5 5,12.5 4,11C4,14 6,17 9,18C8,19 6.5,19.5 5,19.5C7,21 10,22 12,22C14,22 17,21 19,19.5C17.5,19.5 16,19 15,18C18,17 20,14 20,11C19,12.5 17,13.5 15,13.5C16.5,12 17.5,10 17,8C16,9.5 14,10 13,10C13.5,8.5 14.5,7 16,6C14,5.5 12.5,4 12,2Z" />
    </svg>
);

export const SpecialistOathView: React.FC<SpecialistOathViewProps> = ({ t, onComplete }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSealing, setIsSealing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);
  const oath = t.specialist_oath;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStartSeal = useCallback(() => {
      if (step < oath.oath_articles.length || progressRef.current >= 100) return;
      
      setIsSealing(true);
      PlatformBridge.haptic.impact('medium');

      if (timerRef.current) clearInterval(timerRef.current);
      
      timerRef.current = setInterval(() => {
          setProgress(p => {
              const next = p + 2;
              progressRef.current = next;
              
              if (next >= 100) {
                  if (timerRef.current) clearInterval(timerRef.current);
                  PlatformBridge.haptic.notification('success');
                  localStorage.setItem('genesis_oath_signed', 'true');
                  setTimeout(onComplete, 800);
                  return 100;
              }
              
              if (next % 10 === 0) PlatformBridge.haptic.impact('light');
              return next;
          });
      }, 40);
  }, [step, oath.oath_articles.length, onComplete]);

  const handleEndSeal = useCallback(() => {
      if (progressRef.current < 100) {
          setIsSealing(false);
          setProgress(0);
          progressRef.current = 0;
          if (timerRef.current) clearInterval(timerRef.current);
          PlatformBridge.haptic.impact('heavy');
      }
  }, []);

  return (
    <div className="h-full bg-[#020617] text-slate-300 p-8 flex flex-col items-center justify-center font-serif animate-in select-none relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.03)_0%,transparent_70%)]"></div>

        <header className="text-center space-y-2 mb-12 relative z-10">
            <h1 className="text-2xl font-black text-amber-500 italic uppercase tracking-widest">{oath.title}</h1>
            <p className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.4em]">{oath.subtitle}</p>
        </header>

        <div className="flex-1 w-full max-w-sm flex flex-col justify-center space-y-8 relative z-10">
            <div className={`text-center transition-all duration-700 ${isSealing ? 'opacity-20 scale-95 blur-sm' : 'opacity-100'}`}>
                <span className="text-[10px] font-mono font-black text-amber-600 uppercase tracking-[0.3em] block mb-8">{oath.pledge_label}</span>
                
                <div className="space-y-6 min-h-[220px] flex flex-col justify-center border-l border-amber-500/10 pl-6">
                    {oath.oath_articles.map((article: string, i: number) => (
                        <p 
                            key={i} 
                            className={`text-[13px] leading-relaxed transition-all duration-1000 ${i <= step ? 'opacity-100 translate-x-0 text-slate-100' : 'opacity-0 -translate-x-4'}`}
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            — {article}
                        </p>
                    ))}
                </div>
            </div>

            {step < oath.oath_articles.length ? (
                <button 
                    onClick={() => { setStep(s => s + 1); PlatformBridge.haptic.impact('medium'); }}
                    className="w-full py-5 bg-amber-600/5 border border-amber-600/20 text-amber-500 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-amber-600/10 transition-all active:scale-[0.98]"
                >
                    Я ПРИНИМАЮ УСЛОВИЯ
                </button>
            ) : (
                <div className="flex flex-col items-center space-y-10 animate-in">
                    {/* Исправленный контейнер: строгая центровка без внешних отступов */}
                    <div className="relative w-40 h-40 flex items-center justify-center overflow-visible">
                        {/* Progress Ring - Добавлен точный viewBox и origin-center */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 origin-center overflow-visible" viewBox="0 0 160 160">
                            <circle cx="80" cy="80" r="76" fill="none" stroke="rgba(217,119,6,0.05)" strokeWidth="2" />
                            <circle 
                                cx="80" cy="80" r="76" fill="none" stroke="#d97706" strokeWidth="3" 
                                strokeDasharray="477.5" 
                                strokeDashoffset={477.5 - (477.5 * progress) / 100}
                                strokeLinecap="round"
                                className="transition-all duration-100 ease-linear"
                                style={{ filter: 'drop-shadow(0 0 8px rgba(217,119,6,0.4))' }}
                            />
                        </svg>
                        
                        {/* The Seal Button - Абсолютное центрирование в родителе */}
                        <button 
                            onMouseDown={handleStartSeal}
                            onMouseUp={handleEndSeal}
                            onMouseLeave={handleEndSeal}
                            onTouchStart={handleStartSeal}
                            onTouchEnd={handleEndSeal}
                            onTouchCancel={handleEndSeal}
                            style={{ touchAction: 'none' }}
                            className={`relative z-10 w-28 h-28 rounded-full transition-all duration-500 flex items-center justify-center overflow-hidden
                                ${isSealing 
                                    ? 'scale-110 shadow-[0_0_60px_rgba(217,119,6,0.4)]' 
                                    : 'shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)]'}
                                bg-gradient-to-br from-amber-500 to-amber-700
                                border-4 border-amber-400/30
                            `}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
                            <FleurDeLis />
                            <div className={`absolute inset-0 bg-white transition-opacity duration-100 ${isSealing ? 'opacity-10' : 'opacity-0'}`}></div>
                        </button>
                    </div>
                    
                    <div className="text-center space-y-2">
                        <p className={`text-[10px] font-mono font-black uppercase tracking-[0.3em] transition-colors duration-500 ${progress === 100 ? 'text-emerald-400' : 'text-amber-500'}`}>
                            {progress === 100 ? oath.completion_msg : isSealing ? 'ИДЕТ СКРЕПЛЕНИЕ ПЕЧАТЬЮ' : oath.seal_instruction}
                        </p>
                        <div className="h-1 w-32 bg-slate-900 rounded-full mx-auto overflow-hidden opacity-40">
                             <div className="h-full bg-amber-600" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <footer className="mt-12 text-center opacity-20 relative z-10">
            <p className="text-[7px] uppercase tracking-[0.5em] text-slate-500">Specialist Integrity Registry</p>
            <p className="text-[6px] font-mono mt-2 text-slate-600 uppercase tracking-widest">Protocol Art. 30 Compliant</p>
        </footer>
    </div>
  );
};
