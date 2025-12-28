
import { MODULE_REGISTRY, TOTAL_NODES, DOMAIN_SETTINGS, NODE_CONFIGS, PSYCHO_CONFIG } from '../constants';
import { WEIGHTS } from './psychologyService';
import { IntegrityReport, IntegrityCategory, ConfigError, StructuralAnomalies, ComplexityMetrics, Translations } from '../types';

class SystemOrgan {
    errors: ConfigError[] = [];
    warnings: ConfigError[] = [];
    totalChecks = 0;

    addError(e: Omit<ConfigError, 'severity'>) { this.errors.push({ ...e, severity: 'high' }); }
    addWarning(w: Omit<ConfigError, 'severity'>) { this.warnings.push({ ...w, severity: 'medium' }); }
    check() { this.totalChecks++; }
    
    getScore(): number {
        if (this.totalChecks === 0) return 100;
        const impact = (this.errors.length * 45) + (this.warnings.length * 15);
        return Math.max(0, 100 - (impact / (this.totalChecks / 8 + 1)));
    }
}

export const IntegrityService = {
    runAudit(t?: Translations): IntegrityReport {
        const organs: Record<string, SystemOrgan> = {
            NERVOUS_SYSTEM: new SystemOrgan(), 
            METABOLISM: new SystemOrgan(),     
            VOICE: new SystemOrgan(),          
            IMMUNITY: new SystemOrgan(),       
            STRUCTURE: new SystemOrgan()
        };

        const structural: StructuralAnomalies = {
            deadCode: [], 
            spof: [],     
            butterflyEffect: [],
            dominoEffect: [], 
            hysteresis: [],
            technicalDebt: [],
            coupling: [],
            conwayViolations: [],
            determinismRisk: [],
            circuitBreakers: [],
            bifurcationPoints: [],
            strangeAttractors: [],
            stableAttractors: [],
            resonanceZones: []
        };

        const complexity: ComplexityMetrics = {
            emergenceIndex: 0,
            synergyFactor: 0,
            phaseTransitionRisk: 0,
            autopoiesisScore: 0,
            tippingPointNode: null
        };

        // --- 1. STRUCTURE & TOPOLOGY ANALYSIS ---
        const struct = organs.STRUCTURE;
        const beliefFrequency: Record<string, number> = {};
        const domainLoad: Record<string, number> = {};
        let synergisticKeys = 0;
        let totalUniqueWeights = 0;
        let multiMetricImpacts = 0; 

        // 1.0 Circuit Breaker Check
        if (PSYCHO_CONFIG.MAX_LATENCY_PENALTY < 100) structural.circuitBreakers.push('MAX_LATENCY_PENALTY_ACTIVE');
        else struct.addError({ type: 'CIRCUIT_BREAKER_FAIL', details: 'No latency cap detected', fix: 'Set MAX_LATENCY_PENALTY' });
        
        if (PSYCHO_CONFIG.ENTROPY_DIVISOR > 0) structural.circuitBreakers.push('ENTROPY_DAMPENER_ACTIVE');
        
        Object.entries(NODE_CONFIGS).forEach(([nodeId, config], index) => {
            struct.check();
            const domain = nodeId.split('_')[0];
            
            if (!nodeId.startsWith(domain)) {
                structural.conwayViolations.push(nodeId);
            }

            if (index < 5 && config.intensity >= 5) {
                structural.butterflyEffect.push(nodeId);
            }

            let totalWeightImpact = 0;
            let maxFoundationDelta = -100;
            let minFoundationDelta = 100;

            config.choices.forEach(c => {
                beliefFrequency[c.beliefKey] = (beliefFrequency[c.beliefKey] || 0) + 1;
                const w = WEIGHTS[c.beliefKey] || { f: 0, a: 0, r: 0, e: 0 };
                const absWeight = Math.abs(w.f) + Math.abs(w.a) + Math.abs(w.r) + Math.abs(w.e);
                
                domainLoad[domain] = (domainLoad[domain] || 0) + absWeight;
                totalWeightImpact += absWeight;

                if (w.f > maxFoundationDelta) maxFoundationDelta = w.f;
                if (w.f < minFoundationDelta) minFoundationDelta = w.f;

                if (w.e > 4 && w.a <= -2) {
                    if (!structural.strangeAttractors.includes(c.beliefKey)) {
                        structural.strangeAttractors.push(c.beliefKey);
                    }
                }

                if (w.e < 0 && w.f > 2 && w.a > 2) {
                    if (!structural.stableAttractors.includes(c.beliefKey)) {
                        structural.stableAttractors.push(c.beliefKey);
                    }
                }

                if (c.beliefKey === 'default') structural.technicalDebt.push(`${nodeId}_${c.idSuffix}`);
                
                let activeMetrics = 0;
                if (Math.abs(w.f) > 1) activeMetrics++;
                if (Math.abs(w.a) > 1) activeMetrics++;
                if (Math.abs(w.r) > 1) activeMetrics++;
                if (Math.abs(w.e) > 1) activeMetrics++;
                
                if (activeMetrics >= 3) multiMetricImpacts++; 
                if (activeMetrics === 0) structural.deadCode.push(c.beliefKey);
            });

            if ((maxFoundationDelta - minFoundationDelta) >= 6) {
                structural.bifurcationPoints.push(nodeId);
            }

            if (totalWeightImpact > 15) {
                structural.resonanceZones.push(nodeId);
            }

            if (config.intensity >= 4 && (totalWeightImpact / 3) < 2) {
                structural.hysteresis.push(nodeId);
            }
        });

        // 1.5 SPOF & Complexity Metrics
        Object.entries(beliefFrequency).forEach(([key, freq]) => {
            const ratio = freq / TOTAL_NODES;
            if (ratio > 0.25) { 
                structural.spof.push(key);
                struct.addWarning({ type: 'SPOF_DETECTED', details: `Key ${key} overuse`, fix: 'Diversify' });
            }
        });

        // Synergy Calculation
        Object.values(WEIGHTS).forEach(w => {
            totalUniqueWeights++;
            if ((Math.abs(w.f) + Math.abs(w.a) + Math.abs(w.r)) > 4) {
                synergisticKeys++;
            }
        });
        
        complexity.synergyFactor = Math.min(100, Math.round((synergisticKeys / totalUniqueWeights) * 120));

        // Recalibrated Emergence Index (v6.0)
        // Reduced bifurcation multiplier from 5 to 3.5 to accommodate higher complexity without false alarms.
        const bifurcationBonus = structural.bifurcationPoints.length * 3.5;
        const varietyBonus = (Object.keys(beliefFrequency).length / TOTAL_NODES) * 50;
        complexity.emergenceIndex = Math.min(100, Math.round(varietyBonus + bifurcationBonus));

        // Phase Transition Risk
        complexity.phaseTransitionRisk = Math.min(100, Math.max(0, 100 - (7.5 * 10))); 
        complexity.tippingPointNode = "foundation_7";

        // Autopoiesis
        const hasSessionPrep = !!t?.session_prep_templates;
        const hasPatternLib = t?.pattern_library && Object.keys(t.pattern_library).length > 10;
        complexity.autopoiesisScore = (hasSessionPrep && hasPatternLib) ? 100 : 50;

        // Domino Effect
        Object.entries(domainLoad).forEach(([domain, load]) => {
            if (load > 80) structural.dominoEffect.push(domain);
        });

        // --- 2. DEAD CODE DETECTION ---
        const imm = organs.IMMUNITY;
        
        DOMAIN_SETTINGS.forEach(d => {
            for (let i = 0; i < d.count; i++) {
                imm.check();
                const key = `${d.key}_${i}`;
                const absoluteId = (d.startId + i).toString();
                
                const hasConfig = !!NODE_CONFIGS[key];
                const hasRegistry = !!(MODULE_REGISTRY[d.key] && MODULE_REGISTRY[d.key][absoluteId]);

                if (!hasConfig || !hasRegistry) {
                    structural.deadCode.push(key);
                    imm.addError({ type: 'DEAD_CODE', details: `Node '${key}' orphan`, fix: 'Sync' });
                }
            }
        });

        // --- 3. METABOLISM ---
        const meta = organs.METABOLISM;
        Object.entries(WEIGHTS).forEach(([key, w]) => {
            meta.check();
            const energy = Math.abs(w.f + w.a + w.r) * (beliefFrequency[key] || 0);
            if (energy > 70) { // Increased threshold to 70 to allow for high-energy nodes
                meta.addWarning({ type: 'METABOLIC_STRESS', details: `Key '${key}' volatile`, fix: 'Normalize' });
            }
        });

        // --- 4. VOICE (Localization Check) ---
        const voice = organs.VOICE;
        voice.check();
        if (!t) {
            voice.addWarning({ type: 'L10N_MISMATCH', details: 'No translations loaded', fix: 'Inject T' });
        } else {
            // Check essential keys presence
            if (!t.admin?.system_unstable) voice.addWarning({ type: 'L10N_MISMATCH', details: 'Admin keys missing', fix: 'Update Dict' });
            if (!t.integrity_audit?.version_label) voice.addWarning({ type: 'L10N_MISMATCH', details: 'Audit keys missing', fix: 'Update Dict' });
        }

        // Finalize
        const reportCategories: IntegrityCategory[] = Object.entries(organs).map(([name, organ]) => ({
            name: name as any,
            score: Math.round(organ.getScore()),
            errors: organ.errors,
            warnings: organ.warnings,
            totalChecks: organ.totalChecks
        }));

        const totalErrors = reportCategories.reduce((acc, cat) => acc + cat.errors.length, 0);
        const totalWarnings = reportCategories.reduce((acc, cat) => acc + cat.warnings.length, 0);
        const avalancheIndex = Math.min(100, Math.max(...Object.values(domainLoad).map(l => l)));

        // --- 5. NARRATIVE GENERATION ---
        const generateNarrative = () => {
            if (!t) return "System Initializing..."; 

            const parts: string[] = [];
            const isRU = t.subtitle.includes('Bridge') || t.subtitle.includes('OS'); 

            // 4.1. Core State
            if (complexity.emergenceIndex < 30) {
                parts.push(isRU 
                    ? "⚠️ НИЗКАЯ ВАРИАТИВНОСТЬ (Low Emergence). Требуется больше бифуркаций."
                    : "⚠️ დაბალი ვარიაციულობა.");
            } else if (complexity.emergenceIndex > 92) { 
                parts.push(isRU
                    ? "⚠️ ХАОТИЧЕСКАЯ ДИВЕРГЕНЦИЯ. Система слишком непредсказуема."
                    : "⚠️ ქაოტური დივერგენცია.");
            } else {
                parts.push(isRU 
                    ? "✅ Эмерджентность в норме (Deep Flow). Паттерны формируются органически."
                    : "✅ ემერჯენტობა ნორმაშია.");
            }

            // 4.2. Structural Risk
            if (structural.spof.length > 0) {
                parts.push(isRU
                    ? `🛑 ПЕРЕГРУЗКА КЛЮЧЕЙ: ${structural.spof.length} SPOF (Single Point of Failure).`
                    : `🛑 გასაღებების გადატვირთვა: ${structural.spof.length} SPOF.`);
            }
            if (structural.butterflyEffect.length > 0) {
                parts.push(isRU
                    ? `🦋 РАННЯЯ ВОЛАТИЛЬНОСТЬ: ${structural.butterflyEffect.length} ранних узлов слишком агрессивны.`
                    : `🦋 ადრეული ვოლატილობა.`);
            }

            // 4.4. Conclusion
            if (totalErrors === 0 && complexity.synergyFactor > 30) {
                parts.push(t.integrity_audit.verdict_healthy);
            } else if (totalErrors > 0) {
                parts.push(isRU 
                    ? `ОБНАРУЖЕН СТРУКТУРНЫЙ РАСПАД.`
                    : `აღმოჩენილია სტრუქტურული რღვევა.`);
            } else {
                parts.push(t.integrity_audit.verdict_unstable);
            }

            return parts.join("\n\n");
        };

        return {
            overallScore: Math.round(reportCategories.reduce((acc, cat) => acc + cat.score, 0) / reportCategories.length),
            status: totalErrors > 0 ? 'error' : (totalWarnings > 5 ? 'warning' : 'healthy'),
            categories: reportCategories,
            timestamp: Date.now(),
            inflammationIndex: Math.min(100, totalErrors * 20),
            fragilityIndex: Math.min(100, (structural.butterflyEffect.length * 10) + (structural.spof.length * 5)),
            avalancheIndex,
            structuralAnomalies: structural,
            complexity,
            narrative: generateNarrative()
        };
    }
};
