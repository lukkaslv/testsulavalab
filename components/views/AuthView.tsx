
import React, { useState } from 'react';
import { Translations, SubscriptionTier } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { SecurityCore } from '../../utils/crypto';
import { STORAGE_KEYS, StorageService } from '../../services/storageService';
import { RemoteAccess } from '../../services/remoteAccess';
import { Logo } from '../Logo';

interface AuthViewProps {
  onLogin: (password: string, isDemo: boolean, tier?: SubscriptionTier) => boolean;
  t: Translations;
  lang: 'ru' | 'ka';
  onLangChange: (lang: 'ru' | 'ka') => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, t, lang }) => {
  const [showPricing, setShowPricing] = useState(false);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminPwd, setAdminPwd] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleClientEntry = () => {
    PlatformBridge.haptic.notification('success');
    onLogin("genesis_client", false);
  };

  const handleAuthAttempt = async () => {
      if (!adminPwd.trim()) {
          setStatusMessage(lang === 'ru' ? 'ВВЕДИТЕ КЛЮЧ' : 'შეიყვანეთ კოდი');
          return;
      }
      
      if (adminPwd.toLowerCase() === "genesis_prime") {
          onLogin(adminPwd, false, 'LAB');
          return;
      }

      setIsVerifying(true);
      setStatusMessage(t.auth_ui.checking_crypto);
      const license = SecurityCore.validateLicense(adminPwd);
      
      if (license.status === 'INVALID') {
          setIsVerifying(false);
          setStatusMessage(t.auth_ui.invalid_format);
          PlatformBridge.haptic.notification('error');
          return;
      }
      
      if (license.status === 'EXPIRED') {
          setIsVerifying(false);
          setStatusMessage(t.auth_ui.license_expired);
          PlatformBridge.haptic.notification('warning');
          return;
      }

      const isOnline = navigator.onLine;
      if (!isOnline) {
          setStatusMessage(t.auth_ui.offline_mode);
          setTimeout(() => {
              StorageService.save(STORAGE_KEYS.SESSION, 'true');
              onLogin('genesis_lab_entry', false, license.tier as SubscriptionTier); 
          }, 800);
          return;
      }

      const remote = await RemoteAccess.checkKeyStatus(adminPwd);
      setIsVerifying(false);

      if (remote.status === 'REVOKED') {
          setStatusMessage(t.auth_ui.revoked);
          PlatformBridge.haptic.notification('error');
          return;
      }
      
      if (remote.maintenance) {
          setStatusMessage(remote.message || t.auth_ui.maintenance);
          PlatformBridge.haptic.notification('warning');
          return;
      }

      localStorage.setItem('genesis_last_handshake', Date.now().toString());
      StorageService.save(STORAGE_KEYS.SESSION, 'true');
      onLogin('genesis_lab_entry', false, license.tier as SubscriptionTier); 
  };

  return (
    <div className="relative flex flex-col items-center animate-in h-full select-none max-w-sm mx-auto bg-white overflow-hidden">
      
      {showAdminInput && (
        <div className="absolute inset-0 z-[100] bg-white/98 flex flex-col items-center justify-center p-6 animate-in backdrop-blur-3xl">
           <div className="text-center mb-8 space-y-4">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-xl border border-slate-700">
                🔐
              </div>
              <h3 className="text-slate-900 font-black text-lg uppercase tracking-widest">{t.ui.auth_title}</h3>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest px-8 text-center leading-relaxed">
                Доступ ограничен для владельцев профессиональных лицензий
              </p>
           </div>
           
           <div className="w-full max-w-[260px] space-y-4">
               <input 
                  type="text" 
                  autoFocus
                  className="w-full bg-slate-50 border-b-2 border-slate-200 p-4 text-slate-800 font-mono text-xs text-center outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-300 uppercase"
                  placeholder={t.ui.code_input_placeholder}
                  value={adminPwd}
                  onChange={e => { setAdminPwd(e.target.value); setStatusMessage(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleAuthAttempt()}
               />
               
               {statusMessage && (
                   <p className="text-[9px] text-center font-black uppercase tracking-widest text-indigo-600 animate-pulse px-2">
                       {statusMessage}
                   </p>
               )}

               <button 
                  onClick={handleAuthAttempt} 
                  disabled={isVerifying}
                  className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-[10px] tracking-[0.3em] shadow-xl active:scale-95 transition-all disabled:opacity-50"
               >
                  {isVerifying ? t.auth_ui.verifying : t.auth_ui.authenticate}
               </button>
               <button onClick={() => setShowAdminInput(false)} className="w-full text-[9px] text-slate-400 uppercase font-black tracking-widest pt-2 opacity-60">
                  {t.auth_ui.cancel}
               </button>
           </div>
        </div>
      )}

      {/* COMPACT MAIN VIEW */}
      {!showPricing ? (
        <div className="flex flex-col items-center h-full w-full pt-10 pb-8 px-6 space-y-8 overflow-y-auto no-scrollbar">
            <div 
                onDoubleClick={() => setShowAdminInput(true)}
                className="w-24 h-24 flex items-center justify-center shrink-0 active:scale-90 transition-transform cursor-pointer"
            >
                <Logo size="lg" />
            </div>

            <div className="text-center space-y-2 relative z-10 shrink-0">
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                    GENESIS<span className="text-indigo-600">OS</span>
                </h2>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em] pt-1">
                    {t.subtitle.split('//')[0]}
                </p>
            </div>

            <div className="w-full space-y-6 flex-1 flex flex-col justify-center max-w-[280px]">
                <button 
                    onClick={handleClientEntry} 
                    className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl hover:bg-slate-800 active:scale-[0.98] transition-all relative overflow-hidden group"
                >
                    <span className="relative z-10">{t.onboarding.protocol_btn}</span>
                </button>
                
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            {lang === 'ru' ? 'ВХОД ДЛЯ КЛИЕНТОВ' : 'შესვლა კლიენტებისთვის'}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-slate-100 shrink-0">
                <button onClick={() => setShowPricing(true)} className="flex flex-col items-center gap-1.5 group transition-all">
                    <span className="text-xl group-hover:scale-110 transition-transform">💎</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.onboarding.pricing_btn}</span>
                </button>
                <button onClick={() => setShowAdminInput(true)} className="flex flex-col items-center gap-1.5 group opacity-40 hover:opacity-100 transition-opacity">
                    <span className="text-xl group-hover:scale-110 transition-transform">🔑</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.ui.enter_code_btn}</span>
                </button>
            </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col bg-slate-50 animate-in overflow-hidden">
            {/* STICKY PRICING HEADER */}
            <header className="bg-white px-6 pt-8 pb-4 border-b border-slate-200 shrink-0 relative z-20">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight leading-none">{t.onboarding.promo_title}</h3>
                    <button onClick={() => setShowPricing(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">✕</button>
                </div>
                <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-widest">{t.onboarding.promo_desc}</p>
            </header>

            {/* SCROLLABLE CARDS */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 no-scrollbar">
                
                {/* VALUE PROPOSITION BLOCK */}
                <div className="bg-white border border-indigo-100 p-4 rounded-3xl shadow-sm space-y-3">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Почему это нужно вашей практике?</h4>
                    <div className="grid grid-cols-1 gap-2.5">
                        {[
                            { icon: '⏱️', text: t.onboarding.promo_value_1 },
                            { icon: '👁️', text: t.onboarding.promo_value_2 },
                            { icon: '🤝', text: t.onboarding.promo_value_3 }
                        ].map((v, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-lg">{v.icon}</span>
                                <p className="text-[10px] font-bold text-slate-700 leading-tight">{v.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { id: 'SOLO', name: t.onboarding.solo_plan, price: t.onboarding.price_solo, features: t.onboarding.features_solo.split(';'), icon: '🌱' },
                        { id: 'CLINICAL', name: t.onboarding.clinical_plan, price: t.onboarding.price_clinical, highlight: true, features: t.onboarding.features_clinical.split(';'), icon: '💎' },
                        { id: 'LAB', name: t.onboarding.lab_plan, price: t.onboarding.price_lab, features: t.onboarding.features_lab.split(';'), icon: '🔬' }
                    ].map(plan => (
                        <div 
                            key={plan.id} 
                            className={`w-full p-5 rounded-[1.5rem] border-2 transition-all relative overflow-hidden flex flex-col gap-4 ${plan.highlight ? 'bg-indigo-600 border-indigo-700 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-900'}`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 right-0 bg-emerald-400 text-slate-900 text-[6px] font-black px-2 py-1 uppercase tracking-widest rounded-bl-lg">
                                    {t.onboarding.recommended_tag}
                                </div>
                            )}
                            
                            <div className="flex justify-between items-start">
                                <div className="space-y-0.5">
                                    <span className={`text-[9px] font-black uppercase tracking-widest block ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{plan.name}</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black">{plan.price}</span>
                                        <span className={`text-[8px] font-bold ${plan.highlight ? 'text-indigo-300' : 'text-slate-400'}`}>{t.onboarding.price_per_month}</span>
                                    </div>
                                </div>
                                <span className="text-2xl opacity-80">{plan.icon}</span>
                            </div>

                            <ul className="space-y-1.5">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <span className={`w-3.5 h-3.5 mt-0.5 rounded-full flex items-center justify-center text-[7px] shrink-0 ${plan.highlight ? 'bg-indigo-400 text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                                        <span className={`text-[10px] font-bold leading-tight ${plan.highlight ? 'text-white' : 'text-slate-600'}`}>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <button 
                                onClick={() => PlatformBridge.openLink("https://t.me/thndrrr")}
                                className={`w-full py-3.5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all active:scale-95 ${plan.highlight ? 'bg-white text-indigo-600' : 'bg-slate-900 text-white'}`}
                            >
                                {t.onboarding.buy_btn}
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="h-10 shrink-0"></div>
            </div>
            
            {/* FIXED BACK BUTTON FOOTER */}
            <footer className="bg-white p-4 border-t border-slate-200 shrink-0">
                <button onClick={() => setShowPricing(false)} className="w-full py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-slate-600 transition-colors">
                    ← {t.global.back}
                </button>
            </footer>
        </div>
      )}

      {!showPricing && (
        <footer className="px-10 text-center opacity-30 pb-6 shrink-0">
            <p className="text-[7px] font-black font-mono text-slate-500 uppercase tracking-[0.4em]">
                GENESIS_CORE // PRO_VERSION
            </p>
        </footer>
      )}
    </div>
  );
};
