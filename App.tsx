
import React, { useState, useMemo, useCallback } from 'react';
import { Layout } from './components/Layout';
import { MODULE_REGISTRY, DOMAIN_SETTINGS } from './constants';
import { calculateRawMetrics } from './services/psychologyService';
import { DiagnosticEngine } from './services/diagnosticEngine';
import { DomainType, AnalysisResult, GameHistoryItem } from './types';
import { resolvePath } from './utils/helpers';
import { useTestEngine } from './hooks/useTestEngine';
import { AdaptiveQuestionEngine, getDomainForNodeId } from './services/adaptiveQuestionEngine';
import { PatternDetector } from './services/PatternDetector';
import { useAppContext } from './hooks/useAppContext';
import { StorageService } from './services/storageService';
import { generateShareImage } from './utils/shareGenerator';

// View Imports
import { AuthView } from './components/views/AuthView';
import { BootView } from './components/views/BootView';
import { DashboardView, NodeUI } from './components/views/DashboardView';
import { TestView } from './components/views/TestModule';
import { BodySyncView } from './components/views/BodySyncView';
import { ResultsView } from './components/views/ResultsView';
import { AdminPanel } from './components/views/AdminPanel';
import { ProTerminalView } from './components/views/ProTerminalView';
import { GuideView } from './components/views/GuideView';
import { DataCorruptionView } from './components/views/DataCorruptionView';
import { InvalidResultsView } from './components/views/InvalidResultsView';
import { SystemIntegrityView } from './components/views/SystemIntegrityView';
import { SystemSimulationView } from './components/views/SystemSimulationView';
import { ProHubView } from './components/views/ProHubView';
import { ScanDetailView } from './components/views/ScanDetailView';
import { PrivacyView } from './components/views/PrivacyView';
import { ExpertAcademyView } from './components/views/ExpertAcademyView';
import { TransparencyView } from './components/views/TransparencyView';
import { CompareView } from './components/views/CompareView';
import { SecurityMonitorView } from './components/views/SecurityMonitorView';
import { SpecialistAtlasView } from './components/views/SpecialistAtlasView';
import { SystemChangelogView } from './components/views/SystemChangelogView';
import { ScientificFoundationsView } from './components/views/ScientificFoundationsView';
import { SpecialistOathView } from './components/views/SpecialistOathView';
import { StabilizationView } from './components/views/StabilizationView';
import { IntegrationProtocolView } from './components/views/IntegrationProtocolView';
import { ProcessingView } from './components/views/ProcessingView';
import { ConstitutionView } from './components/views/ConstitutionView';
import { CrisisView } from './components/views/CrisisView';
import { DevSanctuaryView } from './components/views/DevSanctuaryView';
import { BriefExplainerView } from './components/views/BriefExplainerView';
import { PatternLibraryView } from './components/views/PatternLibraryView';
import { ArchetypeGalleryView } from './components/views/ArchetypeGalleryView';
import { TechnicalStandardView } from './components/views/TechnicalStandardView';

const App: React.FC = () => {
  const {
    t, view, setViewAndPersist, licenseTier, isDemo, isPro,
    completedNodeIds, setCompletedNodeIds, history, setHistory,
    dataStatus, scanHistory, usageStats, networkReport,
    handleLogout, handleReset, handleLogin, previousView
  } = useAppContext();

  const [activeTest, setActiveTest] = useState<{ id: string; domain: DomainType | null }>({ id: '0', domain: 'foundation' });
  const [selectedScan, setSelectedScan] = useState<AnalysisResult | null>(null);
  const [compareSelection, setCompareSelection] = useState<[AnalysisResult, AnalysisResult] | null>(null);

  const baseline = useMemo(() => {
    if (history.length === 0) return 2000;
    const samples = history.slice(0, 5);
    return samples.reduce((acc, h) => acc + h.latency, 0) / samples.length;
  }, [history]);

  const adaptiveState = useMemo(() => 
    AdaptiveQuestionEngine.getAdaptiveState(history, baseline, parseInt(activeTest.id, 10))
  , [history, baseline, activeTest.id]);

  const result = useMemo(() => {
    if (history.length < 5) return null;
    try {
        const rawResult = calculateRawMetrics(history);
        const patternFlags = PatternDetector.analyze(history);
        return DiagnosticEngine.interpret(rawResult, patternFlags);
    } catch (e) {
        console.error("Critical Analysis Failure:", e);
        return null;
    }
  }, [history]);

  const handleFinalizeSession = useCallback(async () => {
    if (result && result.validity === 'VALID') {
        try {
            await StorageService.saveScan(result);
            console.log("🧬 ГЕНЕЗИС: Результат сессии зафиксирован в истории.");
        } catch (e) {
            console.warn("Ошибка фиксации истории:", e);
        }
    }
    setViewAndPersist('results');
  }, [result, setViewAndPersist]);

  const handleContinue = useCallback((historyOverride?: GameHistoryItem[]) => {
    const currentHistory = historyOverride || history;
    const currentAdaptiveState = AdaptiveQuestionEngine.getAdaptiveState(
        currentHistory, 
        baseline, 
        parseInt(activeTest.id, 10)
    );

    if (currentAdaptiveState.isComplete) {
      setViewAndPersist('processing');
      return;
    }
    
    const nextIdStr = currentAdaptiveState.suggestedNextNodeId;
    if (nextIdStr) {
      const numericId = parseInt(nextIdStr, 10);
      const nextDomain = getDomainForNodeId(numericId);
      if (nextDomain) {
          setActiveTest({ id: nextIdStr, domain: nextDomain });
          setViewAndPersist('test');
      }
    }
  }, [history, baseline, activeTest.id, setViewAndPersist]);

  const engineInstance = useTestEngine({
    setCompletedNodeIds, setHistory, setView: setViewAndPersist,
    activeId: activeTest.id, activeModule: activeTest.domain,
    setActiveNode: (id, domain) => setActiveTest({ id, domain }),
    isDemo, canStart: usageStats.canStart, 
    onNextNodeRequest: handleContinue
  });

  const nodes = useMemo(() => {
    const allNodes: NodeUI[] = [];
    DOMAIN_SETTINGS.forEach((config) => {
      for (let i = 0; i < config.count; i++) {
        const absId = config.startId + i;
        allNodes.push({ 
            id: absId, domain: config.key, 
            active: absId === 0 || completedNodeIds.includes(absId - 1) || completedNodeIds.includes(absId), 
            done: completedNodeIds.includes(absId) 
        });
      }
    });
    return allNodes;
  }, [completedNodeIds]);

  const renderView = () => {
    if (dataStatus === 'corrupted') return <DataCorruptionView t={t} onReset={() => handleReset(true)} />;
    
    if (view === 'results' && result?.isCrisis) {
        return <CrisisView t={t} onExit={() => handleReset(true)} shareCode={result.shareCode} />;
    }

    const backTo = previousView === 'admin' ? 'admin' : (isPro ? 'pro_hub' : 'dashboard');

    switch (view) {
      case 'auth': return <AuthView onLogin={handleLogin} t={t} />;
      case 'boot': return <BootView onComplete={() => setViewAndPersist(backTo)} t={t} />;
      case 'dashboard': return <DashboardView nodes={nodes} result={result} onStartNode={engineInstance.startNode} onResume={() => handleContinue()} globalProgress={Math.round(adaptiveState.clarity)} t={t} isDemo={isDemo} completedNodeIds={completedNodeIds} onSetView={setViewAndPersist} scanHistory={scanHistory} onSetCurrentDomain={() => {}} currentDomain={null} />;
      case 'pro_hub': return <ProHubView t={t} usageStats={usageStats} onSetView={setViewAndPersist} onLogout={handleLogout} licenseTier={licenseTier} scanHistory={scanHistory} onStartNode={engineInstance.startNode} onSelectScan={(s) => { setSelectedScan(s); setViewAndPersist('scan_detail'); }} onCompareScans={(a,b) => { setCompareSelection([a,b]); setViewAndPersist('compare'); }} />;
      case 'pro_terminal': return <ProTerminalView t={t} onBack={() => setViewAndPersist(backTo)} />;
      case 'test': return <TestView t={t} activeModule={activeTest.domain!} currentId={activeTest.id} scene={MODULE_REGISTRY[activeTest.domain!]![activeTest.id]} onChoice={engineInstance.handleChoice} onExit={() => setViewAndPersist(backTo)} getSceneText={(path) => resolvePath(t, path)} adaptiveState={adaptiveState} />;
      case 'body_sync': return <BodySyncView t={t} onSync={engineInstance.syncBodySensation} />;
      case 'stabilization': return <StabilizationView t={t} onComplete={() => handleContinue()} />;
      case 'processing': return <ProcessingView onComplete={handleFinalizeSession} />;
      case 'results':
        if (!result) return <DashboardView nodes={nodes} result={result} onStartNode={engineInstance.startNode} onResume={() => handleContinue()} globalProgress={Math.round(adaptiveState.clarity)} t={t} isDemo={isDemo} completedNodeIds={completedNodeIds} onSetView={setViewAndPersist} scanHistory={scanHistory} onSetCurrentDomain={() => {}} currentDomain={null} />;
        return result.validity === 'INVALID' 
            ? <InvalidResultsView t={t} onReset={() => handleReset(true)} patternFlags={result.patternFlags} /> 
            : <ResultsView t={t} result={result} isGlitchMode={false} onContinue={() => handleContinue()} onShare={async () => {
                const blob = await generateShareImage(result, t, licenseTier);
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'slepok.png'; a.click();
                }
            }} onBack={() => setViewAndPersist(backTo)} isPro={isPro} onSetView={setViewAndPersist} />;
      case 'protocol':
        if (!result) return <div/>;
        return <IntegrationProtocolView t={t} result={result} onBack={() => setViewAndPersist('results')} />;
      case 'admin': return <AdminPanel t={t} onExit={handleLogout} history={history} onUnlockAll={engineInstance.forceCompleteAll} glitchEnabled={false} onToggleGlitch={() => {}} onSetView={setViewAndPersist} />;
      case 'academy': return <ExpertAcademyView t={t} onBack={() => setViewAndPersist(backTo)} />;
      case 'scan_detail': return <ScanDetailView scan={selectedScan!} t={t} onBack={() => setViewAndPersist('pro_hub')} />;
      case 'compare': return <CompareView scanA={compareSelection![0]} scanB={compareSelection![1]} t={t} onBack={() => setViewAndPersist('pro_hub')} />;
      case 'guide': return <GuideView t={t} onBack={() => setViewAndPersist(backTo)} />;
      case 'codex': return <PatternLibraryView t={t} onBack={() => setViewAndPersist(backTo)} />;
      case 'brief_explainer': return <BriefExplainerView t={t} onBack={() => setViewAndPersist(backTo)} />;
      case 'archetypes': return <ArchetypeGalleryView t={t} onBack={() => setViewAndPersist(backTo)} />;
      case 'privacy': return <PrivacyView t={t} onBack={() => setViewAndPersist(backTo)} />;
      case 'security_monitor': return <SecurityMonitorView report={networkReport} t={t} onBack={() => setViewAndPersist(backTo)} />;
      case 'constitution': return <ConstitutionView onBack={() => setViewAndPersist(backTo)} t={t} />;
      case 'specialist_atlas': return <SpecialistAtlasView t={t} onBack={() => setViewAndPersist(backTo)} />;
      case 'changelog': return <SystemChangelogView t={t} onBack={() => setViewAndPersist(backTo)} />;
      case 'scientific_foundations': return <ScientificFoundationsView t={t} onBack={() => setViewAndPersist(backTo)} />;
      case 'tech_standard': return <TechnicalStandardView t={t} onBack={() => setViewAndPersist(backTo)} />;
      case 'specialist_oath': return <SpecialistOathView t={t} onComplete={() => setViewAndPersist('pro_hub')} />;
      case 'transparency': return result ? <TransparencyView t={t} result={result} onBack={() => setViewAndPersist('results')} /> : <div/>;
      case 'system_integrity': return <SystemIntegrityView t={t} onBack={() => setViewAndPersist('admin')} />;
      case 'system_simulation': return <SystemSimulationView t={t} onBack={() => setViewAndPersist('admin')} />;
      case 'dev_sanctuary': return <DevSanctuaryView onBack={() => setViewAndPersist('admin')} />;
      default: return <AuthView onLogin={handleLogin} t={t} />;
    }
  };

  const isFullScreen = ['auth', 'boot', 'test', 'body_sync', 'processing', 'security_monitor', 'constitution', 'stabilization', 'pro_terminal', 'protocol', 'dev_sanctuary', 'tech_standard', 'changelog'].includes(view);

  return (
    <div className="w-full h-full">
      {isFullScreen ? renderView() : <Layout>{renderView()}</Layout>}
    </div>
  );
};

export default App;
