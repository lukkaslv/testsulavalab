
import { GameHistoryItem, ArchetypeKey, BeliefKey } from '../types';
import { calculateRawMetrics } from './psychologyService';
import { DiagnosticEngine } from './diagnosticEngine';

export interface BifurcationPoint {
    nodeId: string;
    archetypeBefore: ArchetypeKey;
    archetypeAfter: ArchetypeKey;
    intensity: number; // 0-100%
    triggerBelief: BeliefKey;
}

/**
 * Genesis OS Bifurcation Engine v1.0
 * Детерминированный поиск точек слома стратегии.
 */
export const BifurcationEngine = {
    detect(history: GameHistoryItem[]): BifurcationPoint[] {
        const points: BifurcationPoint[] = [];
        if (history.length < 5) return points;

        for (let i = 5; i < history.length; i++) {
            const sliceBefore = history.slice(0, i);
            const sliceAfter = history.slice(0, i + 1);

            const resBefore = DiagnosticEngine.interpret(calculateRawMetrics(sliceBefore));
            const resAfter = DiagnosticEngine.interpret(calculateRawMetrics(sliceAfter));

            if (resBefore.archetypeKey !== resAfter.archetypeKey) {
                // Зафиксирован скачок в топологии
                const scoreBefore = resBefore.archetypeSpectrum.find(s => s.key === resAfter.archetypeKey)?.score || 0;
                const scoreAfter = resAfter.archetypeMatch;
                
                points.push({
                    nodeId: history[i].nodeId,
                    archetypeBefore: resBefore.archetypeKey,
                    archetypeAfter: resAfter.archetypeKey,
                    intensity: Math.round(Math.abs(scoreAfter - scoreBefore)),
                    triggerBelief: history[i].beliefKey as BeliefKey
                });
            }
        }
        return points;
    }
};
