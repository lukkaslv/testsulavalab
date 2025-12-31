
import React, { useState, useEffect } from 'react';
import { Translations } from '../../types';
import { PlatformBridge } from '../../utils/helpers';

interface CrisisViewProps {
  t: Translations;
  onExit: () => void;
  shareCode?: string;
}

const BreathingCircle = () => {
    const [scale, setScale] = useState(1);
    const [text, setText] = useState('ВДОХ');

    useEffect(() => {
        const interval = setInterval(() => {
            setScale(s => s === 1 ? 1.5 : 1);
            setText(t => t === 'ВДОХ' ? 'ВЫДОХ' : 'ВДОХ');
            PlatformBridge.haptic.impact('soft');
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-40 h-40 flex items-center justify-center my-8">
            <div 
                className="absolute inset-0 bg-teal-500/10 rounded-full transition-all duration-[4000ms] ease-in-out border border-teal-500/20"
                style={{ transform: `scale(${scale})` }}
            ></div>
            <div 
                className="absolute inset-0 bg-teal-500/5 rounded-full transition-all duration-[4000ms] ease-in-out delay-100"
                style={{ transform: `scale(${scale * 0.8})` }}
            ></div>
            <div className="text-sm font-black text-teal-300 tracking-[0.2em] animate-pulse">
                {text}
            </div>
        </div>
    );
};

const HelplineCard = ({ flag, name, number, desc }: { flag: string; name: string; number: string; desc: string }) => (
    <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/50 shadow-sm text-left flex items-center gap-4 backdrop-blur-md">
        <div className="text-3xl">{flag}</div>
        <div className="flex-1">
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide">{name}</h4>
            <a href={`tel:${number}`} className="text-xl font-black text-teal-400 font-mono tracking-widest my-1 block">{number}</a>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{desc}</p>
        </div>
    </div>
);

export const CrisisView: React.FC<CrisisViewProps> = ({ t, onExit, shareCode }) => {
  const cv = t.crisis_view;

  const copyCode = () => {
      if (shareCode) {
          navigator.clipboard.writeText(shareCode);
          PlatformBridge.haptic.notification('success');
      }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in px-6 text-center bg-slate-950 text-slate-200 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.08)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="space-y-4 max-w-sm relative z-10">
        <div className="w-16 h-16 mx-auto bg-teal-900/20 rounded-full flex items-center justify-center text-2xl border border-teal-500/20 shadow-xl">
            ⚓
        </div>
        
        <h2 className="text-xl font-black uppercase tracking-[0.2em] text-teal-400 leading-tight">
          {cv.title}
        </h2>
        <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-[280px] mx-auto italic">
          "{cv.message}"
        </p>
      </div>

      <BreathingCircle />
      
      <div className="w-full max-w-sm space-y-3 relative z-10">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-2">{cv.recommendation}</p>
        <HelplineCard 
            flag="🇷🇺" 
            name={cv.ru_helpline_name} 
            number={cv.ru_helpline_number} 
            desc={cv.ru_helpline_desc}
        />
        <HelplineCard 
            flag="🆘" 
            name="МЧС Психологи" 
            number="+7 (495) 989-50-50" 
            desc="Экстренная помощь"
        />
      </div>

      {shareCode && (
          <button 
            onClick={copyCode}
            className="w-full max-w-sm p-3 bg-slate-900/50 border border-teal-500/10 rounded-xl relative z-10 flex flex-col items-center gap-1 active:bg-slate-900 transition-colors group"
          >
              <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-teal-500 transition-colors">Токен для специалиста</span>
              <span className="text-[10px] font-mono text-teal-400/70 tracking-widest">{shareCode}</span>
          </button>
      )}

      <button
        onClick={() => {
          PlatformBridge.haptic.notification('success');
          onExit();
        }}
        className="w-full max-w-xs py-5 bg-teal-900/30 text-teal-400 border border-teal-500/30 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 transition-all mt-2 hover:bg-teal-900/50"
      >
        {cv.exit_button_text}
      </button>
      
      <p className="text-[8px] text-slate-600 font-mono absolute bottom-6 opacity-50 uppercase tracking-widest">
          Protocol Art. 17.3 Active // Safety First
      </p>
    </div>
  );
};
