
import React, { memo } from 'react';
import { GameHistoryItem, Translations, BeliefKey } from '../types';
import { WEIGHTS } from '../services/psychologyService';

interface SignalDecoderProps {
  history: GameHistoryItem[];
  t: Translations;
  baseline: number;
}

export const SignalDecoder: React.FC<SignalDecoderProps> = memo(({ history, t, baseline }) => {
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
                {t.results.signal_decoder.title}
            </h3>
            <span className="text-[8px] font-mono text-slate-300">{t.results.signal_decoder.subtitle}</span>
        </div>

        <div className="space-y-2">
            {hotspots.map((h, i) => {
                const beliefKey = h.beliefKey as BeliefKey;
                const w = WEIGHTS[beliefKey] || WEIGHTS.default;
                const choiceValence = (w.f || 0) + (w.a || 0) + (w.r || 0);
                const isPositiveChoice = choiceValence > 2;
                const isHighLatency = h.latency > baseline * 1.8;
                const hasSomaticFriction = h.sensation === 's1' || h.sensation === 's4';
                const domainLabel = t.domains[h.domain] || h.domain;

                let messageKey: keyof typeof t.results.signal_decoder = 'friction';
                if (isPositiveChoice && hasSomaticFriction) {
                    messageKey = 'cognitive_somatic_dissonance';
                } else if (isHighLatency && hasSomaticFriction) {
                    messageKey = 'high_latency_friction';
                } else if (isHighLatency) {
                    messageKey = 'high_latency';
                }
                const message = t.results.signal_decoder[messageKey] || t.results.signal_decoder.friction;

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
                                {message}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
        <p className="text-[9px] text-slate-400 text-center italic opacity-60">
            {t.results.signal_decoder.footer}
        </p>
    </section>
  );
});
