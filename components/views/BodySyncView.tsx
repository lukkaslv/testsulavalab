
import { memo, useState, useEffect } from 'react';
import { Translations } from '../../types';
import { PlatformBridge } from '../../utils/helpers';

const EtherBody = ({ highlightZone }: { highlightZone: string | null }) => {
    // Abstracted Nerve Paths
    const nerves = {
        s0: "M100,30 C110,30 120,38 120,50 C120,62 110,70 100,70 C90,70 80,62 80,50 C80,38 90,30 100,30 Z", // Head Core
        s1: "M90,75 Q100,85 110,75 L110,85 Q100,95 90,85 Z", // Throat
        s2: "M70,100 C60,110 50,130 50,150 C50,170 150,170 150,150 C150,130 140,110 130,100 Q100,120 70,100 Z", // Chest
        s3: "M80,180 C70,190 70,210 80,220 L120,220 C130,210 130,190 120,180 Z", // Plexus
        s4: "M70,240 C60,260 60,300 70,320 L130,320 C140,300 140,260 130,240 Z" // Belly
    };

    const glowColor = highlightZone === 's1' || highlightZone === 's4' ? '#f59e0b' : '#6366f1'; // Amber for tension, Indigo for flow

    return (
        <svg viewBox="0 0 200 400" className="w-full h-full pointer-events-none drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="15" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Base Nervous System Trace */}
            <path d="M100,30 L100,350 M100,70 L70,90 M100,70 L130,90 M100,120 L50,140 M100,120 L150,140 M100,240 L60,320 M100,240 L140,320" 
                  stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
            
            {/* Active Highlight */}
            {highlightZone && nerves[highlightZone as keyof typeof nerves] && (
                <g filter="url(#glow)">
                    <path 
                        d={nerves[highlightZone as keyof typeof nerves]} 
                        fill={glowColor} 
                        fillOpacity="0.4"
                        stroke={glowColor} 
                        strokeWidth="2"
                        className="animate-pulse" 
                    />
                    {/* Connecting Line to Core */}
                    <path d={`M100,${highlightZone === 's0' ? 50 : 200} L100,200`} stroke={glowColor} strokeWidth="1" strokeDasharray="4 4" className="opacity-50" />
                </g>
            )}

            {/* Core Center Anchor */}
            <circle cx="100" cy="200" r="2" fill="white" opacity="0.5" />
        </svg>
    );
};

interface BodySyncViewProps {
  t: Translations;
  onSync: (sensation: string) => void;
}

export const BodySyncView = memo<BodySyncViewProps>(({ t, onSync }) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isSealing, setIsSealing] = useState(false);

  useEffect(() => {
    if (selectedZone) {
      setIsSealing(true);
      const timer = setTimeout(() => {
          onSync(selectedZone);
      }, 1200); // Allow animation to play
      return () => clearTimeout(timer);
    }
  }, [selectedZone, onSync]);

  const handleZoneSelect = (zone: string) => {
      if (isSealing) return;
      setSelectedZone(zone);
      
      // Semantic Haptics
      if (zone === 's0') PlatformBridge.haptic.impact('light'); // Head -> Light
      else if (zone === 's1') PlatformBridge.haptic.impact('rigid'); // Throat -> Rigid
      else if (zone === 's2') PlatformBridge.haptic.notification('success'); // Chest -> Open
      else if (zone === 's3') PlatformBridge.haptic.impact('medium'); // Plexus -> Power
      else if (zone === 's4') PlatformBridge.haptic.notification('warning'); // Belly -> Fear
  };

  const zones = [
      { key: 's0', label: 'ГОЛОВА', sub: 'Мысли / Тишина', activeColor: 'bg-slate-700' },
      { key: 's1', label: 'ГОРЛО', sub: 'Ком / Слова', activeColor: 'bg-amber-600' },
      { key: 's2', label: 'ГРУДЬ', sub: 'Чувство / Сжатие', activeColor: 'bg-emerald-600' },
      { key: 's3', label: 'СПЛЕТЕНИЕ', sub: 'Тревога / Воля', activeColor: 'bg-indigo-600' },
      { key: 's4', label: 'ЖИВОТ', sub: 'Страх / Холод', activeColor: 'bg-red-600' },
  ];

  return (
     <div className="h-full flex flex-col bg-[#020617] text-white overflow-hidden relative">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617] z-0"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay z-0"></div>

        {/* TOP: Question & Status */}
        <div className="relative z-10 pt-8 px-6 text-center space-y-2 shrink-0">
           <div className="flex items-center justify-center gap-2 mb-2">
               <span className={`w-2 h-2 rounded-full ${isSealing ? 'bg-emerald-500 animate-ping' : 'bg-indigo-500 animate-pulse'}`}></span>
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">SOMATIC_LINK</span>
           </div>
           <h3 className="text-xl font-black uppercase text-slate-100 tracking-tight leading-none">
               {isSealing ? t.sync.scan_complete : t.sync.title}
           </h3>
           <p className="text-[10px] font-medium text-slate-400 max-w-[200px] mx-auto leading-relaxed">
               {t.sync.desc}
           </p>
        </div>

        {/* CENTER: Visualizer */}
        <div className="flex-1 relative z-10 min-h-0 flex items-center justify-center -mt-4">
            <div className={`w-full max-w-[280px] h-[350px] transition-all duration-700 ${isSealing ? 'scale-110 opacity-50 blur-sm' : 'scale-100 opacity-100'}`}>
                <EtherBody highlightZone={selectedZone} />
            </div>
            
            {/* Success Overlay */}
            {isSealing && (
                <div className="absolute inset-0 flex items-center justify-center z-20 animate-in">
                    <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md">
                        <span className="text-2xl animate-pulse">📡</span>
                    </div>
                </div>
            )}
        </div>

        {/* BOTTOM: Haptic Control Deck */}
        <div className="relative z-20 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 px-4 py-6 pb-8 space-y-2 shrink-0">
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                {/* HEAD (Full Width) */}
                <button 
                    onClick={() => handleZoneSelect(zones[0].key)}
                    disabled={isSealing}
                    className={`col-span-2 p-4 rounded-xl border border-white/5 transition-all active:scale-[0.98] flex justify-between items-center group
                        ${selectedZone === zones[0].key ? 'bg-slate-700 border-slate-500 shadow-[0_0_15px_rgba(51,65,85,0.5)]' : 'bg-slate-900/50 hover:bg-slate-800'}`}
                >
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{zones[0].label}</span>
                    <span className="text-[8px] font-mono text-slate-500 uppercase">{zones[0].sub}</span>
                </button>

                {/* OTHER ZONES (Grid) */}
                {zones.slice(1).map((zone) => (
                    <button 
                        key={zone.key}
                        onClick={() => handleZoneSelect(zone.key)}
                        disabled={isSealing}
                        className={`p-4 rounded-xl border border-white/5 transition-all active:scale-[0.98] flex flex-col items-start gap-1 group
                            ${selectedZone === zone.key ? `${zone.activeColor} border-white/20 shadow-lg text-white` : 'bg-slate-900/50 hover:bg-slate-800 text-slate-400'}`}
                    >
                        <span className={`text-[10px] font-black uppercase tracking-widest ${selectedZone === zone.key ? 'text-white' : 'text-slate-300'}`}>{zone.label}</span>
                        <span className={`text-[7px] font-mono uppercase ${selectedZone === zone.key ? 'text-white/80' : 'text-slate-600'}`}>{zone.sub}</span>
                    </button>
                ))}
            </div>
        </div>
     </div>
  );
});
