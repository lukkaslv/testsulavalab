
import { useState } from 'react';
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
    // Automatic invisible login for the client
    onLogin("genesis_client", false);
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
      if (!isOnline) {
          setStatusMessage(t.auth_ui.offline_mode);
          setTimeout(() => {
              StorageService.save(STORAGE_KEYS.SESSION, 'true');
              onLogin('genesis_lab_entry', false, license.tier as SubscriptionTier); 
          }, 800);
          return;
      }

      setStatusMessage('VERIFYING_CREDENTIALS...');
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
    <div className="relative flex flex-col items-center py-12 space-y-12 animate-in h-full select-none max-w-sm mx-auto overflow-y-auto no-scrollbar bg-white">
      
      {/* PROFESSIONAL GATEWAY (HIDDEN MODAL) */}
      {showAdminInput && (
        <div className="absolute inset-0 z-[100] bg-white/98 flex flex-col items-center justify-center p-6 animate-in backdrop-blur-3xl">
           <div className="text-center mb-10 space-y-4">
              <div className="w-20 h-20 bg-slate-900 rounded-full mx-auto flex items-center justify-center text-3xl shadow-2xl border border-slate-700">
                🔐
              </div>
              <h3 className="text-slate-900 font-black text-xl uppercase tracking-widest">{t.ui.auth_title}</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-10">
                Вход только для владельцев профессиональных лицензий
              </p>
           </div>
           
           <div className="w-full max-w-[280px] space-y-5">
               <input 
                  type="text" 
                  autoFocus
                  className="w-full bg-slate-50 border-b-4 border-slate-200 p-5 text-slate-800 font-mono text-sm text-center outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-300 uppercase"
                  placeholder={t.ui.code_input_placeholder}
                  value={adminPwd}
                  onChange={e => { setAdminPwd(e.target.value); setStatusMessage(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleAuthAttempt()}
               />
               
               {statusMessage && (
                   <p className="text-[10px] text-center font-black uppercase tracking-widest text-indigo-600 animate-pulse">
                       {statusMessage}
                   </p>
               )}

               <button 
                  onClick={handleAuthAttempt} 
                  disabled={isVerifying}
                  className="w-full py-5 bg-indigo-600 text-white font-black uppercase text-xs tracking-[0.3em] shadow-2xl active:scale-95 transition-all disabled:opacity-50"
               >
                  {isVerifying ? t.auth_ui.verifying : t.auth_ui.authenticate}
               </button>
               <button onClick={() => setShowAdminInput(false)} className="w-full text-[10px] text-slate-400 uppercase font-black tracking-widest pt-4">
                  {t.auth_ui.cancel}
               </button>
           </div>
        </div>
      )}

      {/* LOGO AREA (Hidden Entrance for Specialists) */}
      <div 
        onDoubleClick={() => {
            PlatformBridge.haptic.impact('heavy');
            setShowAdminInput(true);
        }}
        className="w-36 h-36 flex items-center justify-center shrink-0 group relative active:scale-90 transition-transform mt-8 cursor-pointer"
      >
        <Logo size="xl" />
        <div className="absolute -bottom-2 text-[8px] font-black text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity tracking-widest uppercase">
          Pro_Gateway
        </div>
      </div>

      <div className="text-center space-y-4 px-8 relative z-10">
          <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
            GENESIS<br/><span className="text-indigo-600">OS</span>
          </h2>
          <div className="flex flex-col items-center gap-1 border-t border-slate-100 pt-4 max-w-[280px] mx-auto">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] leading-relaxed">
                {t.subtitle}
            </p>
          </div>
      </div>

      {!showPricing ? (
        <div className="w-full px-10 space-y-10 flex-1 flex flex-col justify-end pb-16">
            
            <div className="space-y-6">
                <button 
                    onClick={handleClientEntry} 
                    className="w-full h-24 bg-indigo-600 text-white rounded-full font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-indigo-200/50 hover:bg-indigo-700 active:scale-[0.98] transition-all relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10">{t.onboarding.protocol_btn}</span>
                </button>
                
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Пароль не требуется</span>
                        <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                    </div>
                    <span className="text-[7px] font-bold text-slate-300 uppercase tracking-[0.2em]">Результаты будут доступны после прохождения</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-8">
                <button onClick={() => setShowPricing(true)} className="flex flex-col items-center gap-2 group">
                    <span className="text-2xl group-hover:scale-125 transition-transform">💎</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.onboarding.promo_desc}</span>
                </button>
                <button onClick={() => setShowAdminInput(true)} className="flex flex-col items-center gap-2 group opacity-40 hover:opacity-100 transition-opacity">
                    <span className="text-2xl group-hover:scale-125 transition-transform">🔑</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.ui.enter_code_btn}</span>
                </button>
            </div>
        </div>
      ) : (
        <div className="w-full px-10 space-y-6 animate-in flex-1 flex flex-col pb-16">
            <h3 className="text-xs font-black uppercase text-slate-900 text-center mb-4 tracking-[0.3em]">{t.onboarding.pricing_btn}</h3>
            
            <div className="space-y-4 overflow-y-auto no-scrollbar">
                {[
                    { id: 'SOLO', name: t.onboarding.solo_plan, price: t.onboarding.price_solo },
                    { id: 'CLINICAL', name: t.onboarding.clinical_plan, price: t.onboarding.price_clinical, highlight: true },
                    { id: 'LAB', name: t.onboarding.lab_plan, price: t.onboarding.price_lab }
                ].map(plan => (
                    <button 
                        key={plan.id} 
                        onClick={() => PlatformBridge.openLink("https://t.me/thndrrr")}
                        className={`w-full p-6 rounded-3xl border-2 text-left flex justify-between items-center transition-all active:scale-[0.98] ${plan.highlight ? 'bg-slate-950 border-indigo-600 text-white shadow-2xl' : 'bg-white border-slate-100 text-slate-900'}`}
                    >
                        <span className="text-[12px] font-black uppercase tracking-widest">{plan.name}</span>
                        <span className="text-sm font-black">{plan.price}</span>
                    </button>
                ))}
            </div>
            
            <button onClick={() => setShowPricing(false)} className="w-full py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-auto">
                {t.global.back}
            </button>
        </div>
      )}

      <footer className="px-10 text-center opacity-30 pb-10">
          <p className="text-[8px] font-black font-mono text-slate-500 uppercase tracking-[0.4em] leading-relaxed">
            TERMINAL_BUILD: 9.9.2 // CLIENT_MODE: AUTHORIZED
          </p>
      </footer>
    </div>
  );
};
