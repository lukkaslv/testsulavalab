import React, { memo, useEffect, useRef } from 'react';
import { useAppContext } from './hooks/useAppContext';
import { SYSTEM_METADATA } from './constants';
import { Logo } from './components/Logo';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * ГЕНЕЗИС: Суверенная Оболочка
 * Соответствие: Ст. 12 (Языковой Суверенитет)
 */
export const Layout = memo<LayoutProps>(({ children }) => {
  const { handleReset, t, history } = useAppContext();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) { mainRef.current.scrollTop = 0; }
  }, [children]);
  
  const canReset = history && history.length > 0;

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative h-full bg-white overflow-hidden">
      <header className="px-5 py-4 flex justify-between items-center z-[60] relative shrink-0 border-b border-slate-100/50 glass-card">
        <div className="flex items-center gap-3">
          <Logo size="md" animate={false} />
          <div className="flex flex-col">
            <h1 className="font-black text-lg tracking-tight leading-none text-slate-900">
              ГЕНЕЗИС <span className="text-indigo-600">СИСТЕМА</span>
            </h1>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              ПСИХОМЕТРИЯ СОПРОТИВЛЕНИЯ
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-3 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 font-black text-[10px] text-slate-800">
            РУ
          </div>
        </div>
      </header>
      
      <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth z-10">
        <div className="px-5 py-6 pb-28">
          {children}
        </div>
      </main>
      
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 glass-card border-t border-slate-100 z-[70] flex justify-between items-center rounded-t-3xl shadow-2xl">
        <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">СБОРКА СИСТЕМЫ</span>
            <span className="text-[9px] font-mono font-bold text-slate-400">v{SYSTEM_METADATA.VERSION}</span>
        </div>
        <button 
          onClick={() => handleReset(false)} 
          disabled={!canReset}
          className="text-[9px] font-black uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-slate-400 hover:bg-slate-100 enabled:hover:text-slate-600"
        >
          {t.ui.reset_session_btn}
        </button>
      </footer>
    </div>
  );
});