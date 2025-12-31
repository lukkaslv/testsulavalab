
import { AnalysisResult, DomainType } from '../types';

export interface SovereigntyMetrics {
    escapeVelocity: number; // 0-100 (Текущая "скорость" изменений)
    requiredVelocity: number; // 0-100 (Порог разрыва аттрактора)
    willPowerIndex: number; // Чистая энергия воли
    leverageDomain: DomainType; // Точка максимального рычага
    systemicPrice: number; // Цена перехода (риск дестабилизации)
    canEscape: boolean;
}

/**
 * Genesis OS Sovereignty Engine v1.0
 * Расчет способности системы к суверенному выбору (Art. 1.1)
 */
export const SovereigntyEngine = {
    calculate(result: AnalysisResult): SovereigntyMetrics {
        const { foundation: f, agency: a, resource: r, entropy: e } = result.state;
        const sync = result.neuroSync;

        // Порог побега зависит от глубины Well и уровня хаоса
        const wellDepth = (f * 0.7 + (100 - e) * 0.3) * (sync / 100);
        const required = Math.round(wellDepth * 0.85);

        // Текущая энергия побега (Agency + Sync - Entropy)
        const current = Math.round((a * 0.6 + sync * 0.4) * (1 - (e / 200)));

        // Определение рычага (где минимальное усилие даст макс результат)
        const profiles = [
            { key: 'foundation' as DomainType, val: f },
            { key: 'agency' as DomainType, val: a },
            { key: 'money' as DomainType, val: r }
        ].sort((x, y) => x.val - y.val);
        
        // Рычаг — это самый слабый домен, требующий внимания
        const leverage = profiles[0].key;

        // Цена перехода: чем ниже фундамент, тем опаснее прыжок
        const price = Math.round((100 - f) * 0.5 + e * 0.3);

        return {
            escapeVelocity: current,
            requiredVelocity: required,
            willPowerIndex: Math.round(a * (sync / 100)),
            leverageDomain: leverage,
            systemicPrice: price,
            canEscape: current >= required
        };
    }
};
