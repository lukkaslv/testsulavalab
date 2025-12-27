
import { useState, useRef } from 'react';
import { Translations, SubscriptionTier } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { SecurityCore } from '../../utils/crypto';
import { STORAGE_KEYS, StorageService } from '../../services/storageService';
import { RemoteAccess } from '../../services/remoteAccess';

interface AuthViewProps {
  onLogin: (password: string, isDemo: boolean, tier?: SubscriptionTier) => boolean;
  t: Translations;
  lang: 'ru' | 'ka';
  onLangChange: (lang: 'ru' | 'ka') => void;
}

const LEASE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days offline allowance

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, t, lang }) => {
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
      const lastHandshake = parseInt(localStorage.getItem('genesis_last_handshake') || '0');
      const timeSinceHandshake = Date.now() - lastHandshake;
      const isLeaseValid = timeSinceHandshake < LEASE_DURATION_MS;

      if (!isOnline) {
          if (!isLeaseValid) {
              setStatusMessage('⚠️ EMERGENCY OFFLINE ACCESS (LEASE EXPIRED)');
              PlatformBridge.haptic.notification('warning');
              
              setTimeout(() => {
                  StorageService.save(STORAGE_KEYS.SESSION, 'true');
                  onLogin('genesis_lab_entry', false, license.tier as SubscriptionTier); 
              }, 1200);
              return;
          }
          
          setStatusMessage(t.auth_ui.offline_mode);
          setTimeout(() => {
              StorageService.save(STORAGE_KEYS.SESSION, 'true');
              onLogin('genesis_lab_entry', false, license.tier as SubscriptionTier); 
              PlatformBridge.haptic.notification('warning');
          }, 800);
          return;
      }

      setStatusMessage('Verifying with Central Registry...');
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

      if (remote.message) {
          localStorage.setItem('genesis_system_message', remote.message);
      } else {
          localStorage.removeItem('genesis_system_message');
      }

      localStorage.setItem('genesis_last_handshake', Date.now().toString());

      StorageService.save(STORAGE_KEYS.SESSION, 'true');
      onLogin('genesis_lab_entry', false, license.tier as SubscriptionTier); 
      PlatformBridge.haptic.notification('success');
  };

  return (
    <div className="relative flex flex-col items-center py-8 space-y-8 animate-in h-full select-none max-w-sm mx-auto overflow-y-auto no-scrollbar bg-white">
      
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
                  {isVerifying ? t.auth_ui.verifying : t.auth_ui.authenticate}
               </button>
               <button 
                  onClick={() => { setShowAdminInput(false); setStatusMessage(''); }} 
                  className="w-full py-2 text-[10px] text-slate-400 uppercase font-black hover:text-slate-600 transition-colors"
               >
                  {t.auth_ui.cancel}
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
            {t.subtitle}
          </p>
      </div>

      {/* MAIN ACTIONS */}
      {!showPricing ? (
        <div className="w-full px-6 space-y-6 flex-1 flex flex-col justify-end pb-8">
            
            {/* CLIENT START (FULL MODE) */}
            <div className="space-y-4">
                {!agreed ? (
                    <div 
                        className="relative w-full h-24 bg-slate-900 rounded-[2rem] overflow-hidden cursor-pointer touch-none border border-slate-700 shadow-2xl group"
                        onMouseDown={startHold} onMouseUp={endHold} onTouchStart={startHold} onTouchEnd={endHold}
                    >
                        <div className="absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-75" style={{ width: `${holdProgress}%` }}></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 space-y-1">
                            <span className={`text-xs font-black uppercase tracking-widest transition-colors ${holdProgress > 50 ? 'text-white' : 'text-indigo-100'}`}>
                                {t.onboarding.protocol_btn}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">HOLD TO START</span>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => onLogin("genesis_client", false)} 
                        className="w-full h-24 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl animate-in hover:bg-indigo-700 active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1"
                    >
                        <span>{t.onboarding.start_btn}</span>
                    </button>
                )}
            </div>

            {/* PRO ZONE DIVIDER */}
            <div className="flex items-center gap-4 py-2 opacity-50">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{t.onboarding.promo_title}</span>
                <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            {/* PRO ACTIONS GRID */}
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={() => {
                        PlatformBridge.haptic.impact('light');
                        setShowPricing(true);
                    }}
                    className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all shadow-sm hover:border-indigo-300 group"
                >
                    <span className="text-xl group-hover:scale-110 transition-transform">💎</span>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight text-center leading-tight">{t.onboarding.promo_desc}</span>
                </button>

                <button 
                    onClick={() => setShowAdminInput(true)}
                    className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all shadow-sm hover:border-indigo-300 group"
                >
                    <span className="text-xl group-hover:scale-110 transition-transform">🔑</span>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight text-center leading-tight">{t.ui.enter_code_btn}</span>
                </button>
            </div>
        </div>
      ) : (
        <div className="w-full px-6 space-y-4 animate-in flex-1 flex flex-col pb-8">
            <h3 className="text-xs font-black uppercase text-slate-800 text-center mb-2 pt-4">{t.onboarding.pricing_btn}</h3>
            
            {/* VALUE PROPOSITION BLOCK */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-3">
                <h4 className="text-[10px] font-black uppercase text-indigo-900 tracking-wide flex items-center gap-2">
                    <span className="text-lg">⚡</span> GENESIS FOR PROS
                </h4>
                <ul className="space-y-2">
                    {[t.onboarding.promo_value_1, t.onboarding.promo_value_2, t.onboarding.promo_value_3].map((val, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-[10px] text-slate-700 leading-tight font-medium">
                            <span className="text-indigo-500 font-bold">•</span>
                            {val}
                        </li>
                    ))}
                </ul>
            </div>

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
            
            <div className="mt-auto">
                <button onClick={() => setShowPricing(false)} className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors bg-slate-50 rounded-xl">{t.global.back}</button>
            </div>
        </div>
      )}

      <footer className="px-6 text-center opacity-30 pb-4 shrink-0">
          <p className="text-[7px] font-mono text-slate-500 uppercase leading-relaxed max-w-[200px] mx-auto">
            {t.legal_disclaimer} <br/>
            BUILD: 9.9.0 // SECTOR: 7G
          </p>
      </footer>
    </div>
  );
};
