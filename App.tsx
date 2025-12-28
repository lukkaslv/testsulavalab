import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Layout } from './components/Layout';
import { MODULE_REGISTRY, ONBOARDING_NODES_COUNT, TOTAL_NODES, DOMAIN_SETTINGS } from './constants';
import { calculateRawMetrics } from './services/psychologyService';
import { DiagnosticEngine } from './services/diagnosticEngine';
import { DomainType, AnalysisResult, GameHistoryItem, ScanHistory, DataCorruptionError } from './types';
import { StorageService, STORAGE_KEYS, SessionState } from './services/storageService';
import { resolvePath, PlatformBridge } from './utils/helpers';
import { useTestEngine } from './hooks/useTestEngine';
import { AdaptiveQuestionEngine } from './services/adaptiveQuestionEngine';
import { PatternDetector } from './services/PatternDetector';
import { useAppContext } from './hooks/useAppContext';
import { generateShareImage } from './utils/shareGenerator';

// View Imports
import { AuthView } from './components/views/AuthView';
import { BootView } from './components/views/BootView';
import { DashboardView, NodeUI } from './components/views/DashboardView';
import { TestView, ReflectionView } from './components/views/TestModule';
import { BodySyncView } from './components/views/BodySyncView';
import { ResultsView } from './components/views/ResultsView';
import { AdminPanel } from './components/views/AdminPanel';
import { CompatibilityView } from './components/views/CompatibilityView';
import { GuideView } from './components/views/GuideView';
import { DataCorruptionView } from './components/views/DataCorruptionView';
import { InvalidResultsView } from './components/views/InvalidResultsView';
import { SystemIntegrityView } from './components/views/SystemIntegrityView';
import { SystemSimulationView } from './components/views/SystemSimulationView';

const App: React.FC = () => {
  const {
    lang, t, view, setViewAndPersist,
    licenseTier, isDemo, isPro, isMaster,
    completedNodeIds, setCompletedNodeIds,
    history, setHistory,
    dataStatus, scanHistory, usageStats,
    handleLogout, handleReset,
    handleLogin, onLangChange
  } = useAppContext();

  const [activeTest, setActiveTest] = useState<{ id: string; domain: DomainType | null }>({ id: '0', domain: 'foundation' });
  const [currentDomain, setCurrentDomain] = useState<DomainType | null>(null);
  const [forceGlitch, setForceGlitch] = useState(false);

  const engineRef = useRef<any>(null);

  const baseline = useMemo(() => {
    if (history.length === 0) return 2000;
    const samples = history.slice(0, 5);
    return samples.reduce((acc, h) => acc + h.latency, 0) / samples.length;
  }, [history]);

  const adaptiveState = useMemo(() => 
    AdaptiveQuestionEngine.getAdaptiveState(history, baseline, parseInt(activeTest.id, 10))
  , [history, baseline, activeTest.id]);

  const handleStartNode = useCallback((nodeId: number, domain: DomainType) => {
      if (!usageStats.canStart && !isDemo) {
          PlatformBridge.haptic.notification('error');
          return;
      }
      if (engineRef.current) {
          engineRef.current.startNode(nodeId, domain);
      }
  }, [isDemo, usageStats.canStart]);

  const handleContinue = useCallback(() => {
    if (adaptiveState.isComplete) { 
        setViewAndPersist('results'); 
        return; 
    }
    
    let nextIdStr = adaptiveState.suggestedNextNodeId;
    const completedSet = new Set(completedNodeIds);
    if (nextIdStr && completedSet.has(parseInt(nextIdStr, 10))) {
        nextIdStr = null;
    }

    if (!nextIdStr) {
        for(let i=0; i < TOTAL_NODES; i++) {
            if (!completedSet.has(i)) {
                nextIdStr = i.toString();
                break;
            }
        }
    }

    if (nextIdStr) {
        const numericId = parseInt(nextIdStr, 10);
        let nextDomain: DomainType | null = null;
        for (const d of DOMAIN_SETTINGS) {
            if (numericId >= d.startId && numericId < (d.startId + d.count)) { 
                nextDomain = d.key; 
                break; 
            }
        }
        if (nextDomain) handleStartNode(numericId, nextDomain);
        else setViewAndPersist('dashboard');
    } else {
        setViewAndPersist('results');
    }
  }, [adaptiveState, completedNodeIds, handleStartNode, setViewAndPersist]);

  const engineInstance = useTestEngine({
    setCompletedNodeIds,
    setHistory,
    setView: setViewAndPersist,
    activeId: activeTest.id,
    activeModule: activeTest.domain,
    setActiveNode: (id, domain) => setActiveTest({ id, domain }),
    isDemo,
    canStart: usageStats.canStart,
    onNextNodeRequest: handleContinue
  });

  useEffect(() => {
    engineRef.current = engineInstance;
  }, [engineInstance]);

  const result = useMemo<AnalysisResult | null>(() => {
    if (history.length < ONBOARDING_NODES_COUNT) return null;
    const rawResult = calculateRawMetrics(history);
    const patternFlags = PatternDetector.analyze(history);
    return DiagnosticEngine.interpret(rawResult, patternFlags);
  }, [history]);

  const globalProgress = useMemo(() => Math.min(100, Math.round(adaptiveState.clarity)), [adaptiveState.clarity]);
  
  const isGlitchMode = forceGlitch || (result && (result.entropyScore > 55 || result.state.foundation < 25));
  
  const getSceneText = useCallback((textKey: string) => resolvePath(t, textKey), [t]);

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

  const handleShare = async () => {
    if (!result) return;
    PlatformBridge.haptic.impact('light');
    try {
        const blob = await generateShareImage(result, t);
        if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'genesis-blueprint.png';
            a.click();
            URL.revokeObjectURL(url);
        }
    } catch (error) { console.error('Share failed', error); }
  };

  const renderCurrentView = () => {
    if (dataStatus === 'corrupted') return <DataCorruptionView t={t} onReset={() => handleReset(true)} />;
    const scene = activeTest.domain ? MODULE_REGISTRY[activeTest.domain]?.[activeTest.id] : undefined;

    switch (view) {
      case 'auth': return <AuthView onLogin={handleLogin} t={t} lang={lang} onLangChange={onLangChange} />;
      case 'boot': return <BootView onComplete={() => setViewAndPersist('dashboard')} t={t} />;
      case 'dashboard': return <DashboardView nodes={nodes} result={result} onStartNode={handleStartNode} onResume={handleContinue} globalProgress={globalProgress} lang={lang} t={t} isDemo={isDemo} isPro={isPro} completedNodeIds={completedNodeIds} onSetView={setViewAndPersist} onLogout={handleLogout} scanHistory={scanHistory} licenseTier={licenseTier} usageStats={usageStats} onSetCurrentDomain={setCurrentDomain} currentDomain={currentDomain} />;
      case 'test': return <TestView key={activeTest.id} t={t} activeModule={activeTest.domain!} currentId={activeTest.id} scene={scene!} onChoice={engineInstance.handleChoice} onExit={() => setViewAndPersist('dashboard')} getSceneText={getSceneText} adaptiveState={adaptiveState} />;
      case 'body_sync': return <BodySyncView lang={lang} t={t} onSync={engineInstance.syncBodySensation} />;
      case 'reflection': return <ReflectionView t={t} sensation={history[history.length - 1]?.sensation} />;
      case 'results': if (!result) return <div/>; return result.validity === 'INVALID' ? <InvalidResultsView t={t} onReset={() => handleReset(true)} patternFlags={result.patternFlags} /> : <ResultsView lang={lang} t={t} result={result} isGlitchMode={!!isGlitchMode} onContinue={handleContinue} onShare={handleShare} onBack={() => setViewAndPersist('dashboard')} onNewCycle={() => handleReset(false)} isPro={isPro} />;
      case 'admin': return <AdminPanel t={t} onExit={() => setViewAndPersist('dashboard')} history={history} onUnlockAll={engineInstance.forceCompleteAll} glitchEnabled={forceGlitch} onToggleGlitch={() => setForceGlitch(!forceGlitch)} onSetView={setViewAndPersist} />;
      case 'compatibility': return <CompatibilityView lang={lang} t={t} onBack={() => setViewAndPersist('dashboard')} />;
      case 'guide': return <GuideView t={t} onBack={() => setViewAndPersist('dashboard')} />;
      case 'system_integrity': return <SystemIntegrityView t={t} onBack={() => setViewAndPersist('admin')} />;
      case 'system_simulation': return <SystemSimulationView t={t} onBack={() => setViewAndPersist('admin')} />;
      default: return <AuthView onLogin={handleLogin} t={t} lang={lang} onLangChange={onLangChange} />;
    }
  };

  // Axis 9.4: Strict View Isolation for Professionals
  const isProMode = licenseTier === 'CLINICAL' || licenseTier === 'LAB';
  const isTerminalView = (isMaster && ['admin', 'system_integrity', 'system_simulation'].includes(view)) || (isProMode && ['compatibility', 'guide'].includes(view));

  return (
    <div className={`w-full h-full ${isGlitchMode ? 'glitch' : ''}`}>
      {isTerminalView ? renderCurrentView() : <Layout>{renderCurrentView()}</Layout>}
    </div>
  );
};

export default App;