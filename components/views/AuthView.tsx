import React, { useState, useEffect } from 'react';
import { Translations, SubscriptionTier } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { SecurityCore } from '../../utils/crypto';
import { RemoteAccess } from '../../services/remoteAccess';
import { SYSTEM_METADATA, SYSTEM_LINKS, PRICING_CONFIG } from '../../constants';
import { Logo } from '../Logo';

interface AuthViewProps {
  onLogin: (password: string, isDemo: boolean, tier?: SubscriptionTier) => boolean;
  t: Translations;
}

// --- SUB-COMPONENTS ---

const TierCard = ({ 
    title, 
    subtitle, 
    features, 
    isActive, 
    onClick, 
    color,
    price
}: { 
    title: string, 
    subtitle: string, 
    features: string[], 
    isActive: boolean, 
    onClick: () => void, 
    color: string,
    price: string
}) => (
    <button 
        onClick={onClick}
        className={`relative p-5 rounded-2xl border transition-all duration-300 w-full text-left group overflow-hidden
            ${isActive 
                ? `bg-${color}-950/40 border-${color}-500 shadow-[0_0_30px_rgba(var(--color-${color}),0.15)]` 
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
            }`}
    >
        {/* Active Glow */}
        {isActive && <div className={`absolute inset-0 bg-${color}-500/5 animate-pulse-slow`}></div>}
        
        <div className="relative z-10 flex justify-between items-start mb-3">
            <div>
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {title}
                </h3>
                <p className={`text-[8px] font-mono uppercase mt-1 ${isActive ? `text-${color}-400` : 'text-slate-600'}`}>
                    {subtitle}
                </p>
            </div>
            <div className="text-right">
                <span className={`text-[12px] font-black ${isActive ? 'text-white' : 'text-slate-500'}`}>{price}</span>
            </div>
        </div>

        <ul className="space-y-2">
            {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-[9px] font-medium text-slate-400">
                    <span className={`w-1 h-1 rounded-full ${isActive ? `bg-${color}-500` : 'bg-slate-700'}`}></span>
                    <span className={isActive ? 'text-slate-300' : 'text-slate-600'}>{f}</span>
                </li>
            ))}
        </ul>
    </button>
);

const SubscriptionModal = ({ onClose }: { onClose: () => void }) => {
    const handleSubscribe = () => {
        PlatformBridge.haptic.selection();
        PlatformBridge.openLink(SYSTEM_LINKS.TRIBUTE_SUB);
    };

    return (
        <div className="fixed inset-0 z-[110] bg-[#020617]/95 backdrop-blur-xl flex flex-col animate-in">
            <header className="p-6 flex justify-between items-center border-b border-white/5">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">GENESIS OS PRO</h2>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">✕</button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="text-center space-y-4 py-4">
                    <div className="w-20 h-20 mx-auto bg-indigo-500/10 rounded-full flex items-center justify-center text-4xl border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                        💎
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-white italic uppercase tracking-tight">КЛИНИЧЕСКИЙ ДОСТУП</h1>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono max-w-[200px] mx-auto">
                            Инструмент для глубинной работы и супервизии
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-1">
                    {[
                        { icon: '📂', title: 'Клиническое Досье', desc: 'Детальный разбор паттернов (20k+ слов).' },
                        { icon: '🧬', title: 'Нейронный След', desc: 'Timeline сопротивления и бифуркаций.' },
                        { icon: '🔭', title: 'Горизонт Событий', desc: 'Прогностическое моделирование и симуляция.' },
                        { icon: '🛡️', title: 'Суверенитет Данных', desc: 'Локальное шифрование и анонимность.' }
                    ].map((feat, i) => (
                        <div key={i} className="flex gap-4 p-4 border-b border-white/5 last:border-0">
                            <span className="text-xl">{feat.icon}</span>
                            <div>
                                <h3 className="text-[10px] font-black text-white uppercase tracking-wide">{feat.title}</h3>
                                <p className="text-[9px] text-slate-500 leading-snug mt-0.5">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 text-center space-y-4">
                    <div className="space-y-1">
                        <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-widest">СТОИМОСТЬ ЛИЦЕНЗИИ</span>
                        <div className="text-3xl font-black text-white">{PRICING_CONFIG.PLANS.PRO} {PRICING_CONFIG.CURRENCY} <span className="text-sm text-slate-500">/ МЕС</span></div>
                    </div>
                    <button 
                        onClick={handleSubscribe}
                        className="w-full py-4 bg-white text-indigo-950 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-indigo-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>ОФОРМИТЬ ЧЕРЕЗ TRIBUTE</span>
                        <span>→</span>
                    </button>
                    <p className="text-[7px] text-slate-500 uppercase tracking-widest opacity-60">
                        Платеж обрабатывается ботом Tribute. Подписку можно отменить в любой момент.
                    </p>
                </div>
            </div>
        </div>
    );
};

const AccessMatrixModal = ({ 
    onClose, 
    onSelect, 
    currentSelection 
}: { 
    onClose: () => void, 
    onSelect: (mode: 'GUEST' | 'SPECIALIST') => void,
    currentSelection: 'GUEST' | 'SPECIALIST'
}) => {
    return (
        <div className="fixed inset-0 z-[100] bg-[#020617]/90 backdrop-blur-xl flex flex-col animate-in">
            <header className="p-6 flex justify-between items-center border-b border-white/5">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">МАТРИЦА ДОСТУПА</h2>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">✕</button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <TierCard 
                    title="КЛИЕНТ" 
                    subtitle="ПРОХОЖДЕНИЕ ТЕСТА" 
                    price="СТАРТ"
                    features={["Карта Личности (Blueprint)", "Базовые метрики (F, A, R, E)", "Без сохранения истории"]}
                    isActive={currentSelection === 'GUEST'}
                    onClick={() => { onSelect('GUEST'); PlatformBridge.haptic.selection(); onClose(); }}
                    color="emerald"
                />
                
                <TierCard 
                    title="СПЕЦИАЛИСТ" 
                    subtitle="Pro License" 
                    price={`${PRICING_CONFIG.PLANS.PRO} ${PRICING_CONFIG.CURRENCY}/мес`}
                    features={["Клиническое Досье (20k слов)", "Нейронный След (Timeline)", "Инструменты Терапии", "Сохранение сессий"]}
                    isActive={currentSelection === 'SPECIALIST'}
                    onClick={() => { onSelect('SPECIALIST'); PlatformBridge.haptic.selection(); onClose(); }}
                    color="indigo"
                />

                <div className="mt-8 p-4 rounded-xl bg-slate-900 border border-white/5 text-center">
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest leading-relaxed">
                        Согласно Статье 24 Конституции, базовый функционал всегда доступен бесплатно для самопознания.
                    </p>
                </div>
            </div>
        </div>
    );
};

const ClinicalAirlock = ({ onAuth, onBack }: { onAuth: (k: string) => void, onBack: () => void }) => {
    const [key, setKey] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [isAdminOverride, setIsAdminOverride] = useState(false);
    const [showSubModal, setShowSubModal] = useState(false);

    useEffect(() => {
        const cached = localStorage.getItem('genesis_license_cache');
        if (cached) setKey(cached);
    }, []);

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
            {showSubModal && <SubscriptionModal onClose={() => setShowSubModal(false)} />}

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
                                onChange={e => { setKey(e.target.value); }}
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

                        {!isAdminOverride && (
                            <button 
                                onClick={() => setShowSubModal(true)}
                                className="w-full py-3 rounded-xl border border-indigo-500/20 bg-indigo-900/10 text-indigo-400 font-black uppercase text-[8px] tracking-[0.2em] hover:bg-indigo-900/20 transition-all active:scale-95"
                            >
                                НЕТ ЛИЦЕНЗИИ? ОФОРМИТЬ ДОСТУП
                            </button>
                        )}
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

const ConsentBlock = ({
  content,
  isExpanded,
  onToggle,
}: {
  content: any;
  isExpanded: boolean;
  onToggle: () => void;
}) => (
  <div className="font-mono text-xs text-slate-300 bg-slate-900/40 border border-slate-700 rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center p-4 text-left group"
      aria-expanded={isExpanded}
      aria-controls="consent-details"
    >
      <h3 className="font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">
        {content.title}
      </h3>
      <span className="text-[9px] font-black text-slate-500 tracking-widest group-hover:text-white transition-colors">
        {isExpanded ? 'СВЕРНУТЬ ▲' : 'ДЕТАЛИ ▼'}
      </span>
    </button>
    <div
      id="consent-details"
      className={`transition-all duration-500 ease-in-out grid ${
        isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}
    >
      <div className="overflow-hidden">
        <div className="space-y-3 p-4 pt-2 border-t border-slate-700/50">
          <div className="space-y-2">
            <p className="font-bold text-slate-200">{content.measures_title}</p>
            <ul className="pl-4 text-slate-400">
              {content.measures.map((item: string, i: number) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-slate-200">{content.usage_title}</p>
            <ul className="pl-4 text-slate-400">
              {content.usage.map((item: string, i: number) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-slate-200">{content.data_title}</p>
            <ul className="pl-4 text-slate-400">
              {content.data.map((item: string, i: number) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, t }) => {
  const [mode, setMode] = useState<'CLIENT' | 'PRO'>('CLIENT');
  const [selectedAccess, setSelectedAccess] = useState<'GUEST' | 'SPECIALIST'>('GUEST');
  const [showMatrix, setShowMatrix] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isConsentExpanded, setIsConsentExpanded] = useState(false);
  
  const handleClientStart = () => {
      if (!agreed) {
          PlatformBridge.haptic.notification('error');
          return;
      }
      PlatformBridge.haptic.notification('success');
      
      if (selectedAccess === 'SPECIALIST') {
          setMode('PRO');
      } else {
          onLogin("genesis_client", false);
      }
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

      localStorage.setItem('genesis_license_cache', pwd);
      onLogin('genesis_lab_entry', false, license.tier as SubscriptionTier);
  };

  if (mode === 'PRO') {
      return <ClinicalAirlock onAuth={handleProAuth} onBack={() => setMode('CLIENT')} />;
  }

  return (
    <div className="relative flex flex-col h-full bg-[#020617] text-white overflow-hidden select-none">
        
        {showMatrix && (
            <AccessMatrixModal 
                onClose={() => setShowMatrix(false)} 
                onSelect={setSelectedAccess} 
                currentSelection={selectedAccess} 
            />
        )}

        {/* ATMOSPHERE */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

        {/* HERO */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 relative z-10 p-6 pt-10">
            <div className="relative group cursor-pointer" onClick={() => PlatformBridge.haptic.impact('light')}>
                <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full animate-pulse-slow"></div>
                <Logo size="xl" className="relative z-10 drop-shadow-[0_0_50px_rgba(16,185,129,0.2)]" />
            </div>
            
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black italic tracking-tighter text-white leading-none">
                    GENESIS <span className="text-emerald-500">OS</span>
                </h1>
                <p className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-500">
                    Sovereign Psychometrics
                </p>
            </div>
        </div>

        {/* AUTH INTERFACE */}
        <div className="bg-slate-950/80 backdrop-blur-xl border-t border-white/5 rounded-t-[2.5rem] p-6 pb-10 space-y-6 relative z-20 shadow-2xl">
            <div className="flex justify-center mb-2">
                <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
            </div>

            <div className="space-y-6 animate-in">
                
                {/* MODE SELECTION BUTTON */}
                <button 
                    onClick={() => { setShowMatrix(true); PlatformBridge.haptic.selection(); }}
                    className="w-full flex justify-between items-center p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group"
                >
                    <div className="flex flex-col text-left">
                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">РЕЖИМ ДОСТУПА</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs font-black uppercase ${selectedAccess === 'GUEST' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                {selectedAccess === 'GUEST' ? 'КЛИЕНТ (ТЕСТ)' : 'СПЕЦИАЛИСТ (PRO)'}
                            </span>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                        ⚙️
                    </div>
                </button>

                {/* CONSENT (Art. 15) */}
                <ConsentBlock 
                    content={t.informed_consent} 
                    isExpanded={isConsentExpanded}
                    onToggle={() => {
                        PlatformBridge.haptic.selection();
                        setIsConsentExpanded(!isConsentExpanded);
                    }}
                />
                <label className="flex items-center gap-4 p-2 cursor-pointer group">
                    <div className={`w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center transition-all ${agreed ? 'bg-emerald-600 border-emerald-600' : 'border-slate-700 bg-slate-900 group-hover:border-slate-500'}`}>
                        {agreed && <span className="text-white text-[10px] font-black">✓</span>}
                    </div>
                    <input type="checkbox" className="hidden" checked={agreed} onChange={() => { PlatformBridge.haptic.selection(); setAgreed(!agreed); }} />
                    <span className="text-xs text-slate-300 font-medium leading-tight">
                        {t.informed_consent.checkbox}
                    </span>
                </label>

                {/* ACTION BUTTON */}
                <button 
                    onClick={handleClientStart}
                    disabled={!agreed}
                    className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] border-b-4 
                        ${agreed 
                            ? selectedAccess === 'GUEST' 
                                ? 'bg-emerald-600 text-white border-emerald-800 shadow-emerald-900/20' 
                                : 'bg-indigo-600 text-white border-indigo-800 shadow-indigo-900/20'
                            : 'bg-slate-800 text-slate-600 border-slate-900 cursor-not-allowed'}`}
                >
                    {selectedAccess === 'GUEST' ? 'НАЧАТЬ СЕССИЮ' : 'ВВЕСТИ КЛЮЧ'}
                </button>
            </div>
        </div>
    </div>
  );
};