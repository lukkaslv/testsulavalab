
import { AnalysisResult, DomainType } from '../types';

export interface AttractorMetrics {
    point: { x: number; y: number };
    convergenceRate: number; // 0-100 (Скорость схлопывания вариативности)
    anchorDomain: DomainType;
    fateDescription: string;
    isDegenerative: boolean;
}

/**
 * Genesis OS Teleology Engine v1.0
 * Анализ финальных причин и аттракторов (Art. 3.1)
 */
export const TeleologyEngine = {
    calculate(result: AnalysisResult): AttractorMetrics {
        const { foundation: f, agency: a, resource: r, entropy: e } = result.state;
        const sync = result.neuroSync;

        // Расчет точки схождения в 2D проекции
        // Инерция тянет систему в сторону максимального дефицита или хаоса
        const x = (a - f) * (1 + e / 100);
        const y = (r - sync) * (1 - f / 200);

        // Индекс конвергенции: чем выше энтропия и ниже фундамент, тем быстрее "финал"
        const convergence = Math.round((e * 0.6 + (100 - f) * 0.4) * (1 - a / 250));

        // Определение доминирующего якоря судьбы
        let anchor: DomainType = 'foundation';
        const profiles = [
            { key: 'foundation' as DomainType, val: f },
            { key: 'agency' as DomainType, val: a },
            { key: 'money' as DomainType, val: r }
        ].sort((x, y) => x.val - y.val);
        anchor = profiles[0].key;

        const isDegenerative = e > 60 || f < 35;
        
        let fate = "Стабилизация текущего плато.";
        if (f < 30) fate = "Системный распад через утрату опор.";
        else if (a > 80 && e > 50) fate = "Термическая смерть через гипер-активность.";
        else if (r < 30) fate = "Ресурсное истощение и изоляция.";
        else if (sync < 40) fate = "Полная дезинтеграция Ум-Тело.";

        return {
            point: { x, y },
            convergenceRate: Math.min(100, convergence),
            anchorDomain: anchor,
            fateDescription: fate,
            isDegenerative
        };
    }
};
