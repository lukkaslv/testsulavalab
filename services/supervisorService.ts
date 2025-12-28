
import { AnalysisResult, Translations, BeliefKey, SupervisorPattern } from "../types";

/**
 * Genesis OS Supervisor Service v5.5 "Deterministic Monolith"
 * Focus: High-density Clinical Deep Dive (RU/KA Support)
 * Constitution Compliance: No runtime AI calls.
 */

export const SupervisorService = {
  async generateClinicalSupervision(result: AnalysisResult, lang: 'ru' | 'ka', t: Translations): Promise<string> {
    // Artificial slight delay for professional "processing" feel (purely UX)
    await new Promise(resolve => setTimeout(resolve, 1800)); 

    const { state, neuroSync, activePatterns, verdictKey, validity } = result;
    const f = state.foundation;
    const a = state.agency;
    const r = state.resource;
    const e = state.entropy;

    const isBreach = validity === 'BREACH' || state.entropy > 500;
    const patterns = t.clinical_narratives.supervisor_patterns;

    // --- EXPERT LOGIC: Pattern Selection Axis ---
    let patternKey: keyof typeof patterns = 'stable';
    
    if (f < 20 && e > 80) patternKey = 'burnout_protocol';
    else if (f < 35) patternKey = 'critical_foundation';
    else if (a > 80 && f < 45) patternKey = 'manic_defense';
    else if (a > 85 && r > 75 && f < 50) patternKey = 'narcissistic_expansion';
    else if (a < 35 && e > 45) patternKey = 'frozen_state';
    else if (neuroSync < 45) patternKey = 'dissociation';
    else if (activePatterns.includes('family_loyalty')) patternKey = 'systemic_loyalty';
    
    const pattern: SupervisorPattern = patterns[patternKey] || patterns.stable;

    const reportTitle = lang === 'ru' ? "**КЛИНИЧЕСКИЙ ДОКЛАД СУПЕРВИЗОРА**" : "**სუპერვაიზერის კლინიკური მოხსენება**";
    const headers = lang === 'ru' ? 
        ["1. Клиническая картина", "2. Прогнозируемые риски", "3. Терапевтическая ловушка", "4. Провокация (Интервенция)", "5. Динамика переноса", "6. Тактический план"] : 
        ["1. კლინიკური სურათი", "2. პროგნოზირებადი რისკები", "3. თერაპიული ხაფანგი", "4. პროვოკაცია (ინტერვენცია)", "5. გადაცემის დინამიკა", "6. ტაქტიკური გეგმა"];

    const getLongMonograph = (key: BeliefKey): string => {
        const p = t.pattern_library[key] || t.pattern_library.default;
        const b = t.beliefs[key] || key;
        return lang === 'ru' 
          ? `ПАТТЕРН: ${b.toUpperCase()}\n- Функция: ${p.protection}\n- Цена: ${p.cost}\n\n`
          : `პატერნი: ${b.toUpperCase()}\n- ფუნქცია: ${p.protection}\n- ფასი: ${p.cost}\n\n`;
    };

    let dossier = `${reportTitle}\n\n`;
    dossier += `ID: ${result.shareCode.substring(0,24)}\n`;
    dossier += `CORE_METRICS: F:${f} A:${a} R:${r} E:${e} SYNC:${neuroSync}\n\n`;

    if (isBreach) {
        dossier += lang === 'ru' ? "⚠️ СИГНАЛ СКРОМПРОМЕТИРОВАН (BREACH)\n\n" : "⚠️ სიგნალი კომპრომეტირებულია\n\n";
    }

    dossier += `**${headers[0]}:**\n${pattern.obs}\n\n`;
    dossier += `**${headers[1]}:**\n${pattern.risk}\n\n`;
    dossier += `**${headers[2]}:**\n${pattern.trap}\n\n`;
    dossier += `**${headers[3]}:**\n${pattern.provocation}\n\n`;
    dossier += `**${headers[4]}:**\n${pattern.transfer}\n\n`;
    dossier += `**${headers[5]}:**\n${pattern.tactics}\n\n`;

    dossier += lang === 'ru' ? "--- АКТИВНЫЕ ПАТТЕРНЫ ---\n" : "--- აქტიური პატერნები ---\n";
    if (activePatterns.length > 0) {
        activePatterns.forEach(p => { dossier += getLongMonograph(p); });
    } else {
        dossier += lang === 'ru' ? "Специфических паттернов не выявлено.\n" : "სპეციფიკური პატერნები არ არის გამოვლენილი.\n";
    }

    dossier += `\n--- VERDICT: ${t.verdicts[verdictKey]?.label || verdictKey} ---`;
    
    return dossier;
  }
};
