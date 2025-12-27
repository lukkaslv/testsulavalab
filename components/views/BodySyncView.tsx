import { memo } from 'react';
import { Translations } from '../../types';

interface BodySyncViewProps {
  lang: 'ru' | 'ka';
  t: Translations;
  onSync: (sensation: string) => void;
}

export const BodySyncView = memo<BodySyncViewProps>(({ lang, t, onSync }) => {
  return (
     <div className="py-10 text-center px-4 space-y-8 animate-in h-full flex flex-col justify-center bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-500 animate-pulse-slow" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-500 animate-pulse-slow" style={{ animationDelay: '1s' }} />
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-500 animate-pulse-slow" style={{ animationDelay: '2s' }} />
           </svg>
        </div>

        <div className="relative w-40 h-40 mx-auto flex items-center justify-center z-10">
           <div className="absolute inset-0 bg-indigo-500/5 rounded-full animate-pulse-slow"></div>
           <div className="absolute inset-8 bg-indigo-500/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
           
           <div className="w-28 h-28 rounded-full bg-slate-950 flex flex-col items-center justify-center text-indigo-400 border-4 border-slate-100 shadow-2xl z-10 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-20"></div>
             <span className="text-3xl mb-1 animate-pulse">📡</span>
             <span className="text-[8px] font-mono uppercase tracking-widest text-indigo-400/70">{lang === 'ka' ? 'კავშირი' : 'СВЯЗЬ'}</span>
             
             <svg className="absolute inset-0 w-full h-full animate-spin-slow opacity-30" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
             </svg>
           </div>
        </div>

        <div className="space-y-2 z-10">
           <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight">{t.sync.title}</h3>
           <p className="text-sm text-slate-500 font-medium leading-relaxed italic">{t.sync.desc}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 z-10 px-2">
           {['s0', 's1', 's2', 's3', 's4'].map((s) => (
              <button 
                key={s} 
                onClick={() => onSync(s)}
                className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm font-bold text-[10px] uppercase hover:border-indigo-500 transition-all active:scale-95 text-slate-700"
              >
                 {t.sync[s as keyof typeof t.sync]}
              </button>
           ))}
        </div>
        
        <p className="text-[10px] text-slate-400 font-medium italic z-10">{t.sync.guidance_tip}</p>
     </div>
  );
});
