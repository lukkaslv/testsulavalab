
import { BeliefKey, GameHistoryItem, RawAnalysisResult, NeuralCorrelation, SessionPulseNode, DomainType } from '../types';

// v5.2: STABILIZED COMPLEXITY
// Goal: Fix "Chaotic Divergence" (Emergence > 85%).
// Method: Dampened extreme weights and reduced sigmoid sensitivity.
export const WEIGHTS: Record<BeliefKey, { f: number; a: number; r: number; e: number }> = {
  // --- SURVIVAL CLUSTER ---
  'scarcity_mindset':     { f: -2, a: 1,  r: -2, e: 3 },  // Damped from -3/4
  'fear_of_punishment':   { f: -3, a: -2, r: 1,  e: 2 },  // Damped
  'poverty_is_virtue':    { f: 2,  a: -1, r: -3, e: -1 }, 
  
  // --- GROWTH CLUSTER ---
  'money_is_tool':        { f: 2,  a: 2,  r: 2,  e: -2 }, 
  'self_permission':      { f: 1,  a: 4,  r: 2,  e: 1 },  // High agency, but controlled
  'capacity_expansion':   { f: 2,  a: 2,  r: 4,  e: -1 }, 
  
  // --- COMPETENCE SHADOWS ---
  'imposter_syndrome':    { f: -1, a: -3, r: 3,  e: 4 },  
  'shame_of_success':     { f: -2, a: -2, r: 2,  e: 5 },  
  'hard_work_only':       { f: 3,  a: 3,  r: 1,  e: 3 },  
  
  // --- RELATIONAL ---
  'family_loyalty':       { f: 4,  a: -3, r: -1, e: 2 },  // Roots vs Wings
  'fear_of_conflict':     { f: -1, a: -3, r: 1,  e: 2 },  
  'betrayal_trauma':      { f: -4, a: 2,  r: -1, e: 6 },  // Still heavy, but not -5
  
  // --- SABOTAGE MECHANISMS ---
  'boundary_collapse':    { f: -3, a: -2, r: -2, e: 4 }, 
  'money_is_danger':      { f: 1,  a: 1,  r: -4, e: 5 },  
  'unconscious_fear':     { f: -2, a: -1, r: 0,  e: 2 },  
  'short_term_bias':      { f: -2, a: 3,  r: 1,  e: 4 },  
  'impulse_spend':        { f: -1, a: 2,  r: -3, e: 3 },
  'latency_resistance':   { f: 1,  a: -2, r: 0,  e: 1 },  
  'resource_toxicity':    { f: -2, a: 1,  r: -4, e: 4 },  
  'body_mind_conflict':   { f: -1, a: -3, r: -1, e: 5 },  
  'ambivalence_loop':     { f: -1, a: -2, r: 0,  e: 4 },  
  
  // --- ARCHETYPAL SHADOWS ---
  'hero_martyr':          { f: 2,  a: 3,  r: -3, e: 4 },  
  'autopilot_mode':       { f: 3,  a: -4, r: 1,  e: -1 }, 
  'golden_cage':          { f: 4,  a: -5, r: 4,  e: 3 },  
  
  'default':              { f: -1, a: -1, r: -1, e: 1 }   
};

/**
 * Stabilized Sigmoid Engine v5.3
 * Added stronger entropy gravity to prevent runaway chaos.
 */
const sigmoidUpdate = (current: number, delta: number, entropyCurrent: number): number => {
    const chaos = entropyCurrent > 65 ? 1.05 : 1.0;
    
    const x = Math.max(-5, Math.min(5, (current - 50) / 12));
    const newX = x + (delta * 0.10 * chaos); 
    
    const result = 100 / (1 + Math.exp(-newX));
    return Math.max(5, Math.min(95, result));
};

const calculateDomainScores = (history: GameHistoryItem[]): Record<DomainType, number> => {
    const scores: Record<DomainType, { current: number }> = {
        foundation: { current: 50 },
        agency: { current: 50 },
        money: { current: 50 },
        social: { current: 50 },
        legacy: { current: 50 }
    };

    history.forEach(h => {
        if (!h.domain || !scores[h.domain]) return;
        const w = WEIGHTS[h.beliefKey as BeliefKey] || WEIGHTS.default;
        
        // Inverse Entropy impact: High entropy beliefs lower the domain score
        const impact = w.e * -3; 
        
        // Apply sigmoid-like clamping
        scores[h.domain].current = Math.max(10, Math.min(100, scores[h.domain].current + impact));
    });

    return {
        foundation: Math.round(scores.foundation.current),
        agency: Math.round(scores.agency.current),
        money: Math.round(scores.money.current),
        social: Math.round(scores.social.current),
        legacy: Math.round(scores.legacy.current)
    };
};

export function calculateRawMetrics(history: GameHistoryItem[]): RawAnalysisResult {
  let f = 50, a = 50, r = 50, e = 15;
  let syncScore = 100;
  
  const correlations: NeuralCorrelation[] = [];
  const sessionPulse: SessionPulseNode[] = [];
  const somaticDissonance: BeliefKey[] = [];
  
  if (!history || history.length === 0) {
      return createEmptyResult();
  }

  const latenciesForBaseline = history.slice(1).map(h => h.latency).filter(l => l > 300 && l < 30000);
  const sessionMean = latenciesForBaseline.length > 0 ? (latenciesForBaseline.reduce((a, b) => a + b, 0) / latenciesForBaseline.length) : 2000;
  const sessionStdDev = Math.sqrt(latenciesForBaseline.map(x => Math.pow(x - sessionMean, 2)).reduce((a, b) => a + b, 0) / (latenciesForBaseline.length || 1)) || 1;

  history.forEach((h, index) => {
    if (!h) return;
    const beliefKey = (h.beliefKey as BeliefKey) || 'default';
    const w = WEIGHTS[beliefKey] || WEIGHTS.default;
    const zScore = (h.latency - sessionMean) / sessionStdDev;

    // Pass 'e' (Entropy) into update function to simulate system volatility
    f = sigmoidUpdate(f, w.f, e);
    a = sigmoidUpdate(a, w.a, e);
    r = sigmoidUpdate(r, w.r, e);
    
    // Updated Entropy Gravity Logic v5.3
    // Stronger downward pull when > 70 to stabilize the system.
    let entropyResistance = 1.0;
    if (e > 70) entropyResistance = 0.8;
    if (e > 85) entropyResistance = 0.6; // Strong damping near max

    e = Math.max(5, Math.min(95, e + (w.e * entropyResistance) + (zScore > 2.5 ? 3 : 0)));

    // NeuroSync Decay Logic
    if ((Math.abs(w.a) > 2 || Math.abs(w.f) > 2) && (h.sensation === 's1' || h.sensation === 's4')) {
        syncScore = Math.max(10, syncScore - 12); // Reduced penalty from 15
        if (!somaticDissonance.includes(beliefKey)) somaticDissonance.push(beliefKey);
    } else if (h.sensation === 's2' || h.sensation === 's3') {
        syncScore = Math.min(100, syncScore + 3); // Faster recovery
    }

    sessionPulse.push({
        id: index, 
        domain: h.domain || 'foundation', 
        tension: Math.round(Math.max(0, Math.min(100, (zScore + 2) * 20 + (w.e * 2)))),
        isBlock: zScore > 1.8 || h.sensation === 's1', 
        isFlow: zScore < -0.8 && h.sensation !== 's1', 
        zScore
    });
  });

  const domainProfile = calculateDomainScores(history);

  return {
    context: 'NORMAL',
    state: { foundation: Math.round(f), agency: Math.round(a), resource: Math.round(r), entropy: Math.round(e) },
    domainProfile,
    integrity: Math.round(((f + a + r) / 3) * (1 - e / 280)), // Softened entropy penalty on integrity
    capacity: Math.round((f + r) / 2),
    entropyScore: Math.round(e),
    neuroSync: Math.round(syncScore),
    systemHealth: Math.round(((f + a + r) / 3) * 0.6 + syncScore * 0.4),
    phase: f < 35 ? 'SANITATION' : 'STABILIZATION',
    status: f < 30 ? 'PROTECTIVE' : 'STABLE',
    validity: history.length < 10 ? 'SUSPICIOUS' : 'VALID',
    activePatterns: [], correlations, conflicts: [], somaticDissonance,
    somaticProfile: { blocks: 0, resources: 0, dominantSensation: 's0' },
    integrityBreakdown: { coherence: 100, sync: syncScore, stability: f, label: 'STABLE', status: 'STABLE' },
    clarity: Math.min(100, history.length * 2.5),
    confidenceScore: 95,
    warnings: [],
    flags: { isAlexithymiaDetected: false, isSlowProcessingDetected: false, isNeuroSyncReliable: true, isSocialDesirabilityBiasDetected: false, processingSpeedCompensation: 1, entropyType: 'NEUTRAL', isL10nRiskDetected: false },
    skippedCount: history.filter(h => h.beliefKey === 'default').length,
    sessionPulse
  };
}

function createEmptyResult(): RawAnalysisResult {
    return {
        context: 'NORMAL', state: { foundation: 50, agency: 50, resource: 50, entropy: 15 },
        domainProfile: { foundation: 50, agency: 50, money: 50, social: 50, legacy: 50 },
        integrity: 50, capacity: 50, entropyScore: 15, neuroSync: 100, systemHealth: 70,
        phase: 'STABILIZATION', status: 'INITIALIZING', validity: 'SUSPICIOUS',
        activePatterns: [], correlations: [], conflicts: [], somaticDissonance: [],
        somaticProfile: { blocks: 0, resources: 0, dominantSensation: 's0' },
        integrityBreakdown: { coherence: 100, sync: 100, stability: 50, label: 'INIT', status: 'STABLE' },
        clarity: 0, confidenceScore: 0, warnings: [], flags: {}, skippedCount: 0, sessionPulse: []
    };
}
