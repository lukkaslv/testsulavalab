
import { AnalysisResult, ClinicalNarrative, SystemicVector, Intervention } from '../types';
import { translations } from '../translations';

type Lang = 'ru' | 'ka';

export function generateClinicalNarrative(result: AnalysisResult, lang: Lang): ClinicalNarrative {
    const t = translations[lang];
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
            origin: 'SYSTEMIC_LOYALTY', 
            strength: activePatterns.includes('family_loyalty') ? 92 : 65, 
            description: cn.systemic.loyalty_desc,
            proNote: cn.systemic.supervisor_note
        });
    }

    // --- INTERVENTIONS ---
    const interventions: Intervention[] = [];
    if (isCompensatory) interventions.push({ type: 'CONFRONTATION', text: cn.interventions.confrontation_1, purpose: 'Break armor' });
    else if (isBorderline) interventions.push({ type: 'SUPPORT', text: cn.interventions.support_1, purpose: 'Stabilize' });
    else interventions.push({ type: 'SYSTEMIC', text: cn.systemic.systemic_order_1, purpose: 'Boundary' });

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
        shadowContract = lang === 'ru' 
            ? "Я буду самым успешным клиентом, чтобы ты никогда не увидел, как я на самом деле мертв внутри."
            : "ვიქნები ყველაზე წარმატებული კლიენტი, რომ ვერასდროს დაინახო რამდენად მკვდარი ვარ შიგნიდან.";
    } else if (isBorderline && e > 50) {
        shadowContract = lang === 'ru'
            ? "Я разрушу всё, что ты построишь, чтобы доказать, что меня невозможно спасти."
            : "დავანგრევ ყველაფერს რასაც ააშენებ, რომ დავამტკიცო - ჩემი გადარჩენა შეუძლებელია.";
    }

    return {
        level1: {
            title: "CLINICAL SUMMARY",
            statusTag: cn.labels[profileKey === 'compensatory' ? 'armored' : profileKey === 'borderline' ? 'critical' : 'stable'],
            summary: cn.labels.stable,
            focusQuestion: p.hypo,
            tone: isBorderline ? 'alert' : 'supportive',
            recommendation: cn.labels.focus_somatic,
        },
        level2: {
            introduction: `🧬 GENESIS OS // SUPERVISOR DOSSIER v5.0 [${lang.toUpperCase()}]`,
            generalConfig: `System Profile: ${cn.labels[profileKey === 'compensatory' ? 'armored' : profileKey === 'borderline' ? 'critical' : 'stable']}`,
            psychodynamicProfile: p.p_profile,
            deepAnalysis: p.deep_expl,
            deepExpl: p.deep_expl,
            behaviorExpl: p.behavior,
            hypoExpl: p.hypo,
            interExpl: cn.interventions.confrontation_1,
            diffExpl: cn.diff_expl,
            validityExpl: cn.validity_expl, 
            archetypeAnalysis: `Dominant: ${archetypeKey}`,
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
                { phase: 'ENTRY', title: cn.steps.confrontation_func, action: cn.steps.confrontation_func_action },
                { phase: 'EXPLORATION', title: cn.steps.search_crack, action: cn.steps.search_crack_action }
            ],
            clinicalProfile: `F:${Math.round(f)} A:${Math.round(a)} R:${Math.round(r)} E:${Math.round(e)}`,
            systemicVectors, interventions, differentialHypotheses: diffMap.map(h => ({ label: h.label, probability: h.prob }))
        },
    };
}
