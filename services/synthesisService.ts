import { AnalysisResult, ClinicalSynthesis, SynthesisInsight, Translations } from '../types';

const ICONS = {
    TENSION: '⚡',
    PREDICTION: '🔮',
    FOCUS: '🎯'
};

export const SynthesisService = {
  generateSynthesis(result: AnalysisResult, t: Translations): ClinicalSynthesis {
    const s = t.synthesis;
    let coreKey: 'burnout_leak' | 'sabotage_control' | 'frozen_will' | 'default' = 'default';

    // DETERMINISTIC LOGIC - Article 2 Compliance
    if (result.archetypeKey === 'THE_BURNED_HERO' && result.verdictKey === 'LEAKY_BUCKET') {
        coreKey = 'burnout_leak';
    } else if (result.archetypeKey === 'THE_ARCHITECT' && result.verdictKey === 'BRILLIANT_SABOTAGE') {
        coreKey = 'sabotage_control';
    } else if (result.state.foundation < 40 && result.verdictKey === 'FROZEN_POTENTIAL') {
        coreKey = 'frozen_will';
    }

    const coreTension: SynthesisInsight = {
        title: s.core_tension,
        icon: ICONS.TENSION,
        analysis: s[`ct_${coreKey}`],
        recommendation: `Investigate the secondary gains of this state.`
    };

    const behavioralPrediction: SynthesisInsight = {
        title: s.behavioral_prediction,
        icon: ICONS.PREDICTION,
        analysis: s[`bp_${coreKey}`],
        recommendation: `Observe for these patterns in session.`
    };
    
    const therapeuticFocus: SynthesisInsight = {
        title: s.therapeutic_focus,
        icon: ICONS.FOCUS,
        analysis: s[`tf_${coreKey}`],
        recommendation: `Align therapeutic contract with this vector.`
    };

    return {
        coreTension,
        behavioralPrediction,
        therapeuticFocus,
        keyQuestion: s[`kq_${coreKey}`]
    };
  }
};
