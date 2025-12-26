
import React, { useState, useRef, useEffect } from 'react';
import { Translations } from '../../types';

interface AuthViewProps {
  onLogin: (password: string, isDemo: boolean) => boolean;
  t: Translations;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, t }) => {
  const [agreed, setAgreed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminPwd, setAdminPwd] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const tapCountRef = useRef(0);
  const holdInterval = useRef<number | null>(null);
  const tapTimeout = useRef<number | null>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const startHold = () => {
    if (agreed) return;
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.('light');
    holdInterval.current = window.setInterval(() => {
        setHoldProgress(prev => {
            if (prev >= 100) {
                clearInterval(holdInterval.current!);
                window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success');
                setAgreed(true);
                return 100;
            }
            return prev + 4; 
        });
    }, 50);
  };

  const endHold = () => {
    if (agreed) return;
    if (holdInterval.current) clearInterval(holdInterval.current);
    setHoldProgress(0);
  };

  const handleEnter = (isDemo: boolean) => {
    if (!agreed) {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('error');
        return;
    }
    onLogin(isDemo ? "" : "genesis_lab_entry", isDemo);
  };

  const handleAdminLoginAttempt = () => {
    const success = onLogin(adminPwd, false);
    if (!success) {
      setLoginError(true);
      setTimeout(() => {
          setLoginError(false);
          setShowAdminInput(false); // Stealth: hide input on fail
          setAdminPwd('');
      }, 820);
    } else {
        setShowAdminInput(false);
    }
  };

  const handleLogoInteraction = (e: React.PointerEvent) => {
      e.preventDefault(); 
      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.('light');
      
      tapCountRef.current += 1;
      
      if (tapTimeout.current) clearTimeout(tapTimeout.current);
      
      // Increased threshold to 7 for stealth
      if (tapCountRef.current >= 7) {
          window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success');
          tapCountRef.current = 0; 
          setAdminPwd(''); 
          setShowAdminInput(true); 
          return;
      }

      tapTimeout.current = window.setTimeout(() => {
          tapCountRef.current = 0;
      }, 1500);
  };

  useEffect(() => {
    return () => { 
        if (holdInterval.current) clearInterval(holdInterval.current);
        if (tapTimeout.current) clearTimeout(tapTimeout.current);
    };
  }, []);

  const onboarding = t.onboarding;

  return (
    <div className="relative flex flex-col items-center justify-center py-12 space-y-10 animate-in h-full select-none max-w-sm mx-auto">
      
      {showAdminInput && (
        <div className="absolute inset-0 z-[100] bg-slate-950/98 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in rounded-3xl border border-white/5">
            <div className="w-full max-w-xs space-y-6">
                <div className="text-center space-y-2">
                    <div className="text-2xl opacity-40">🗝️</div>
                    <h3 className="text-slate-500 font-mono text-[9px] font-black uppercase tracking-[0.4em]">BRIDGE_INIT_AUTH</h3>
                </div>
                
                <input 
                    type="password" 
                    autoFocus
                    className={`w-full bg-slate-900 border rounded-xl p-4 text-emerald-400 font-mono text-center outline-none focus:border-emerald-500 transition-colors shadow-inner text-sm placeholder-slate-800 ${loginError ? 'animate-shake border-red-500/50' : 'border-white/5'}`}
                    placeholder="••••••••"
                    value={adminPwd}
                    onChange={e => setAdminPwd(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLoginAttempt()}
                />
                
                <div className="flex justify-center">
                    <button 
                        onClick={() => setShowAdminInput(false)} 
                        className="text-slate-700 py-2 px-4 rounded-xl text-[8px] font-black uppercase tracking-widest active:scale-95 transition-all"
                    >
                        ABORT_STREAMS
                    </button>
                </div>
            </div>
        </div>
      )}

      <div 
        ref={logoRef}
        onPointerDown={handleLogoInteraction}
        className="w-20 h-20 bg-slate-950 rounded-[2rem] flex items-center justify-center text-indigo-500 font-black text-3xl border border-indigo-500/10 shadow-2xl shrink-0 cursor-default transition-all duration-100 touch-manipulation"
      >
        G
      </div>
      
      <div className="w-full px-2 flex-1 flex flex-col space-y-8">
        <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">{onboarding.title}</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {[
                { i: "01", t: onboarding.step1_t, d: onboarding.step1_d },
                { i: "02", t: onboarding.step2_t, d: onboarding.step2_d },
                { i: "03", t: onboarding.step3_t, d: onboarding.step3_d }
            ].map(step => (
                <div key={step.i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-start">
                    <span className="text-[10px] font-mono font-black text-indigo-500 bg-white px-2 py-1 rounded shadow-sm">{step.i}</span>
                    <div className="space-y-1">
                        <h4 className="text-[10px] font-black uppercase text-slate-900">{step.t}</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight">{step.d}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="space-y-4 pt-4">
            {!agreed ? (
                <div 
                    className="relative w-full h-16 bg-slate-100 rounded-2xl overflow-hidden cursor-pointer touch-none select-none border border-slate-200"
                    onMouseDown={startHold}
                    onMouseUp={endHold}
                    onMouseLeave={endHold}
                    onTouchStart={startHold}
                    onTouchEnd={endHold}
                >
                    <div 
                        className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-75 ease-linear"
                        style={{ width: `${holdProgress}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${holdProgress > 50 ? 'text-white' : 'text-slate-400'}`}>
                            {holdProgress > 0 ? onboarding.protocol_init : onboarding.protocol_btn}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="w-full h-16 bg-slate-950 rounded-2xl flex items-center justify-center border border-indigo-500/50 shadow-lg animate-pulse">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">{onboarding.protocol_ready}</span>
                </div>
            )}
            
            <div className="space-y-2 text-[9px] text-slate-400 font-medium leading-relaxed text-center italic opacity-70">
                <p>{t.legal_disclaimer}</p>
                <p className="font-bold border-t border-slate-100 pt-2 text-indigo-500/70">{t.admin.privacy}</p>
            </div>
        </div>

        <div className="pt-2">
           <button 
             onClick={() => handleEnter(false)} 
             disabled={!agreed} 
             className={`w-full p-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-lg transition-all ${agreed ? 'bg-slate-950 text-white active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
           >
             {onboarding.start_btn}
           </button>
        </div>
      </div>
    </div>
  );
};
