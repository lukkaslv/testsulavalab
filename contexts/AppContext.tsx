
import React, { createContext, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { translations } from '@/translations';
import { Translations, GameHistoryItem, ScanHistory, SubscriptionTier, DataCorruptionError, AppContextType, NetworkAuditReport, IntegrityReport, LifeContext, AnalysisResult } from '../types';
import { StorageService, STORAGE_KEYS, SessionState } from '../services/storageService';
import { PlatformBridge } from '../utils/helpers';
import { SUBSCRIPTION_LIMITS } from '../constants';
import { IntegrityService } from '../services/integrityService';
import { SecurityCore } from '../utils/crypto';

export const AppContext = createContext<AppContextType | null>(null);

const VALID_VIEWS = [
    'auth', 'boot', 'dashboard', 'test', 'body_sync', 'results', 
    'admin', 'pro_terminal', 'guide', 'system_integrity', 'system_simulation', 
    'pro_hub', 'scan_detail', 'privacy', 'academy', 'security_monitor', 
    'constitution', 'processing', 'compare', 'brief_explainer', 'transparency',
    'stabilization', 'specialist_atlas', 'changelog', 'scientific_foundations', 'specialist_oath',
    'protocol', 'dev_sanctuary', 'codex', 'archetypes', 'tech_standard'
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lang: 'ru' = 'ru';
  const rawTranslations: Translations = useMemo(() => translations[lang], [lang]);
  
  const [view, setView] = useState<string>('auth');
  const [previousView, setPreviousView] = useState<string | null>(null);
  const [sessionContext, setSessionContextState] = useState<LifeContext>('NORMAL');
  const [isDemo, setIsDemo] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isMaster, setIsMaster] = useState(false); 
  const [isSafeDevMode, setIsSafeDevMode] = useState(() => localStorage.getItem('genesis_safe_dev') === 'true');
  
  const [licenseTier, setLicenseTier] = useState<SubscriptionTier>('FREE');
  const [networkReport, setNetworkReport] = useState<NetworkAuditReport>({ totalRequests: 0, authorizedDomains: [], violations: [], isSovereign: true });
  const [integrityReport, setIntegrityReport] = useState<IntegrityReport | null>(null);

  const [dataStatus, setDataStatus] = useState<string>('ok');
  const [completedNodeIds, setCompletedNodeIds] = useState<number[]>([]);
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [scanHistory, setScanHistory] = useState<ScanHistory>({ scans: [], latestScan: null, evolutionMetrics: { entropyTrend: [], integrityTrend: [], dates: [] } });

  const isInitialized = useRef(false);
  const viewRef = useRef(view);

  useEffect(() => {
      viewRef.current = view;
  }, [view]);

  // ПРОТОКОЛ УБЕЖИЩА: Семантическая Очистка (Ст. 10.4 Изоляция)
  const t = useMemo(() => {
    if (!isSafeDevMode) return rawTranslations;
    
    const scrub = (obj: any): any => {
        if (typeof obj === 'string') return `[ТЕХ_ID_${obj.length}]`;
        if (Array.isArray(obj)) return obj.map(scrub);
        if (obj && typeof obj === 'object') {
            const scrubbed: any = {};
            for (const key in obj) scrubbed[key] = scrub(obj[key]);
            return scrubbed;
        }
        return obj;
    };

    return {
        ...rawTranslations,
        beliefs: Object.keys(rawTranslations.beliefs).reduce((acc, key) => ({...acc, [key]: `ID_${key.toUpperCase()}`}), {}),
        archetypes: Object.keys(rawTranslations.archetypes).reduce((acc, key) => ({...acc, [key]: scrub(rawTranslations.archetypes[key])}), {}),
        scenes: Object.keys(rawTranslations.scenes).reduce((acc, key) => ({...acc, [key]: scrub(rawTranslations.scenes[key])}), {}),
    } as unknown as Translations;
  }, [rawTranslations, isSafeDevMode]);

  const setSafeDevMode = useCallback((active: boolean) => {
      setIsSafeDevMode(active);
      localStorage.setItem('genesis_safe_dev', active ? 'true' : 'false');
      PlatformBridge.haptic.notification('success');
  }, []);

  const setSessionContext = useCallback((ctx: LifeContext) => {
      setSessionContextState(ctx);
      StorageService.save(STORAGE_KEYS.SESSION_CONTEXT, ctx);
      PlatformBridge.haptic.selection();
  }, []);

  const sanitizeMemory = useCallback(() => {
      SecurityCore.nullify(scanHistory.latestScan);
      scanHistory.scans.forEach(s => SecurityCore.nullify(s));
      setScanHistory({ scans: [], latestScan: null, evolutionMetrics: { entropyTrend: [], integrityTrend: [], dates: [] } });
      setHistory([]);
      setCompletedNodeIds([]);
  }, [scanHistory]);

  useEffect(() => {
      const beat = () => {
          const report = IntegrityService.runAudit(rawTranslations);
          setIntegrityReport(report);
          if (report.status === 'lockdown' && isPro && view !== 'security_monitor') {
              sanitizeMemory();
              setView('security_monitor');
              PlatformBridge.haptic.notification('error');
          }
      };
      beat();
      const interval = setInterval(beat, 5000);
      return () => clearInterval(interval);
  }, [rawTranslations, isPro, view, sanitizeMemory]);

  useEffect(() => {
      IntegrityService.getNetworkObserver().subscribe(setNetworkReport);
  }, []);

  const usageStats = useMemo(() => {
      const limit = SUBSCRIPTION_LIMITS[licenseTier] || 1;
      const used = scanHistory.scans.length;
      return { used, limit, isUnlimited: limit > 9000, canStart: (limit > 9000) || (used < limit) };
  }, [licenseTier, scanHistory.scans.length]);

  const setViewAndPersist = useCallback((newView: string) => {
    if (!VALID_VIEWS.includes(newView)) return;
    setPreviousView(viewRef.current);
    sessionStorage.setItem('genesis_last_view', newView);
    setView(newView);
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;
    PlatformBridge.expand();
    PlatformBridge.ready();
    
    try {
        const sessionState = StorageService.load<SessionState>(STORAGE_KEYS.SESSION_STATE, { nodes: [], history: [] });
        setCompletedNodeIds(sessionState.nodes.map(id => Number(id)));
        setHistory(sessionState.history);
        setScanHistory(StorageService.getScanHistory());
        setSessionContextState(StorageService.load<LifeContext>(STORAGE_KEYS.SESSION_CONTEXT, 'NORMAL'));
    } catch (e) {
        if (e instanceof DataCorruptionError) setDataStatus('corrupted');
    }

    const sessionAuth = localStorage.getItem(STORAGE_KEYS.SESSION);
    const lastView = sessionStorage.getItem('genesis_last_view');
    const isLastViewValid = VALID_VIEWS.includes(lastView || '');

    if (sessionAuth === 'true') { 
        setIsPro(true);
        setLicenseTier((localStorage.getItem('genesis_tier') as SubscriptionTier) || 'FREE');
        setIsMaster(localStorage.getItem('genesis_master') === 'true');
        setView(isLastViewValid ? lastView! : 'pro_hub');
    } else if (sessionAuth === 'client') {
        setIsPro(false); 
        setIsMaster(false);
        // FIX: Теперь сессия клиента восстанавливает последнее сохраненное состояние, 
        // предотвращая сброс на dashboard при обновлении на странице результатов.
        setView(isLastViewValid ? lastView! : 'dashboard');
    }
    isInitialized.current = true;
  }, []);

  const handleLogin = useCallback((password: string, demo = false, tier: SubscriptionTier = 'FREE'): boolean => {
    const pwd = password.toLowerCase().trim();
    PlatformBridge.haptic.selection();

    if (pwd === "genesis_prime") {
        localStorage.setItem(STORAGE_KEYS.SESSION, 'true');
        localStorage.setItem('genesis_tier', 'LAB');
        localStorage.setItem('genesis_master', 'true');
        sessionStorage.setItem('pro_pin_verified', 'true');
        setLicenseTier('LAB'); setIsPro(true); setIsMaster(true);
        setViewAndPersist('admin'); 
        return true;
    }
    if (pwd === "genesis_client" || demo) {
        localStorage.setItem(STORAGE_KEYS.SESSION, 'client');
        setIsDemo(demo); 
        setIsPro(false); 
        setIsMaster(false);
        setLicenseTier('FREE');
        setViewAndPersist('dashboard');
        return true;
    }
    if (pwd === "genesis_lab_entry") {
      localStorage.setItem(STORAGE_KEYS.SESSION, 'true');
      localStorage.setItem('genesis_tier', tier);
      setLicenseTier(tier); setIsPro(true); 
      setViewAndPersist('pro_hub');
      return true;
    }
    return false;
  }, [setViewAndPersist]);

  const handleLogout = useCallback(() => { 
      sanitizeMemory();
      const oath = localStorage.getItem('genesis_oath_signed');
      const licenseCache = localStorage.getItem('genesis_license_cache');
      
      localStorage.clear();
      
      if (oath) localStorage.setItem('genesis_oath_signed', oath);
      if (licenseCache) localStorage.setItem('genesis_license_cache', licenseCache);
      
      sessionStorage.clear();
      
      setIsPro(false);
      setIsMaster(false);
      setLicenseTier('FREE');
      
      setView('auth'); 
  }, [sanitizeMemory]);

  const handleReset = useCallback((force: boolean = false) => {
    const action = () => {
      const isProSession = isPro;
      const tier = licenseTier;
      const oath = localStorage.getItem('genesis_oath_signed');
      const licenseCache = localStorage.getItem('genesis_license_cache');
      
      localStorage.clear();
      sessionStorage.clear();
      
      if (oath) localStorage.setItem('genesis_oath_signed', oath);
      if (licenseCache) localStorage.setItem('genesis_license_cache', licenseCache);
      
      if (!force && isProSession) {
          localStorage.setItem(STORAGE_KEYS.SESSION, 'true');
          localStorage.setItem('genesis_tier', tier);
          if (isMaster) localStorage.setItem('genesis_master', 'true');
      }
      window.location.reload();
    };
    if (force) action(); 
    else PlatformBridge.showConfirm(t.ui.reset_confirm, (confirmed) => confirmed && action());
  }, [t, isPro, licenseTier, isMaster]);

  const handleFullReset = useCallback(() => {
    PlatformBridge.haptic.notification('warning');
    sanitizeMemory();
    localStorage.clear();
    sessionStorage.clear();
    if (window.indexedDB) {
        indexedDB.databases().then(dbs => dbs.forEach(db => db.name && indexedDB.deleteDatabase(db.name)));
    }
    window.location.href = '/';
  }, [sanitizeMemory]);

  const value = useMemo<AppContextType>(() => ({
    lang, t, view, previousView, setViewAndPersist, 
    sessionContext, setSessionContext,
    isDemo, isPro, isMaster, licenseTier,
    isSafeDevMode, setSafeDevMode,
    completedNodeIds, setCompletedNodeIds, history, setHistory,
    dataStatus, scanHistory, usageStats, networkReport, integrityReport,
    handleLogin, handleLogout, handleReset, handleFullReset
  }), [view, previousView, sessionContext, setSessionContext, isDemo, isPro, isMaster, licenseTier, isSafeDevMode, setSafeDevMode, completedNodeIds, history, dataStatus, scanHistory, usageStats, networkReport, integrityReport, handleLogin, handleLogout, handleReset, handleFullReset, t]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
