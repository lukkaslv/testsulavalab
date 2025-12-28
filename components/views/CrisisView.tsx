import React from 'react';
import { Translations } from '../../types';
import { PlatformBridge } from '../../utils/helpers';

interface CrisisViewProps {
  t: Translations;
  onExit: () => void;
}

const HelplineCard = ({ flag, name, number, desc }: { flag: string; name: string; number: string; desc: string }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left flex items-center gap-4">
        <div className="text-3xl">{flag}</div>
        <div className="flex-1">
            <h4 className="text-sm font-black text-slate-800">{name}</h4>
            <p className="text-lg font-bold text-indigo-600 font-mono tracking-wider my-1">{number}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{desc}</p>
        </div>
    </div>
);

export const CrisisView: React.FC<CrisisViewProps> = ({ t, onExit }) => {
  const cv = t.crisis_view;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in px-4 text-center bg-indigo-50">
      <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-5xl shadow-xl border border-indigo-100 animate-pulse-slow">
        🛡️
      </div>
      <div className="space-y-4 max-w-sm">
        <h2 className="text-2xl font-black uppercase tracking-tight text-indigo-900 leading-tight italic">
          {cv.title}
        </h2>
        <p className="text-sm font-medium text-indigo-800/80 leading-relaxed">
          {cv.message}
        </p>
      </div>
      
      <div className="w-full max-w-sm space-y-4">
        <p className="text-xs font-bold text-slate-500">{cv.recommendation}</p>
        <HelplineCard 
            flag="🇷🇺" 
            name={cv.ru_helpline_name} 
            number={cv.ru_helpline_number} 
            desc={cv.ru_helpline_desc}
        />
        <HelplineCard 
            flag="🇬🇪" 
            name={cv.ge_helpline_name} 
            number={cv.ge_helpline_number} 
            desc={cv.ge_helpline_desc}
        />
      </div>

      <button
        onClick={() => {
          PlatformBridge.haptic.notification('success');
          onExit();
        }}
        className="w-full max-w-xs py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all mt-4"
      >
        {cv.exit_button_text}
      </button>
    </div>
  );
};
