
import { AnalysisResult, Translations, BeliefKey } from '../types';

const getTopItems = (arr: BeliefKey[], count: number): BeliefKey[] => {
    const frequency: Partial<Record<BeliefKey, number>> = {};
    arr.forEach(item => {
        if (item) frequency[item] = (frequency[item] || 0) + 1;
    });
    return (Object.entries(frequency) as [BeliefKey, number][])
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .slice(0, count)
        .map(entry => entry[0]);
};

const formatTemplate = (template: string, replacements: Record<string, string>): string => {
    let formatted = template;
    for (const key in replacements) {
        formatted = formatted.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
    }
    return formatted;
};

export const SessionPrepService = {
  generate(result: AnalysisResult, t: Translations): string[] {
    const questions: string[] = [];
    const templates = t.session_prep_templates;

    // --- PRIORITY 1: CRITICAL STATE (Foundation < 35) ---
    if (result.state.foundation < 35) {
        const topNegativePattern = getTopItems(result.activePatterns.filter(p => p !== 'default'), 1)[0];
        if (topNegativePattern) {
            questions.push(formatTemplate(templates.low_foundation_pattern, {
                pattern: t.beliefs[topNegativePattern] || topNegativePattern
            }));
        } else {
            questions.push(templates.low_foundation_generic);
        }
    }

    // --- PRIORITY 2: SOMATIC DISSONANCE ---
    if (result.somaticDissonance.length > 0) {
        const dissonantPattern = result.somaticDissonance[0];
        questions.push(formatTemplate(templates.somatic_dissonance, {
            pattern: t.beliefs[dissonantPattern] || dissonantPattern
        }));
    }

    // --- PRIORITY 3: ARCHETYPE SHADOW FOCUS ---
    const arch = t.archetypes[result.archetypeKey];
    if (arch && arch.shadow) {
        questions.push(formatTemplate(templates.default_archetype, {
            archetype_shadow: arch.shadow
        }));
    }

    // --- PRIORITY 4: INTERACTION / CONFLICT ---
    const topPatterns = getTopItems(result.activePatterns.filter(p => p !== 'default'), 2);
    if (topPatterns.length === 2 && questions.length < 3) {
        questions.push(formatTemplate(templates.pattern_interaction, {
            pattern1: t.beliefs[topPatterns[0]] || topPatterns[0],
            pattern2: t.beliefs[topPatterns[1]] || topPatterns[1]
        }));
    }

    // FALLBACKS
    const defaultTemplates = [templates.default_latency, templates.default_verdict];
    let defaultIndex = 0;
    while (questions.length < 3 && defaultIndex < defaultTemplates.length) {
        const question = formatTemplate(defaultTemplates[defaultIndex], {
            verdict_impact: t.verdicts[result.verdictKey]?.impact || '...'
        });
        if (!questions.includes(question)) {
            questions.push(question);
        }
        defaultIndex++;
    }

    return questions.slice(0, 3);
  }
};
