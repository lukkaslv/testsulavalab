import { Translations } from './types';
import { generateScenes } from './translations/scenes';
import { clinicalTranslations } from './translations/clinical';
import { uiTranslations } from './translations/ui';
import { resultsTranslations } from './translations/results';
import { proTranslations } from './translations/pro';
import { systemTranslations } from './translations/system';
import { modulesTranslations } from './translations/modules';

/**
 * Genesis OS Unified Localization Hub
 * Compliance: Art. 12 (Russian Sovereignty), Art. 21 (Simplicity)
 */
export const translations = {
  ru: {
    // 1. Clinical Data & Typology
    ...clinicalTranslations,
    
    // 2. Core UI & Logic (Consolidated uiTranslations handles interface needs)
    ...uiTranslations,
    
    // 3. Results & Roadmaps (Consolidated resultsTranslations)
    ...resultsTranslations,
    
    // 4. Specialist Tools & Hubs
    ...proTranslations,
    
    // 5. System Meta & Legal
    ...systemTranslations,
    
    // 6. Component-specific Modules
    ...modulesTranslations,
    
    // 7. Dynamic Content
    scenes: generateScenes(),
  } as unknown as Translations
};