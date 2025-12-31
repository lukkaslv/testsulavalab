import React from 'react';
import { PlatformBridge } from '../../utils/helpers';
import { Translations } from '../../types';

interface DataCorruptionViewProps {
  t: Translations;
  onReset: () => void;
}

export const DataCorruptionView: React.FC<DataCorruptionViewProps> = ({ t, onReset }) => {
  const content = t.data_corruption;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in px-4 text-center bg-slate-950 text-red-200">
      <div className="w-24 h-24 bg-red-950/30 rounded-3xl flex items-center justify-center text-5xl shadow-inner border border-red-500/30 animate-pulse">
        ⚠️
      </div>
      <div className="space-y-4 max-w-sm">
        <h2 className="text-2xl font-black uppercase tracking-tight text-red-400 leading-tight italic">
          {content.title}
        </h2>
        <p className="text-sm font-medium text-red-300 leading-relaxed">
          {content.message}
        </p>
        <p className="text-xs font-bold text-red-400/80">
          {content.recommendation}
        </p>
      </div>
      <button
        onClick={() => {
          PlatformBridge.haptic.notification('warning');
          onReset();
        }}
        className="w-full max-w-xs py-5 bg-red-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
      >
        {content.reset_button}
      </button>
    </div>
  );
};
