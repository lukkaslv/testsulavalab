
import { BeliefKey, GameHistoryItem, RawAnalysisResult, SessionPulseNode, DomainType, AutopoiesisMetrics, ForecastMetrics, LifeContext } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';

// Genesis OS Core Weights (Constitutional Monolith)
// FIX: Changed from const to let to support Admin Sandbox recalibration (Art. 22.2)
export let WEIGHTS: Record<string, any> = {
  'scarcity_mindset':     { f: -2, a: 1,  r: -2, e: 3,  s: -2, l: 0 },
  'fear_of_punishment':   { f: -3, a: -2, r: 1,  e: 2,  s: -1, l: -2 },
  'poverty_is_virtue':    { f: 2,  a: -1, r: -3, e: -1, s: 1,  l: 4 }, 
  'money_is_tool':        { f: 2,  a: 2,  r: 2,  e: -2, s: 2,  l: 1 }, 
  'self_permission':      { f: 1,  a: 4,  r: 2,  e: 1,  s: 1,  l: 0 },
  'capacity_expansion':   { f: 2,  a: 2,  r: 4,  e: -1, s: 1,  l: 2 }, 
  'imposter_syndrome':    { f: -1, a: -3, r: 3,  e: 4,  s: -3, l: 0 },  
  'shame_of_success':     { f: -2, a: -2, r: 2,  e: 5,  s: -2, l: -1 },  
  'hard_work_only':       { f: 3,  a: 3,  r: 1,  e: 3,  s: -1, l: 1 },  
  'family_loyalty':       { f: 4,  a: -3, r: -1, e: 2,  s: 4,  l: 5 },
  'fear_of_conflict':     { f: -1, a: -3, r: 1,  e: 2,  s: -4, l: 0 },  
  'betrayal_trauma':      { f: -4, a: 2,  r: -1, e: 6,  s: -5, l: -2 },
  'boundary_collapse':    { f: -3, a: -2, r: -2, e: 4,  s: -3, l: -1 }, 
  'money_is_danger':      { f: 1,  a: 1,  r: -4, e: 5,  s: -2, l: -1 },  
  'unconscious_fear':     { f: -2, a: -1, r: 0,  e: 2,  s: -1, l: 0 },  
  'short_term_bias':      { f: -2, a: 3,  r: 1,  e: 4,  s: 0,  l: -2 },  
  'impulse_spend':        { f: -1, a: 2,  r: -3, e: 3,  s: 1,  l: -1 },
  'latency_resistance':   { f: 1,  a: -2, r: 0,  e: 1,  s: -1, l: 0 },  
  'resource_toxicity':    { f: -2, a: 1,  r: -4, e: 4,  s: -2, l: -1 },  
  'body_mind_conflict':   { f: -1, a: -3, r: -1, e: 5,  s: -3, l: -1 },  
  'ambivalence_loop':     { f: -1, a: -2, r: 0,  e: 4,  s: -2, l: 0 },  
  'hero_martyr':          { f: 2,  a: 3,  r: -3, e: 4,  s: -1, l: 2 },  
  'autopilot_mode':       { f: 3,  a: -4, r: 1,  e: -1, s: 2,  l: 1 }, 
  'golden_cage':          { f: 4,  a: -5, r: 4,  e: 3,  s: 3,  l: 2 },  
  'default':              { f: -1, a: -1, r: -1, e: 1,  s: -1, l: -1 }   
};

// FIX: Added recalibrateWeights for Admin Sandbox simulations
export const recalibrateWeights = (newWeights: Record<string, any>) => {
    WEIGHTS = { ...WEIGHTS, ...newWeights };
};

// Context Physics Modifiers (Art. 5)
const CONTEXT_PHYSICS: Record<LifeContext, { inertia: number; f_sensitivity: number; a_sensitivity: number; e_damping: number }> = {
    NORMAL:     { inertia: 1.0, f_sensitivity: 1.0, a_sensitivity: 1.0, e_damping: 1.0 },
    HIGH_LOAD:  { inertia: 1.2, f_sensitivity: 0.8, a_sensitivity: 1.3, e_damping: 0.9 }, // Тяжелее сменить курс, воля важнее
    CRISIS:     { inertia: 0.6, f_sensitivity: 1.5, a_sensitivity: 0.7, e_damping: 1.2 }, // Система нестабильна, фундамент критичен, хаос ожидаем
    TRANSITION: { inertia: 0.4, f_sensitivity: 1.1, a_sensitivity: 1.1, e_damping: 0.8 }  // Высокая пластичность, легкая смена состояний
};

/**
 * Вычисляет показатели Автопоэза: рычаги самоисцеления системы (Ст. 7.3)
 */
export const calculateAutopoiesis = (raw: RawAnalysisResult): AutopoiesisMetrics => {
    const { foundation: f, agency: a, entropy: e } = raw.state;
    // Удалены неиспользуемые переменные resource, money, social, legacy
    const sync = raw.neuroSync;

    const selfHealingIndex = Math.round(((f * 0.4) + (sync * 0.6)) * (1 - (e / 250)));
    const integrationPotential = Math.round(e * (sync / 100));
    const levers: Array<{ domain: DomainType; impact: number; label: string }> = [];

    if (f < 40) levers.push({ domain: 'foundation', impact: 90, label: 'СТАБИЛИЗАЦИЯ_БАЗЫ' });
    if (sync < 50) levers.push({ domain: 'agency', impact: 75, label: 'ВОССТАНОВЛЕНИЕ_СВЯЗИ' });
    if (e > 60 && a > 60) levers.push({ domain: 'money', impact: 60, label: 'СБРОС_НАПРЯЖЕНИЯ' });

    return {
        selfHealingIndex,
        integrationPotential,
        phaseTransitionReadiness: Math.round(((a + sync) / 2) * (1 - (e / 150))),
        levers: levers.sort((x, y) => y.impact - x.impact).slice(0, 3)
    };
};

// FIX: Added calculateEntropyFlux for Clinical Decoder (Art. 7.1)
export const calculateEntropyFlux = (history: GameHistoryItem[]): any[] => {
    if (!history || history.length < 2) return [];
    return history.slice(1).map((h, i) => {
        const prev = history[i];
        return {
            nodeId: h.nodeId,
            domain: h.domain,
            delta: Math.abs(h.latency - prev.latency),
            impact: h.sensation !== 's0' ? 1.5 : 1.0
        };
    });
};

export const calculateForecast = (f: number, a: number, r: number, e: number): ForecastMetrics => {
    const horizonMonths = 6;
    const momentum = Math.round((a + f) / 2);
    const friction = Math.round(e + (100 - r) / 4);
    const generatePath = (start: number, trend: number, noise: number) => {
        const path = [start];
        let current = start;
        for (let i = 1; i <= horizonMonths; i++) {
            current = Math.max(5, Math.min(95, current + trend + (Math.random() - 0.5) * noise));
            path.push(Math.round(current));
        }
        return path;
    };
    const integrity = Math.round(((f + a + r) / 3) * (1 - e / 200));
    return {
        horizonMonths, momentum, friction,
        inertialPath: generatePath(integrity, (a - 50) / 15, 5),
        decayPath: generatePath(integrity, -e / 10, 8),
        growthPath: generatePath(integrity, (a + r) / 20, 3),
        tippingPointMonth: e > 70 ? 3 : null
    };
};

// Удалены неиспользуемые аргументы r и l
const applyResonance = (delta: number, f: number, domain: DomainType): number => {
    if (domain === 'agency' && delta > 0 && f < 40) return delta * (f / 50);
    if (domain === 'money' && delta > 0 && f < 30) return delta * 0.4;
    return delta;
};

const applyHysteresis = (current: number, target: number, entropy: number, resilience: number = 50, contextInertia: number = 1.0): number => {
    const baselineInertia = 0.85 * contextInertia; // Context modifies inertia
    const resilienceBonus = (resilience - 50) / 200; 
    const entropySoftening = entropy / 400; 
    const inertia = Math.max(0.3, baselineInertia - entropySoftening - resilienceBonus);
    return (current * (target < current ? inertia * 0.7 : inertia)) + (target * (1 - (target < current ? inertia * 0.7 : inertia)));
};

const sigmoidUpdate = (
    current: number, 
    delta: number, 
    entropyCurrent: number, 
    f: number, r: number, l: number, 
    domain: DomainType, 
    resilience: number,
    physics: typeof CONTEXT_PHYSICS['NORMAL']
): number => {
    // Исправлен вызов applyResonance без лишних аргументов
    const resonatedDelta = applyResonance(delta, f, domain);
    let gravityFactor = entropyCurrent > 60 ? 1.0 - ((entropyCurrent - 60) / 40) * 0.4 : 1.0;
    
    // Apply Context Sensitivity
    let sensitivity = 1.0;
    if (domain === 'foundation') sensitivity = physics.f_sensitivity;
    if (domain === 'agency') sensitivity = physics.a_sensitivity;

    const x = Math.max(-5, Math.min(5, (current - 50) / 12));
    const newX = x + (resonatedDelta * gravityFactor * 0.11 * sensitivity); 
    const target = 100 / (1 + Math.exp(-newX));
    return applyHysteresis(current, target, entropyCurrent, resilience, physics.inertia);
};

export function calculateRawMetrics(history: GameHistoryItem[]): RawAnalysisResult & { isCrisis: boolean } {
  const context = StorageService.load<LifeContext>(STORAGE_KEYS.SESSION_CONTEXT, 'NORMAL');
  const physics = CONTEXT_PHYSICS[context] || CONTEXT_PHYSICS.NORMAL;

  let f = 50, a = 50, r = 50, e = 15, s = 50, l = 50;
  let syncScore = 100;
  let currentResilience = 50;
  const sessionPulse: SessionPulseNode[] = [];
  const somaticDissonance: BeliefKey[] = [];
  
  if (!history || history.length === 0) return { ...createEmptyResult(), isCrisis: false };
  
  const latencies = history.map(h => h.latency).filter(val => val > 300);
  const mean = latencies.length > 0 ? latencies.reduce((sum, v) => sum + v, 0) / latencies.length : 2000;
  const stdDev = Math.sqrt(latencies.map(x => Math.pow(x - mean, 2)).reduce((sum, v) => sum + v, 0) / (latencies.length || 1)) || 1;
  
  history.forEach((h, idx) => {
    const beliefKey = (h.beliefKey as BeliefKey) || 'default';
    const w = (WEIGHTS as any)[beliefKey] || WEIGHTS.default;
    let zScore = (h.latency - mean) / stdDev;
    
    currentResilience = Math.round(((f + r) / 2) * (syncScore / 100) * (1 - (e / 180)));
    
    f = sigmoidUpdate(f, w.f, e, f, r, l, 'foundation', currentResilience, physics);
    a = sigmoidUpdate(a, w.a, e, f, r, l, 'agency', currentResilience, physics);
    r = sigmoidUpdate(r, w.r, e, f, r, l, 'money', currentResilience, physics);
    s = sigmoidUpdate(s, w.s, e, f, r, l, 'social', currentResilience, physics);
    l = sigmoidUpdate(l, w.l, e, f, r, l, 'legacy', currentResilience, physics);
    
    // Entropy is damped in Crisis/High Load to prevent premature collapse in calculation
    const e_delta = (w.e * (zScore > 2.2 ? 1.4 : 1.0));
    e = Math.max(5, Math.min(95, (e * (h.sensation === 's2' || h.sensation === 's3' ? 0.88 : 0.98)) + (e_delta * physics.e_damping)));
    
    if ((w.f || 0) + (w.a || 0) + (w.r || 0) > 2 && (h.sensation === 's1' || h.sensation === 's4')) {
        syncScore = Math.max(10, syncScore - 15);
        if (!somaticDissonance.includes(beliefKey)) somaticDissonance.push(beliefKey);
    }
    
    sessionPulse.push({ id: idx, domain: h.domain, tension: Math.round(Math.max(0, Math.min(100, (zScore + 2) * 20))), isBlock: zScore > 1.8 || h.sensation === 's1', isFlow: zScore < -0.8 && !['s1', 's4'].includes(h.sensation), zScore });
  });
  
  // Art. 17.3 Crisis Fuse Activation
  // We check for critical structural failures that require immediate blocking of results
  const isCollapse = f < 30; // Loss of support
  const isChaos = e > 80; // Psychotic risk
  const isManicBreak = a > 90 && f < 30; // Manic defense risk
  
  const isCrisis = isCollapse || isChaos || isManicBreak;

  const integrity = Math.round(((f + a + r + s + l) / 5) * (1 - e / 220));
  
  const finalResult: RawAnalysisResult & { isCrisis: boolean } = {
    context, 
    state: { foundation: Math.round(f), agency: Math.round(a), resource: Math.round(r), entropy: Math.round(e) },
    domainProfile: { foundation: Math.round(f), agency: Math.round(a), money: Math.round(r), social: Math.round(s), legacy: Math.round(l) },
    integrity, capacity: Math.round((f + r) / 2), entropyScore: Math.round(e), neuroSync: Math.round(syncScore), systemHealth: Math.round(integrity * 0.6 + syncScore * 0.4),
    phase: f < 35 ? 'SANITATION' : 'STABILIZATION', status: isCrisis ? 'CRITICAL' : 'OPTIMAL', validity: 'VALID', activePatterns: history.map(h => h.beliefKey as BeliefKey), somaticDissonance, history, correlations: [], conflicts: [], somaticProfile: { blocks: 0, resources: 0, dominantSensation: 's0' }, integrityBreakdown: { coherence: 0, sync: 0, stability: 0, label: '', status: '' }, clarity: 0, confidenceScore: 0, warnings: [], flags: {}, skippedCount: 0, sessionPulse,
    isCrisis // Explicitly added
  };

  return finalResult;
}

const createEmptyResult = (): RawAnalysisResult => ({
    context: 'NORMAL', state: { foundation: 50, agency: 50, resource: 50, entropy: 15 }, domainProfile: { foundation: 50, agency: 50, money: 50, social: 50, legacy: 50 }, integrity: 50, capacity: 50, entropyScore: 15, neuroSync: 100, systemHealth: 70, phase: 'STABILIZATION', status: 'INITIALIZING', validity: 'INITIALIZING', activePatterns: [], somaticDissonance: [], history: [], correlations: [], conflicts: [], somaticProfile: { blocks: 0, resources: 0, dominantSensation: 's0' }, integrityBreakdown: { coherence: 100, sync: 100, stability: 100, label: 'Init', status: 'Init' }, clarity: 0, confidenceScore: 0, warnings: [], flags: {}, skippedCount: 0, sessionPulse: []
});
