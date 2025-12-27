
import React, { useState, useRef, useEffect } from 'react';
import { Translations } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { SecurityCore } from '../../utils/crypto';
import { STORAGE_KEYS, StorageService } from '../../services/storageService';
import { RemoteAccess } from '../../services/remoteAccess';

interface AuthViewProps {
  onLogin: (password: string, isDemo: boolean) => boolean;
  t: Translations;
  lang: 'ru' | 'ka';
  onLangChange: (lang: 'ru' | 'ka') => void;
}

const LEASE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days offline allowance

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, t, lang, onLangChange }) => {
  const [agreed, setAgreed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showPricing, setShowPricing] = useState(false);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminPwd, setAdminPwd] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  const holdInterval = useRef<number | null>(null);

  const startHold = () => {
    if (agreed) return;
    PlatformBridge.haptic.impact('light');
    holdInterval.current = window.setInterval(() => {
        setHoldProgress(prev => {
            if (prev >= 100) {
                clearInterval(holdInterval.current!);
                PlatformBridge.haptic.notification('success');
                setAgreed(true);
                return 100;
            }
            return prev + 5; 
        });
    }, 50);
  };

  const endHold = () => {
    if (agreed) return;
    if (holdInterval.current) clearInterval(holdInterval.current);
    setHoldProgress(0);
  };

  const handleContactSales = () => {
      PlatformBridge.haptic.impact('medium');
      PlatformBridge.openLink("https://t.me/thndrrr");
  };

  const handleAuthAttempt = async () => {
      // 1. Check if it's a hardcoded admin/demo key (Bypass everything)
      if (adminPwd.toLowerCase() === "genesis_prime") {
          onLogin(adminPwd, false);
          return;
      }

      // 2. Validate format & math (Offline Check)
      setIsVerifying(true);
      setStatusMessage('Checking Cryptography...');
      
      const license = SecurityCore.validateLicense(adminPwd);
      
      if (license.status === 'INVALID') {
          setIsVerifying(false);
          setStatusMessage('Invalid License Key Format');
          PlatformBridge.haptic.notification('error');
          return;
      }

      if (license.status === 'EXPIRED') {
          setIsVerifying(false);
          setStatusMessage(lang === 'ru' ? 'LICENSE EXPIRED' : 'ვადაგასული ლიცენზია');
          PlatformBridge.haptic.notification('warning');
          return;
      }

      // 3. OVERSIGHT PROTOCOL (Layer 3 Defense)
      const isOnline = navigator.onLine;
      const lastHandshake = parseInt(localStorage.getItem('genesis_last_handshake') || '0');
      const timeSinceHandshake = Date.now() - lastHandshake;
      const isLeaseValid = timeSinceHandshake < LEASE_DURATION_MS;

      if (!isOnline) {
          // OFFLINE MODE LOGIC
          if (!isLeaseValid) {
              // Red Team Mitigation: Prevent eternal offline use of generated keys
              setIsVerifying(false);
              setStatusMessage('SECURITY LEASE EXPIRED. ONLINE SYNC REQUIRED.');
              PlatformBridge.haptic.notification('error');
              return;
          }
          
          // Allow access if lease is valid, but warn
          setStatusMessage('OFFLINE MODE: VALIDATING VIA CACHE...');
          setTimeout(() => {
              StorageService.save(STORAGE_KEYS.SESSION, 'true');
              onLogin('genesis_lab_entry', false); 
              PlatformBridge.haptic.notification('warning');
          }, 800);
          return;
      }

      // ONLINE MODE LOGIC
      setStatusMessage('Verifying with Central Registry...');
      const remote = await RemoteAccess.checkKeyStatus(adminPwd);

      setIsVerifying(false);

      if (remote.status === 'REVOKED') {
          setStatusMessage('LICENSE REVOKED BY ISSUER');
          PlatformBridge.haptic.notification('error');
          return;
      }

      if (remote.maintenance) {
          setStatusMessage(remote.message || 'SYSTEM MAINTENANCE MODE');
          PlatformBridge.haptic.notification('warning');
          return;
      }

      // Success (Valid Math + Not Revoked + Not Maintenance)
      // Save broadcast message if any
      if (remote.message) {
          localStorage.setItem('genesis_system_message', remote.message);
      } else {
          localStorage.removeItem('genesis_system_message');
      }

      // UPDATE LEASE TIMESTAMP
      localStorage.setItem('genesis_last_handshake', Date.now().toString());

      StorageService.save(STORAGE_KEYS.SESSION, 'true');
      onLogin('genesis_lab_entry', false); 
      PlatformBridge.haptic.notification('success');
  };

  return (
    <div className="relative flex flex-col items-center py-8 space-y-8 animate-in h-full select-none max-w-sm mx-auto overflow-y-auto no-scrollbar bg-white">
      
      {/* LANGUAGE SWITCHER AT TOP */}
      <div className="absolute top-4 right-4 z-50 flex gap-1 p-1 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => { onLangChange('ru'); PlatformBridge.haptic.impact('light'); }}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${lang === 'ru' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
          >
            RU
          </button>
          <button 
            onClick={() => { onLangChange('ka'); PlatformBridge.haptic.impact('light'); }}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${lang === 'ka' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
          >
            KA
          </button>
      </div>

      {/* ACCESS CODE INPUT MODAL */}
      {showAdminInput && (
        <div className="absolute inset-0 z-[100] bg-slate-50/98 flex flex-col items-center justify-center p-6 animate-in rounded-3xl backdrop-blur-xl">
           <div className="text-center mb-6 space-y-2">
              <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                🔑
              </div>
              <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest">{t.ui.auth_title}</h3>
           </div>
           
           <div className="w-full max-w-[240px] space-y-4">
               <input 
                  type="text" 
                  autoFocus
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-800 font-mono text-xs text-center outline-none focus:border-indigo-500 transition-all shadow-sm placeholder:text-slate-300"
                  placeholder={t.ui.code_input_placeholder}
                  value={adminPwd}
                  onChange={e => { setAdminPwd(e.target.value); setStatusMessage(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleAuthAttempt()}
                  disabled={isVerifying}
               />
               
               {statusMessage && (
                   <p className={`text-[9px] text-center font-bold uppercase ${statusMessage.includes('REVOKED') || statusMessage.includes('Invalid') || statusMessage.includes('EXPIRED') ? 'text-red-500' : 'text-indigo-500 animate-pulse'}`}>
                       {statusMessage}
                   </p>
               )}

               <button 
                  onClick={handleAuthAttempt} 
                  disabled={isVerifying}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-50"
               >
                  {isVerifying ? 'Verifying...' : 'Authenticate'}
               </button>
               <button 
                  onClick={() => { setShowAdminInput(false); setStatusMessage(''); }} 
                  className="w-full py-2 text-[10px] text-slate-400 uppercase font-black hover:text-slate-600 transition-colors"
               >
                  Cancel
               </button>
           </div>
        </div>
      )}

      {/* LOGO SECTION */}
      <div 
        onDoubleClick={() => {
            PlatformBridge.haptic.impact('heavy');
            setShowAdminInput(true);
        }}
        className="w-20 h-20 bg-slate-950 rounded-[2.5rem] flex items-center justify-center text-indigo-500 font-black text-3xl border border-indigo-500/10 shadow-2xl shrink-0 group relative overflow-hidden active:scale-95 transition-transform mt-6"
      >
        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 animate-pulse"></div>
        G
      </div>

      <div className="text-center space-y-2 px-6">
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">{t.onboarding.title}</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] leading-relaxed">
            {lang === 'ka' ? 'კლინიკური ხიდი // პროფესიული სკრინინგი' : t.subtitle}
          </p>
      </div>

      {/* PRICING DISCOVERY */}
      {!showPricing ? (
        <div className="w-full px-6 space-y-6 flex-1 flex flex-col">
            <button 
                onClick={() => {
                    PlatformBridge.haptic.impact('light');
                    setShowPricing(true);
                }}
                className="w-full p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-between group active:scale-95 transition-all shadow-sm"
            >
                <div className="text-left">
                    <span className="text-[9px] font-black text-indigo-600 uppercase block">{t.onboarding.promo_title}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{t.onboarding.promo_desc}</span>
                </div>
                <span className="text-indigo-400 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all text-xl">💎</span>
            </button>

            <div className="space-y-4">
                {!agreed ? (
                    <div 
                        className="relative w-full h-20 bg-slate-50 rounded-[2rem] overflow-hidden cursor-pointer touch-none border border-slate-200 shadow-inner"
                        onMouseDown={startHold} onMouseUp={endHold} onTouchStart={startHold} onTouchEnd={endHold}
                    >
                        <div className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-75" style={{ width: `${holdProgress}%` }}></div>
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${holdProgress > 50 ? 'text-white' : 'text-slate-400'}`}>
                                {t.onboarding.protocol_btn}
                            </span>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => onLogin("", true)} className="w-full h-20 bg-slate-950 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl animate-in hover:bg-slate-900 active:scale-[0.98] transition-all">
                        {t.onboarding.start_btn}
                    </button>
                )}
            </div>

            {/* NEW EXPLICIT CODE ENTRY BUTTON */}
            <div className="text-center pt-2">
                <button 
                    onClick={() => setShowAdminInput(true)}
                    className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-dashed border-slate-300 pb-1 hover:text-indigo-600 hover:border-indigo-600 transition-all"
                >
                    {t.ui.enter_code_btn}
                </button>
            </div>
        </div>
      ) : (
        <div className="w-full px-6 space-y-4 animate-in">
            <h3 className="text-xs font-black uppercase text-slate-800 text-center mb-2">{t.onboarding.pricing_btn}</h3>
            {[
                { id: 'SOLO', name: t.onboarding.solo_plan, desc: lang === 'ka' ? "პირადი მოხმარება, 10 კლიენტი" : "Личное использование, 10 клиентов", price: t.onboarding.price_solo },
                { id: 'CLINICAL', name: t.onboarding.clinical_plan, desc: lang === 'ka' ? "ღრმა დიაგნოსტიკა, 50 კლიენტი" : "Глубокая диагностика, 50 клиентов", price: t.onboarding.price_clinical, highlight: true },
                { id: 'LAB', name: t.onboarding.lab_plan, desc: lang === 'ka' ? "სრული წვდომა, შეუზღუდავი" : "Полный доступ, без ограничений", price: t.onboarding.price_lab }
            ].map(plan => (
                <button 
                    key={plan.id} 
                    onClick={handleContactSales}
                    className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all active:scale-[0.98] ${plan.highlight ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-800'}`}
                >
                    <div className="space-y-1">
                        <span className="text-[11px] font-black uppercase block">{plan.name}</span>
                        <span className={`text-[9px] opacity-70 block leading-tight ${plan.highlight ? 'text-indigo-100' : 'text-slate-500'}`}>{plan.desc}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-black block">{plan.price}</span>
                        <span className={`text-[7px] font-bold uppercase opacity-60 ${plan.highlight ? 'text-white' : 'text-slate-400'}`}>{t.onboarding.price_per_month}</span>
                    </div>
                </button>
            ))}
            <button onClick={() => setShowPricing(false)} className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">{t.global.back}</button>
        </div>
      )}

      <footer className="px-6 text-center opacity-30 mt-auto pb-4">
          <p className="text-[7px] font-mono text-slate-500 uppercase leading-relaxed max-w-[200px] mx-auto">
            {t.legal_disclaimer} <br/>
            BUILD: 9.8.7 // SECTOR: 7G
          </p>
      </footer>
    </div>
  );
};
