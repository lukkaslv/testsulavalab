import { GameHistoryItem, Contradiction, AdaptiveState, BeliefKey, DomainType } from '../types';
import { TOTAL_NODES, DOMAIN_SETTINGS } from '../constants';

// Genesis OS v4.9 - Integrity Calibration
// CLARITY_PER_NODE reduced to 2.0 so 50 nodes = 100%
const CLARITY_PER_NODE = 2.0; 
const CONTRADICTION_PENALTY = 1.5; 
const MIN_REQUIRED_NODES = 40; // Hard limit for clinical validity

const POSITIVE_BELIEFS: BeliefKey[] = ['money_is_tool', 'self_permission', 'capacity_expansion'];

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

    history.forEach(h => {
      const numericId = parseInt(h.nodeId, 10);
      if (isNaN(numericId) || numericId < 3) return; 

      if (h.latency > userBaseline * 2.8 && POSITIVE_BELIEFS.includes(h.beliefKey as BeliefKey)) {
        contradictions.push({
          type: 'latency_mask',
          nodeId: h.nodeId,
          beliefKey: h.beliefKey,
          severity: 0.85,
          description: 'High cognitive effort for standard choice'
        });
      }

      if ((h.sensation === 's1' || h.sensation === 's4') && POSITIVE_BELIEFS.includes(h.beliefKey as BeliefKey)) {
        contradictions.push({
          type: 'somatic_clash',
          nodeId: h.nodeId,
          beliefKey: h.beliefKey,
          severity: 0.95,
          description: 'Physical friction detected'
        });
      }
    });

    return contradictions;
  },

  selectNextQuestion(history: GameHistoryItem[], contradictions: Contradiction[], excludedId?: number): string | null {
    const sanitizedHistory = history.filter(h => h && h.nodeId);
    
    const completedIds = new Set(sanitizedHistory.map(h => {
        const id = parseInt(h.nodeId, 10);
        return isNaN(id) ? -1 : id;
    }));
    
    if (excludedId !== undefined && !isNaN(excludedId)) {
        completedIds.add(excludedId);
    }
    
    // Safety exit: only if we reached absolute limit
    if (completedIds.size >= TOTAL_NODES) return null;

    // 1. Calibration (First 3)
    for (let i = 0; i < 3; i++) {
        if (!completedIds.has(i)) return i.toString();
    }
    
    // 2. Ensure all domains have at least 3 nodes before stopping
    for (const domain of DOMAIN_SETTINGS) {
        const domainNodes = sanitizedHistory.filter(h => h.domain === domain.key);
        if (domainNodes.length < 3) {
            for (let i = 0; i < domain.count; i++) {
                const id = domain.startId + i;
                if (!completedIds.has(id)) return id.toString();
            }
        }
    }

    // 3. Target domains with contradictions
    let domainTension: Record<string, number> = { foundation: 0, agency: 0, money: 0, social: 0, legacy: 0 };
    contradictions.forEach(c => {
        const item = sanitizedHistory.find(h => h.nodeId === c.nodeId);
        if (item && domainTension[item.domain] !== undefined) {
            domainTension[item.domain]++;
        }
    });

    const sortedDomains = (Object.entries(domainTension) as [DomainType, number][])
        .filter(([_, score]) => score > 0)
        .sort((a, b) => b[1] - a[1]) 
        .map(([key]) => key);

    for (const domainKey of sortedDomains) {
        const domainCfg = DOMAIN_SETTINGS.find(d => d.key === domainKey);
        if (domainCfg) {
             for (let i = 0; i < domainCfg.count; i++) {
                const id = domainCfg.startId + i;
                if (!completedIds.has(id)) return id.toString();
             }
        }
    }

    // 4. Sequential search as final fallback
    for (let i = 0; i < TOTAL_NODES; i++) {
        if (!completedIds.has(i)) return i.toString();
    }

    return null;
  },

  getAdaptiveState(history: GameHistoryItem[], userBaseline: number, currentNodeId?: number): AdaptiveState {
    const contradictions = this.analyzeContradictions(history, userBaseline);
    const rawClarity = history.length * CLARITY_PER_NODE;
    const penalty = contradictions.length * CONTRADICTION_PENALTY;
    
    const clarity = Math.min(100, Math.max(0, rawClarity - penalty));
    const suggestedNextNodeId = this.selectNextQuestion(history, contradictions, currentNodeId);

    // Clinical Logic: Cannot be complete if clarity < 100 AND history < MIN_REQUIRED_NODES
    const isStatisticallyReady = clarity >= 100 && history.length >= MIN_REQUIRED_NODES;

    return {
      clarity,
      contradictions,
      isComplete: isStatisticallyReady || suggestedNextNodeId === null || history.length >= TOTAL_NODES,
      suggestedNextNodeId,
      confidenceScore: 100 // Simplified for logic check
    };
  }
};
