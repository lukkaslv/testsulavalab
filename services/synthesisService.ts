
import { AnalysisResult, ClinicalSynthesis, SynthesisInsight, Translations } from '../types';

/**
 * Genesis OS Synthesis Engine v1.0
 * Детерминированная матрица интерпретации (Art. 1.1)
 * Исключает AI-галлюцинации, работая на жестких логических правилах.
 */
export const SynthesisService = {
  generateSynthesis(result: AnalysisResult, t: Translations): ClinicalSynthesis {
    const s = t.synthesis;
    const { state, neuroSync } = result;
    const { foundation: f, agency: a, resource: r, entropy: e } = state;

    // Определение ключевого паттерна сопротивления (Art. 3.1)
    let coreKey: 'burnout_leak' | 'sabotage_control' | 'frozen_will' | 'manic_armor' | 'somatic_wall' | 'default' = 'default';

    if (a > 75 && f < 35) coreKey = 'manic_armor';
    else if (neuroSync < 40) coreKey = 'somatic_wall';
    else if (a > 70 && f < 45 && r < 40) coreKey = 'burnout_leak';
    else if (a > 80 && neuroSync < 55) coreKey = 'sabotage_control';
    else if (a < 35 && e > 60) coreKey = 'frozen_will';

    const coreTension: SynthesisInsight = {
        title: s.core_tension,
        icon: '⚡',
        analysis: s[`ct_${coreKey}`] || s.ct_default,
        recommendation: t.clinical_narratives.profiles[coreKey === 'manic_armor' ? 'compensatory' : coreKey === 'frozen_will' ? 'borderline' : 'neurotic']?.strategies || "Стабилизация"
    };

    const behavioralPrediction: SynthesisInsight = {
        title: s.behavioral_prediction,
        icon: '🔮',
        analysis: s[`bp_${coreKey}`] || s.bp_default,
        recommendation: t.clinical_narratives.profiles[coreKey === 'manic_armor' ? 'compensatory' : 'neurotic']?.behavior || "Наблюдение"
    };
    
    const therapeuticFocus: SynthesisInsight = {
        title: s.therapeutic_focus,
        icon: '🎯',
        analysis: s[`tf_${coreKey}`] || s.tf_default,
        recommendation: t.clinical_narratives.profiles[coreKey === 'manic_armor' ? 'compensatory' : 'neurotic']?.goal || "Рост"
    };

    return {
        coreTension,
        behavioralPrediction,
        therapeuticFocus,
        keyQuestion: s[`kq_${coreKey}`] || s.kq_default
    };
  }
};
