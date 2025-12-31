
import React, { useState, useEffect } from 'react';
import { Translations, SubscriptionTier } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { SecurityCore } from '../../utils/crypto';
import { RemoteAccess } from '../../services/remoteAccess';
import { SYSTEM_METADATA } from '../../constants';
import { Logo } from '../Logo';

interface AuthViewProps {
  onLogin: (password: string, isDemo: boolean, tier?: SubscriptionTier) => boolean;
  t: Translations;
}

const ClinicalAirlock = ({ t, onAuth, onBack }: { t: Translations, onAuth: (k: string) => void, onBack: () => void }) => {
    const [key, setKey] = useState('');
    const [status, setStatus] = useState('IDLE');
    const [isScanning, setIsScanning] = useState(false);
    const [isAdminOverride, setIsAdminOverride] = useState(false);

    // Art. 26: Reactive Admin Detection
    useEffect(() => {
        if (key.trim().toLowerCase() === 'genesis_prime') {
            if (!isAdminOverride) {
                PlatformBridge.haptic.notification('warning');
                setIsAdminOverride(true);
            }
        } else {
            if (isAdminOverride) setIsAdminOverride(false);
        }
    }, [key, isAdminOverride]);

    const handleSubmit = async () => {
        if (!key.trim()) return;
        setIsScanning(true);
        setStatus('VERIFYING_CRYPTOGRAPHY...');
        
        if (!isAdminOverride) {
            PlatformBridge.haptic.notification('warning');
            // Cinematic delay for "Network Handshake" simulation (Standard Pro)
            await new Promise(r => setTimeout(r, 1200));
        } else {
            PlatformBridge.haptic.impact('heavy');
            // Faster entry for Admin
            await new Promise(r => setTimeout(r, 600));
        }
        
        onAuth(key);
        setIsScanning(false);
    };

    const theme = isAdminOverride 
        ? { border: 'border-red-500/50', bg: 'bg-red-950/20', text: 'text-red-500', glow: 'shadow-red-900/50', icon: '👁️' }
        : { border: 'border-indigo-500/30', bg: 'bg-indigo-950/20', text: 'text-indigo-400', glow: 'shadow-indigo-900/20', icon: '🛡️' };

    return (
        <div className="absolute inset-0 bg-[#020617] flex flex-col z-50 animate-in transition-colors duration-700">
            {/* Clinical Grid Background */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isAdminOverride ? 'opacity-20 bg-red-900/10' : 'opacity-100'}`} style={{
                backgroundImage: `linear-gradient(${isAdminOverride ? 'rgba(220,38,38,0.1)' : 'rgba(99,102,241,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${isAdminOverride ? 'rgba(220,38,38,0.1)' : 'rgba(99,102,241,0.03)'} 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }}></div>
            
            <header className="p-6 pt-12 flex justify-between items-start relative z-10">
                <div className="space-y-1">
                    <h2 className={`text-sm font-black uppercase tracking-[0.3em] transition-colors ${theme.text}`}>
                        {isAdminOverride ? 'КОРНЕВОЙ ДОСТУП' : 'ЗАЩИЩЕННЫЙ КАНАЛ'}
                    </h2>
                    <p className="text-[7px] font-mono text-slate-500 uppercase tracking-widest">Genesis OS v{SYSTEM_METADATA.VERSION}</p>
                </div>
                <button onClick={onBack} className="w-10 h-10 rounded-full border border-slate-800 bg-slate-900/50 flex items-center justify-center text-slate-500 text-xs hover:text-white transition-colors">✕</button>
            </header>

            <div className="flex-1 flex flex-col justify-center px-8 relative z-10">
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <div className={`w-20 h-20 mx-auto rounded-[2rem] border flex items-center justify-center relative overflow-hidden group transition-all duration-500 ${theme.bg} ${theme.border} ${isAdminOverride ? 'scale-110 rotate-180' : ''}`}>
                            <div className={`absolute inset-0 blur-xl transition-all duration-1000 ${isScanning ? 'opacity-100 scale-150' : 'opacity-0 scale-100'} ${isAdminOverride ? 'bg-red-500/20' : 'bg-indigo-500/20'}`}></div>
                            <span className={`text-3xl relative z-10 transition-transform duration-500 ${isAdminOverride ? 'rotate-180' : ''}`}>{theme.icon}</span>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest">
                                {isAdminOverride ? 'СИСТЕМНЫЙ АРХИТЕКТОР' : 'ДОСТУП СПЕЦИАЛИСТА'}
                            </h3>
                            <p className="text-[9px] text-slate-500 font-mono leading-relaxed max-w-[200px] mx-auto">
                                {isAdminOverride 
                                    ? "Внимание: Прямой доступ к ядру. Ограничения Ст. 26." 
                                    : '"Система не диагностирует. Она создает карту для специалиста." (Ст. 1.2)'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group">
                            <div className={`absolute -inset-0.5 rounded-xl opacity-0 transition duration-500 group-focus-within:opacity-30 ${isAdminOverride ? 'bg-red-600 opacity-40' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}></div>
                            <input 
                                type="text" 
                                value={key}
                                onChange={e => { setKey(e.target.value); setStatus('IDLE'); }}
                                placeholder="ВВЕДИТЕ ХЕШ ЛИЦЕНЗИИ"
                                className={`relative w-full bg-slate-950 border rounded-xl py-4 px-4 text-center font-mono text-xs uppercase tracking-widest placeholder-slate-800 focus:outline-none transition-all ${isAdminOverride ? 'border-red-500/50 text-red-400' : 'border-slate-800 text-indigo-300 focus:border-indigo-500/50'}`}
                                autoFocus
                            />
                        </div>

                        <button 
                            onClick={handleSubmit}
                            disabled={isScanning || !key}
                            className={`w-full py-4 rounded-xl font-black uppercase text-[9px] tracking-[0.3em] shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                ${isAdminOverride 
                                    ? 'bg-red-700 hover:bg-red-600 text-white shadow-red-900/40' 
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(79,70,229,0.2)]'}`}
                        >
                            {isScanning ? 'СОЕДИНЕНИЕ...' : isAdminOverride ? 'ЗАПУСК КОРНЕВОЙ ОБОЛОЧКИ' : 'АВТОРИЗАЦИЯ'}
                        </button>
                    </div>

                    {!isAdminOverride && (
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-red-400">
                                <span className="text-[10px]">⚠️</span>
                                <span className="text-[8px] font-black uppercase tracking-widest">Внимание: Ст. 16</span>
                            </div>
                            <p className="text-[8px] text-slate-500 leading-relaxed font-mono">
                                Доступ разрешен только дипломированным психологам. Любое использование в целях скрининга персонала или манипуляции запрещено Конституцией.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, t }) => {
  const [mode, setMode] = useState<'CLIENT' | 'PRO'>('CLIENT');
  const [agreed, setAgreed] = useState(false);
  
  const handleClientStart = () => {
      if (!agreed) {
          PlatformBridge.haptic.notification('error');
          return;
      }
      PlatformBridge.haptic.notification('success');
      onLogin("genesis_client", false);
  };

  const handleProAuth = async (pwd: string) => {
      if (pwd.toLowerCase() === "genesis_prime") {
          onLogin(pwd, false, 'LAB');
          return;
      }
      
      const license = SecurityCore.validateLicense(pwd);
      if (license.status === 'INVALID') {
          PlatformBridge.haptic.notification('error');
          return;
      }
      
      if (license.status === 'EXPIRED') {
          PlatformBridge.haptic.notification('warning');
          return;
      }

      const remote = await RemoteAccess.checkKeyStatus(pwd);
      if (remote.status === 'REVOKED') {
          PlatformBridge.haptic.notification('error');
          return;
      }

      onLogin('genesis_lab_entry', false, license.tier as SubscriptionTier);
  };

  if (mode === 'PRO') {
      return <ClinicalAirlock t={t} onAuth={handleProAuth} onBack={() => setMode('CLIENT')} />;
  }

  return (
    <div className="relative flex flex-col h-full bg-[#020617] text-white overflow-hidden select-none">
        
        {/* ATMOSPHERE */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

        {/* HERO */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative z-10 p-6">
            <div className="relative group cursor-pointer" onClick={() => PlatformBridge.haptic.impact('light')}>
                <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full animate-pulse-slow"></div>
                <Logo size="xl" className="relative z-10 drop-shadow-[0_0_50px_rgba(16,185,129,0.2)]" />
            </div>
            
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black italic tracking-tighter text-white leading-none">
                    GENESIS <span className="text-emerald-500">OS</span>
                </h1>
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">
                    Sovereign Psychometrics
                </p>
            </div>
        </div>

        {/* CLIENT INTERFACE */}
        <div className="bg-slate-950/80 backdrop-blur-xl border-t border-white/5 rounded-t-[2.5rem] p-6 pb-10 space-y-6 relative z-20 shadow-2xl">
            <div className="flex justify-center mb-2">
                <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
            </div>

            <div className="space-y-6 animate-in">
                {/* PRIVACY BADGE */}
                <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500">
                        🛡️
                    </div>
                    <div className="flex-1">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-300">Приватность по Дизайну</h4>
                        <p className="text-[9px] text-slate-500 leading-tight mt-1">
                            Данные шифруются на устройстве (Local-First). Сервер не имеет доступа к ответам.
                        </p>
                    </div>
                </div>

                {/* CONSENT */}
                <label className="flex items-start gap-4 p-2 cursor-pointer group">
                    <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${agreed ? 'bg-emerald-600 border-emerald-600' : 'border-slate-700 bg-slate-900 group-hover:border-slate-500'}`}>
                        {agreed && <span className="text-white text-[10px] font-black">✓</span>}
                    </div>
                    <input type="checkbox" className="hidden" checked={agreed} onChange={() => { PlatformBridge.haptic.selection(); setAgreed(!agreed); }} />
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-200 uppercase tracking-wide">Я принимаю условия</p>
                        <p className="text-[9px] text-slate-500 leading-tight">
                            Я понимаю, что это не медицинский диагноз, а инструмент для самоанализа.
                        </p>
                    </div>
                </label>

                {/* START BUTTON */}
                <button 
                    onClick={handleClientStart}
                    disabled={!agreed}
                    className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] border-b-4 
                        ${agreed 
                            ? 'bg-emerald-600 text-white border-emerald-800 shadow-emerald-900/20' 
                            : 'bg-slate-800 text-slate-600 border-slate-900 cursor-not-allowed'}`}
                >
                    ИНИЦИАЛИЗАЦИЯ
                </button>

                {/* PRO TOGGLE */}
                <div className="pt-4 flex justify-center">
                    <button 
                        onClick={() => { PlatformBridge.haptic.impact('medium'); setMode('PRO'); }}
                        className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 hover:text-indigo-400 transition-colors py-2 px-4 rounded-lg active:bg-slate-900"
                    >
                        <span>Я СПЕЦИАЛИСТ</span>
                        <span className="text-xs">➜</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
