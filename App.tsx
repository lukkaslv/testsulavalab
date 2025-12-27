
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { MODULE_REGISTRY, ONBOARDING_NODES_COUNT, TOTAL_NODES, DOMAIN_SETTINGS } from './constants';
import { translations } from './translations';
import { calculateRawMetrics } from './services/psychologyService';
import { DiagnosticEngine } from './services/diagnosticEngine';
import { DomainType, Translations, AnalysisResult, GameHistoryItem, ScanHistory, DataCorruptionError, SubscriptionTier } from './types';
import { StorageService, STORAGE_KEYS, SessionState } from './services/storageService';
import { resolvePath, PlatformBridge } from './utils/helpers';
import { useTestEngine } from './hooks/useTestEngine';
import { AdaptiveQuestionEngine } from './services/adaptiveQuestionEngine';
import { PatternDetector } from './services/PatternDetector';

// View Imports
import { AuthView } from './components/views/AuthView';
import { BootView } from './components/views/BootView';
import { DashboardView, NodeUI } from './components/views/DashboardView';
import { TestView, BodySyncView, ReflectionView } from './components/views/TestModule';
import { ResultsView } from './components/views/ResultsView';
import { AdminPanel } from './components/views/AdminPanel';
import { CompatibilityView } from './components/views/CompatibilityView';
import { GuideView } from './components/views/GuideView';
import { BriefExplainerView } from './components/views/BriefExplainerView';
import { DataCorruptionView } from './components/views/DataCorruptionView';
import { generateShareImage } from './utils/shareGenerator';
import { InvalidResultsView } from './components/views/InvalidResultsView';
import { SystemIntegrityView } from './components/views/SystemIntegrityView';

const App: React.FC = () => {
  const [lang, setLang] = useState<'ru' | 'ka'>(() => (localStorage.getItem(STORAGE_KEYS.LANG) as 'ru' | 'ka') || 'ru');
  const t: Translations = useMemo(() => translations[lang], [lang]);
  
  const [view, setView] = useState<'auth' | 'boot' | 'dashboard' | 'test' | 'body_sync' | 'reflection' | 'results' | 'admin' | 'compatibility' | 'guide' | 'brief_explainer' | 'system_integrity'>('auth');
  const [dataStatus, setDataStatus] = useState<'ok' | 'corrupted'>('ok');
  const [activeModule, setActiveModule] = useState<DomainType | null>(null);
  const [currentDomain, setCurrentDomain] = useState<DomainType | null>(null);
  const [completedNodeIds, setCompletedNodeIds] = useState<number[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [licenseTier, setLicenseTier] = useState<SubscriptionTier>('FREE');
  const [bootShown, setBootShown] = useState(() => sessionStorage.getItem('genesis_boot_seen') === 'true');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistory | null>(null);
  const [forceGlitch, setForceGlitch] = useState(false);

  const [history, setHistory] = useState<GameHistoryItem[]>([]);

  const engine = useTestEngine({
    setCompletedNodeIds: (fn: any) => setCompletedNodeIds(fn),
    setHistory: (fn: any) => setHistory(fn),
    setView,
    activeModule,
    setActiveModule,
    isDemo
  });

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
        if (e.key === STORAGE_KEYS.SESSION_STATE) {
            try {
                const newState = JSON.parse(e.newValue || '{}') as SessionState;
                if (newState.nodes) setCompletedNodeIds(newState.nodes);
                if (newState.history) setHistory(newState.history);
            } catch (err) { console.error("Tab Sync Error", err); }
        }
    };
    window.addEventListener('storage', handleStorage);
    
    if (window.Telegram?.WebApp?.BackButton) {
        const bb = window.Telegram.WebApp.BackButton;
        if (view !== 'auth' && view !== 'dashboard' && view !== 'admin' && view !== 'system_integrity') {
            bb.show();
            const handleBack = () => {
                if (view === 'test' || view === 'body_sync') {
                    PlatformBridge.showConfirm(
                        lang === 'ru' ? "Выйти в дашборд? Прогресс текущего вопроса будет потерян." : "გსურთ გასვლა?",
                        (confirmed) => {
                            if (confirmed) setView('dashboard');
                        }
                    );
                } else {
                    setView('dashboard');
                }
            };
            bb.onClick(handleBack);
            return () => {
                bb.offClick(handleBack);
                bb.hide();
            };
        } else {
            bb.hide();
        }
    }

    return () => window.removeEventListener('storage', handleStorage);
  }, [view, lang]);

  const result = useMemo<AnalysisResult | null>(() => {
    if (history.length < ONBOARDING_NODES_COUNT) return null;
    const rawResult = calculateRawMetrics(history);
    const patternFlags = PatternDetector.analyze(history);
    return DiagnosticEngine.interpret(rawResult, patternFlags);
  }, [history]);

  const adaptiveState = useMemo(() => {
    const baseline = history.length > 0 
      ? history.slice(0, 5).reduce((a, b) => a + b.latency, 0) / Math.max(1, Math.min(5, history.length))
      : 2000;
    return AdaptiveQuestionEngine.getAdaptiveState(history, baseline);
  }, [history]);

  const globalProgress = useMemo(() => {
    return Math.min(100, Math.round(adaptiveState.clarity));
  }, [adaptiveState.clarity]);

  const isGlitchMode = forceGlitch || (result && result.entropyScore > 45);
  const getSceneText = useCallback((textKey: string) => resolvePath(t, textKey), [t]);

  useEffect(() => {
    PlatformBridge.ready();
    PlatformBridge.expand();
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
    
    try {
        const sessionState = StorageService.load<SessionState>(STORAGE_KEYS.SESSION_STATE, { nodes: [], history: [] });
        setCompletedNodeIds(sessionState.nodes.map(id => typeof id === 'string' ? parseInt(id, 10) : id));
        setHistory(sessionState.history);
    } catch (e) {
        if (e instanceof DataCorruptionError) setDataStatus('corrupted');
    }

    const loadedScanHistory = StorageService.getScanHistory();
    setScanHistory(loadedScanHistory);

    const sessionAuth = localStorage.getItem(STORAGE_KEYS.SESSION);
    const savedTier = localStorage.getItem('genesis_tier') as SubscriptionTier || 'FREE';
    
    if (sessionAuth === 'true') { 
        setView('dashboard'); 
        setIsDemo(false); 
        setIsPro(true); 
        setLicenseTier(savedTier);
    }
    else if (sessionAuth === 'client') { 
        setView('dashboard'); 
        setIsDemo(false); 
        setIsPro(false); 
        setLicenseTier('FREE'); 
    }
    else if (sessionAuth === 'demo') { 
        setView('dashboard'); 
        setIsDemo(true); 
        setIsPro(false); 
        setLicenseTier('FREE'); 
    }
  }, [lang]);

  const nodes = useMemo(() => {
    const allNodes: NodeUI[] = [];
    DOMAIN_SETTINGS.forEach((config: any) => {
      for (let i = 0; i < config.count; i++) {
        const absoluteId = config.startId + i;
        const isCompleted = completedNodeIds.includes(absoluteId);
        let isActive = absoluteId < ONBOARDING_NODES_COUNT || completedNodeIds.includes(absoluteId - 1);
        if (isCompleted) isActive = true;
        if (isDemo && absoluteId >= 3) isActive = false;
        allNodes.push({ id: absoluteId, domain: config.key, active: isActive, done: isCompleted });
      }
    });
    return allNodes;
  }, [completedNodeIds, isDemo]);

  const handleLogin = useCallback((password: string, demo = false, tier: SubscriptionTier = 'FREE'): boolean => {
    PlatformBridge.haptic.impact('light');
    if (password === "genesis_client") {
        localStorage.setItem(STORAGE_KEYS.SESSION, 'client');
        setIsDemo(false);
        setIsPro(false);
        setLicenseTier('FREE');
        localStorage.removeItem('genesis_tier');
        setView(bootShown ? 'dashboard' : 'boot');
        return true;
    }
    if (demo) {
        localStorage.setItem(STORAGE_KEYS.SESSION, 'demo');
        setIsDemo(true);
        setIsPro(false);
        setLicenseTier('FREE');
        localStorage.removeItem('genesis_tier');
        setView(bootShown ? 'dashboard' : 'boot');
        return true;
    }
    const cleanPassword = password.toLowerCase().trim();
    if (cleanPassword === "genesis_prime") { setIsPro(true); setView('admin'); return true; }
    if (cleanPassword === "genesis_lab_entry") {
      localStorage.setItem(STORAGE_KEYS.SESSION, 'true');
      localStorage.setItem('genesis_tier', tier);
      setIsDemo(false);
      setIsPro(true);
      setLicenseTier(tier);
      setView(bootShown ? 'dashboard' : 'boot');
      return true;
    }
    PlatformBridge.haptic.notification('error');
    return false;
  }, [bootShown]);

  const handleLogout = useCallback(() => {
     setView('auth');
     PlatformBridge.haptic.impact('medium');
  }, []);

  const handleReset = useCallback((force: boolean = false) => {
    const performResetAction = () => {
      // 1. Clear Storage
      StorageService.clear();
      sessionStorage.removeItem('genesis_boot_seen');
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      localStorage.removeItem('genesis_tier');
      localStorage.removeItem('genesis_system_message');
      
      // 2. Clear State
      setBootShown(false);
      setCompletedNodeIds([]);
      setHistory([]);
      setDataStatus('ok');
      setIsDemo(false);
      setIsPro(false);
      setLicenseTier('FREE');
      
      // 3. Forced UI Reset (Ensures no stale data remains in memory)
      PlatformBridge.haptic.notification('success');
      setTimeout(() => {
          window.location.reload();
      }, 300);
    };

    if (force) { 
        performResetAction(); 
    } else {
        PlatformBridge.showConfirm(
            lang === 'ru' ? "СБРОСИТЬ ВСЕ ДАННЫЕ? Это действие невозможно отменить." : "ყველა მონაცემის წაშლა? ამ ქმედების გაუქმება შეუძლებელია.",
            (confirmed) => { if (confirmed) performResetAction(); }
        );
    }
  }, [lang]);

  const handleNewCycle = useCallback(() => {
      const limits: Record<SubscriptionTier, number> = { FREE: 1, SOLO: 10, CLINICAL: 50, LAB: 9999 };
      const currentCount = scanHistory?.scans.length || 0;
      const limit = limits[licenseTier];
      if (currentCount >= limit) {
          PlatformBridge.haptic.notification('error');
          PlatformBridge.showConfirm(
              lang === 'ru' ? `Лимит лицензии исчерпан (${currentCount}/${limit}).` : `ლიმიტი ამოწურულია.`,
              () => {} 
          );
          return;
      }
      PlatformBridge.showConfirm(
          lang === 'ru' ? "Архивировать текущий результат и начать новый цикл?" : "დავაარქივოთ და დავიწყოთ ახალი ციკლი?",
          (confirmed) => {
              if (confirmed) {
                  setCompletedNodeIds([]);
                  setHistory([]);
                  StorageService.save(STORAGE_KEYS.SESSION_STATE, { nodes: [], history: [] });
                  setView('dashboard');
                  PlatformBridge.haptic.notification('success');
                  setScanHistory(StorageService.getScanHistory());
              }
          }
      );
  }, [lang, licenseTier, scanHistory]);

  const handleContinue = useCallback(() => {
    if (adaptiveState.isComplete) { setView('results'); return; }
    const nextId = adaptiveState.suggestedNextNodeId;
    if (nextId === null) { setView('results'); return; }
    const numericId = parseInt(nextId);
    let nextDomain: DomainType | null = null;
    for (const d of DOMAIN_SETTINGS) {
        if (numericId >= d.startId && numericId < (d.startId + d.count)) { nextDomain = d.key; break; }
    }
    if (nextDomain) engine.startNode(numericId, nextDomain);
    else setView('dashboard');
  }, [adaptiveState, engine]);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const blob = await generateShareImage(result, t);
    const text = `Genesis OS Blueprint: ${t.archetypes[result.archetypeKey]?.title || 'Analysis'}. Share Code: ${result.shareCode}`;
    if (blob && navigator.share) {
       try {
         const file = new File([blob], 'genesis_blueprint.png', { type: 'image/png' });
         if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ title: 'Genesis OS Blueprint', text, files: [file] });
            return;
         }
       } catch(e) { console.error('Share failed', e); }
    }
    PlatformBridge.openLink(t.results.share_url);
  }, [result, t]);

  const layoutProps = { 
    lang, onLangChange: setLang, soundEnabled, 
    onSoundToggle: () => setSoundEnabled(!soundEnabled), 
    onLogout: handleLogout, onReset: () => handleReset(false) 
  };

  const renderCurrentView = () => {
    if (dataStatus === 'corrupted') return <DataCorruptionView t={t} onReset={() => handleReset(true)} />;
    switch (view) {
      case 'auth': return <AuthView onLogin={handleLogin} t={t} lang={lang} onLangChange={setLang} />;
      case 'boot': return <BootView onComplete={() => { sessionStorage.setItem('genesis_boot_seen', 'true'); setBootShown(true); setView('dashboard'); }} t={t} />;
      case 'dashboard': return <DashboardView lang={lang} t={t} isDemo={isDemo} isPro={isPro} globalProgress={globalProgress} result={result} currentDomain={currentDomain} nodes={nodes} completedNodeIds={completedNodeIds} onSetView={setView as any} onSetCurrentDomain={onSetCurrentDomain => setCurrentDomain(onSetCurrentDomain)} onStartNode={engine.startNode} onLogout={handleLogout} scanHistory={scanHistory} onResume={handleContinue} licenseTier={licenseTier} />;
      case 'test': return !activeModule ? null : <TestView t={t} activeModule={activeModule} currentId={engine.state.currentId} scene={MODULE_REGISTRY[activeModule]?.[engine.state.currentId]} onChoice={engine.handleChoice} onExit={() => setView('dashboard')} getSceneText={getSceneText} adaptiveState={adaptiveState} />;
      case 'body_sync': return <BodySyncView lang={lang} t={t} onSync={engine.syncBodySensation} />;
      case 'reflection': return <ReflectionView t={t} sensation={history[history.length - 1]?.sensation} />;
      case 'results': if (!result) return null; return result.validity === 'INVALID' ? <InvalidResultsView t={t} onReset={() => handleReset(true)} patternFlags={result.patternFlags} /> : <ResultsView lang={lang} t={t} result={result} isGlitchMode={!!isGlitchMode} onContinue={handleContinue} onShare={handleShare} onBack={() => setView('dashboard')} getSceneText={getSceneText} adaptiveState={adaptiveState} onOpenBriefExplainer={() => setView('brief_explainer')} onNewCycle={handleNewCycle} isPro={isPro} />;
      case 'compatibility': return <CompatibilityView lang={lang} onUnlockPro={() => setIsPro(true)} t={t} onBack={() => setView('dashboard')} />;
      case 'guide': return <GuideView t={t} onBack={() => setView('dashboard')} />;
      case 'brief_explainer': return <BriefExplainerView t={t} onBack={() => setView('results')} />;
      default: return <AuthView onLogin={handleLogin} t={t} lang={lang} onLangChange={setLang} />;
    }
  };
  
  return (
    <div className={`w-full h-full ${isGlitchMode ? 'glitch' : ''}`}>
      {view === 'admin' ? (
        <AdminPanel t={t} onExit={() => setView('auth')} history={history} onUnlockAll={engine.forceCompleteAll} glitchEnabled={forceGlitch} onToggleGlitch={() => setForceGlitch(!forceGlitch)} onSetView={setView} />
      ) : view === 'system_integrity' ? (
        <SystemIntegrityView t={t} onBack={() => setView('admin')} />
      ) : (
        <Layout {...layoutProps}>{renderCurrentView()}</Layout>
      )}
    </div>
  );
};

export default App;
