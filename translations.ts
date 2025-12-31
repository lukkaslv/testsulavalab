
import { Translations } from './types';
import { generateScenes } from './translations/scenes';
import { interfaceTranslations } from './translations/interface';
import { clinicalTranslations } from './translations/clinical';
import { uiTranslations } from './translations/ui';
import { resultsTranslations } from './translations/results';
import { proTranslations } from './translations/pro';
import { systemTranslations } from './translations/system';
import { modulesTranslations } from './translations/modules';

// Ст. 21 Оптимизация: Использование консолидированных пакетов с фоллбеками
export const translations = {
  ru: {
    ...interfaceTranslations,
    ...clinicalTranslations,
    // Поддержка устаревших ключей на этапе миграции
    ...uiTranslations,
    ...resultsTranslations,
    ...proTranslations,
    ...systemTranslations,
    ...modulesTranslations,
    scenes: generateScenes(),
    // Исправление: Двойное приведение типов для удовлетворения интерфейса Translations (Соответствие Ст. 28)
  } as unknown as Translations
};
