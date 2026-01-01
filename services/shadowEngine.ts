import { AnalysisResult, ArchetypeKey } from '../types';

export interface ShadowContract {
    archetype: ArchetypeKey;
    gain: string; // Вторичная выгода
    cost: string; // Системная цена
    logic: string; // Логика контракта
}

/**
 * ГЕНЕЗИС: Ядро Тени v1.0
 * Детерминированный анализ теневых структур (Ст. 1.1, 18.2)
 */
export const ShadowEngine = {
    decode(result: AnalysisResult): ShadowContract {
        const shadowArch = result.shadowArchetype?.key || 'THE_DRIFTER';
        const { foundation: f, agency: a, resource: r, entropy: e } = result.state;
        
        // Матрица теневых контрактов (Ст. 3.1)
        // Каждое условие — это детерминированный логический затвор
        let gainKey = 'default';
        
        if (f < 35 && a > 70) gainKey = 'protection_via_power';
        else if (r < 35 && f > 60) gainKey = 'purity_via_scarcity';
        else if (e > 70) gainKey = 'safety_via_chaos';
        else if (a < 35 && r > 60) gainKey = 'comfort_via_paralysis';
        else if (f > 80 && e < 20) gainKey = 'stagnation_via_order';

        const contracts: Record<string, any> = {
            protection_via_power: {
                gain: "Иллюзия всемогущества",
                cost: "Отсутствие реальных опор",
                logic: "Я создаю фасад силы, чтобы никто не увидел, как мне страшно внутри. Мой успех — это мой доспех, защищающий от уязвимости."
            },
            purity_via_scarcity: {
                gain: "Лояльность роду через нужду",
                cost: "Финансовое и ресурсное истощение",
                logic: "Если я стану богатым, я стану чужим для своих близких. Я выбираю дефицит, чтобы оставаться 'своим' и не чувствовать вины."
            },
            safety_via_chaos: {
                gain: "Избегание ответственности",
                cost: "Хроническая тревога и износ",
                logic: "В хаосе невозможно ничего планировать, а значит, с меня нельзя ничего спросить. Я прячусь за неопределенностью от реальных действий."
            },
            comfort_via_paralysis: {
                gain: "Гарантия отсутствия ошибок",
                cost: "Упущенные возможности и стагнация",
                logic: "Любое действие несет риск. Я выбираю не действовать, чтобы гарантированно не проиграть. Мой покой — это моя крепость."
            },
            stagnation_via_order: {
                gain: "Предсказуемость будущего",
                cost: "Утрата живой спонтанности",
                logic: "Я превращаю жизнь в ритуал, чтобы не встречаться с Хаосом. Я в безопасности, пока всё под контролем, но я мертв внутри."
            },
            default: {
                gain: "Сохранение текущего гомеостаза",
                cost: "Замедление психической эволюции",
                logic: "Психика удерживает текущее состояние как единственно безопасное. Изменения воспринимаются системой как угроза выживанию."
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