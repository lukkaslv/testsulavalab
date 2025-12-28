
import { useState, useRef, useCallback } from 'react';
import { DomainType, GameHistoryItem, Choice, ChoiceWithLatency } from '../types';
import { StorageService, STORAGE_KEYS } from '../services/storageService';
import { MODULE_REGISTRY, ONBOARDING_NODES_COUNT, TOTAL_NODES } from '../constants';

interface UseTestEngineProps {
  setCompletedNodeIds: (fn: (prev: number[]) => number[]) => void;
  setHistory: (fn: (prev: GameHistoryItem[]) => GameHistoryItem[]) => void;
  setView: (view: any) => void;
  activeId: string;
  activeModule: DomainType | null;
  setActiveNode: (id: string, d: DomainType | null) => void;
  isDemo: boolean;
  canStart: boolean;
  onNextNodeRequest: () => void; // App.tsx will provide adaptive logic
}

export const useTestEngine = ({
  setCompletedNodeIds,
  setHistory,
  setView,
  activeId,
  activeModule,
  setActiveNode,
  isDemo,
  canStart,
  onNextNodeRequest
}: UseTestEngineProps) => {
  
  const lastChoiceRef = useRef<ChoiceWithLatency | null>(StorageService.load<ChoiceWithLatency | null>('genesis_recovery_choice', null));
  const [isProcessing, setIsProcessing] = useState(false);

  const nodeStartTime = useRef<number>(0);
  const pauseStart = useRef<number>(0);
  const totalPausedTime = useRef<number>(0);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commitUpdate = useCallback((newItem: GameHistoryItem, lastNodeId: number, onComplete: () => void) => {
    const userId = localStorage.getItem(STORAGE_KEYS.SESSION) || 'anonymous';
    const variantId = (userId.charCodeAt(0) % 2 === 0) ? 'A' : 'B';

    StorageService.logTelemetry({
        nodeId: newItem.nodeId,
        domain: newItem.domain,
        latency: newItem.latency,
        sensation: newItem.sensation,
        beliefKey: newItem.beliefKey,
        variantId
    });

    setHistory(prevHistory => {
        const nextHistory = [...prevHistory, newItem];
        setCompletedNodeIds(prevNodes => {
            const nextNodes = prevNodes.includes(lastNodeId) ? prevNodes : [...prevNodes, lastNodeId];
            StorageService.save(STORAGE_KEYS.SESSION_STATE, { nodes: nextNodes, history: nextHistory });
            return nextNodes;
        });
        return nextHistory;
    });

    StorageService.save('genesis_recovery_choice', null);
    lastChoiceRef.current = null;
    
    // Defer completion to ensure state batching finishes
    setTimeout(onComplete, 0);
  }, [setHistory, setCompletedNodeIds]);

  const startNode = useCallback((nodeId: number, domain: DomainType) => {
    // CRITICAL: Always reset processing lock when starting a new node
    setIsProcessing(false);
    
    if (!canStart && !isDemo) {
        // FIX: Cast window to any for Telegram access
        (window as any).Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('error');
        return;
    }

    setActiveNode(nodeId.toString(), domain);
    setView('test');
    
    totalPausedTime.current = 0;
    pauseStart.current = 0;
    requestAnimationFrame(() => {
      nodeStartTime.current = performance.now();
    });
  }, [isDemo, canStart, setActiveNode, setView]);

  const syncBodySensation = useCallback((sensation: string) => {
    if (isProcessing || !lastChoiceRef.current || !activeModule) return;
    setIsProcessing(true);

    const numericActiveId = parseInt(activeId, 10);
    const newItem: GameHistoryItem = { 
      beliefKey: lastChoiceRef.current.beliefKey, 
      sensation, 
      latency: lastChoiceRef.current.latency,
      nodeId: activeId,
      domain: activeModule as DomainType,
      choicePosition: lastChoiceRef.current.position
    };
    
    commitUpdate(newItem, numericActiveId, () => {
      if (sensation === 's0') {
        onNextNodeRequest();
      } else {
        setView('reflection');
        if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
        syncTimerRef.current = setTimeout(() => {
           onNextNodeRequest();
        }, 1200);
      }
    });
  }, [isProcessing, activeId, activeModule, setView, commitUpdate, onNextNodeRequest]);

  const handleChoice = useCallback((choice: Choice) => {
    if (isProcessing || !activeModule) return; 
    
    const now = performance.now();
    const cleanLatency = Math.max(0, now - nodeStartTime.current - totalPausedTime.current);
    const numericActiveId = parseInt(activeId, 10);
    const currentScene = MODULE_REGISTRY[activeModule]?.[activeId];
    
    lastChoiceRef.current = { ...choice, latency: cleanLatency };
    StorageService.save('genesis_recovery_choice', lastChoiceRef.current);

    if (numericActiveId < ONBOARDING_NODES_COUNT || (currentScene && currentScene.intensity >= 4)) {
        setView('body_sync');
    } else {
         setIsProcessing(true);
         const newItem: GameHistoryItem = { 
             beliefKey: choice.beliefKey, sensation: 's0', latency: cleanLatency,
             nodeId: activeId, domain: activeModule as DomainType,
             choicePosition: choice.position
         };
         commitUpdate(newItem, numericActiveId, onNextNodeRequest);
    }
  }, [isProcessing, activeId, activeModule, setView, commitUpdate, onNextNodeRequest]);

  const forceCompleteAll = useCallback(() => {
    const allIds = Array.from({ length: TOTAL_NODES }, (_, i) => i);
    setCompletedNodeIds(() => allIds);
    // ... history generation logic ...
  }, [setCompletedNodeIds]);

  return { startNode, handleChoice, forceCompleteAll, syncBodySensation };
};
