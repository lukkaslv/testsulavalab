
import { GameHistoryItem, Contradiction, AdaptiveState, BeliefKey, DomainType, InterventionType } from '../types';
import { TOTAL_NODES, DOMAIN_SETTINGS } from '../constants';
import { calculateRawMetrics } from './psychologyService';

// Genesis OS v5.0 - Finalization Patch
const CLARITY_PER_NODE = 2.5; 
const CONTRADICTION_PENALTY = 1.0; 
const MIN_REQUIRED_NODES = 50; // Forced to full set for testing

export const getDomainForNodeId = (nodeId: number): DomainType | null => {
  for (const d of DOMAIN_SETTINGS) {
    if (nodeId >= d.startId && nodeId < (d.startId + d.count)) {
      return d.key;
    }
  }
  return null;
};

export const AdaptiveQuestionEngine = {
  analyzeContradictions(history: GameHistoryItem[], userBaseline: number): Contradiction[] {
    const contradictions: Contradiction[] = [];
    const POSITIVE_BELIEFS: BeliefKey[] = ['money_is_tool', 'self_permission', 'capacity_expansion'];

    history.forEach(h => {
      const numericId = parseInt(h.nodeId, 10);
      if (isNaN(numericId) || numericId < 3) return; 

      if (h.latency > userBaseline * 2.5 && POSITIVE_BELIEFS.includes(h.beliefKey as BeliefKey)) {
        contradictions.push({
          type: 'latency_mask',
          nodeId: h.nodeId,
          beliefKey: h.beliefKey,
          severity: 0.8,
          description: 'Когнитивное трение при выборе ресурсного варианта'
        });
      }
    });

    return contradictions;
  },

  detectInterventionNeed(history: GameHistoryItem[]): InterventionType | null {
      // Art. 6 Feedback Loops: Check for run-away positive feedback loops (Mania/Panic)
      if (history.length < 8) return null;

      // Check if we already triggered one recently (Debounce)
      // This requires the UI to track interventions, but here we can check if behavior persisted
      // For simplicity in this engine, we rely on the state snapshot

      const recent = history.slice(-5);
      
      // 1. MANIC BREAK (Fast + High Agency + Low Foundation)
      // We need metrics for this check
      const metrics = calculateRawMetrics(history);
      const isFast = recent.every(h => h.latency < 1500);
      
      if (isFast && metrics.state.agency > 75 && metrics.state.foundation < 35) {
          return {
              code: 'MANIC_BREAK',
              trigger: 'VELOCITY_OVERLOAD',
              requiredAction: 'SLOW_DOWN'
          };
      }

      // 2. SOMATIC WAKEUP (Disassociation)
      // 7 consecutive 's0' (Neutral)
      const somaticStreak = history.slice(-7);
      if (somaticStreak.length === 7 && somaticStreak.every(h => h.sensation === 's0')) {
          return {
              code: 'SOMATIC_WAKEUP',
              trigger: 'DISASSOCIATION_LOCK',
              requiredAction: 'BREATHE'
          };
      }

      return null;
  },

  selectNextQuestion(history: GameHistoryItem[], contradictions: Contradiction[], excludedId?: number): string | null {
    const sanitizedHistory = history.filter(h => h && h.nodeId);
    const completedIds = new Set(sanitizedHistory.map(h => parseInt(h.nodeId, 10)));
    
    if (excludedId !== undefined && !isNaN(excludedId)) {
        completedIds.add(excludedId);
    }
    
    if (completedIds.size >= TOTAL_NODES) return null;

    // После 50 вопросов система считает, что данных достаточно (полный цикл)
    if (completedIds.size >= MIN_REQUIRED_NODES) {
        return null; 
    }

    for (let i = 0; i < TOTAL_NODES; i++) {
        if (!completedIds.has(i)) return i.toString();
    }

    return null;
  },

  getAdaptiveState(history: GameHistoryItem[], userBaseline: number, currentNodeId?: number): AdaptiveState {
    const contradictions = this.analyzeContradictions(history, userBaseline);
    const rawClarity = history.length * CLARITY_PER_NODE;
    const penalty = contradictions.length * CONTRADICTION_PENALTY;
    
    let clarity = Math.min(100, Math.max(0, rawClarity - penalty));
    
    // Check for Intervention FIRST
    const intervention = this.detectInterventionNeed(history);
    
    const suggestedNextNodeId = this.selectNextQuestion(history, contradictions, currentNodeId);

    return {
      clarity,
      contradictions,
      // FORCE strict 50 nodes check. Ignore clarity score for completion.
      isComplete: history.length >= TOTAL_NODES,
      suggestedNextNodeId,
      confidenceScore: Math.min(100, 70 + (history.length)),
      intervention
    };
  }
};
