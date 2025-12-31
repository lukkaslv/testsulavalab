
import { AnalysisResult, ClinicalNarrative, SystemicVector, Intervention } from '../types';
import { translations } from '@/translations';

export function generateClinicalNarrative(result: AnalysisResult): ClinicalNarrative {
    const t = translations.ru;
    const { state, neuroSync, activePatterns, archetypeKey, verdictKey, entropyScore } = result;
    const cn = t.clinical_narratives;

    const f = state.foundation;
    const a = state.agency;
    const r = state.resource;
    const e = entropyScore;

    // --- EXPERT LOGIC FOR PROFILE SELECTION ---
    const isCompensatory = a > 80 && f < 45;
    const isBorderline = f < 35;
    const isChaotic = e > 60;
    
    let profileKey: 'compensatory' | 'borderline' | 'neurotic' | 'chaotic' = 'neurotic';
    if (isChaotic) profileKey = 'chaotic';
    else if (isBorderline) profileKey = 'borderline';
    else if (isCompensatory) profileKey = 'compensatory';

    const p = cn.profiles[profileKey];

    // --- SYSTEMIC VECTORS ---
    const systemicVectors: SystemicVector[] = [];
    if (activePatterns.includes('family_loyalty') || f < 45) {
        systemicVectors.push({ 
            origin: 'СИСТЕМНАЯ ЛОЯЛЬНОСТЬ', 
            strength: activePatterns.includes('family_loyalty') ? 92 : 65, 
            description: cn.systemic.loyalty_desc,
            proNote: cn.systemic.supervisor_note
        });
    }

    // --- INTERVENTIONS ---
    const interventions: Intervention[] = [];
    if (isCompensatory) interventions.push({ type: 'КОНФРОНТАЦИЯ', text: cn.interventions.confrontation_1, purpose: 'Прорыв панциря' });
    else if (isBorderline) interventions.push({ type: 'ПОДДЕРЖКА', text: cn.interventions.support_1, purpose: 'Стабилизация' });
    else interventions.push({ type: 'СИСТЕМНОЕ', text: cn.systemic.systemic_order_1, purpose: 'Границы' });

    // --- DIFFERENTIAL DIAGNOSIS ---
    const diffMap = [
        { label: cn.diagnoses.affective, prob: neuroSync < 45 ? 0.85 : 0.15 },
        { label: cn.diagnoses.narcissistic, prob: a > 85 ? 0.85 : 0.1 },
        { label: cn.diagnoses.manic, prob: (a > 75 && f < 40) ? 0.9 : 0.05 },
        { label: cn.diagnoses.systemic, prob: activePatterns.includes('family_loyalty') ? 0.95 : 0.3 }
    ];

    // --- DYNAMIC SHADOW CONTRACT GENERATION ---
    let shadowContract = p.contract;
    if (isCompensatory && neuroSync < 50) {
        shadowContract = cn.shadow_contracts.compensatory_dissonance;
    } else if (isBorderline && e > 50) {
        shadowContract = cn.shadow_contracts.borderline_chaos;
    }

    return {
        level1: {
            title: "КЛИНИЧЕСКОЕ РЕЗЮМЕ",
            statusTag: cn.labels[profileKey === 'compensatory' ? 'armored' : profileKey === 'borderline' ? 'critical' : 'stable'],
            summary: cn.labels.stable,
            focusQuestion: p.hypo,
            tone: isBorderline ? 'alert' : 'supportive',
            recommendation: cn.labels.focus_somatic,
        },
        level2: {
            introduction: `🧬 GENESIS OS // ДОСЬЕ СУПЕРВИЗОРА v5.0 [RU]`,
            generalConfig: `Профиль Системы: ${cn.labels[profileKey === 'compensatory' ? 'armored' : profileKey === 'borderline' ? 'critical' : 'stable']}`,
            psychodynamicProfile: p.p_profile,
            deepAnalysis: p.deep_expl,
            deepExpl: p.deep_expl,
            behaviorExpl: p.behavior,
            hypoExpl: p.hypo,
            interExpl: cn.interventions.confrontation_1,
            diffExpl: cn.diff_expl,
            validityExpl: cn.validity_expl, 
            archetypeAnalysis: `Доминанта: ${archetypeKey}`,
            clinicalHypotheses: p.hypo,
            activePatterns: activePatterns.join(', '),
            verdictAndRecommendations: `${t.verdicts[verdictKey]?.label || verdictKey}`,
            resistanceProfile: p.behavior,
            behavioralMarkers: p.behavior,
            systemicRoot: cn.systemic.loyalty_desc,
            therapeuticAlliance: p.transference,
            shadowContract: shadowContract,
            evolutionGoal: p.goal, 
            shadowContractExpl: shadowContract, 
            evolutionProcess: p.process, 
            counterTransference: p.counter_transference, 
            primaryDefense: p.p_profile, 
            therapeuticTrap: p.trap, 
            fragilityPoint: p.fragility, 
            clinicalStrategy: p.strategies, 
            triggers: [], 
            blindSpots: [],
            sessionFlow: [
                { phase: 'ВХОД', title: cn.steps.confrontation_func, action: cn.steps.confrontation_func_action },
                { phase: 'ИССЛЕДОВАНИЕ', title: cn.steps.search_crack, action: cn.steps.search_crack_action }
            ],
            clinicalProfile: `F:${Math.round(f)} A:${Math.round(a)} R:${Math.round(r)} E:${Math.round(e)}`,
            systemicVectors, interventions, differentialHypotheses: diffMap.map(h => ({ label: h.label, probability: h.prob }))
        },
    };
}
