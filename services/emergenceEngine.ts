
import { AnalysisResult, EmergentPattern } from '../types';

/**
 * Emergence Engine v1.0
 * Обнаружение нелинейных свойств системы (Art. 7)
 * Исключает AI-интерпретации, работая на прецизионных затворах.
 */
export const EmergenceEngine = {
    detectPatterns(result: AnalysisResult): EmergentPattern[] {
        const { state, domainProfile, neuroSync: sync } = result;
        const { foundation: f, agency: a, entropy: e } = state;
        const patterns: EmergentPattern[] = [];

        // 1. "Стеклянная Колонна" (The Glass Pillar)
        if (a > 80 && f < 40) {
            patterns.push({
                id: 'glass_pillar',
                label: 'Стеклянная Колонна',
                description: 'Высокая дееспособность при отсутствии базовых опор.',
                intensity: Math.round((a + (100 - f)) / 2),
                impact: 'DECAY',
                clinicalNote: 'Риск мгновенной декомпенсации при малейшем стрессоре. Фасад успеха скрывает внутреннюю хрупкость.',
                indicators: ['agency', 'foundation']
            });
        }

        // 2. "Соматическая Стена" (The Somatic Wall)
        if (sync < 40 && e > 50) {
            patterns.push({
                id: 'somatic_wall',
                label: 'Соматическая Стена',
                description: 'Тотальный разрыв связи между умом и телом.',
                intensity: Math.round((100 - sync + e) / 2),
                impact: 'PROTECTION',
                clinicalNote: 'Эмоциональный опыт не усваивается. Вербальная терапия блокируется диссоциацией.',
                indicators: ['foundation', 'agency']
            });
        }

        // 3. "Мертвый Якорь" (The Dead Anchor)
        if (f > 80 && a < 40) {
            patterns.push({
                id: 'dead_anchor',
                label: 'Мертвый Якорь',
                description: 'Безопасность превращена в тюрьму.',
                intensity: Math.round((f + (100 - a)) / 2),
                impact: 'DECAY',
                clinicalNote: 'Паралич развития ради сохранения статус-кво. Лояльность прошлому убивает будущее.',
                indicators: ['foundation', 'legacy']
            });
        }

        // 4. "Теневой Резервуар" (Shadow Reservoir)
        if (domainProfile.money > 70 && e > 60) {
            patterns.push({
                id: 'shadow_reservoir',
                label: 'Теневой Резервуар',
                description: 'Ресурс системы питает внутренний хаос.',
                intensity: Math.round((domainProfile.money + e) / 2),
                impact: 'EVOLUTION',
                clinicalNote: 'В системе много энергии, но она тратится на обслуживание конфликтов, а не на рост.',
                indicators: ['money', 'social']
            });
        }

        return patterns.sort((x, y) => y.intensity - x.intensity);
    }
};
