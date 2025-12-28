
import React, { memo } from 'react';
import { GameHistoryItem, Translations } from '../types';

interface SignalDecoderProps {
  history: GameHistoryItem[];
  t: Translations;
  baseline: number;
  lang: 'ru' | 'ka';
}

export const SignalDecoder: React.FC<SignalDecoderProps> = memo(({ history, t, baseline, lang }) => {
  // Identify hotspots: High latency (Z > 1.8) or Somatic Friction (s1, s4)
  const hotspots = history.filter(h => {
      const isHighLatency = h.latency > baseline * 1.8;
      const hasSomaticFriction = h.sensation === 's1' || h.sensation === 's4';
      const isCalibration = parseInt(h.nodeId) < 3;
      return !isCalibration && (isHighLatency || hasSomaticFriction);
  }).slice(-4);

  if (hotspots.length === 0) return null;

  return (
    <section className="space-y-4 animate-in">
        <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
                Evidence // {lang === 'ru' ? 'Обоснование' : 'მტკიცებულება'}
            </h3>
            <span className="text-[8px] font-mono text-slate-300">CORE_SIGNALS_LOG</span>
        </div>

        <div className="space-y-2">
            {hotspots.map((h, i) => {
                const isHighLatency = h.latency > baseline * 1.8;
                const hasSomaticFriction = h.sensation === 's1' || h.sensation === 's4';
                const domainLabel = t.domains[h.domain] || h.domain;

                return (
                    <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-start gap-4 group">
                        <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${hasSomaticFriction ? 'bg-amber-500 animate-pulse' : 'bg-indigo-400'}`}></div>
                            <div className="w-px h-8 bg-slate-200"></div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">Node {parseInt(h.nodeId) + 1} // {domainLabel}</span>
                                <span className="text-[8px] font-mono text-slate-400">{(h.latency/1000).toFixed(1)}s</span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-700 leading-tight italic">
                                {isHighLatency && hasSomaticFriction 
                                    ? (lang === 'ru' ? "Зафиксировано когнитивное усилие и телесный барьер." : "დაფიქსირდა კოგნიტური ძალისხმევა და სხეულის ბარიერი.")
                                    : isHighLatency 
                                    ? (lang === 'ru' ? "Микро-задержка указывает на внутренний конфликт в этой теме." : "მიკრო-დაყოვნება მიუთითებს შინაგან კონფლიქტზე.")
                                    : (lang === 'ru' ? "Телесный отклик подтверждает наличие напряжения." : "სხეულის გამოძახილი ადასტურებს დაძაბულობას.")
                                }
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
        <p className="text-[9px] text-slate-400 text-center italic opacity-60">
            {lang === 'ru' 
                ? "* Эти сигналы стали основой для определения ваших паттернов." 
                : "* ეს სიგნალები გახდა თქვენი პატერნების განსაზღვრის საფუძველი."}
        </p>
    </section>
  );
});
