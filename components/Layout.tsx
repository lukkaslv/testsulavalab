import React, { memo, useEffect, useRef, useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { SYSTEM_METADATA } from '../constants';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Генезис: Суверенная Оболочка v19.0
 * Соответствие: Ст. 12 (Языковой Суверенитет)
 */
export const Layout = memo<LayoutProps>(({ children }) => {
  const { handleReset, t, view, networkReport } = useAppContext();
  const mainRef = useRef<HTMLElement>(null);
  const [showNetworkStatus, setShowNetworkStatus] = useState(false);

  useEffect(() => {
    if (mainRef.current) { mainRef.current.scrollTop = 0; }
  }, [view]);

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative h-full bg-transparent text-slate-100 overflow-hidden">
      <header className="px-5 py-4 flex justify-between items-center z-[60] relative shrink-0 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Logo size="sm" animate={false} />
          <div className="flex flex-col">
            <h1 className="font-black text-lg tracking-tight leading-none text-white">
              ГЕНЕЗИС <span className="text-indigo-500">СИСТЕМА</span>
            </h1>
            <h2 className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">
              {SYSTEM_METADATA.CODENAME}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setShowNetworkStatus(!showNetworkStatus)}
                className={`flex items-center gap-1.5 px-3 h-8 rounded-lg border transition-all ${networkReport.isSovereign ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
            >
                <div className={`w-1.5 h-1.5 rounded-full ${networkReport.isSovereign ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></div>
                <span className="font-black text-[9px] uppercase tracking-widest">{networkReport.isSovereign ? 'Суверен' : 'Аудит'}</span>
            </button>
          <div className="px-3 h-8 flex items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 font-black text-[9px] text-indigo-400">
            RU
          </div>
        </div>

        {showNetworkStatus && (
            <div className="absolute top-full left-0 right-0 bg-slate-900 border-b border-white/10 p-4 animate-in-down z-50 shadow-2xl">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Сетевой Аудит (Ст. 11.3)</span>
                    <span className="text-[10px] font-mono text-emerald-400">0 БАЙТ УТЕЧКИ</span>
                </div>
                <p className="text-[9px] text-slate-400 italic leading-snug">
                    Все вычисления производятся локально. Входящие запросы ограничены доверенными доменами.
                </p>
            </div>
        )}
      </header>
      
      <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth z-10 no-scrollbar">
        <div className="px-5 py-6 pb-32">
          {children}
        </div>
      </main>
      
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 bg-slate-950/90 backdrop-blur-2xl border-t border-white/5 z-[70] flex justify-between items-center rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col">
            <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">{t.ui.system_build}</span>
            <span className="text-[10px] font-mono font-black text-slate-400 tracking-tighter">V{SYSTEM_METADATA.VERSION}</span>
        </div>
        <button 
          onClick={() => handleReset(false)} 
          className="text-[9px] font-black uppercase tracking-[0.2em] bg-slate-900 px-4 py-2 rounded-xl border border-white/5 transition-all text-slate-400 hover:text-white active:scale-95"
        >
          {t.ui.reset_session_btn}
        </button>
      </footer>
    </div>
  );
});