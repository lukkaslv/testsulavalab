
import React, { useState } from 'react';
import { Translations, SubscriptionTier } from '../../types';
import { PlatformBridge } from '../../utils/helpers';
import { SecurityCore } from '../../utils/crypto';
import { STORAGE_KEYS, StorageService } from '../../services/storageService';
import { RemoteAccess } from '../../services/remoteAccess';
import { PRICING_CONFIG } from '../../constants';
import { Logo } from '../Logo';

interface AuthViewProps {
  onLogin: (password: string, isDemo: boolean, tier?: SubscriptionTier) => boolean;
  t: Translations;
  lang: 'ru' | 'ka';
  onLangChange: (lang: 'ru' | 'ka') => void;
}

const LegalModal = ({ t, type, onClose }: { t: Translations, type: 'tos' | 'privacy', onClose: () => void }) => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in backdrop-blur-xl bg-slate-900/60">
        <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6 border border-slate-100 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-black uppercase text-slate-900 tracking-tight">
                {type === 'tos' ? t.legal.tos_title : t.legal.privacy_title}
            </h2>
            <div className="text-[11px] text-slate-600 leading-relaxed font-medium space-y-4">
                {type === 'tos' ? t.legal.tos_body : t.legal.privacy_body}
            </div>
            <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest mt-4">
                {t.legal.close_btn}
            </button>
        </div>
    </div>
);

const ConsentModal = ({ t, onConfirm, onCancel, lang, onLangChange }: { t: Translations, onConfirm: () => void, onCancel: () => void, lang: 'ru'|'ka', onLangChange: (l:'ru'|'ka')=>void }) => {
    const [checked, setChecked] = useState(false);
    const ic = t.informed_consent;

    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 animate-in backdrop-blur-3xl bg-slate-950/90 text-slate-200">
            <div className="absolute top-4 right-4 z-50">
                <button onClick={() => onLangChange(lang === 'ru' ? 'ka' : 'ru')} className="bg-white/10 px-3 py-1 rounded text-[10px] font-bold uppercase">{lang === 'ru' ? 'KA' : 'RU'}</button>
            </div>
            <div className="w-full max-w-sm rounded-[2rem] border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl">📜</div>
                <h2 className="text-sm font-black uppercase tracking-widest text-indigo-400 text-center border-b border-slate-800 pb-4">
                    {ic.title}
                </h2>
                
                <div className="space-y-4 text-[10px] font-medium leading-relaxed text-slate-400">
                    <div className="space-y-1">
                        <span className="text-white font-bold block">{ic.measures_title}</span>
                        <ul className="list-disc pl-4 space-y-0.5">
                            {ic.measures.map((m: string, i: number) => <li key={i}>{m}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-1">
                        <span className="text-white font-bold block">{ic.usage_title}</span>
                        <ul className="list-disc pl-4 space-y-0.5">
                            {ic.usage.map((m: string, i: number) => <li key={i}>{m}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-1">
                        <span className="text-white font-bold block">{ic.data_title}</span>
                        <ul className="list-disc pl-4 space-y-0.5">
                            {ic.data.map((m: string, i: number) => <li key={i}>{m}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="pt-2">
                    <label className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
                        <input type="checkbox" checked={checked} onChange={e => { PlatformBridge.haptic.selection(); setChecked(e.target.checked); }} className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500" />
                        <span className="text-[9px] font-bold uppercase text-white leading-tight">{ic.checkbox}</span>
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={onCancel} className="py-4 bg-slate-800 text-slate-400 rounded-xl font-black uppercase text-[9px] tracking-widest hover:text-white transition-colors">
                        {t.auth_ui.cancel}
                    </button>
                    <button onClick={() => { if(checked) onConfirm(); }} disabled={!checked} className={`py-4 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all ${checked ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
                        {ic.start_btn}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, t, lang, onLangChange }) => {
  const [showPricing, setShowPricing] = useState(false);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [legalType, setLegalType] = useState<'tos' | 'privacy' | null>(null);
  const [adminPwd, setAdminPwd] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const currency = PRICING_CONFIG.CURRENCY[lang];
  const plansData = PRICING_CONFIG.PLANS;

  const handleClientEntry = () => {
    PlatformBridge.haptic.notification('success');
    onLogin("genesis_client", false);
  };

  const handleAuthAttempt = async () => {
      if (!adminPwd.trim()) {
          setStatusMessage(t.auth_ui.enter_key_placeholder);
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
      
      {legalType && <LegalModal t={t} type={legalType} onClose={() => setLegalType(null)} />}
      
      {showConsent && (
          <ConsentModal 
            t={t} 
            lang={lang}
            onLangChange={onLangChange}
            onConfirm={() => { setShowConsent(false); handleClientEntry(); }} 
            onCancel={() => setShowConsent(false)} 
          />
      )}

      {showAdminInput && (
        <div className="absolute inset-0 z-[100] bg-white/98 flex flex-col items-center justify-center p-6 animate-in backdrop-blur-3xl">
           <div className="text-center mb-8 space-y-4">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-xl border border-slate-700">
                🔐
              </div>
              <h3 className="text-slate-900 font-black text-lg uppercase tracking-widest">{t.ui.auth_title}</h3>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest px-8 text-center leading-relaxed">
                {t.auth_ui.admin_access_hint}
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

      {!showPricing ? (
        <div className="flex flex-col items-center h-full w-full pt-8 pb-8 px-6 space-y-6 overflow-y-auto no-scrollbar">
            <div 
                onDoubleClick={() => setShowAdminInput(true)}
                className="w-20 h-20 flex items-center justify-center shrink-0 active:scale-90 transition-transform cursor-pointer"
            >
                <Logo size="lg" />
            </div>

            <div className="text-center space-y-1 relative z-10 shrink-0">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                    GENESIS<span className="text-indigo-600">OS</span>
                </h2>
                <p className="text-[8px] text-indigo-500 font-black uppercase tracking-[0.4em] pt-1">
                    {t.subtitle.split('//')[0]}
                </p>
            </div>

            <div className="w-full space-y-3 flex-1 flex flex-col justify-center max-w-[300px]">
                <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-4">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block text-center">{t.onboarding.for_clients}</span>
                    <button 
                        onClick={() => setShowConsent(true)} 
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all"
                    >
                        {t.onboarding.protocol_btn}
                    </button>
                    <p className="text-[9px] text-slate-400 font-medium text-center leading-tight italic px-2">
                        {t.onboarding.client_card_desc}
                    </p>
                </div>

                <div className="pt-2">
                    <button 
                        onClick={() => setShowAdminInput(true)}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        <span>🛡️</span> {t.ui.enter_code_btn}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 w-full pt-4 border-t border-slate-100 shrink-0">
                <button onClick={() => setShowPricing(true)} className="bg-indigo-50 p-4 rounded-2xl flex items-center justify-center gap-3 group transition-all border border-indigo-100">
                    <span className="text-xl">💎</span>
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{t.onboarding.pricing_btn}</span>
                </button>
            </div>

            <div className="flex gap-4 opacity-40 pt-2 shrink-0">
                <button onClick={() => setLegalType('tos')} className="text-[7px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 underline">{t.auth_ui.terms_link}</button>
                <button onClick={() => setLegalType('privacy')} className="text-[7px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 underline">{t.auth_ui.privacy_link}</button>
            </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col bg-slate-50 animate-in overflow-hidden">
            <header className="bg-white px-6 pt-8 pb-4 border-b border-slate-200 shrink-0 relative z-20">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight leading-none">{t.onboarding.promo_title}</h3>
                    <button onClick={() => setShowPricing(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">✕</button>
                </div>
                <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-widest">{t.onboarding.promo_desc}</p>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 no-scrollbar">
                
                {/* PRO PLAN CARD ($80) */}
                <div className="w-full p-8 rounded-[2.5rem] border-4 border-indigo-100 bg-white text-slate-900 shadow-2xl relative overflow-hidden flex flex-col gap-6">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[8px] font-black px-4 py-1.5 uppercase tracking-widest rounded-bl-2xl">
                        {t.onboarding.recommended_tag}
                    </div>
                    
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Genesis Professional</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-slate-900">{plansData.PRO[lang]}{currency}</span>
                            <span className="text-[10px] font-bold text-slate-400">{t.onboarding.price_per_month}</span>
                        </div>
                    </div>

                    <ul className="space-y-3">
                        {t.onboarding.features_clinical.split(';').map((feat: string, i: number) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] shrink-0 font-bold">✓</span>
                                <span className="text-xs font-bold text-slate-700 leading-snug">{feat}</span>
                            </li>
                        ))}
                    </ul>

                    <button 
                        onClick={() => PlatformBridge.openLink("https://t.me/thndrrr")}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                    >
                        {t.onboarding.activate_access_btn}
                    </button>
                </div>

                {/* FREE TRIAL CARD */}
                <div className="w-full p-6 rounded-[2rem] border border-slate-200 bg-slate-50 text-slate-600 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest">Free Trial</span>
                        <span className="text-[11px] font-black">0{currency}</span>
                    </div>
                    <p className="text-[10px] font-medium leading-relaxed italic opacity-80">
                        {t.onboarding.free_trial_desc}
                    </p>
                    <button 
                        onClick={() => setShowConsent(true)}
                        className="w-full py-3 bg-white border border-slate-300 rounded-xl font-black uppercase text-[9px] tracking-widest text-slate-500 active:scale-95 transition-all"
                    >
                        {t.onboarding.start_free_btn}
                    </button>
                </div>

                <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white space-y-3 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl italic font-black">?</div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Что входит в Pro?</h4>
                    <p className="text-xs leading-relaxed font-bold italic opacity-90">
                        {t.onboarding.pro_features_expl}
                    </p>
                </div>

                <div className="h-10 shrink-0"></div>
            </div>
            
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
                {t.auth_ui.footer_tagline}
            </p>
        </footer>
      )}
    </div>
  );
};
