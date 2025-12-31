
import { AnalysisResult, ArchetypeKey } from '../types';

export interface ShadowContract {
    archetype: ArchetypeKey;
    gain: string; // Вторичная выгода
    cost: string; // Системная цена
    logic: string; // Логика контракта
}

/**
 * Genesis OS Shadow Engine v1.0
 * Детерминированный анализ теневых структур (Art. 1.1)
 */
export const ShadowEngine = {
    decode(result: AnalysisResult): ShadowContract {
        const shadowArch = result.shadowArchetype?.key || 'THE_DRIFTER';
        const { foundation: f, agency: a, resource: r, entropy: e } = result.state;
        
        // Матрица теневых контрактов (Art. 3.1)
        // Каждое условие — это детерминированный логический затвор
        let gainKey = 'default';
        if (f < 35 && a > 70) gainKey = 'protection_via_power';
        else if (r < 35 && f > 60) gainKey = 'purity_via_scarcity';
        else if (e > 70) gainKey = 'safety_via_chaos';
        else if (a < 35 && r > 60) gainKey = 'comfort_via_paralysis';

        const contracts: Record<string, any> = {
            protection_via_power: {
                gain: "Иллюзия всемогущества",
                cost: "Отсутствие реальных опор",
                logic: "Я создаю фасад силы, чтобы никто не увидел, как мне страшно внутри. Мой успех — это мой доспех."
            },
            purity_via_scarcity: {
                gain: "Сохранение лояльности роду",
                cost: "Финансовое истощение",
                logic: "Если я стану богатым, я стану чужим для своих близких. Я выбираю дефицит, чтобы оставаться 'своим'."
            },
            safety_via_chaos: {
                gain: "Избегание ответственности",
                cost: "Постоянная тревога",
                logic: "В хаосе невозможно ничего планировать, а значит, с меня нельзя ничего спросить. Я прячусь за неопределенностью."
            },
            comfort_via_paralysis: {
                gain: "Гарантия стабильности",
                cost: "Упущенная жизнь",
                logic: "Любое действие несет риск. Я выбираю не действовать, чтобы гарантированно не проиграть."
            },
            default: {
                gain: "Сохранение гомеостаза",
                cost: "Замедление эволюции",
                logic: "Психика удерживает текущее состояние как единственно безопасное, даже если оно дефицитарно."
            }
        };

        const contract = contracts[gainKey];

        return {
            archetype: shadowArch,
            gain: contract.gain,
            cost: contract.cost,
            logic: contract.logic
        };
    }
};
