
import { BeliefKey, GameHistoryItem, RawAnalysisResult, NeuralCorrelation, DomainType, IntegrityBreakdown, SystemConflict, MetricLevel, ClinicalWarning, AnalysisFlags, PhaseType, SessionPulseNode } from '../types';
import { SYSTEM_METADATA, STORAGE_KEYS } from '../constants';

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

// A/B VARIANT OVERRIDES (SLC LOOP)
const WEIGHT_VARIANT_B: Partial<Record<BeliefKey, Partial<{ f: number; a: number; r: number; e: number }>>> = {
    'imposter_syndrome': { a: 15 }, 
    'ambivalence_loop': { e: 12 }
};

// --- MATHEMATICAL KERNEL v3.3 (Hydraulic Systemic Coupling) ---

const toLogSpace = (ms: number): number => Math.log(Math.max(1, ms));

const sigmoidUpdate = (current: number, delta: number): number => {
    const x = (current - 50) / 10; 
    const newX = x + (delta * 0.15); 
    const result = 100 / (1 + Math.exp(-newX));
    return result;
};

const calculateEntropyFriction = (currentEntropy: number): number => {
    return Math.max(0.3, 1 - (currentEntropy / 140));
};

const calculateFatigueAllowance = (index: number, total: number): number => {
    return 1 + ((index / total) * 0.20); 
};

const calculateLogVariance = (latencies: number[]): number => {
    if (latencies.length < 2) return 0;
    const logs = latencies.map(toLogSpace);
    const mean = logs.reduce((a, b) => a + b) / logs.length;
    return logs.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / logs.length;
};

const calculateDomainCoherence = (domainItems: GameHistoryItem[]): number => {
    if (domainItems.length < 2) return 1.0;
    let polarityFlips = 0;
    for (let i = 1; i < domainItems.length; i++) {
        const currW = WEIGHTS[domainItems[i].beliefKey as BeliefKey] || { f:0, a:0, r:0, e:0 };
        const prevW = WEIGHTS[domainItems[i-1].beliefKey as BeliefKey] || { f:0, a:0, r:0, e:0 };
        const domain = domainItems[i].domain;
        const key = domain === 'foundation' ? 'f' : domain === 'agency' ? 'a' : 'r';
        if ((currW[key] > 1 && prevW[key] < -1) || (currW[key] < -1 && prevW[key] > 1)) {
            polarityFlips += 1;
        }
    }
    const maxFlips = domainItems.length - 1;
    return Math.max(0, 1 - (polarityFlips / maxFlips));
};

function calculateAdaptiveThresholds(latencies: number[], fatigueFactor: number): { slow: number; median: number } {
    if (latencies.length < 5) return { slow: 5000, median: 2000 };
    const sorted = [...latencies].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const medianVal = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    const logMedian = toLogSpace(medianVal);
    const resistanceLog = logMedian + 0.6; 
    const resistanceLinear = Math.exp(resistanceLog) * fatigueFactor;
    return { slow: Math.max(3000, resistanceLinear), median: medianVal };
}

function getABVariant(userId: string): 'A' | 'B' {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    return (Math.abs(hash) % 2 === 0) ? 'A' : 'B';
}

export function calculateRawMetrics(history: GameHistoryItem[]): RawAnalysisResult & { variantId: string } {
  let f = 50, a = 50, r = 50, e = 15;
  let syncScore = 100;
  let skippedCount = 0;
  
  const activePatterns: BeliefKey[] = [];
  const correlations: NeuralCorrelation[] = [];
  const conflicts: SystemConflict[] = [];
  const somaticDissonance: BeliefKey[] = [];
  const somaticProfile = { blocks: 0, resources: 0, dominantSensation: 's0' };
  const warnings: ClinicalWarning[] = [];
  const sessionPulse: SessionPulseNode[] = [];
  
  const currentLang = (localStorage.getItem(STORAGE_KEYS.LANG) || 'ru') as 'ru' | 'ka';
  const langHealth = SYSTEM_METADATA.LANG_HEALTH[currentLang];
  const nodeOverrides = SYSTEM_METADATA.SEMANTIC_RELIABILITY_OVERRIDE;

  const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION) || 'anonymous';
  const variantId = getABVariant(sessionId);

  let validLatencies: number[] = [];
  let slidingLatencyWindow: number[] = [];
  let lastDomain: DomainType | null = null;
  let lastLatency = 0;
  let positiveChoicesCount = 0;
  let positiveChoicesLatencySum = 0;
  
  // ALEXITHYMIA DETECTOR VARS
  let neutralSensationCount = 0;
  let mismatchCount = 0; // High Latency + Neutral Sensation

  if (langHealth.status === 'BETA_RISK' || langHealth.status === 'LEARNING') {
      warnings.push({ type: 'L10N_ACCURACY_LOW', severity: 'LOW', messageKey: 'L10n accuracy under SLC audit.' });
  }

  // Calculate Global Median for normalization
  const allLatencies = history.map(h => h.latency).filter(l => l > 300 && l < 30000);
  const sessionMedian = median(allLatencies) || 2000;

  history.forEach((h, index) => {
    const fatigueFactor = calculateFatigueAllowance(index, history.length);

    if (h.latency > 300 && h.latency < 30000) {
        slidingLatencyWindow.push(h.latency);
        if (slidingLatencyWindow.length > 7) slidingLatencyWindow.shift();
    }
    const { slow: adaptiveSlowThreshold, median: medianBaseline } = calculateAdaptiveThresholds(slidingLatencyWindow, fatigueFactor);
    
    // --- SESSION PULSE EKG (Dynamic Tension) ---
    // Calculates the "psychic load" of the specific question.
    let tension = Math.min(100, (h.latency / (sessionMedian * 1.5)) * 50);
    // Add Somatic Penalty to Tension
    if (h.sensation === 's1' || h.sensation === 's4') tension += 30; // Block/Tremor
    if (h.sensation === 's3') tension += 40; // Freeze is high tension
    if (h.sensation === 's2') tension -= 10; // Flow/Heat reduces tension
    
    sessionPulse.push({
        id: index,
        domain: h.domain,
        tension: Math.round(Math.min(100, Math.max(0, tension))),
        isBlock: h.latency > adaptiveSlowThreshold * 1.2 || ['s1', 's3', 's4'].includes(h.sensation),
        isFlow: h.latency < medianBaseline * 0.8 && h.sensation === 's2'
    });

    if (h.beliefKey === 'default') {
        skippedCount++;
        return;
    }
    
    const nodeReliability = (nodeOverrides[h.nodeId] !== undefined) ? nodeOverrides[h.nodeId] : 1.0;
    const beliefKey = h.beliefKey as BeliefKey;
    
    let w = { ...WEIGHTS[beliefKey] || { f: 0, a: 0, r: 0, e: 1 } };
    if (variantId === 'B' && WEIGHT_VARIANT_B[beliefKey]) {
        w = { ...w, ...WEIGHT_VARIANT_B[beliefKey] };
    }

    // PRIMING EFFECT
    if (lastDomain && lastDomain !== h.domain) {
        if (h.latency > medianBaseline * 1.6 && h.latency > lastLatency * 1.3) {
             correlations.push({ 
                 nodeId: h.nodeId, 
                 domain: h.domain, 
                 type: 'resistance', 
                 descriptionKey: `priming_${lastDomain}_${h.domain}` 
             });
             e += 3;
        }
    }
    lastDomain = h.domain;
    lastLatency = h.latency;

    if (w.a > 2 || w.f > 2 || w.r > 2) {
        positiveChoicesCount++;
        positiveChoicesLatencySum += h.latency;
    }
    
    const latencyRatio = h.latency / medianBaseline;
    const impactFactor = Math.log(latencyRatio) < -0.4 ? 1.2 : Math.log(latencyRatio) > 0.7 ? 0.8 : 1.0;
    const friction = calculateEntropyFriction(e);

    f = sigmoidUpdate(f, w.f * friction * impactFactor * nodeReliability);
    a = sigmoidUpdate(a, w.a * friction * impactFactor * nodeReliability);
    r = sigmoidUpdate(r, w.r * friction * impactFactor * nodeReliability);
    
    const entropyDelta = w.e > 0 ? w.e : w.e * 0.5;
    e = Math.max(0, Math.min(100, e + (entropyDelta * latencyFactor(latencyRatio) * nodeReliability)));
    
    // SOMATIC PROFILING
    if (h.sensation === 's1' || h.sensation === 's4') somaticProfile.blocks++;
    if (h.sensation === 's2') somaticProfile.resources++;
    if (h.sensation === 's0') neutralSensationCount++;

    // REFLECTION vs FREEZE vs ALEXITHYMIA
    if (h.latency > adaptiveSlowThreshold) {
        const isSomaticNegative = h.sensation === 's1' || h.sensation === 's3' || h.sensation === 's4';
        
        if (isSomaticNegative) {
            correlations.push({ nodeId: h.nodeId, domain: h.domain, type: 'resistance', descriptionKey: `correlation_resistance_${beliefKey}` });
            e = Math.min(100, e + (6 * nodeReliability)); 
        } else if (h.sensation === 's0') {
            // High Latency + Neutral = Suspicious (Alexithymia Check)
            mismatchCount++;
        }
    }
    
    if (h.sensation === 's2' && h.latency < medianBaseline * 1.2) {
        correlations.push({ nodeId: h.nodeId, domain: h.domain, type: 'resonance', descriptionKey: `correlation_resonance_${beliefKey}` });
    }

    const isPositiveBelief = w.a > 2 || w.f > 1 || w.r > 2;
    if (isPositiveBelief && (h.sensation === 's1' || h.sensation === 's4')) {
        syncScore = Math.max(0, syncScore - (8 * nodeReliability)); 
        if (!somaticDissonance.includes(beliefKey)) somaticDissonance.push(beliefKey);
    } else if (!isPositiveBelief && (h.sensation === 's2')) {
        syncScore = Math.max(0, syncScore - (5 * nodeReliability));
    }
    
    if (history.filter(item => item.beliefKey === h.beliefKey).length > 2) activePatterns.push(beliefKey);
    validLatencies.push(h.latency);
  });

  // --- HYDRAULIC SYSTEMIC COUPLING (POST-PROCESSING) ---
  // Expert Critique: "Metrics are interdependent."
  
  // 1. Manic Defense (High Agency vs Low Foundation)
  if (a > 75 && f < 40) {
      e += 15; // Manic defense generates massive internal friction
      warnings.push({ type: 'MANIC_DEFENSE', severity: 'HIGH', messageKey: 'High Agency without Safety = Anxiety' });
      // Penalize the "Fake" Agency
      a = a * 0.9;
  }

  // 2. Paralyzed Resource (High Resource vs Low Agency)
  if (r > 75 && a < 35) {
      e += 10; // Stagnation creates rot (entropy)
      warnings.push({ type: 'GOLDEN_CAGE', severity: 'MEDIUM', messageKey: 'High Resource without Action = Stagnation' });
  }

  // 3. Alexithymia / Dissociation Check
  const isAlexithymiaDetected = (neutralSensationCount / history.length > 0.7) && (mismatchCount > 2);
  if (isAlexithymiaDetected) {
      syncScore = Math.min(syncScore, 45); // Cap Sync if user is numb
      warnings.push({ type: 'DISSOCIATION', severity: 'HIGH', messageKey: 'Somatic Numbness Detected' });
  }

  // --- STATISTICAL INTEGRITY ---
  const foundationCoherence = calculateDomainCoherence(history.filter(h => h.domain === 'foundation'));
  const agencyCoherence = calculateDomainCoherence(history.filter(h => h.domain === 'agency'));
  
  if (foundationCoherence < 0.6) {
      f = f * 0.85; 
      e += 8;       
      warnings.push({ type: 'FRAGMENTATION', severity: 'MEDIUM', messageKey: 'Foundation Splitting Detected' });
  }
  if (agencyCoherence < 0.6) {
      a = a * 0.85;
      e += 8;
      warnings.push({ type: 'AMBIVALENCE', severity: 'MEDIUM', messageKey: 'Agency Ambivalence Detected' });
  }

  const latencyLogVariance = calculateLogVariance(validLatencies);
  const isVolatile = latencyLogVariance > 0.6; 

  const positiveRatio = positiveChoicesCount / Math.max(1, history.length);
  const avgPositiveLatency = positiveChoicesCount > 0 ? positiveChoicesLatencySum / positiveChoicesCount : 0;
  const globalMedian = median(validLatencies);
  
  const isSocialDesirabilityBiasDetected = (positiveRatio > 0.75) && (avgPositiveLatency < globalMedian * 0.9);

  let technicalConfidence = 100;
  if (validLatencies.length < 10) technicalConfidence -= 40;
  if (isVolatile) technicalConfidence -= 15;
  if (isSocialDesirabilityBiasDetected) technicalConfidence -= 20;
  if (isAlexithymiaDetected) technicalConfidence -= 15; // Numbness reduces confidence in self-report
  if (foundationCoherence < 0.7 || agencyCoherence < 0.7) technicalConfidence -= 15;
  
  const confidenceScore = Math.max(0, Math.min(100, Math.round(technicalConfidence * langHealth.reliability)));

  const consistencyFactor = Math.max(0.5, 1 - latencyLogVariance);
  const integrityBase = Math.round(((f + a + r) / 3) * consistencyFactor * (1 - (e / 200)));
  
  const systemHealth = Math.round((integrityBase * 0.6) + (syncScore * 0.4));
  const status: MetricLevel = systemHealth > 82 ? 'OPTIMAL' : systemHealth > 52 ? 'STABLE' : systemHealth > 32 ? 'STRAINED' : 'PROTECTIVE';

  const finalEntropy = Math.round(e);
  const friction = calculateEntropyFriction(finalEntropy);

  return {
    variantId,
    state: { 
        foundation: Math.round(f), 
        agency: Math.round(a), 
        resource: Math.round(r), 
        entropy: finalEntropy 
    },
    integrity: integrityBase, 
    capacity: Math.round((f + r) / 2), 
    entropyScore: finalEntropy, 
    neuroSync: Math.round(syncScore), 
    systemHealth, 
    phase: f < 32 ? 'SANITATION' : systemHealth < 68 ? 'STABILIZATION' : 'EXPANSION',
    status,
    validity: confidenceScore < 40 ? 'SUSPICIOUS' : 'VALID', 
    activePatterns: [...new Set(activePatterns)],
    correlations: correlations.slice(0, 8),
    conflicts,
    somaticDissonance: [...new Set(somaticDissonance)],
    somaticProfile,
    integrityBreakdown: { coherence: Math.round(technicalConfidence), sync: Math.round(syncScore), stability: Math.round(f), label: status, description: '', status },
    clarity: Math.min(100, history.length * 2),
    confidenceScore: Math.round(confidenceScore),
    warnings,
    flags: {
      isAlexithymiaDetected, // Now actively calculated
      isSlowProcessingDetected: false,
      isNeuroSyncReliable: !isVolatile && !isAlexithymiaDetected,
      isSocialDesirabilityBiasDetected, 
      processingSpeedCompensation: 1.0,
      entropyType: e > 40 ? (a > 60 ? 'CREATIVE' : 'STRUCTURAL') : 'NEUTRAL',
      isL10nRiskDetected: langHealth.status === 'BETA_RISK'
    },
    skippedCount,
    mathSignature: {
        sigma: Math.round(latencyLogVariance * 100), 
        friction: Number(friction.toFixed(2)),
        volatilityScore: Math.max(0, Math.min(100, Math.round(100 - (latencyLogVariance * 100))))
    },
    sessionPulse 
  };
}

const median = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
};

function latencyFactor(ratio: number): number {
    if (ratio > 2.5) return 1.5;
    if (ratio > 1.5) return 1.2;
    return 1.0;
}
