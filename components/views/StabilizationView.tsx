
import React, { useState, useEffect } from 'react';
import { Translations } from '../../types';
import { PlatformBridge } from '../../utils/helpers';

interface StabilizationViewProps {
  t: Translations;
  onComplete: () => void;
}

export const StabilizationView: React.FC<StabilizationViewProps> = ({ t, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const sv = t.stabilization;

  useEffect(() => {
    PlatformBridge.haptic.notification('warning');
    
    const timer = setInterval(() => {
        setProgress(p => {
            if (p >= 100) {
                clearInterval(timer);
                PlatformBridge.haptic.notification('success');
                setTimeout(onComplete, 1000);
                return 100;
            }
            if (p % 20 === 0) PlatformBridge.haptic.impact('soft');
            return p + 1;
        });
    }, 150); // ~15 seconds total

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="h-full bg-slate-950 flex flex-col items-center justify-center p-10 font-mono animate-in overflow-hidden relative">
        {/* Deep Water Ambient Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05)_0%,transparent_70%)]"></div>
        
        {/* Harmonic Pulse Visual */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-20 z-10">
            <div className="absolute inset-0 rounded-full border border-teal-500/10 animate-[ping_4s_infinite]"></div>
            <div className="absolute inset-8 rounded-full border border-teal-500/20 animate-[ping_4s_infinite]" style={{ animationDelay: '1s' }}></div>
            <div className="absolute inset-16 rounded-full border border-teal-500/30 animate-[ping_4s_infinite]" style={{ animationDelay: '2s' }}></div>
            
            <div className="w-24 h-24 rounded-full bg-teal-900/20 border-2 border-teal-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.2)] animate-pulse-slow">
                <span className="text-4xl">🧘</span>
            </div>
        </div>

        <div className="text-center space-y-6 relative z-10 max-w-xs">
            <header className="space-y-1">
                <h2 className="text-teal-400 font-black text-sm tracking-[0.3em] uppercase">{sv.title}</h2>
                <p className="text-[8px] text-teal-600 font-bold tracking-widest">{sv.subtitle}</p>
            </header>
            
            <p className="text-sm text-slate-300 font-medium italic leading-relaxed animate-pulse">
                "{sv.instruction}"
            </p>

            <div className="w-full space-y-2 pt-10">
                <div className="flex justify-between text-[8px] font-black text-teal-700 uppercase tracking-widest">
                    <span>{sv.restoring_signal}</span>
                    <span>{progress}%</span>
                </div>
                <div className="h-1 bg-slate-900 w-full rounded-full overflow-hidden border border-teal-900/30">
                    <div className="h-full bg-teal-500 shadow-[0_0_10px_#14b8a6] transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>

        <footer className="absolute bottom-10 left-0 right-0 text-center opacity-20">
            <p className="text-[7px] uppercase tracking-[0.5em] text-teal-600">Homeostatic Re-Alignment Protocol Art.6.1</p>
        </footer>
    </div>
  );
};
