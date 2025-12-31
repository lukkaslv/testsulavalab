
import React, { useMemo } from 'react';
import { DomainType, Translations } from '../types';
import { DOMAIN_SETTINGS } from '../constants';
import { NodeUI } from './views/DashboardView';

interface DomainNavigatorProps {
    nodes: NodeUI[];
    onStartNode: (id: number, domain: DomainType) => void;
    t: Translations;
}

const DOMAIN_POSITIONS: Record<DomainType, { x: string; y: string }> = {
    foundation: { x: '50%', y: '10%' },
    agency: { x: '10%', y: '45%' },
    money: { x: '90%', y: '45%' },
    social: { x: '25%', y: '90%' },
    legacy: { x: '75%', y: '90%' },
};

const DOMAIN_ICONS: Record<DomainType, string> = {
    foundation: '⚓',
    agency: '⚡',
    money: '💎',
    social: '👥',
    legacy: '🌳',
};

export const DomainNavigator: React.FC<DomainNavigatorProps> = ({ nodes, onStartNode, t }) => {
    const domainStats = useMemo(() => {
        return DOMAIN_SETTINGS.map(config => {
            const domainNodes = nodes.filter(n => n.domain === config.key);
            const completedCount = domainNodes.filter(n => n.done).length;
            const progress = (completedCount / config.count) * 100;
            const isDone = progress === 100;
            const isActive = domainNodes.some(n => n.active && !n.done);
            const firstAvailableNode = domainNodes.find(n => n.active && !n.done);
            const canStart = !!firstAvailableNode;

            return {
                ...config,
                progress,
                isDone,
                isActive,
                canStart,
                startNodeId: firstAvailableNode?.id,
            };
        });
    }, [nodes]);

    return (
        <div className="space-y-2 animate-in">
            <header className="px-2 border-l-2 border-indigo-500 pl-4 flex justify-between items-baseline">
                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400 italic">
                    {t.dashboard.domain_navigator.title}
                </h3>
                <span className="text-[7px] text-slate-600 font-mono uppercase tracking-widest">
                    MAP_V2
                </span>
            </header>

            <div className="relative aspect-square w-full max-w-sm mx-auto">
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
                    <line x1="50" y1="10" x2="10" y2="45" stroke="currentColor" strokeWidth="1" />
                    <line x1="10" y1="45" x2="25" y2="90" stroke="currentColor" strokeWidth="1" />
                    <line x1="25" y1="90" x2="75" y2="90" stroke="currentColor" strokeWidth="1" />
                    <line x1="75" y1="90" x2="90" y2="45" stroke="currentColor" strokeWidth="1" />
                    <line x1="90" y1="45" x2="50" y2="10" stroke="currentColor" strokeWidth="1" />
                </svg>

                {domainStats.map(domain => {
                    const pos = DOMAIN_POSITIONS[domain.key];
                    const circumference = 2 * Math.PI * 18; // r=18

                    return (
                        <button
                            key={domain.key}
                            disabled={!domain.canStart}
                            onClick={() => domain.startNodeId !== undefined && onStartNode(domain.startNodeId, domain.key)}
                            className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 group transition-all duration-300 disabled:cursor-not-allowed"
                            style={{ left: pos.x, top: pos.y }}
                        >
                            <div className={`relative w-full h-full flex flex-col items-center justify-center rounded-full border-2 transition-all duration-300
                                ${domain.isActive ? 'border-indigo-500 bg-indigo-900/40 shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110' :
                                domain.isDone ? 'border-emerald-500/30 bg-emerald-950/20' :
                                domain.canStart ? 'border-slate-700 bg-slate-900/50 hover:border-indigo-500/50' :
                                'border-slate-800/50 bg-slate-950/50 opacity-50'}`}
                            >
                                <div className="absolute inset-0 z-0 scale-110">
                                    <svg className="w-full h-full" viewBox="0 0 40 40">
                                        <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="2" />
                                        <circle
                                            cx="20" cy="20" r="18"
                                            fill="none"
                                            stroke={domain.isDone ? '#10b981' : '#6366f1'}
                                            strokeWidth="2"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={circumference - (domain.progress / 100) * circumference}
                                            className="-rotate-90 origin-center transition-all duration-1000"
                                        />
                                    </svg>
                                </div>

                                <span className={`text-xl sm:text-2xl transition-all ${domain.isDone ? 'grayscale' : ''}`}>{DOMAIN_ICONS[domain.key]}</span>
                                <span className={`text-[6px] sm:text-[7px] font-black uppercase tracking-widest mt-0.5 sm:mt-1 ${domain.isActive ? 'text-indigo-300' : 'text-slate-400'}`}>
                                    {t.domains[domain.key].substring(0,3)}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
