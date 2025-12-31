
import { BifurcationNode, BeliefKey, AnalysisResult } from '../types';
import { calculateRawMetrics } from './psychologyService';
import { DiagnosticEngine } from './diagnosticEngine';

export type { BifurcationNode };

/**
 * Butterfly Engine v1.0
 * Детерминированный анализ альтернативных историй.
 * "Малое изменение — большое последствие" (Art. 5)
 */
export const ButterflyEngine = {
    calculateBifurcations(result: AnalysisResult): BifurcationNode[] {
        const history = result.history;
        if (!history || history.length < 10) return [];

        const nodes: BifurcationNode[] = [];
        
        // Анализируем последние 10 узлов, где система наиболее чувствительна
        const criticalWindow = history.slice(-15);

        criticalWindow.forEach((h) => {
            // Моделируем "что если": меняем выбор на альтернативный
            const alternativeBelief = h.choicePosition === 0 ? 'money_is_tool' : 'family_loyalty';
            
            const simulatedHistory = [...history];
            simulatedHistory[history.indexOf(h)] = {
                ...h,
                beliefKey: alternativeBelief,
                latency: 1200 // Идеальная латентность
            };

            const simulatedResult = DiagnosticEngine.interpret(calculateRawMetrics(simulatedHistory));
            
            if (simulatedResult.archetypeKey !== result.archetypeKey) {
                // Это точка бифуркации: смена одного выбора меняет архетип
                nodes.push({
                    id: h.nodeId,
                    belief: h.beliefKey as BeliefKey,
                    actualArchetype: result.archetypeKey,
                    shadowArchetype: simulatedResult.archetypeKey,
                    sensitivity: Math.round(result.butterflySensitivity),
                    delta: Math.round(Math.abs(simulatedResult.integrity - result.integrity))
                });
            }
        });

        return nodes.sort((a, b) => b.delta - a.delta).slice(0, 5);
    }
};
