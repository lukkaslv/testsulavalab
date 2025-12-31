
import React, { useMemo } from 'react';
import { NetworkAuditReport, Translations, IntegrityReport } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';

interface SecurityMonitorViewProps {
  report: NetworkAuditReport;
  t: Translations;
  onBack: () => void;
}

export const SecurityMonitorView: React.FC<SecurityMonitorViewProps> = ({ report, t, onBack }) => {
  const { integrityReport, isPro } = useAppContext();
  const sm = t.security_monitor;
  
  const isLockdown = integrityReport?.status === 'lockdown';
  const isEnvUnsafe = integrityReport?.isEnvironmentSafe === false;

  return (
    <div className={`h-full font-mono p-6 flex flex-col space-y-6 animate-in transition-colors duration-1000 ${isLockdown ? 'bg-red-950 text-red-500' : 'bg-slate-950 text-emerald-500'}`}>
        <header className="flex justify-between items-center border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${!isLockdown ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-ping'}`}></div>
                <h1 className="text-sm font-black uppercase tracking-widest">{isLockdown ? 'SYSTEM_LOCKDOWN' : sm.title}</h1>
            </div>
            {!isLockdown && (
                <button onClick={onBack} className="text-[10px] font-black uppercase bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 transition-all hover:bg-white/10">
                    {t.global.back}
                </button>
            )}
        </header>

        <div className="flex-1 overflow-y-auto space-y-8 pr-1 custom-scrollbar">
            {/* Main Sovereign Score */}
            <div className={`p-5 rounded-2xl space-y-4 shadow-2xl border ${isLockdown ? 'border-red-500/50 bg-black/40' : 'border-emerald-900/30 bg-slate-900/40'}`}>
                <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase opacity-60">Sovereign_Index</span>
                    <span className="text-3xl font-black">{isLockdown ? 'CRITICAL' : `${integrityReport?.overallScore || 0}%`}</span>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${isLockdown ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${integrityReport?.overallScore || 0}%`}}></div>
                </div>
            </div>

            {isLockdown && (
                <div className="bg-red-600 text-white p-4 rounded-xl animate-pulse text-[10px] font-black uppercase tracking-widest text-center">
                    ⚠️ Доступ к клиническим данным заблокирован. Устраните угрозу безопасности.
                </div>
            )}

            {/* Critical Sub-systems */}
            <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border transition-all ${!isEnvUnsafe ? 'border-white/10 bg-white/5' : 'border-red-500 bg-red-950/20'}`}>
                    <span className="text-[8px] text-slate-500 uppercase block mb-1">Environment (Art.13)</span>
                    <span className={`text-[10px] font-black ${!isEnvUnsafe ? 'text-emerald-400' : 'text-red-400'}`}>
                        {!isEnvUnsafe ? 'PROTECTED' : 'DEBUG_DETECTED'}
                    </span>
                </div>
                <div className={`p-4 rounded-xl border transition-all ${report.isSovereign ? 'border-white/10 bg-white/5' : 'border-amber-500 bg-amber-950/20'}`}>
                    <span className="text-[8px] text-slate-500 uppercase block mb-1">Network (Art.11)</span>
                    <span className={`text-[10px] font-black ${report.isSovereign ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {report.isSovereign ? 'SOVEREIGN' : 'LEAK_DETECTED'}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <section className="space-y-2">
                    <h4 className="text-[9px] font-black uppercase opacity-60 tracking-widest">{sm.requests_label}</h4>
                    <div className="text-2xl font-bold">{report.totalRequests}</div>
                </section>

                <section className="space-y-2">
                    <h4 className="text-[9px] font-black uppercase opacity-60 tracking-widest">{sm.domains_label}</h4>
                    <div className="flex flex-wrap gap-2">
                        {report.authorizedDomains.map(d => (
                            <span key={d} className="text-[8px] px-2 py-1 bg-white/5 border border-white/10 rounded uppercase tracking-tighter text-slate-400">{d}</span>
                        ))}
                    </div>
                </section>

                {report.violations.length > 0 && (
                    <section className="space-y-2">
                        <h4 className="text-[9px] font-black uppercase text-red-500 tracking-widest">{sm.violations_label}</h4>
                        <div className="flex flex-col gap-1">
                            {report.violations.map(v => (
                                <div key={v} className="text-[10px] p-2 bg-red-950/20 border border-red-900/30 rounded text-red-400 font-bold">🚨 LEAK_TRACE: {v}</div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <div className="bg-black/20 border-l-2 border-white/20 p-4 rounded-r-xl">
                <p className="text-[10px] italic leading-relaxed opacity-70">
                    {sm.integrity_desc} Система гарантирует, что ни один бит ваших данных не покинул физическое хранилище устройства. При нарушении целостности активируется протокол самозащиты.
                </p>
            </div>
        </div>

        <footer className="pt-4 border-t border-white/10 text-center opacity-30">
            <span className="text-[8px] uppercase tracking-[0.5em]">Genesis OS Autonomous Fortress v6.0</span>
        </footer>
    </div>
  );
};
