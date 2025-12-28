
import { AnalysisResult, ClinicalInterpretation, TherapyHypothesis, Translations } from '../types';

export const ClinicalDecoder = {
  decode(result: AnalysisResult, t: Translations): ClinicalInterpretation {
    const { state, neuroSync, archetypeKey, activePatterns, flags, sessionPulse } = result;
    const cd = t.clinical_decoder;
    const p = cd.provocations;

    // 1. EXPERT SYSTEM: CONFIGURATION DETECTION
    let configKey = 'balanced';
    
    if (state.agency >= 85 && state.foundation < 40) configKey = 'compensatory_overdrive';
    else if (state.foundation < 30) configKey = 'critical_deficit'; 
    else if (state.foundation < 45 && state.entropy < 35) configKey = 'economy_mode';
    else if (state.agency > 70 && state.foundation < 45) configKey = 'mobilization';
    else if (state.entropy > 55) {
        configKey = flags?.entropyType === 'CREATIVE' ? 'chaotic_creative' : 'chaotic';
    }
    else if (state.foundation > 75 && state.agency < 45) configKey = 'rigid';

    // 2. ALLIANCE SABOTAGE CALCULATION (Localized v5.0)
    let trapType = "OBSERVATIONAL";
    let provocation = "";

    if (state.agency > 80 && neuroSync < 50) {
        trapType = "INTELLECTUAL_SEDUCER";
        provocation = p.seducer;
    }
    else if (state.foundation < 35 && state.entropy > 60) {
        trapType = "ELUSIVE_SHADOW";
        provocation = p.shadow;
    }
    else if (state.agency > 85 && state.foundation > 70) {
        trapType = "GRANDIOSE_CRITIC";
        provocation = p.critic;
    }
    else if (neuroSync < 40) {
        trapType = "SOMATIC_WALL";
        provocation = p.wall;
    }

    // 3. DIFFERENTIAL MATRIX (Refined Weights v4.2)
    const diffProb: Record<string, number> = {
        narcissistic: Math.min(95, (state.agency * 0.65 + (100 - state.foundation) * 0.35)),
        borderline: Math.min(95, ((100 - state.foundation) * 0.7 + state.entropy * 0.3)),
        depressive: Math.min(95, ((100 - state.resource) * 0.6 + (100 - state.agency) * 0.4)),
        systemic: activePatterns.includes('family_loyalty') ? 92 : (100 - state.foundation) * 0.4 + 20
    };

    // 4. NEURAL HEATMAP
    const criticalNodes = (sessionPulse || [])
        .filter(n => n.zScore > 1.8 || (n.tension > 85 && n.isBlock))
        .map(n => n.id);

    // 5. HYPOTHESES GENERATION
    const hypotheses: TherapyHypothesis[] = [];
    const h = cd.common_hypotheses;
    
    if (configKey === 'compensatory_overdrive') {
        hypotheses.push({
            id: 'h_anes',
            hypothesis: h.anesthesia.h,
            basedOn: `ENT:${Math.round(state.entropy)} AGC:${Math.round(state.agency)}`,
            focusForSession: h.anesthesia.q
        });
    }
    if (state.foundation < 35) {
        hypotheses.push({
            id: 'h_srv',
            hypothesis: h.survival_priority.h,
            basedOn: `FND:${Math.round(state.foundation)}`,
            focusForSession: h.survival_priority.q
        });
    }

    return {
        systemConfiguration: {
            title: cd.configs[configKey]?.title || "Nominal",
            description: cd.configs[configKey]?.desc || "Normal functioning",
            limitingFactor: state.foundation < 35 ? "Foundation" : state.agency < 40 ? "Agency" : "Resource"
        },
        deepMechanism: {
            title: cd.headers.mechanism,
            analysis: [] 
        },
        metricInteractions: {
            farDescription: `F${Math.round(state.foundation)} A${Math.round(state.agency)} R${Math.round(state.resource)}`,
            syncDescription: cd.sync_patterns[neuroSync < 60 ? 'dissociation' : 'coherent']
        },
        archetypeClinical: {
            strategy: cd.archetype_strategies[archetypeKey]?.strategy || "Adaptive",
            functionality: cd.archetype_strategies[archetypeKey]?.func || "Preservation",
            limit: cd.archetype_strategies[archetypeKey]?.limit || "Growth"
        },
        beliefImpact: activePatterns.length > 0 ? activePatterns.map(p => t.beliefs[p] || p).join(", ") : "None detected",
        hypotheses,
        risks: state.foundation < 30 ? [cd.risks.decompensation] : [],
        sessionEntry: cd.session_entries[trapType.toLowerCase().split('_')[1]] || cd.session_entries.intellectual,
        extra: {
            diffProb,
            criticalNodes,
            trapType,
            provocation
        }
    };
  }
};
