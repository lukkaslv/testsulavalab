
import { RawAnalysisResult, AnalysisResult, ArchetypeKey, VerdictKey, PhaseType, TaskKey, PatternFlags, DomainType, EntropyFluxVector, StructuralFracture } from '../types';
import { SecurityCore } from '../utils/crypto';
import { SYSTEM_METADATA } from '../constants';
import { calculateForecast, WEIGHTS } from './psychologyService';

const TASKS_LOGIC: Record<PhaseType, Array<{ taskKey: TaskKey, targetMetricKey: string }>> = {
  SANITATION: [{ taskKey: "sanitation_1", targetMetricKey: "Focus" }, { taskKey: "sanitation_2", targetMetricKey: "Sync" }, { taskKey: "sanitation_3", targetMetricKey: "Space" }, { taskKey: "sanitation_4", targetMetricKey: "Clarity" }, { taskKey: "sanitation_5", targetMetricKey: "Control" }, { taskKey: "sanitation_6", targetMetricKey: "Awareness" }, { taskKey: "sanitation_7", targetMetricKey: "Space" }],
  STABILIZATION: [{ taskKey: "stabilization_1", targetMetricKey: "Agency" }, { taskKey: "stabilization_2", targetMetricKey: "Foundation" }, { taskKey: "stabilization_3", targetMetricKey: "Will" }, { taskKey: "stabilization_4", targetMetricKey: "Stability" }, { taskKey: "stabilization_5", targetMetricKey: "Focus" }, { taskKey: "stabilization_6", targetMetricKey: "Agency" }, { taskKey: "stabilization_7", targetMetricKey: "Integrity" }],
  EXPANSION: [{ taskKey: "expansion_1", targetMetricKey: "Courage" }, { taskKey: "expansion_2", targetMetricKey: "Resource" }, { taskKey: "expansion_3", targetMetricKey: "Agency" }, { taskKey: "expansion_4", targetMetricKey: "Visibility" }, { taskKey: "expansion_5", targetMetricKey: "Scale" }, { taskKey: "expansion_6", targetMetricKey: "Vision" }, { taskKey: "integrity_7", targetMetricKey: "Integrity" }]
};

export const DiagnosticEngine = {
  interpret(raw: RawAnalysisResult & { isCrisis?: boolean }, patternFlagsOverride?: PatternFlags): AnalysisResult {
    const { foundation: f, agency: a, resource: r, entropy: e } = raw.state;
    const { history, domainProfile } = raw;
    
    // 1. Стандартный расчет спектра
    const spectrum = [
      { key: 'THE_CHAOS_SURFER' as ArchetypeKey, score: e * 1.6 },
      { key: 'THE_DRIFTER' as ArchetypeKey, score: (100 - a) * 1.1 + (e * 0.4) },
      { key: 'THE_BURNED_HERO' as ArchetypeKey, score: (a * 0.9 + (100 - r) * 0.9) },
      { key: 'THE_GOLDEN_PRISONER' as ArchetypeKey, score: (r * 0.8 + (100 - a) * 0.8) },
      { key: 'THE_GUARDIAN' as ArchetypeKey, score: (f * 0.7 + (100 - a) * 0.7) },
      { key: 'THE_ARCHITECT' as ArchetypeKey, score: (a + f + r) / 3 }
    ].sort((x, y) => y.score - x.score);

    const gap = spectrum.length > 1 ? (spectrum[0].score - spectrum[1].score) : 100;
    const butterflySensitivity = Math.round(Math.max(0, 100 - gap));

    // 2. КИНЕТИЧЕСКИЙ РАСЧЕТ ПОТОКОВ ЭНТРОПИИ (Art. 6.1)
    const entropyFlux: EntropyFluxVector[] = [];
    const domains: DomainType[] = ['foundation', 'agency', 'money', 'social', 'legacy'];
    
    for (let i = 0; i < domains.length; i++) {
        for (let j = 0; j < domains.length; j++) {
            if (i === j) continue;
            const from = domains[i];
            const to = domains[j];
            const valFrom = domainProfile[from];
            const valTo = domainProfile[to];
            const delta = valFrom - valTo;
            if (delta > 25) { 
                entropyFlux.push({
                    from, to, intensity: Math.round(delta),
                    velocity: 0.5 + (e / 100) * 2 
                });
            }
        }
    }

    // 3. ДЕТЕКЦИЯ СТРУКТУРНЫХ РАЗЛОМОВ (Art. 7.3)
    const fractures: StructuralFracture[] = [];
    if (history && history.length > 5) {
        const latencies = history.map(h => h.latency);
        const mean = latencies.reduce((sum, v) => sum + v, 0) / latencies.length;
        const stdDev = Math.sqrt(latencies.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / latencies.length) || 1;

        history.forEach(h => {
            const z = (h.latency - mean) / stdDev;
            const isDissonant = h.sensation === 's1' || h.sensation === 's4';
            
            if (z > 1.6 && isDissonant) {
                fractures.push({
                    nodeId: h.nodeId,
                    domain: h.domain,
                    intensity: Math.round(z * 20),
                    beliefKey: h.beliefKey,
                    description: z > 2.5 ? "Критический разлом когерентности" : "Точка системного напряжения"
                });
            }
        });
    }

    const shadowProfile: Record<DomainType, number> = { foundation: 20, agency: 20, money: 20, social: 20, legacy: 20 };
    if (history && history.length > 5) {
        const latencies = history.map(h => h.latency);
        const mean = latencies.reduce((sum, v) => sum + v, 0) / latencies.length;
        history.forEach(h => {
            const w = WEIGHTS[h.beliefKey] || WEIGHTS.default;
            const z = h.latency > mean * 1.5 ? 1.5 : 0.5;
            Object.keys(shadowProfile).forEach(d => {
                const metricKey = d === 'money' ? 'r' : d[0] as 'f'|'a'|'s'|'l';
                if (w[metricKey] < 0) {
                    shadowProfile[d as DomainType] = Math.min(95, shadowProfile[d as DomainType] + Math.abs(w[metricKey]) * z);
                }
            });
        });
    }

    const keys: DomainType[] = ['foundation', 'agency', 'money', 'social', 'legacy'];
    const center = 50;
    const graphPoints = keys.map((key, i) => {
        const value = (raw.domainProfile as any)[key] || 50;
        const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
        return { x: center + Math.cos(angle) * (value / 100 * 45), y: center + Math.sin(angle) * (value / 100 * 45), label: key };
    });

    const shadowPoints = keys.map((key, i) => {
        const value = shadowProfile[key];
        const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
        return { x: center + Math.cos(angle) * (value / 100 * 45), y: center + Math.sin(angle) * (value / 100 * 45), label: key };
    });

    const shadowArchetypeKey = spectrum[spectrum.length - 1].key;
    let verdictKey: VerdictKey = 'HEALTHY_SCALE';
    if (e > 80 || f <= 35) verdictKey = 'CRITICAL_DEFICIT';
    else if (a > 75 && f < 45) verdictKey = 'BRILLIANT_SABOTAGE';

    const recommendedPhase: PhaseType = f < 35 ? 'SANITATION' : 'STABILIZATION';
    const headerData = `${SYSTEM_METADATA.LOGIC_VERSION}::СКРЫТО`;
    const sig = SecurityCore.generateChecksum(headerData);

    return {
      ...raw,
      timestamp: Date.now(),
      createdAt: Date.now(),
      archetypeMatch: Math.round(spectrum[0].score),
      lifeScriptKey: `v8_std_${spectrum[0].key.toLowerCase()}`,
      graphPoints,
      shadowPoints,
      shadowArchetype: { 
          key: shadowArchetypeKey, 
          tension: Math.round(e), 
          description: "Подавленная часть системы." 
      },
      forecast: calculateForecast(f, a, r, e),
      refraction: spectrum.slice(0, 3).map(s => ({ key: s.key, match: Math.round(s.score), description: "Ось преломления" })),
      interventionStrategy: f < 35 ? 'STABILIZATION' : 'GROWTH',
      coreConflict: e > 50 ? 'IDENTITY_DIFFUSION' : 'STRUCTURAL_RESISTANCE',
      shadowDirective: 'INTEGRATE_SHADOW',
      // FIX: Use SecurityCore.toBase64 to handle Cyrillic characters in headerData
      shareCode: SecurityCore.toBase64(`${headerData}#${sig}`),
      archetypeKey: spectrum[0].key,
      secondaryArchetypeKey: spectrum[1]?.key,
      archetypeSpectrum: spectrum,
      verdictKey,
      roadmap: Array.from({ length: 7 }, (_, i) => ({ day: i + 1, phase: recommendedPhase, ...TASKS_LOGIC[recommendedPhase][i % 7] })),
      butterflySensitivity,
      patternFlags: patternFlagsOverride || { isMonotonic: false, isHighSkipRate: false, isFlatline: false, isRoboticTiming: false, isSomaticMonotony: false, isEarlyTermination: false, dominantPosition: null },
      entropyFlux,
      fractures,
      // Pass the crisis flag from raw to final result
      isCrisis: raw.isCrisis
    };
  }
};
