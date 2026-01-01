
import { DomainType, AnalysisResult } from '../types';

export interface РезультатМоделирования {
    состояние: Record<DomainType, number>;
    хаос: number;
    трение: number;
    рискДекомпенсации: number;
    ценаИзменений: number;
    вердикт: string;
}

/**
 * ЯДРО ИНТЕРВЕНЦИЙ ГЕНЕЗИС v1.0
 * Детерминированные законы взаимодействия психических сил.
 * Соответствие: Ст. 1.1, Ст. 19.2
 */
export const InterventionEngine = {
    рассчитатьОтклик(база: AnalysisResult, изменения: Record<DomainType, number>): РезультатМоделирования {
        const профиль = { ...изменения };
        let хаос = база.state.entropy;
        let связь = база.neuroSync;
        
        // Закон I: Давление на Волю при слабой Опоре рождает Хаос
        if (профиль.agency > база.domainProfile.foundation + 20) {
            const избыток = профиль.agency - база.domainProfile.foundation;
            хаос += избыток * 0.4;
        }

        // Закон II: Рост Опоры стабилизирует систему (снижает Хаос)
        if (профиль.foundation > база.domainProfile.foundation) {
            const прирост = профиль.foundation - база.domainProfile.foundation;
            хаос = Math.max(5, хаос - прирост * 0.3);
        }

        // Закон III: Диссоциация (Связь) увеличивает Трение
        const трение = Math.round((100 - связь) * 0.5 + хаос * 0.5);

        // Расчет риска декомпенсации (Ст. 17.1)
        const риск = Math.round((хаос * 0.6) + (Math.abs(профиль.agency - профиль.foundation) * 0.4));

        // Цена изменений - количество затрачиваемой психической энергии
        const цена = Math.round(Object.keys(профиль).reduce((acc, key) => {
            const delta = Math.abs(профиль[key as DomainType] - база.domainProfile[key as DomainType]);
            return acc + delta;
        }, 0) * (хаос / 50));

        let вердикт = "Система стабильна.";
        if (риск > 75) вердикт = "КРИТИЧЕСКИЙ РИСК СРЫВА: Нагрузка превышает прочность Опоры.";
        else if (риск > 50) вердикт = "ВЫСОКОЕ НАПРЯЖЕНИЕ: Требуется фаза стабилизации.";
        else if (цена > 100) вердикт = "ВЫСОКАЯ ЦЕНА: Изменения возможны, но потребуют много времени.";

        return {
            состояние: профиль,
            хаос: Math.min(95, Math.round(хаос)),
            трение,
            рискДекомпенсации: Math.min(100, риск),
            ценаИзменений: цена,
            вердикт
        };
    },

    ограничить(значение: number): number {
        return Math.max(5, Math.min(95, Math.round(значение)));
    }
};
