
import React, { useEffect, useState } from 'react';
import { BioSignature } from '../BioSignature';
import { useAppContext } from '../../hooks/useAppContext';
import { calculateRawMetrics } from '../../services/psychologyService';

interface ProcessingViewProps {
    onComplete: () => void;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ onComplete }) => {
    const { history } = useAppContext();
    const [progress, setProgress] = useState(0);
    const metrics = calculateRawMetrics(history);

    useEffect(() => {
        const duration = 3000;
        const interval = 30;
        const step = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress(p => {
                if (p + step >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return p + step;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="h-full flex flex-col items-center justify-center p-12 bg-[#020617] font-mono overflow-hidden">
            <div className="relative w-full max-w-xs flex flex-col items-center space-y-12">
                
                {/* Эмерджентное Зеркало (Art. 7.3) */}
                <div className="relative animate-pulse-slow">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full scale-150"></div>
                    <BioSignature 
                        f={metrics.state.foundation} 
                        a={metrics.state.agency} 
                        r={metrics.state.resource} 
                        e={metrics.state.entropy}
                        width={280}
                        height={280}
                        className="relative z-10 drop-shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                    />
                </div>

                <div className="w-full space-y-4 text-center relative z-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">MIRROR_PROTOCOL_ACTIVE</p>
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest">Синтез эмерджентной формы...</p>
                    </div>
                    
                    <div className="h-0.5 bg-slate-900 w-full rounded-full overflow-hidden border border-white/5">
                        <div 
                            className="h-full bg-indigo-500 shadow-[0_0_15px_#6366f1] transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    
                    <div className="flex justify-between font-mono text-[7px] text-slate-600 uppercase tracking-tighter">
                        <span>Determining_Structure</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
