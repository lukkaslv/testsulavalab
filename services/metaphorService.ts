
import { AnalysisResult, DomainType } from '../types';

/**
 * Genesis OS Metaphor Engine v1.0
 * Combinatorial Determinism: 6^4 = 1296 unique clinical images.
 * Art. 1.1 (Deterministic), Art. 2 (No AI)
 */

const BLOCKS = {
    foundation: [
        { limit: 20, text: "Дом на болоте" },
        { limit: 40, text: "Треснувший фундамент" },
        { limit: 60, text: "Утоптанная тропа" },
        { limit: 80, text: "Каменный замок" },
        { limit: 95, text: "Корни векового дуба" },
        { limit: 101, text: "Стальное ядро" }
    ],
    agency: [
        { limit: 20, text: "с парусом в штиль," },
        { limit: 40, text: "с заржавевшим рулем," },
        { limit: 60, text: "с натянутой тетивой," },
        { limit: 80, text: "с мотором на пределе," },
        { limit: 95, text: "с лезвием хирурга," },
        { limit: 101, text: "с волей урагана," }
    ],
    resource: [
        { limit: 20, text: "в котором пересох колодец." },
        { limit: 40, text: "где воду носят решетом." },
        { limit: 60, text: "наполненный наполовину." },
        { limit: 80, text: "с полными закромами." },
        { limit: 95, text: "где бьет артезианский ключ." },
        { limit: 101, text: "превращающий всё в золото." }
    ],
    shadow: {
        THE_ARCHITECT: "Призрак порядка требует жертв.",
        THE_DRIFTER: "Ветер уносит семена будущего.",
        THE_BURNED_HERO: "Пепел ослепляет идущих за тобой.",
        THE_GOLDEN_PRISONER: "Клетка блестит ярче, чем солнце.",
        THE_CHAOS_SURFER: "Бездна смеется над твоей доской.",
        THE_GUARDIAN: "Двери закрыты снаружи и изнутри."
    }
};

export const MetaphorService = {
    synthesize(result: AnalysisResult): string {
        const { foundation: f, agency: a, resource: r } = result.state;
        const archetype = result.archetypeKey;

        const getBlock = (val: number, list: any[]) => list.find(b => val < b.limit)?.text || list[0].text;

        const part1 = getBlock(f, BLOCKS.foundation);
        const part2 = getBlock(a, BLOCKS.agency);
        const part3 = getBlock(r, BLOCKS.resource);
        const part4 = BLOCKS.shadow[archetype] || "Тень молчит.";

        return `${part1} ${part2} ${part3}\n\n[ШИФР ТЕНИ]: ${part4}`;
    }
};
