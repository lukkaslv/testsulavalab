
import { useState, useRef, useCallback, useEffect } from 'react';
import { DomainType, GameHistoryItem, Choice, ChoiceWithLatency } from '../types';
import { StorageService, STORAGE_KEYS } from '../services/storageService';
// FIX: Added TOTAL_NODES to support force completion logic
import { MODULE_REGISTRY, ONBOARDING_NODES_COUNT, TOTAL_NODES } from '../constants';
import { IntegrityService } from '../services/integrityService';
import { PlatformBridge } from '../utils/helpers';

interface UseTestEngineProps {
  setCompletedNodeIds: (fn: (prev: number[]) => number[]) => void;
  setHistory: (fn: (prev: GameHistoryItem[]) => GameHistoryItem[]) => void;
  setView: (view: string) => void;
  activeId: string;
  activeModule: DomainType | null;
  setActiveNode: (id: string, d: DomainType | null) => void;
  isDemo: boolean;
  canStart: boolean;
  onNextNodeRequest: (updatedHistory?: GameHistoryItem[]) => void; 
}

/**
 * Ядро Тестирования Genesis OS v12.0
 * Соответствие: Ст. 1.1 (Детерминизм), Ст. 21 (Простота)
 */
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
  
  const lastChoiceRef = useRef<ChoiceWithLatency | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const nodeStartTime = useRef<number>(0);

  useEffect(() => {
      nodeStartTime.current = performance.now();
      setIsProcessing(false);
  }, [activeId]);

  const commitUpdate = useCallback((newItem: GameHistoryItem, lastNodeId: number) => {
    // Ст. 5.1: Критическая Проверка Временной Целостности
    if (!IntegrityService.checkTemporalStability()) {
        newItem.latency = 99999; // Маркировка как ненадежные данные
    }

    StorageService.logTelemetry({
        nodeId: newItem.nodeId,
        domain: newItem.domain,
        latency: newItem.latency,
        sensation: newItem.sensation,
        beliefKey: newItem.beliefKey,
        variantId: 'GEN_V12'
    });

    let freshHistory: GameHistoryItem[] = [];

    setHistory(prev => {
        freshHistory = [...prev, newItem];
        
        // Синхронизация Атомарного Состояния
        setCompletedNodeIds(prevNodes => {
            const nextNodes = prevNodes.includes(lastNodeId) ? prevNodes : [...prevNodes, lastNodeId];
            StorageService.save(STORAGE_KEYS.SESSION_STATE, { nodes: nextNodes, history: freshHistory });
            return nextNodes;
        });
        
        return freshHistory;
    });

    StorageService.save('genesis_recovery_choice', null);
    lastChoiceRef.current = null;
    
    // Отложенный шаг для завершения цикла React
    setTimeout(() => onNextNodeRequest(freshHistory), 0);
  }, [setHistory, setCompletedNodeIds, onNextNodeRequest]);

  const startNode = useCallback((nodeId: number, domain: DomainType) => {
    if (!canStart && !isDemo) {
        PlatformBridge.haptic.notification('error');
        return;
    }
    setActiveNode(nodeId.toString(), domain);
    setView('test');
  }, [isDemo, canStart, setActiveNode, setView]);

  const syncBodySensation = useCallback((sensation: string) => {
    if (isProcessing || !lastChoiceRef.current || !activeModule) return;
    setIsProcessing(true);

    const newItem: GameHistoryItem = { 
      beliefKey: lastChoiceRef.current.beliefKey, 
      sensation, 
      latency: lastChoiceRef.current.latency,
      nodeId: activeId,
      domain: activeModule,
      choicePosition: lastChoiceRef.current.position
    };
    
    commitUpdate(newItem, parseInt(activeId, 10));
  }, [isProcessing, activeId, activeModule, commitUpdate]);

  const handleChoice = useCallback((choice: Choice) => {
    if (isProcessing || !activeModule) return; 
    
    const cleanLatency = performance.now() - nodeStartTime.current;
    const numericActiveId = parseInt(activeId, 10);
    const currentScene = MODULE_REGISTRY[activeModule]?.[activeId];
    
    lastChoiceRef.current = { ...choice, latency: cleanLatency };

    // Forensic Entry Check: Онбординг или Высокая Интенсивность запускает соматический скан
    if (numericActiveId < ONBOARDING_NODES_COUNT || (currentScene && currentScene.intensity >= 4)) {
        setView('body_sync');
    } else {
         setIsProcessing(true);
         const newItem: GameHistoryItem = { 
             beliefKey: choice.beliefKey, sensation: 's0', latency: cleanLatency,
             nodeId: activeId, domain: activeModule,
             choicePosition: choice.position
         };
         commitUpdate(newItem, numericActiveId);
    }
  }, [isProcessing, activeId, activeModule, setView, commitUpdate]);

  // FIX: Добавлена функция принудительного завершения для Админ-панели (Unlock All)
  const forceCompleteAll = useCallback(() => {
    const allIds = Array.from({ length: TOTAL_NODES }, (_, i) => i);
    setCompletedNodeIds(() => allIds);
    setHistory(() => []);
    StorageService.save(STORAGE_KEYS.SESSION_STATE, { nodes: allIds, history: [] });
    PlatformBridge.haptic.notification('success');
  }, [setCompletedNodeIds, setHistory]);

  return { startNode, handleChoice, syncBodySensation, forceCompleteAll };
};
