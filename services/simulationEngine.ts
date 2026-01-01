
import { DomainType, AnalysisResult } from '../types';

export interface SimulationProjection {
    state: Record<DomainType, number>;
    delta: Record<DomainType, number>;
    archetypeShift: boolean;
    integrityGain: number;
    wearReduction: number;
}

/**
 * СИМУЛЯТОР ГЕНЕЗИС v1.0
 * Детерминированное моделирование системных сдвигов (Ст. 19.2)
 * Основано на коэффициентах связанности доменов.
 */
export const SimulationEngine = {
    project(base: AnalysisResult, changes: Partial<Record<DomainType, number>>): SimulationProjection {
        const profile = { ...base.domainProfile };
        const nextState = { ...profile };
        // FIX: Сохранение и обновление энтропии отдельно от доменного профиля (Ст. 4.1)
        let nextEntropy = base.state.entropy;
        
        // 1. Применяем прямые изменения
        Object.entries(changes).forEach(([domain, val]) => {
            if (val !== undefined) nextState[domain as DomainType] = val;
        });

        // 2. Рассчитываем системное эхо (Влияние доменов друг на друга)
        // Если Фундамент растет, Энтропия падает детерминированно
        if (changes.foundation !== undefined && changes.foundation > profile.foundation) {
            const boost = (changes.foundation - profile.foundation) * 0.3;
            nextEntropy = Math.max(5, nextEntropy - boost);
        }

        // 3. Расчет итоговых метрик
        const deltas = (Object.keys(nextState) as DomainType[]).reduce((acc, key) => {
            acc[key] = Math.round(nextState[key] - profile[key]);
            return acc;
        }, {} as Record<DomainType, number>);

        const newIntegrity = Math.round(Object.values(nextState).reduce((a, b) => a + b, 0) / 5);
        const oldIntegrity = base.integrity;

        // Расчет изменения износа
        // @ts-ignore
        const oldWear = base.systemicWear || 0;
        const newSync = base.neuroSync; // Упрощено: синхрон не меняется в симуляции без соматики
        // FIX: Использование обновленного значения энтропии для расчета износа
        const newWear = Math.round((nextEntropy * 0.7) + ((100 - newSync) * 0.3));

        return {
            state: nextState,
            delta: deltas,
            archetypeShift: false, 
            integrityGain: newIntegrity - oldIntegrity,
            wearReduction: oldWear - newWear
        };
    },

    clamp(val: number): number {
        return Math.max(5, Math.min(95, Math.round(val)));
    }
};
