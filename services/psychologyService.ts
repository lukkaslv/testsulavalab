
import { BeliefKey, GameHistoryItem, RawAnalysisResult, NeuralCorrelation, DomainType, SystemConflict, MetricLevel, ClinicalWarning, SessionPulseNode, LifeContext } from '../types';
import { SYSTEM_METADATA, STORAGE_KEYS, TOTAL_NODES } from '../constants';

const WEIGHTS: Record<BeliefKey, { f: number; a: number; r: number; e: number }> = {
  'scarcity_mindset':     { f: -4, a: -2, r: -3, e: 4 },
  'fear_of_punishment':   { f: -3, a: -3, r: -2, e: 4 },
  'money_is_tool':        { f: 2, a: 4, r: 5, e: -2 },
  'self_permission':      { f: 0, a: 3, r: 6, e: -3 },
  'imposter_syndrome':    { f: -2, a: -6, r: -2, e: 5 },
  'family_loyalty':       { f: -6, a: -2, r: -2, e: 3 },
  'shame_of_success':     { f: -3, a: -4, r: 3, e: 6 },
  'betrayal_trauma':      { f: -2, a: -3, r: 2, e: 8 },
  'capacity_expansion':   { f: 3, a: 4, r: 4, e: -3 },
  'hard_work_only':       { f: 3, a: 2, r: 1, e: 3 },
  'boundary_collapse':    { f: -4, a: -5, r: -2, e: 6 }, 
  'money_is_danger':      { f: -3, a: -2, r: -6, e: 7 }, 
  'unconscious_fear':     { f: -3, a: -3, r: -2, e: 4 },
  'short_term_bias':      { f: -2, a: 2, r: 3, e: 5 },
  'impulse_spend':        { f: -2, a: 2, r: -4, e: 4 },
  'fear_of_conflict':     { f: -2, a: -4, r: 0, e: 3 },
  'poverty_is_virtue':    { f: -3, a: -3, r: -3, e: 3 },
  'latency_resistance':   { f: 0, a: 0, r: 0, e: 2 },
  'resource_toxicity':    { f: -2, a: 0, r: -2, e: 4 },
  'body_mind_conflict':   { f: 0, a: -1, r: 0, e: 4 },
  'ambivalence_loop':     { f: -2, a: -5, r: 0, e: 10 },
  'hero_martyr':          { f: 0, a: 0, r: 0, e: 5 },
  'autopilot_mode':       { f: 0, a: -5, r: 0, e: 5 },
  'golden_cage':          { f: 0, a: -5, r: 0, e: 5 },
  'default':              { f: 0, a: 0, r: 0, e: 0 } 
};

const sigmoidUpdate = (current: number, delta: number): number => {
    const x = (current - 50) / 10; 
    const newX = x + (delta * 0.15); 
    return 100 / (1 + Math.exp(-newX));
};

export function calculateRawMetrics(history: GameHistoryItem[]): RawAnalysisResult {
  let f = 50, a = 50, r = 50, e = 15;
  let syncScore = 100;
  
  const correlations: NeuralCorrelation[] = [];
  const sessionPulse: SessionPulseNode[] = [];
  const somaticDissonance: BeliefKey[] = [];
  
  const allLatencies = history.map(h => h.latency).filter(l => l > 300 && l < 30000);
  const sessionMean = allLatencies.reduce((a, b) => a + b, 0) / (allLatencies.length || 1);
  const sessionStdDev = Math.sqrt(allLatencies.map(x => Math.pow(x - sessionMean, 2)).reduce((a, b) => a + b, 0) / (allLatencies.length || 1)) || 1;

  history.forEach((h, index) => {
    const zScore = (h.latency - sessionMean) / sessionStdDev;
    const beliefKey = h.beliefKey as BeliefKey;
    const w = WEIGHTS[beliefKey] || { f: 0, a: 0, r: 0, e: 0 };

    f = sigmoidUpdate(f, w.f);
    a = sigmoidUpdate(a, w.a);
    r = sigmoidUpdate(r, w.r);
    e = Math.max(0, Math.min(100, e + w.e + (zScore > 1 ? 2 : 0)));

    if ((w.a > 1 || w.f > 1) && (h.sensation === 's1' || h.sensation === 's4')) {
        syncScore = Math.max(0, syncScore - 10);
        if (!somaticDissonance.includes(beliefKey)) somaticDissonance.push(beliefKey);
    }

    sessionPulse.push({
        id: index, domain: h.domain, tension: Math.round(Math.min(100, (zScore + 2) * 20)),
        isBlock: zScore > 1.5, isFlow: zScore < -0.5, zScore
    });
  });

  return {
    context: 'NORMAL',
    state: { foundation: Math.round(f), agency: Math.round(a), resource: Math.round(r), entropy: Math.round(e) },
    integrity: Math.round(((f + a + r) / 3) * (1 - e / 200)),
    capacity: Math.round((f + r) / 2),
    entropyScore: Math.round(e),
    neuroSync: Math.round(syncScore),
    systemHealth: Math.round(((f + a + r) / 3) * 0.6 + syncScore * 0.4),
    phase: f < 35 ? 'SANITATION' : 'STABILIZATION',
    status: 'STABLE',
    validity: history.length < 10 ? 'SUSPICIOUS' : 'VALID',
    activePatterns: [], correlations, conflicts: [], somaticDissonance,
    somaticProfile: { blocks: 0, resources: 0, dominantSensation: 's0' },
    integrityBreakdown: { coherence: 100, sync: syncScore, stability: f, label: 'STABLE', description: '', status: 'STABLE' },
    clarity: history.length * 2,
    confidenceScore: 90,
    warnings: [],
    flags: { isAlexithymiaDetected: false, isSlowProcessingDetected: false, isNeuroSyncReliable: true, isSocialDesirabilityBiasDetected: false, processingSpeedCompensation: 1, entropyType: 'NEUTRAL', isL10nRiskDetected: false },
    skippedCount: 0,
    sessionPulse
  };
}
