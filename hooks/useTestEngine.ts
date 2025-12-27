
import { useState, useRef, useCallback, useEffect } from 'react';
import { DomainType, GameHistoryItem, Choice, ChoiceWithLatency, BeliefKey } from '../types';
import { StorageService, STORAGE_KEYS, SessionState } from '../services/storageService';
import { MODULE_REGISTRY, ONBOARDING_NODES_COUNT, TOTAL_NODES, DOMAIN_SETTINGS } from '../constants';

interface UseTestEngineProps {
  setCompletedNodeIds: (fn: (prev: number[]) => number[]) => void;
  setHistory: (fn: (prev: GameHistoryItem[]) => GameHistoryItem[]) => void;
  setView: (view: any) => void;
  activeModule: DomainType | null;
  setActiveModule: (d: DomainType | null) => void;
  isDemo: boolean;
  canStart: boolean;
}

export const useTestEngine = ({
  setCompletedNodeIds,
  setHistory,
  setView,
  activeModule,
  setActiveModule,
  isDemo,
  canStart
}: UseTestEngineProps) => {
  
  const [state, setState] = useState({ 
    currentId: '0', 
    lastChoice: StorageService.load<ChoiceWithLatency | null>('genesis_recovery_choice', null)
  });
  
  const [lastSelectedNode, setLastSelectedNode] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const nodeStartTime = useRef<number>(0);
  const pauseStart = useRef<number>(0);
  const totalPausedTime = useRef<number>(0);
  const hardwareLatencyOffset = useRef<number>(0); 
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commitUpdate = useCallback((newItem: GameHistoryItem, lastNodeId: number, onComplete: (newNodes: number[]) => void) => {
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
            const sessionState: SessionState = { nodes: nextNodes, history: nextHistory };
            StorageService.save(STORAGE_KEYS.SESSION_STATE, sessionState);
            
            // FIX: Decouple state update from subsequent action to prevent race conditions.
            // This ensures React has finished processing state changes before we advance the node.
            setTimeout(() => onComplete(nextNodes), 0);

            return nextNodes;
        });
        return nextHistory;
    });

    StorageService.save('genesis_recovery_choice', null);
  }, [setHistory, setCompletedNodeIds]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseStart.current = performance.now();
      } else if (pauseStart.current > 0) {
        totalPausedTime.current += performance.now() - pauseStart.current;
        pauseStart.current = 0;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const startNode = useCallback((nodeId: number, domain: DomainType) => {
    if (!canStart && !isDemo) {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('error');
        return;
    }

    if (isDemo && nodeId >= 3) {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('warning');
        return;
    }
    
    setIsProcessing(false);
    setLastSelectedNode(nodeId);
    setActiveModule(domain);
    setState(prev => ({ ...prev, currentId: nodeId.toString(), lastChoice: null }));
    setView('test');
    
    totalPausedTime.current = 0;
    pauseStart.current = 0;
    requestAnimationFrame(() => {
      nodeStartTime.current = performance.now();
    });
  }, [isDemo, canStart, setActiveModule, setView]);

  const advanceNode = useCallback((completedNodes: number[]) => {
    const nextId = Math.max(...completedNodes, -1) + 1;
    if (nextId >= TOTAL_NODES) { setView('results'); return; }
    if (isDemo && nextId >= 3) { setView('dashboard'); return; }

    let nextDomain: DomainType | null = null;
    for (const d of DOMAIN_SETTINGS) {
        if (nextId >= d.startId && nextId < (d.startId + d.count)) {
            nextDomain = d.key;
            break;
        }
    }
    if (nextDomain) {
      startNode(nextId, nextDomain);
    } else {
      setView('dashboard');
    }
  }, [isDemo, setView, startNode]);

  const syncBodySensation = useCallback((sensation: string) => {
    if (isProcessing || !state.lastChoice || !activeModule || lastSelectedNode === null) return;
    setIsProcessing(true);

    const newItem: GameHistoryItem = { 
      beliefKey: state.lastChoice.beliefKey, 
      sensation, 
      latency: state.lastChoice.latency,
      nodeId: state.currentId,
      domain: activeModule as DomainType,
      choicePosition: state.lastChoice.position
    };
    
    const onCommitComplete = (newNodes: number[]) => {
      if (sensation === 's0') {
        advanceNode(newNodes);
      } else {
        setView('reflection');
        if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
        syncTimerRef.current = setTimeout(() => {
           advanceNode(newNodes);
        }, 1200);
      }
    };
    
    commitUpdate(newItem, lastSelectedNode, onCommitComplete);
  }, [state, isProcessing, activeModule, lastSelectedNode, advanceNode, setView, commitUpdate]);

  const handleChoice = useCallback((choice: Choice) => {
    if (isProcessing) return; 
    
    window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.(); 
    const now = performance.now();
    
    const rawLatency = now - nodeStartTime.current - totalPausedTime.current;
    const cleanLatency = Math.max(0, rawLatency - hardwareLatencyOffset.current);
    
    const choiceWithLatency: ChoiceWithLatency = { ...choice, latency: cleanLatency };
    
    if (activeModule && lastSelectedNode !== null) {
        const currentScene = MODULE_REGISTRY[activeModule][state.currentId];
        const numericId = parseInt(state.currentId);
        const shouldSample = numericId < ONBOARDING_NODES_COUNT || currentScene.intensity >= 4;

        setState(prev => ({ ...prev, lastChoice: choiceWithLatency }));
        StorageService.save('genesis_recovery_choice', choiceWithLatency);

        if (shouldSample) {
            setView('body_sync');
        } else {
             setIsProcessing(true);
             const newItem: GameHistoryItem = { 
                 beliefKey: choice.beliefKey, sensation: 's0', latency: cleanLatency,
                 nodeId: state.currentId, domain: activeModule as DomainType,
                 choicePosition: choice.position
             };
             commitUpdate(newItem, lastSelectedNode, (newNodes) => {
                 advanceNode(newNodes);
             });
        }
    }
  }, [isProcessing, activeModule, state, lastSelectedNode, advanceNode, setView, commitUpdate]);

  const forceCompleteAll = useCallback(() => {
    const allIds = Array.from({ length: TOTAL_NODES }, (_, i) => i);
    const userId = localStorage.getItem(STORAGE_KEYS.SESSION) || 'anonymous';
    const variantId = (userId.charCodeAt(0) % 2 === 0) ? 'A' : 'B';

    const highValueBeliefs: BeliefKey[] = ['money_is_tool', 'self_permission', 'capacity_expansion'];

    const neutralHistory: GameHistoryItem[] = allIds.map(id => {
        const domain = id < 15 ? 'foundation' : id < 25 ? 'agency' : id < 35 ? 'money' : id < 45 ? 'social' : 'legacy';
        
        const item: GameHistoryItem = {
            beliefKey: highValueBeliefs[id % highValueBeliefs.length], 
            sensation: id % 7 === 0 ? 's2' : 's0', 
            latency: 1400 + (id % 9) * 120, 
            nodeId: id.toString(), 
            domain: domain as DomainType, 
            choicePosition: id % 3 
        };

        StorageService.logTelemetry({
            nodeId: item.nodeId,
            domain: item.domain,
            latency: item.latency,
            sensation: item.sensation,
            beliefKey: item.beliefKey,
            variantId
        });

        return item;
    });

    setHistory(() => neutralHistory);
    setCompletedNodeIds(() => allIds);
    StorageService.save(STORAGE_KEYS.SESSION_STATE, { nodes: allIds, history: neutralHistory });
  }, [setHistory, setCompletedNodeIds]);

  return { state, startNode, handleChoice, forceCompleteAll, syncBodySensation };
};
