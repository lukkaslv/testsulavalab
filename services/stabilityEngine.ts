
import { AnalysisResult } from '../types';

export interface StabilityMetrics {
    wellDepth: number; // 0-100 (Глубина застревания)
    fluidityIndex: number; // 0-100 (Готовность к переходу)
    attractorType: 'STABLE' | 'FRAGILE' | 'LOCKED' | 'TRANSITION';
    energyBarrier: number; // Усилия для смены состояния
}

/**
 * StabilityEngine v1.0
 * Детерминированный анализ потенциальной энергии системы (Art. 1.1)
 */
export const StabilityEngine = {
    calculate(result: AnalysisResult): StabilityMetrics {
        const { foundation: f, agency: a, entropy: e } = result.state;
        const sync = result.neuroSync;

        // Глубина воронки зависит от силы фундамента и отсутствия шума
        const depth = Math.round((f * 0.7 + (100 - e) * 0.3) * (sync / 100));
        
        // Текучесть (Fluidity) растет при росте энтропии и воли (Agency)
        const fluidity = Math.round((e * 0.5 + a * 0.5) * (1 - f / 150));

        let type: StabilityMetrics['attractorType'] = 'STABLE';
        if (depth > 80) type = 'LOCKED';
        else if (e > 65) type = 'FRAGILE';
        else if (a > 75 && e > 40) type = 'TRANSITION';

        return {
            wellDepth: depth,
            fluidityIndex: Math.min(100, fluidity),
            attractorType: type,
            energyBarrier: Math.round(depth * (1 - a / 200))
        };
    }
};
