
import React, { useEffect, useState } from 'react';
import { Translations } from '../../types';
import { SYSTEM_METADATA } from '../../constants';

interface BootViewProps {
  onComplete: () => void;
  t: Translations;
}

export const BootView: React.FC<BootViewProps> = ({ onComplete, t }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const bs = t.boot_sequence;

  useEffect(() => {
    const sequence = [
        bs.kernel_init.replace('{version}', SYSTEM_METADATA.VERSION),
        bs.load_constitution.replace('{constitution_version}', SYSTEM_METADATA.CONSTITUTION),
        bs.mount_volumes,
        bs.load_psychometrics,
        bs.calibrate_neuro_sync,
        bs.secure_link,
        bs.system_ready
    ];

    let step = 0;
    const interval = setInterval(() => {
        if (step >= sequence.length) {
            clearInterval(interval);
            setTimeout(onComplete, 800);
            return;
        }
        setLogs(prev => [...prev, sequence[step]]);
        step++;
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete, bs]);

  return (
    <div className="flex flex-col justify-end pb-20 px-6 font-mono h-full bg-[#050505] text-emerald-500 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-20"></div>
      
      <div className="space-y-2 relative z-0">
          <div className="mb-8 border-b border-emerald-900/50 pb-2">
              <h1 className="text-xl font-black text-emerald-600 tracking-tighter">GENESIS_OS <span className="text-xs align-top opacity-50">BIOS</span></h1>
              <p className="text-[9px] text-emerald-800 uppercase tracking-widest">{bs.copyright}</p>
          </div>

          {logs.map((log, i) => (
            <div key={i} className="flex gap-3 text-[10px] animate-in">
              <span className="text-emerald-700 font-bold">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
              <span className={`uppercase tracking-wider ${i === logs.length - 1 ? 'text-emerald-400 font-bold animate-pulse' : 'text-emerald-600'}`}>
                {log}
              </span>
            </div>
          ))}
          
          <div className="h-4 w-3 bg-emerald-500 animate-pulse mt-2"></div>
      </div>
    </div>
  );
};
