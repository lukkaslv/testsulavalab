
import { memo, useState, useEffect } from 'react';
import { Translations } from '../../types';
import { PlatformBridge } from '../../utils/helpers';

const EtherBody = ({ highlightZone, onZoneSelect }: { highlightZone: string | null, onZoneSelect: (zone: string) => void }) => {
    // Abstracted Nerve Paths
    const nerves = {
        s0: "M100,30 C110,30 120,38 120,50 C120,62 110,70 100,70 C90,70 80,62 80,50 C80,38 90,30 100,30 Z", // Head Core
        s1: "M90,75 Q100,85 110,75 L110,85 Q100,95 90,85 Z", // Throat
        s2: "M70,100 C60,110 50,130 50,150 C50,170 150,170 150,150 C150,130 140,110 130,100 Q100,120 70,100 Z", // Chest
        s3: "M80,180 C70,190 70,210 80,220 L120,220 C130,210 130,190 120,180 Z", // Plexus
        s4: "M70,240 C60,260 60,300 70,320 L130,320 C140,300 140,260 130,240 Z" // Belly
    };

    const glowColor = highlightZone === 's1' || highlightZone === 's4' ? '#f59e0b' : '#6366f1'; 

    return (
        <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="10" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Base Body - Interactive Click Zones (Expanded for easier touch) */}
            <g className="opacity-60">
                 {/* Head */}
                 <path 
                    d={nerves.s0} 
                    fill={highlightZone === 's0' ? '#6366f1' : 'transparent'} 
                    stroke="rgba(255,255,255,0.3)" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => onZoneSelect('s0')}
                 />
                 {/* Throat */}
                 <path 
                    d={nerves.s1} 
                    fill={highlightZone === 's1' ? '#f59e0b' : 'transparent'} 
                    stroke="rgba(255,255,255,0.3)" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => onZoneSelect('s1')}
                 />
                 {/* Chest */}
                 <path 
                    d={nerves.s2} 
                    fill={highlightZone === 's2' ? '#10b981' : 'transparent'} 
                    stroke="rgba(255,255,255,0.3)" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => onZoneSelect('s2')}
                 />
                 {/* Plexus */}
                 <path 
                    d={nerves.s3} 
                    fill={highlightZone === 's3' ? '#6366f1' : 'transparent'} 
                    stroke="rgba(255,255,255,0.3)" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => onZoneSelect('s3')}
                 />
                 {/* Belly */}
                 <path 
                    d={nerves.s4} 
                    fill={highlightZone === 's4' ? '#ef4444' : 'transparent'} 
                    stroke="rgba(255,255,255,0.3)" strokeWidth="1"
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => onZoneSelect('s4')}
                 />
            </g>

            {/* Connecting Lines (Structure) */}
            <path d="M100,30 L100,350 M100,70 L70,90 M100,70 L130,90 M100,120 L50,140 M100,120 L150,140 M100,240 L60,320 M100,240 L140,320" 
                  stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" pointerEvents="none" />
            
            {/* Active Highlight (Glow Effect) */}
            {highlightZone && nerves[highlightZone as keyof typeof nerves] && (
                <g filter="url(#glow)" pointerEvents="none">
                    <path 
                        d={nerves[highlightZone as keyof typeof nerves]} 
                        fill="transparent" 
                        stroke={glowColor} 
                        strokeWidth="3"
                        className="animate-pulse" 
                    />
                </g>
            )}
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
      }, 800); // Faster feedback loop
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
      { key: 's0', label: 'ГОЛОВА', sub: 'Мысли / Тишина', activeColor: 'bg-slate-700', activeText: 'text-slate-200' },
      { key: 's1', label: 'ГОРЛО', sub: 'Ком / Несказанное', activeColor: 'bg-amber-600', activeText: 'text-amber-100' },
      { key: 's2', label: 'ГРУДЬ', sub: 'Сжатие / Тепло', activeColor: 'bg-emerald-600', activeText: 'text-emerald-100' },
      { key: 's3', label: 'СПЛЕТЕНИЕ', sub: 'Воля / Тревога', activeColor: 'bg-indigo-600', activeText: 'text-indigo-100' },
      { key: 's4', label: 'ЖИВОТ', sub: 'Страх / Холод', activeColor: 'bg-red-600', activeText: 'text-red-100' },
  ];

  return (
     <div className="h-full flex flex-col bg-[#020617] text-white overflow-hidden relative select-none">
        {/* Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617] z-0"></div>
        
        {/* Header */}
        <div className="relative z-10 pt-6 px-6 text-center space-y-1 shrink-0">
           <h3 className="text-xl font-black uppercase text-slate-100 tracking-tight leading-none drop-shadow-md">
               {isSealing ? t.sync.scan_complete : t.sync.title}
           </h3>
           <p className="text-[10px] font-medium text-slate-400 max-w-[240px] mx-auto leading-relaxed opacity-80 animate-in">
               {t.sync.desc || "Где в теле отозвался этот вопрос?"}
           </p>
        </div>

        {/* Body Visualizer */}
        <div className="flex-1 relative z-10 min-h-0 flex items-center justify-center -my-4">
            <div className={`w-full max-w-[280px] h-[360px] transition-all duration-500 ${isSealing ? 'scale-105 opacity-80 blur-[2px]' : 'scale-100 opacity-100'}`}>
                <EtherBody highlightZone={selectedZone} onZoneSelect={handleZoneSelect} />
            </div>
            
            {/* Success Overlay Pulse */}
            {isSealing && (
                <div className="absolute inset-0 flex items-center justify-center z-20 animate-in pointer-events-none">
                    <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                        <span className="text-3xl animate-ping opacity-50">📡</span>
                    </div>
                </div>
            )}
        </div>

        {/* Control Grid - Optimization: Clearer Labels, Better Hit Areas */}
        <div className="relative z-20 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent px-4 pb-8 pt-6 space-y-2 shrink-0">
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                {/* HEAD (Full Width for easy default access) */}
                <button 
                    onClick={() => handleZoneSelect(zones[0].key)}
                    disabled={isSealing}
                    className={`col-span-2 p-4 rounded-2xl border transition-all active:scale-[0.98] flex justify-between items-center group shadow-md
                        ${selectedZone === zones[0].key ? `${zones[0].activeColor} border-white/20 text-white` : 'bg-slate-900 border-white/5 hover:bg-slate-800'}`}
                >
                    <span className="text-xs font-black uppercase tracking-widest">{zones[0].label}</span>
                    <span className={`text-[9px] font-mono uppercase ${selectedZone === zones[0].key ? 'opacity-100' : 'text-slate-500'}`}>{zones[0].sub}</span>
                </button>

                {/* OTHER ZONES */}
                {zones.slice(1).map((zone) => (
                    <button 
                        key={zone.key}
                        onClick={() => handleZoneSelect(zone.key)}
                        disabled={isSealing}
                        className={`p-3.5 rounded-2xl border transition-all active:scale-[0.98] flex flex-col items-start gap-1 group shadow-sm
                            ${selectedZone === zone.key ? `${zone.activeColor} border-white/20 ${zone.activeText}` : 'bg-slate-900 border-white/5 hover:bg-slate-800'}`}
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest">{zone.label}</span>
                        <span className={`text-[8px] font-mono uppercase leading-tight ${selectedZone === zone.key ? 'opacity-90' : 'text-slate-500'}`}>{zone.sub}</span>
                    </button>
                ))}
            </div>
        </div>
     </div>
  );
});
