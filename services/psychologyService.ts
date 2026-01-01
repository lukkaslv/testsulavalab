
import { BeliefKey, GameHistoryItem, RawAnalysisResult, DomainType, AutopoiesisMetrics, ForecastMetrics, LifeContext, EntropyFluxVector, ViscosityReport } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';

export interface FeedbackLoopNode {
    domain: DomainType;
    label: string;
    impact: 'УСИЛЕНИЕ' | 'ОСЛАБЛЕНИЕ';
}

export interface FeedbackLoop {
    id: string;
    type: 'ЗАМКНУТЫЙ_КРУГ' | 'СПИРАЛЬ_РОСТА';
    nodes: FeedbackLoopNode[];
    inertia: number; // 0-100
    description: string;
    breakingPoint: string; // Совет по выходу
}

export interface FeedbackLoopReport {
    loops: FeedbackLoop[];
    globalStability: number;
    dominantDynamic: string;
}

export interface PhaseTransitionReport {
    aggregateState: 'КРИСТАЛЛ' | 'ТЕКУЧЕСТЬ' | 'ГАЗ';
    shiftPotential: number; // 0-100
    activationEnergy: number; // Требуемое усилие
    couplingNodes: string[]; // Узлы сцепки
    statusDescription: string;
}

export interface ResilienceReport {
    safetyMargin: number; // 0-100
    fragileDomains: DomainType[];
    rigidityIndex: number;
    breakingPointNode: string | null;
    status: 'ЭЛАСТИЧНО' | 'ПРЕДЕЛ' | 'РАЗРУШЕНИЕ';
}

export interface SingularityPoint {
    nodeId: string;
    domain: DomainType;
    beliefKey: BeliefKey;
    impactMagnitude: number; 
    description: string;
    motive: 'ПОТОК' | 'ЗАЩИТА' | 'КРИЗИС';
}

export interface EnergyLeak {
    from: DomainType;
    to: DomainType;
    volume: number; 
    impact: string;
}

export interface MaintenanceReport {
    totalCost: number;
    leaks: EnergyLeak[];
    status: 'СТАБИЛЬНО' | 'КОМПЕНСАЦИЯ' | 'ИСТОЩЕНИЕ' | 'САМОПОЕДАНИЕ';
}

export interface ResonancePoint {
    beliefKey: BeliefKey;
    dissonance: number; 
    description: string;
}

// ГЕНЕЗИС: Веса Ядра
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

/**
 * АНАЛИЗ ВЯЗКОСТИ СРЕДЫ (Ст. 21)
 * Рассчитывает сопротивление изменениям в каждом домене.
 */
export const calculateViscosity = (raw: RawAnalysisResult): ViscosityReport => {
    const domains: DomainType[] = ['foundation', 'agency', 'money', 'social', 'legacy'];
    const { entropy: e } = raw.state;
    const perDomain = {} as Record<DomainType, number>;
    
    let minViscosity = 101;
    let leverage: DomainType = 'foundation';

    domains.forEach(d => {
        const dVal = raw.domainProfile[d];
        // Вязкость = (100 - Значение Домена) * 0.6 + (Хаос * 0.4)
        const v = Math.round(((100 - dVal) * 0.6) + (e * 0.4));
        perDomain[d] = v;

        if (v < minViscosity) {
            minViscosity = v;
            leverage = d;
        }
    });

    return {
        perDomain,
        overall: Math.round(Object.values(perDomain).reduce((a, b) => a + b, 0) / 5),
        leverageDomain: leverage,
        barrierDescription: minViscosity < 30 
            ? "Обнаружено окно проводимости. Система готова к мягким изменениям." 
            : "Высокая вязкость среды. Любое вмешательство встретит жесткое сопротивление."
    };
};

export const calculateFeedbackLoops = (raw: RawAnalysisResult): FeedbackLoopReport => {
    const { foundation: f, agency: a, entropy: e } = raw.state;
    const loops: FeedbackLoop[] = [];

    if (f < 40 && e > 50) {
        loops.push({
            id: 'exhaustion',
            type: 'ЗАМКНУТЫЙ_КРУГ',
            nodes: [
                { domain: 'foundation', label: 'Низкая Опора', impact: 'ОСЛАБЛЕНИЕ' },
                { domain: 'agency', label: 'Хаотичная Воля', impact: 'УСИЛЕНИЕ' },
                { domain: 'money', label: 'Слив Ресурса', impact: 'ОСЛАБЛЕНИЕ' }
            ],
            inertia: Math.round(e * 0.8),
            description: "Дефицит безопасности провоцирует суету, которая сжигает остатки ресурса.",
            breakingPoint: "Остановить внешнюю активность. Работа только на заземление."
        });
    }

    if (a > 80 && f < 45) {
        loops.push({
            id: 'manic',
            type: 'ЗАМКНУТЫЙ_КРУГ',
            nodes: [
                { domain: 'agency', label: 'Гипер-контроль', impact: 'УСИЛЕНИЕ' },
                { domain: 'foundation', label: 'Игнорирование Опор', impact: 'ОСЛАБЛЕНИЕ' },
                { domain: 'social', label: 'Изоляция', impact: 'УСИЛЕНИЕ' }
            ],
            inertia: Math.round((a + (100 - f)) / 2.5),
            description: "Попытка контролировать мир через сверхусилие только усиливает внутреннюю хрупкость.",
            breakingPoint: "Легализация бессилия. Делегирование ответственности."
        });
    }

    if (a > 60 && f > 60 && e < 35) {
        loops.push({
            id: 'growth',
            type: 'СПИРАЛЬ_РОСТА',
            nodes: [
                { domain: 'foundation', label: 'Стабильность', impact: 'УСИЛЕНИЕ' },
                { domain: 'money', label: 'Присвоение', impact: 'УСИЛЕНИЕ' },
                { domain: 'legacy', label: 'Масштаб', impact: 'УСИЛЕНИЕ' }
            ],
            inertia: Math.round((f + a) / 2.2),
            description: "Уверенность в базе позволяет совершать точные действия, приносящие новый ресурс.",
            breakingPoint: "Инвестиция в долгосрочные проекты. Расширение влияния."
        });
    }

    return {
        loops,
        globalStability: Math.round(100 - e),
        dominantDynamic: loops.length > 0 ? (loops[0].type === 'ЗАМКНУТЫЙ_КРУГ' ? "ДЕГРАДАЦИЯ" : "ЭВОЛЮЦИЯ") : "СТАТИКА"
    };
};

export const calculatePhaseTransition = (raw: RawAnalysisResult): PhaseTransitionReport => {
    const { foundation: f, agency: a, entropy: e } = raw.state;
    const sync = raw.neuroSync;
    const shiftPotential = Math.round((a * 0.4 + sync * 0.4) * (1 - e / 200));
    const activationEnergy = Math.round((f * 0.6 + (100 - sync) * 0.4));
    let aggregateState: PhaseTransitionReport['aggregateState'] = 'ТЕКУЧЕСТЬ';
    if (f > 75 && sync < 40) aggregateState = 'КРИСТАЛЛ';
    else if (e > 70) aggregateState = 'ГАЗ';
    const couplingNodes = raw.history.filter(h => h.latency > 3500 && (h.sensation === 's1' || h.sensation === 's4')).map(h => h.nodeId).slice(0, 3);
    let desc = "Система в оптимальном состоянии для трансформации.";
    if (aggregateState === 'КРИСТАЛЛ') desc = "Структура сверх-стабильна. Психика блокирует любые изменения ради безопасности.";
    if (aggregateState === 'ГАЗ') desc = "Система дезорганизована. Слишком много шума для фиксации нового опыта.";
    return { aggregateState, shiftPotential, activationEnergy, couplingNodes, statusDescription: desc };
};

export const calculateResilience = (raw: RawAnalysisResult): ResilienceReport => {
    const { foundation: f, entropy: e } = raw.state;
    const profile = raw.domainProfile;
    const safetyMargin = Math.round(Math.max(0, f * 0.8 - e * 0.5));
    const fragileDomains = (Object.keys(profile) as DomainType[]).filter(d => profile[d] < 35 || (profile[d] < 50 && e > 60));
    const rigidityIndex = Math.round(((100 - raw.neuroSync) * 0.7) + (f * 0.3));
    let status: ResilienceReport['status'] = 'ЭЛАСТИЧНО';
    if (safetyMargin < 15) status = 'РАЗРУШЕНИЕ';
    else if (safetyMargin < 35) status = 'ПРЕДЕЛ';
    return { safetyMargin, fragileDomains, rigidityIndex, breakingPointNode: raw.history.find(h => h.latency > 4500)?.nodeId || null, status };
};

export const calculateSingularity = (history: GameHistoryItem[]): SingularityPoint | null => {
    if (history.length < 10) return null;
    let maxImpact = -1;
    let targetNode: GameHistoryItem | null = null;
    history.forEach(h => {
        const w = WEIGHTS[h.beliefKey as BeliefKey] || WEIGHTS.default;
        const latencyWeight = h.latency > 3000 ? 1.5 : 1.0;
        const somaticPenalty = (h.sensation === 's1' || h.sensation === 's4') ? 2.0 : 1.0;
        const impact = (Math.abs(w.f) + Math.abs(w.a) + Math.abs(w.r) + Math.abs(w.e)) * latencyWeight * somaticPenalty;
        if (impact > maxImpact) { maxImpact = impact; targetNode = h; }
    });
    if (!targetNode) return null;
    const node = targetNode as GameHistoryItem;
    let motive: SingularityPoint['motive'] = 'ПОТОК';
    if (node.latency > 3500) motive = 'ЗАЩИТА';
    if (node.sensation === 's4' || node.sensation === 's1') motive = 'КРИЗИС';
    return {
        nodeId: node.nodeId, domain: node.domain, beliefKey: node.beliefKey as BeliefKey,
        impactMagnitude: Math.round(Math.min(100, maxImpact * 5)), motive,
        description: motive === 'ЗАЩИТА' ? "Узел максимального сопротивления." : motive === 'КРИЗИС' ? "Точка соматического прорыва." : "Точка чистой воли."
    };
};

export const recalibrateWeights = (newWeights: Partial<Record<string, any>>) => {
    Object.entries(newWeights).forEach(([key, val]) => { if (WEIGHTS[key]) { WEIGHTS[key] = { ...WEIGHTS[key], ...val }; } });
};

export const calculateForecast = (f: number, a: number, r: number, e: number): ForecastMetrics => {
    const momentum = Math.round((a * 0.6 + f * 0.4) * (1 - e / 200));
    const friction = Math.round((e * 0.7 + (100 - f) * 0.3));
    const project = (s: number, g: number, n: number) => {
        const p = [s]; let c = s;
        for (let i = 0; i < n; i++) { c = Math.max(5, Math.min(95, c + g)); p.push(Math.round(c)); }
        return p;
    };
    const integrity = Math.round(((f + a + r) / 3) * (1 - e / 200));
    const growthRate = (momentum - friction) / 10;
    return {
        horizonMonths: 6, momentum, friction,
        inertialPath: project(integrity, growthRate * 0.5, 6),
        decayPath: project(integrity, -friction / 10, 6),
        growthPath: project(integrity, growthRate > 0 ? growthRate : 2, 6),
        tippingPointMonth: growthRate < -2 ? 3 : null
    };
};

export const calculateEntropyFlux = (history: GameHistoryItem[]): EntropyFluxVector[] => {
    const flux: EntropyFluxVector[] = []; if (history.length < 5) return flux;
    const domains: DomainType[] = ['foundation', 'agency', 'money', 'social', 'legacy'];
    const blocks = domains.map(d => ({ domain: d, count: history.filter(h => h.domain === d && h.latency > 3000).length })).sort((a,b) => b.count - a.count);
    if (blocks[0].count > 0) flux.push({ from: blocks[0].domain, to: domains.find(d => d !== blocks[0].domain) || 'foundation', intensity: blocks[0].count * 15, velocity: 1.2 });
    return flux;
};

export const calculateAutopoiesis = (result: RawAnalysisResult): AutopoiesisMetrics => {
    const { foundation: f, agency: a, resource: r, entropy: e } = result.state;
    const healing = Math.round((f * 0.5 + a * 0.3 + r * 0.2) * (1 - e / 150));
    return { selfHealingIndex: healing, integrationPotential: Math.round(100 - result.integrity), phaseTransitionReadiness: Math.round(a * (1 - e / 100)), levers: [{ domain: 'foundation', impact: Math.round(100 - f), label: 'Укрепление опор' }, { domain: 'agency', impact: Math.round(a / 2), label: 'Фокус воли' }] };
};

export const calculateMaintenance = (raw: RawAnalysisResult): MaintenanceReport => {
    const profile = raw.domainProfile; const leaks: EnergyLeak[] = []; let totalCost = 0;
    const check = (from: DomainType, to: DomainType, threshold: number, impact: string) => {
        if (profile[from] > 60 && profile[to] < threshold) { const vol = Math.round((profile[from] - profile[to]) * 0.4); leaks.push({ from, to, volume: vol, impact }); totalCost += vol; }
    };
    check('agency', 'foundation', 35, "Воля тратится на удержание разваливающегося фундамента.");
    check('money', 'foundation', 30, "Ресурс сливается в закрытие базовых дыр безопасности.");
    check('agency', 'social', 40, "Достижения используются для компенсации социального одиночества.");
    let status: MaintenanceReport['status'] = 'СТАБИЛЬНО';
    if (totalCost > 50) status = 'САМОПОЕДАНИЕ'; else if (totalCost > 30) status = 'ИСТОЩЕНИЕ'; else if (totalCost > 15) status = 'КОМПЕНСАЦИЯ';
    return { totalCost, leaks, status };
};

export const calculateResonance = (history: GameHistoryItem[]): ResonancePoint[] => {
    return history.map(h => {
        const w = WEIGHTS[h.beliefKey as BeliefKey] || WEIGHTS.default; const valence = w.f + w.a + w.r;
        const isSomaRestrictive = h.sensation === 's1' || h.sensation === 's4'; let dissonance = 0; let desc = "Резонанс в норме.";
        if (valence > 2 && isSomaRestrictive) { dissonance = 85; desc = "Ложный импульс."; }
        else if (valence < -2 && h.sensation === 's2') { dissonance = 60; desc = "Скрытый ресурс."; }
        else if (h.latency > 3500 && isSomaRestrictive) { dissonance = 95; desc = "Активное вытеснение."; }
        return { beliefKey: h.beliefKey as BeliefKey, dissonance, description: desc };
    }).filter(p => p.dissonance > 0).sort((a,b) => b.dissonance - a.dissonance);
};

export const calculateRawMetrics = (history: GameHistoryItem[]): RawAnalysisResult & { isCrisis: boolean, systemicWear: number } => {
  const context = StorageService.load<LifeContext>(STORAGE_KEYS.SESSION_CONTEXT, 'NORMAL');
  let f = 50, a = 50, r = 50, e = 15, s = 50, l = 50, syncScore = 100;
  if (!history || history.length === 0) return { ...createEmptyResult(), isCrisis: false, systemicWear: 0 };
  
  history.forEach((h) => {
    const beliefKey = (h.beliefKey as BeliefKey) || 'default'; const w = (WEIGHTS as any)[beliefKey] || WEIGHTS.default;
    f = Math.max(5, Math.min(95, f + w.f)); a = Math.max(5, Math.min(95, a + w.a));
    r = Math.max(5, Math.min(95, r + w.r)); e = Math.max(5, Math.min(95, e + w.e));
  });
  const integrity = Math.round(((f + a + r + s + l) / 5) * (1 - e / 220));
  return {
    context, state: { foundation: Math.round(f), agency: Math.round(a), resource: Math.round(r), entropy: Math.round(e) },
    domainProfile: { foundation: Math.round(f), agency: Math.round(a), money: Math.round(r), social: Math.round(s), legacy: Math.round(l) },
    integrity, capacity: Math.round((f + r) / 2), entropyScore: Math.round(e), neuroSync: Math.round(syncScore), systemHealth: Math.round(integrity * 0.6 + syncScore * 0.4),
    phase: f < 35 ? 'SANITATION' : 'STABILIZATION', status: 'ОПТИМАЛЬНО', validity: 'VALID', activePatterns: history.map(h => h.beliefKey as BeliefKey), somaticDissonance: [], history, correlations: [], conflicts: [], somaticProfile: { blocks: 0, resources: 0, dominantSensation: 's0' }, integrityBreakdown: { coherence: 0, sync: 0, stability: 0, label: '', status: '' }, clarity: 0, confidenceScore: 0, warnings: [], flags: {}, skippedCount: 0, sessionPulse: [], isCrisis: false, systemicWear: Math.round(e * 0.7) 
  };
};

const createEmptyResult = (): RawAnalysisResult & { systemicWear: number } => ({
    context: 'NORMAL', state: { foundation: 50, agency: 50, resource: 50, entropy: 15 }, domainProfile: { foundation: 50, agency: 50, money: 50, social: 50, legacy: 50 }, integrity: 50, capacity: 50, entropyScore: 15, neuroSync: 100, systemHealth: 70, phase: 'STABILIZATION', status: 'ИНИЦИАЛИЗАЦИЯ', validity: 'INITIALIZING', activePatterns: [], somaticDissonance: [], history: [], correlations: [], conflicts: [], somaticProfile: { blocks: 0, resources: 0, dominantSensation: 's0' }, integrityBreakdown: { coherence: 100, sync: 100, stability: 100, label: 'Начало', status: 'Начало' }, clarity: 0, confidenceScore: 0, warnings: [], flags: {}, skippedCount: 0, sessionPulse: [], systemicWear: 0
});
