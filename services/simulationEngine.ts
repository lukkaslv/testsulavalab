import { DomainType, AnalysisResult } from '../types';

export interface SimulationProjection {
    state: Record<DomainType, number>;
    delta: Record<DomainType, number>;
    archetypeShift: boolean;
    integrityGain: number;
}

/**
 * Simulacrum Engine v1.0
 * Детерминированное моделирование системных связей.
 * Compliance: Art. 19.2 (Симуляция последствий)
 */
export const SimulationEngine = {
    /**
     * Рассчитывает, как изменение одного домена влияет на всю систему.
     * Использует коэффициенты связи из Lattice Logic.
     */
    project(base: AnalysisResult, targetDomain: DomainType, newVal: number): SimulationProjection {
        const profile = { ...base.domainProfile };
        const oldVal = profile[targetDomain];
        const shift = newVal - oldVal;
        
        const nextState = { ...profile };
        nextState[targetDomain] = newVal;

        // Коэффициенты системного влияния ( Coupling Coefficients )
        // Положительное влияние Фундамента на всё
        if (targetDomain === 'foundation') {
            nextState.agency = this.clamp(nextState.agency + shift * 0.4);
            nextState.money = this.clamp(nextState.money + shift * 0.3);
        }

        // Влияние Воли (Agency) на Ресурс и Энтропию (через общие показатели)
        if (targetDomain === 'agency') {
            nextState.money = this.clamp(nextState.money + shift * 0.2);
            // Рост воли при низком фундаменте повышает "напряжение" (моделируется через дельту целостности)
        }

        // Расчет дельт
        const deltas = (Object.keys(nextState) as DomainType[]).reduce((acc, key) => {
            acc[key] = Math.round(nextState[key] - profile[key]);
            return acc;
        }, {} as Record<DomainType, number>);

        const newIntegrity = Object.values(nextState).reduce((a, b) => a + b, 0) / 5;
        const oldIntegrity = Object.values(profile).reduce((a, b) => a + b, 0) / 5;

        return {
            state: nextState,
            delta: deltas,
            archetypeShift: false, // В этой версии упрощено
            integrityGain: Math.round(newIntegrity - oldIntegrity)
        };
    },

    // FIX: Removed 'private' modifier as it is not allowed in object literals.
    clamp(val: number): number {
        return Math.max(5, Math.min(95, Math.round(val)));
    }
};