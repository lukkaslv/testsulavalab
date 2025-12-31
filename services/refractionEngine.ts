
import { AnalysisResult, ArchetypeKey } from '../types';

export interface RefractionVector {
    target: ArchetypeKey;
    weight: number; // 0-100
    tension: number; // Натяжение (дистанция)
    isShadow: boolean;
}

/**
 * Genesis OS Refraction Engine v1.0
 * Детерминированный расчет близости состояний (Art. 1.1)
 */
export const RefractionEngine = {
    calculateVectors(result: AnalysisResult): RefractionVector[] {
        const { archetypeSpectrum, archetypeKey } = result;
        if (!archetypeSpectrum) return [];

        const maxScore = archetypeSpectrum[0].score;
        
        return archetypeSpectrum
            .filter(s => s.key !== archetypeKey) // Не считаем текущий
            .map(s => {
                const relativeWeight = (s.score / maxScore) * 100;
                return {
                    target: s.key,
                    weight: Math.round(relativeWeight),
                    tension: Math.round(100 - relativeWeight),
                    isShadow: relativeWeight > 70 // Если вес > 70%, это активная тень
                };
            })
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 3); // Берем топ-3 вектора влияния
    }
};
