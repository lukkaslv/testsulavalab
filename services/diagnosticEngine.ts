
import { RawAnalysisResult, AnalysisResult, ArchetypeKey, VerdictKey, PhaseType, TaskKey, PatternFlags, DomainType, MetricBreakdown } from '../types';
import { SecurityCore } from '../utils/crypto';
import { SYSTEM_METADATA } from '../constants';

const ARCHETYPE_INDEX_MAP: ArchetypeKey[] = [
  'THE_ARCHITECT', 'THE_DRIFTER', 'THE_BURNED_HERO',
  'THE_GOLDEN_PRISONER', 'THE_CHAOS_SURFER', 'THE_GUARDIAN'
];

const VERDICT_INDEX_MAP: VerdictKey[] = [
  'HEALTHY_SCALE', 'BRILLIANT_SABOTAGE', 'INVISIBILE_CEILING',
  'LEAKY_BUCKET', 'PARALYZED_GIANT', 'FROZEN_POTENTIAL', 'CRITICAL_DEFICIT'
];

const TASKS_LOGIC: Record<PhaseType, Array<{ taskKey: TaskKey, targetMetricKey: string }>> = {
  SANITATION: [{ taskKey: "sanitation_1", targetMetricKey: "Focus" }, { taskKey: "sanitation_2", targetMetricKey: "Sync" }, { taskKey: "sanitation_3", targetMetricKey: "Space" }, { taskKey: "sanitation_4", targetMetricKey: "Clarity" }, { taskKey: "sanitation_5", targetMetricKey: "Control" }, { taskKey: "sanitation_6", targetMetricKey: "Awareness" }, { taskKey: "sanitation_7", targetMetricKey: "Space" }],
  STABILIZATION: [{ taskKey: "stabilization_1", targetMetricKey: "Agency" }, { taskKey: "stabilization_2", targetMetricKey: "Foundation" }, { taskKey: "stabilization_3", targetMetricKey: "Will" }, { taskKey: "stabilization_4", targetMetricKey: "Stability" }, { taskKey: "stabilization_5", targetMetricKey: "Focus" }, { taskKey: "stabilization_6", targetMetricKey: "Agency" }, { taskKey: "stabilization_7", targetMetricKey: "Integrity" }],
  EXPANSION: [{ taskKey: "expansion_1", targetMetricKey: "Courage" }, { taskKey: "expansion_2", targetMetricKey: "Resource" }, { taskKey: "expansion_3", targetMetricKey: "Agency" }, { taskKey: "expansion_4", targetMetricKey: "Visibility" }, { taskKey: "expansion_5", targetMetricKey: "Scale" }, { taskKey: "expansion_6", targetMetricKey: "Vision" }, { taskKey: "expansion_7", targetMetricKey: "Integrity" }]
};

// Calculate pentagon coordinates
const calculatePentagonPoints = (profile: Record<DomainType, number>) => {
    const keys: DomainType[] = ['foundation', 'agency', 'social', 'legacy', 'money'];
    const count = keys.length;
    const center = 50;
    const radiusScale = 0.45; // slightly less than 0.5 to fit in 100x100

    return keys.map((key, i) => {
        const value = profile[key] || 50;
        const normalizedValue = value / 100;
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2; // Start from top
        
        // Calculate point based on value
        const r = normalizedValue * (100 * radiusScale);
        const x = center + Math.cos(angle) * r;
        const y = center + Math.sin(angle) * r;
        
        return { x, y, label: key };
    });
};

const generateFormulaBreakdown = (raw: RawAnalysisResult): MetricBreakdown[] => {
    const { state, neuroSync, integrity } = raw;
    const entropyFactor = 1 - (state.entropy / 280);
    
    return [
        {
            label: 'foundation',
            formula: 'F = Σ(w_f * baseline_norm) * entropy_gravity',
            baseValue: state.foundation,
            entropyImpact: Math.round(state.foundation * (1 - entropyFactor)),
            syncImpact: 0,
            finalValue: state.foundation
        },
        {
            label: 'integrity',
            formula: 'I = [(F+A+R)/3] * [1 - (E/280)]',
            baseValue: Math.round((state.foundation + state.agency + state.resource) / 3),
            entropyImpact: Math.round(((state.foundation + state.agency + state.resource) / 3) * (state.entropy / 280)),
            syncImpact: 0,
            finalValue: integrity
        },
        {
            label: 'neuro_sync',
            formula: 'S = 100 - Σ(somatic_friction_penalty)',
            baseValue: 100,
            entropyImpact: 0,
            syncImpact: 100 - neuroSync,
            finalValue: neuroSync
        }
    ];
};

export const DiagnosticEngine = {
  interpret(raw: RawAnalysisResult, patternFlags: PatternFlags & { isInconsistentRhythm?: boolean }): AnalysisResult {
    const { state, phase, conflicts, domainProfile } = raw;
    
    const f = Math.min(100, state.foundation);
    const a = Math.min(100, state.agency);
    const r = Math.min(100, state.resource);
    const e = Math.min(100, state.entropy);

    const archetypeSpectrum = ([
      { key: 'THE_CHAOS_SURFER', score: e * 1.1 }, 
      { key: 'THE_DRIFTER', score: (100 - a) * 0.9 + (e * 0.3) },
      { key: 'THE_BURNED_HERO', score: (a * 0.8 + (100 - r) * 0.8) },
      { key: 'THE_GOLDEN_PRISONER', score: (r * 0.7 + (100 - a) * 0.7) },
      { key: 'THE_GUARDIAN', score: (f * 0.6 + (100 - a) * 0.6 + r * 0.4) },
      { key: 'THE_ARCHITECT', score: (a + f + r) / 3 }
    ] as { key: ArchetypeKey; score: number }[]).sort((a, b) => b.score - a.score);

    const primary = archetypeSpectrum[0];
    const secondary = archetypeSpectrum[1];

    let verdictKey: VerdictKey = 'HEALTHY_SCALE';
    if (f <= 35) verdictKey = 'CRITICAL_DEFICIT';
    else if (a > 75 && f < 45) verdictKey = 'BRILLIANT_SABOTAGE';
    else if (f > 75 && a < 40) verdictKey = 'INVISIBILE_CEILING';
    else if (r > 70 && e > 55) verdictKey = 'LEAKY_BUCKET';
    else if (a < 35 && e > 45) verdictKey = 'PARALYZED_GIANT';
    else if (f < 50 && a < 50 && r < 50 && e < 40) verdictKey = 'FROZEN_POTENTIAL';

    const pool = TASKS_LOGIC[phase];
    const roadmap = Array.from({ length: 7 }, (_, i) => ({ day: i + 1, phase, ...pool[i % pool.length] }));

    const archIndex = ARCHETYPE_INDEX_MAP.indexOf(primary.key);
    const verdictIndex = VERDICT_INDEX_MAP.indexOf(verdictKey);
    
    // Titanium Integrity Protocol: Version Header + Salted Hash
    const dataStr = `${Math.round(f)}|${Math.round(a)}|${Math.round(r)}|${Math.round(e)}|${archIndex}|${Math.round(raw.neuroSync)}|${verdictIndex}`;
    const headerData = `${SYSTEM_METADATA.LOGIC_VERSION}::${dataStr}`;
    const sig = SecurityCore.generateChecksum(headerData);
    
    const shareCode = btoa(`${headerData}#${sig}`);

    const coreConflict = conflicts.length > 0 ? conflicts[0].key : (verdictKey !== 'HEALTHY_SCALE' ? verdictKey.toLowerCase() : 'none');
    
    let finalValidity = raw.validity;
    let anomalyCount = 0;
    if (patternFlags.isMonotonic) anomalyCount += 2;
    if (patternFlags.isRoboticTiming) anomalyCount += 3;
    if (patternFlags.isInconsistentRhythm) anomalyCount += 2;
    if (patternFlags.isHighSkipRate) anomalyCount += 1;
    if (patternFlags.isEarlyTermination) anomalyCount += 2;

    if (anomalyCount >= 4) {
        finalValidity = 'INVALID';
    } else if (anomalyCount >= 2) {
        finalValidity = 'SUSPICIOUS';
    }

    const graphPoints = calculatePentagonPoints(domainProfile || { foundation: f, agency: a, money: r, social: 50, legacy: 50 });

    return {
      ...raw,
      state: { foundation: f, agency: a, resource: r, entropy: e },
      validity: finalValidity,
      timestamp: Date.now(),
      createdAt: Date.now(),
      shareCode,
      archetypeKey: primary.key,
      secondaryArchetypeKey: secondary?.key,
      archetypeMatch: 100,
      archetypeSpectrum,
      verdictKey,
      lifeScriptKey: `${verdictKey}_${primary.key}`.toLowerCase(),
      roadmap,
      graphPoints,
      interventionStrategy: f < 40 ? 'stabilize_foundation' : e > 50 ? 'lower_entropy' : 'activate_will',
      coreConflict: coreConflict,
      shadowDirective: 'integrity_boost',
      patternFlags,
      formulaBreakdown: generateFormulaBreakdown(raw)
    };
  }
};
