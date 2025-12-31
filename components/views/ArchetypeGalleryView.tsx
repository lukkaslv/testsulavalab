
import React, { useState } from 'react';
import { Translations, ArchetypeKey } from '../../types';
import { PlatformBridge } from '../../utils/helpers';

interface ArchetypeGalleryViewProps {
  t: Translations;
  onBack: () => void;
}

const ARCHETYPES: { key: ArchetypeKey; icon: string; color: string }[] = [
    { key: 'THE_ARCHITECT', icon: '📐', color: 'indigo' },
    { key: 'THE_DRIFTER', icon: '🍂', color: 'slate' },
    { key: 'THE_BURNED_HERO', icon: '🔥', color: 'red' },
    { key: 'THE_GOLDEN_PRISONER', icon: '🏆', color: 'amber' },
    { key: 'THE_CHAOS_SURFER', icon: '🌊', color: 'fuchsia' },
    { key: 'THE_GUARDIAN', icon: '🛡️', color: 'emerald' },
];

export const ArchetypeGalleryView: React.FC<ArchetypeGalleryViewProps> = ({ t, onBack }) => {
  const [selected, setSelected] = useState<ArchetypeKey | null>(null);
  const gallery = t.archetype_gallery;

  const getColorClass = (color: string) => {
      switch(color) {
          case 'indigo': return 'bg-indigo-600 border-indigo-400 text-indigo-100';
          case 'red': return 'bg-red-600 border-red-400 text-red-100';
          case 'amber': return 'bg-amber-600 border-amber-400 text-amber-100';
          case 'emerald': return 'bg-emerald-600 border-emerald-400 text-emerald-100';
          case 'fuchsia': return 'bg-fuchsia-600 border-fuchsia-400 text-fuchsia-100';
          default: return 'bg-slate-700 border-slate-500 text-slate-200';
      }
  };

  return (
    <div className="h-full bg-[#020617] text-slate-300 p-6 overflow-hidden flex flex-col font-mono animate-in select-none">
        <header className="mb-6 border-b border-slate-800 pb-4 flex justify-between items-center shrink-0 bg-[#020617]/90 backdrop-blur z-20">
            <div className="space-y-1">
                <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">{gallery.title}</h1>
                <p className="text-[8px] font-mono text-indigo-400 uppercase tracking-[0.4em]">{gallery.subtitle}</p>
            </div>
            <button onClick={onBack} className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 border border-slate-800 transition-all active:scale-90">✕</button>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar custom-scrollbar space-y-4 pb-20">
            {ARCHETYPES.map((arch) => {
                const data = t.archetypes[arch.key];
                const isSelected = selected === arch.key;
                const marker = (gallery.markers as any)[arch.key];

                return (
                    <div 
                        key={arch.key}
                        onClick={() => { setSelected(isSelected ? null : arch.key); PlatformBridge.haptic.selection(); }}
                        className={`border rounded-[2rem] transition-all duration-500 overflow-hidden relative ${isSelected ? 'bg-slate-900 border-white/20 shadow-2xl' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'}`}
                    >
                        {isSelected && (
                            <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl grayscale pointer-events-none">{arch.icon}</div>
                        )}

                        <div className="p-6 relative z-10">
                            <div className="flex items-center gap-4 mb-2">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg border transition-all ${isSelected ? getColorClass(arch.color) : 'bg-slate-900 border-slate-700 grayscale'}`}>
                                    {arch.icon}
                                </div>
                                <div>
                                    <h3 className={`text-sm font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-slate-400'}`}>{data.title}</h3>
                                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">{data.desc}</p>
                                </div>
                            </div>

                            {isSelected && (
                                <div className="mt-6 space-y-4 animate-in">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                                            <span className="text-[7px] text-emerald-400 uppercase font-black tracking-widest block mb-1">{gallery.superpower_label}</span>
                                            <p className="text-[10px] text-white font-bold">{data.superpower}</p>
                                        </div>
                                        <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                                            <span className="text-[7px] text-red-400 uppercase font-black tracking-widest block mb-1">{gallery.shadow_label}</span>
                                            <p className="text-[10px] text-white font-bold">{data.shadow}</p>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-950/20">
                                        <span className="text-[7px] text-indigo-300 uppercase font-black tracking-widest block mb-1">{gallery.marker_label}</span>
                                        <p className="text-[9px] text-indigo-100 font-mono">{marker}</p>
                                    </div>

                                    <p className="text-[10px] text-slate-400 italic text-center border-t border-white/5 pt-4 mt-2">
                                        "{data.quote}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
        
        <footer className="shrink-0 pt-4 border-t border-slate-900 text-center opacity-30">
            <p className="text-[7px] uppercase tracking-[0.5em]">Typology v6.0 // Art. 18.2</p>
        </footer>
    </div>
  );
};
