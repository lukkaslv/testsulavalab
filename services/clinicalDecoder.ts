import { AnalysisResult, ClinicalInterpretation, TherapyHypothesis, Translations } from '../types';

export const ClinicalDecoder = {
  decode(result: AnalysisResult, t: Translations): ClinicalInterpretation {
    const { state, neuroSync, activePatterns, archetypeKey, flags, sessionPulse } = result;
    const cd = t.clinical_decoder;
    const p = cd.provocations;
    const pt = t.pro_terminal;
    const ph = t.pro_hub;

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
    
    // 3. PRIORITY LOGIC (Centralized)
    let priority = pt.priority_stable;
    let priorityLevel: 'low' | 'medium' | 'high' = 'low';
    if (state.foundation < 30) {
        priority = pt.priority_critical_deficit;
        priorityLevel = 'high';
    } else if (state.agency > 80 && state.foundation < 40) {
        priority = pt.priority_manic_defense;
        priorityLevel = 'high';
    } else if (neuroSync < 40) {
        priority = pt.priority_dissociation;
        priorityLevel = 'medium';
    }


    // 4. DIFFERENTIAL MATRIX (Refined Weights v4.2)
    const diffProb: Record<string, number> = {
        narcissistic: Math.min(95, (state.agency * 0.65 + (100 - state.foundation) * 0.35)),
        borderline: Math.min(95, ((100 - state.foundation) * 0.7 + state.entropy * 0.3)),
        depressive: Math.min(95, ((100 - state.resource) * 0.6 + (100 - state.agency) * 0.4)),
        systemic: activePatterns.includes('family_loyalty') ? 92 : (100 - state.foundation) * 0.4 + 20
    };

    // 5. NEURAL HEATMAP
    const criticalNodes = (sessionPulse || [])
        .filter(n => n.zScore > 1.8 || (n.tension > 85 && n.isBlock))
        .map(n => n.id);

    // 6. HYPOTHESES GENERATION
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

    // 7. RISK PROFILE (for Dashboard)
    let riskLabel = ph.risk_level_nominal;
    let riskLevel: 'critical' | 'high' | 'nominal' = 'nominal';
    
    if (state.foundation < 35) {
        riskLabel = ph.risk_level_critical;
        riskLevel = 'critical';
    } else if (state.agency > 80 && state.foundation < 45) {
        riskLabel = ph.risk_level_high;
        riskLevel = 'high';
    } else if (state.entropy > 65) {
        riskLabel = ph.risk_level_high;
        riskLevel = 'high';
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
        priority,
        priorityLevel,
        riskProfile: {
            label: riskLabel,
            level: riskLevel
        },
        extra: {
            diffProb,
            criticalNodes,
            trapType,
            provocation
        }
    };
  }
};
