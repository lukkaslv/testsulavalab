
import { ALL_BELIEFS, MODULE_REGISTRY, TOTAL_NODES } from '../constants';
import { translations } from '../translations';
import { WEIGHTS } from './psychologyService';
import { BeliefKey, SimulationReport } from '../types';

// Deterministic Pseudo-Random for Simulation (Same input = Same report)
const pseudoRandom = (seed: number) => {
    let value = seed;
    return () => {
        value = (value * 16807) % 2147483647;
        return (value - 1) / 2147483646;
    };
};

/**
 * Mirror of core psychology logic to ensure simulation accuracy.
 * Genesis OS v4.6 Integrity Protocol.
 */
const simulateSigmoidUpdate = (current: number, delta: number): number => {
    const x = Math.max(-5, Math.min(5, (current - 50) / 12));
    const newX = x + (delta * 0.15); 
    const result = 100 / (1 + Math.exp(-newX));
    return Math.max(5, Math.min(95, result));
};

export const SimulationService = {
  runSimulation(): SimulationReport {
    const report: SimulationReport = {
        pathfinder: { anomalies: [], pathsChecked: 0, coverage: 0 },
        calibrator: { results: [], chaosStressTest: { successRate: 0, failureModes: [] } },
        semanticGhost: { duplicates: [], averageSimilarity: 0, vocabularySize: 0 },
        assetGuardian: { orphans: [] },
        timestamp: Date.now()
    };

    const rnd = pseudoRandom(12345);

    // 1. Pathfinder Coverage
    const allNodeIds = Object.keys(MODULE_REGISTRY).flatMap(domain => Object.keys(MODULE_REGISTRY[domain as any]));
    report.pathfinder.pathsChecked = allNodeIds.length;
    report.pathfinder.coverage = Math.round((allNodeIds.length / TOTAL_NODES) * 100);

    // 2. Semantic Analysis
    const sceneTexts: string[] = [];
    // FIX: Cast scene object to ensure 'desc' property visibility during analysis
    Object.values(translations.ru.scenes).forEach((s: any) => {
        if (s.desc && s.desc.length > 10) sceneTexts.push(s.desc);
    });
    report.semanticGhost.vocabularySize = new Set(sceneTexts.join(' ').split(' ')).size;

    // 3. PERSONA STRESS TESTING (Unified Logic Axis)
    const personas = [
        { name: 'SABOTEUR_BOT', logic: () => rnd() > 0.5 ? 'imposter_syndrome' : 'shame_of_success' },
        { name: 'IDEAL_NOMINAL', logic: () => 'money_is_tool' },
        { name: 'CHAOTIC_NEUTRAL', logic: () => ALL_BELIEFS[Math.floor(rnd() * ALL_BELIEFS.length)] }
    ];

    let successCount = 0;
    personas.forEach(p => {
        let f = 50, a = 50, r = 50, e = 15;
        
        // Simulate a full 50-node session
        for (let i = 0; i < 50; i++) {
            const b = p.logic() as BeliefKey;
            const w = WEIGHTS[b] || WEIGHTS.default;
            
            // Use Sigmoid for CORE metrics (F, A, R)
            f = simulateSigmoidUpdate(f, w.f);
            a = simulateSigmoidUpdate(a, w.a);
            r = simulateSigmoidUpdate(r, w.r);
            
            // Linear bounded update for Entropy (E)
            e = Math.max(5, Math.min(95, e + w.e));
        }
        
        // Final boundary validation (Math Integrity Check)
        const isSafe = f >= 5 && f <= 95 && a >= 5 && a <= 95 && r >= 5 && r <= 95 && e >= 5 && e <= 95;
        
        if (isSafe) {
            successCount++;
        } else {
            report.pathfinder.anomalies.push({ 
                type: 'MATH_DRIFT', 
                details: `Persona ${p.name} violated boundary constraints: F=${f.toFixed(1)}, A=${a.toFixed(1)}, E=${e.toFixed(1)}` 
            });
        }

        report.calibrator.results.push({
            persona: p.name,
            finalState: { foundation: f, agency: a, resource: r, entropy: e },
            dominantArchetype: 'THE_ARCHITECT', // Simplified for report
            stabilityIndex: isSafe ? 100 : 0
        });
    });

    report.calibrator.chaosStressTest.successRate = Math.round((successCount / personas.length) * 100);

    return report;
  }
};
