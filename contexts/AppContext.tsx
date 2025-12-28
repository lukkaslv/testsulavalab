
import React, { createContext, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { translations } from '../translations';
import { Translations, GameHistoryItem, ScanHistory, SubscriptionTier, DataCorruptionError, AppContextType } from '../types';
import { StorageService, STORAGE_KEYS, SessionState } from '../services/storageService';
import { PlatformBridge } from '../utils/helpers';
import { SUBSCRIPTION_LIMITS } from '../constants';

export const AppContext = createContext<AppContextType | null>(null);

const VALID_VIEWS = ['auth', 'boot', 'dashboard', 'test', 'body_sync', 'reflection', 'results', 'admin', 'compatibility', 'guide', 'system_integrity', 'system_simulation'];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<'ru' | 'ka'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved === 'ru' || saved === 'ka') ? saved : 'ru';
  });
  
  const t: Translations = useMemo(() => translations[lang], [lang]);
  const [view, setView] = useState<string>('auth');
  const [dataStatus, setDataStatus] = useState<string>('ok');
  const [completedNodeIds, setCompletedNodeIds] = useState<number[]>([]);
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isMaster, setIsMaster] = useState(false); 
  const [licenseTier, setLicenseTier] = useState<SubscriptionTier>('FREE');
  const [bootShown] = useState(() => sessionStorage.getItem('genesis_boot_seen') === 'true');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistory>({ scans: [], latestScan: null, evolutionMetrics: { entropyTrend: [], integrityTrend: [], dates: [] } });

  const isInitialized = useRef(false);

  const usageStats = useMemo(() => {
      const limit = SUBSCRIPTION_LIMITS[licenseTier] || 1;
      const used = scanHistory?.scans?.length || 0;
      const isUnlimited = limit > 9000;
      const canStart = used < limit || isUnlimited;
      return { used, limit, isUnlimited, canStart };
  }, [licenseTier, scanHistory]);

  const setViewAndPersist = useCallback((newView: string) => {
    if (!VALID_VIEWS.includes(newView)) {
        console.warn(`View Integrity: Blocked attempt to visit invalid view [${newView}]. Reverting to dashboard.`);
        newView = 'dashboard';
    }
    
    // Axis 9.4: Persist navigation intent
    sessionStorage.setItem('genesis_last_view', newView);
    setView(newView);
  }, []);

  useEffect(() => {
    // RUN ONCE ON MOUNT
    if (isInitialized.current) return;
    
    PlatformBridge.ready();
    PlatformBridge.expand();
    
    try {
        const sessionState = StorageService.load<SessionState>(STORAGE_KEYS.SESSION_STATE, { nodes: [], history: [] });
        if (sessionState && sessionState.nodes) {
            setCompletedNodeIds(sessionState.nodes.map(id => typeof id === 'string' ? parseInt(id, 10) : id));
            setHistory(Array.isArray(sessionState.history) ? sessionState.history : []);
        }
    } catch (e) {
        if (e instanceof DataCorruptionError) setDataStatus('corrupted');
    }

    const loadedScanHistory = StorageService.getScanHistory();
    if (loadedScanHistory) setScanHistory(loadedScanHistory);

    const sessionAuth = localStorage.getItem(STORAGE_KEYS.SESSION);
    const savedTierRaw = localStorage.getItem('genesis_tier');
    const savedTier = (['FREE','SOLO','CLINICAL','LAB'].includes(savedTierRaw || '') ? savedTierRaw : 'FREE') as SubscriptionTier;
    const isMasterSession = localStorage.getItem('genesis_master') === 'true';
    
    if (sessionAuth === 'true') { 
        setIsPro(true);
        setLicenseTier(savedTier);
        if (isMasterSession) setIsMaster(true);

        const lastView = sessionStorage.getItem('genesis_last_view');
        const safeView = VALID_VIEWS.includes(lastView || '') ? lastView! : 'dashboard';
        
        // Master view restoration logic
        if (isMasterSession && ['admin', 'system_integrity', 'system_simulation'].includes(safeView)) {
            setView(safeView);
        } else if (['dashboard', 'compatibility', 'guide', 'results'].includes(safeView)) {
            setView(safeView);
        } else {
            setView('dashboard');
        }
    }
    else if (sessionAuth === 'client' || sessionAuth === 'demo') {
        setIsDemo(sessionAuth === 'demo');
        setLicenseTier('FREE');
        setView(bootShown ? 'dashboard' : 'boot');
    }

    isInitialized.current = true;
  }, [bootShown]);

  const handleLogin = useCallback((password: string, demo = false, tier: SubscriptionTier = 'FREE'): boolean => {
    PlatformBridge.haptic.impact('light');
    const pwd = password.toLowerCase().trim();
    
    if (pwd === "genesis_prime") {
        localStorage.setItem(STORAGE_KEYS.SESSION, 'true');
        localStorage.setItem('genesis_tier', 'LAB');
        localStorage.setItem('genesis_master', 'true');
        setLicenseTier('LAB'); 
        setIsPro(true); 
        setIsMaster(true);
        setViewAndPersist('admin'); 
        return true;
    }

    if (pwd === "genesis_client" || demo) {
        const sessionType = demo ? 'demo' : 'client';
        localStorage.setItem(STORAGE_KEYS.SESSION, sessionType);
        setIsDemo(demo); 
        setIsPro(false); 
        setLicenseTier('FREE');
        setViewAndPersist(bootShown ? 'dashboard' : 'boot');
        return true;
    }

    if (pwd === "genesis_lab_entry") {
      localStorage.setItem(STORAGE_KEYS.SESSION, 'true');
      localStorage.setItem('genesis_tier', tier);
      setLicenseTier(tier); 
      setIsPro(true); 
      setIsMaster(false);
      setViewAndPersist(bootShown ? 'dashboard' : 'boot');
      return true;
    }
    return false;
  }, [bootShown, setViewAndPersist]);

  const handleLogout = useCallback(() => { 
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      localStorage.removeItem('genesis_master');
      localStorage.removeItem('genesis_tier');
      sessionStorage.removeItem('genesis_last_view');
      setIsPro(false); 
      setIsMaster(false); 
      setIsDemo(false);
      setView('auth'); 
  }, []);

  const handleReset = useCallback((force: boolean = false) => {
    const action = () => {
      const langSave = localStorage.getItem(STORAGE_KEYS.LANG);
      const sessionSave = localStorage.getItem(STORAGE_KEYS.SESSION);
      const tierSave = localStorage.getItem('genesis_tier');
      
      localStorage.clear();
      sessionStorage.clear();
      
      if (!force && sessionSave === 'true') {
          localStorage.setItem(STORAGE_KEYS.SESSION, 'true');
          localStorage.setItem('genesis_tier', tierSave || 'FREE');
      }
      localStorage.setItem(STORAGE_KEYS.LANG, langSave || 'ru');
      window.location.reload();
    };

    if (force) action(); 
    else {
        PlatformBridge.showConfirm(
            lang === 'ru' ? "СБРОСИТЬ ВСЕ ДАННЫЕ? Лицензия сохранится." : "ყველა მონაცემის წაშლა?", 
            (confirmed) => { if (confirmed) action(); }
        );
    }
  }, [lang]);

  const onLangChange = useCallback((newLang: 'ru' | 'ka') => {
      setLang(newLang);
      localStorage.setItem(STORAGE_KEYS.LANG, newLang);
  }, []);

  const value: AppContextType = {
    lang, setLang, t, view, setViewAndPersist,
    isDemo, isPro, isMaster, licenseTier,
    completedNodeIds, setCompletedNodeIds: (fn: any) => setCompletedNodeIds(fn),
    history, setHistory: (fn: any) => setHistory(fn),
    dataStatus, scanHistory, usageStats,
    soundEnabled, setSoundEnabled,
    handleLogin, handleLogout, handleReset, onLangChange
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
