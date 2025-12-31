
import React, { useState } from 'react';
import { Translations } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { PlatformBridge } from '../../utils/helpers';

interface PrivacyViewProps {
  t: Translations;
  onBack: () => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ t, onBack }) => {
  const { handleFullReset } = useAppContext();
  const [panicStep, setPanicStep] = useState(0);
  const content = t.privacy;

  const handlePanic = () => {
      if (panicStep === 0) {
          setPanicStep(1);
          PlatformBridge.haptic.impact('heavy');
          return;
      }
      handleFullReset();
  };

  return (
    <section className="space-y-6 animate-in py-4 flex flex-col h-full text-slate-100 bg-[#020617]">
      <header className="flex justify-between items-center px-1 pb-4 border-b border-slate-800 sticky top-0 bg-[#020617]/80 backdrop-blur-md z-20">
        <button
          onClick={() => {
            if (panicStep === 1) setPanicStep(0);
            else onBack();
            PlatformBridge.haptic.impact('light');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-300 active:scale-95 transition-all shadow-sm border border-slate-700"
        >
          ← {t.global.back}
        </button>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-indigo-400 font-black tracking-widest italic">{content.title}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-between px-1 pb-10">
        <div className="space-y-6">
          <div className="dark-glass-card p-8 rounded-[2.5rem] border border-slate-800 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl">🔒</div>
            <div className="flex items-center gap-3 relative z-10">
              <span className="text-2xl">🛡️</span>
              <h3 className="text-sm font-black uppercase text-slate-100 tracking-tight">{content.title}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium relative z-10 italic">
              {content.description} Genesis OS не использует облака. Все данные шифруются аппаратным ключом вашего устройства.
            </p>
          </div>

          <div className={`p-6 rounded-3xl space-y-3 transition-all duration-500 border-2 border-dashed ${panicStep === 0 ? 'bg-red-950/20 border-red-500/30' : 'bg-red-600 border-white shadow-[0_0_40px_rgba(220,38,38,0.5)]'}`}>
            <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 ${panicStep === 0 ? 'text-red-500' : 'text-white'}`}>
                <span className={`w-2 h-2 rounded-full animate-ping ${panicStep === 0 ? 'bg-red-500' : 'bg-white'}`}></span>
                {panicStep === 0 ? 'ВНИМАНИЕ' : 'ПОДТВЕРДИТЕ УНИЧТОЖЕНИЕ'}
            </h4>
            <p className={`text-[11px] font-bold uppercase leading-relaxed italic ${panicStep === 0 ? 'text-red-300' : 'text-white'}`}>
              {panicStep === 0 
                ? `${content.erase_warning} Все расчеты, история и Blueprints будут стерты навсегда.`
                : "ЭТО ДЕЙСТВИЕ НЕОБРАТИМО. ВСЕ ДАННЫЕ БУДУТ ПЕРЕЗАПИСАНЫ НУЛЯМИ."}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={handlePanic}
            className={`w-full py-6 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 border-b-4 ${
                panicStep === 0 
                ? 'bg-red-700 text-white border-red-900 shadow-red-900/50' 
                : 'bg-white text-red-600 border-slate-300 animate-pulse'
            }`}
          >
            <span className="text-lg">{panicStep === 0 ? '🗑️' : '💀'}</span>
            <span>{panicStep === 0 ? content.erase_button_text : "НАЖМИТЕ ДЛЯ ПОЛНОГО СБРОСА"}</span>
          </button>
          <p className="text-[8px] text-slate-600 font-mono text-center uppercase tracking-widest">Protocol Art.14 Compliance // No Recovery Possible</p>
        </div>
      </div>
    </section>
  );
};
