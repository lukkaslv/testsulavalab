
import { AnalysisResult, CompatibilityReport, DomainType, ArchetypeKey, VerdictKey } from '../types';
import { SecurityCore } from '../utils/crypto';

const ARCHETYPE_INDEX_MAP: ArchetypeKey[] = [
  'THE_ARCHITECT', 'THE_DRIFTER', 'THE_BURNED_HERO',
  'THE_GOLDEN_PRISONER', 'THE_CHAOS_SURFER', 'THE_GUARDIAN'
];

const VERDICT_INDEX_MAP: VerdictKey[] = [
  'HEALTHY_SCALE', 'BRILLIANT_SABOTAGE', 'INVISIBILE_CEILING',
  'LEAKY_BUCKET', 'PARALYZED_GIANT', 'FROZEN_POTENTIAL', 'CRITICAL_DEFICIT'
];

export const CompatibilityEngine = {
  analyzeCompatibility(b1: AnalysisResult, b2: AnalysisResult): CompatibilityReport {
    return {
      overallScore: 0,
      domainSynergies: [],
      domainConflicts: [],
      recommendations: [],
      relationshipType: 'Neutral',
      partnerArchetype: b2.archetypeKey
    };
  },

  decodeSmartCode(textInput: string): AnalysisResult | null {
    try {
        if (!textInput) return null;
        
        let codeToDecode = textInput.trim();
        const idMatch = textInput.match(/(?:CLIENT ID|Share Code|CODE|ID):\s*([A-Za-z0-9+/=]+)/i);
        if (idMatch && idMatch[1]) codeToDecode = idMatch[1].trim();
        
        const sanitized = codeToDecode.replace(/[^A-Za-z0-9+/=]/g, '');
        const decoded = atob(sanitized);
        
        // BLUE_TEAM CHECK: Split by signature anchor
        const [data, sig] = decoded.split('#');
        if (!data || !sig) return null; // Old format or tampered
        
        // 1. CHECKSUM VERIFICATION (First Line of Defense)
        if (SecurityCore.generateChecksum(data) !== sig) {
            console.error("BLUE_TEAM_ALERT: CODE_TAMPERING_DETECTED");
            return CompatibilityEngine.createBreachObject();
        }

        const parts = data.split('|').map(Number);
        if (parts.length < 7) return null;

        // Extract raw data from the code
        const [f, a, r, e, archIdx, sync, verdictIdx] = parts;

        // 2. THE "ICARUS" TRAP (Logic Verification)
        const isOutOfBounds = f > 100 || a > 100 || r > 100 || e > 100 || f < 0 || a < 0 || r < 0 || e < 0;
        const isMathematicallyImpossible = (f + a + r) > 292; 
        const isPerfectFake = f === 100 && a === 100 && r === 100 && e === 0;

        if (isOutOfBounds || isMathematicallyImpossible || isPerfectFake) {
             return CompatibilityEngine.createBreachObject();
        }

        // 3. ZERO TRUST RECALCULATION (Layer 2 Protection)
        const archetypeSpectrum = ([
          { key: 'THE_CHAOS_SURFER', score: e },
          { key: 'THE_DRIFTER', score: 100 - a },
          { key: 'THE_BURNED_HERO', score: (a + (100 - r)) / 2 },
          { key: 'THE_GOLDEN_PRISONER', score: (r + (100 - a)) / 2 },
          { key: 'THE_GUARDIAN', score: (f + (100 - a)) / 2 },
          { key: 'THE_ARCHITECT', score: (a + f + r) / 3 }
        ] as { key: ArchetypeKey; score: number }[]).sort((a, b) => b.score - a.score);
        
        const calculatedArchetypeKey = archetypeSpectrum[0].key;
        
        // 3.2 Recalculate Verdict
        let calculatedVerdictKey: VerdictKey = 'HEALTHY_SCALE';
        if (f <= 35) calculatedVerdictKey = 'CRITICAL_DEFICIT';
        else if (a > 75 && f < 45) calculatedVerdictKey = 'BRILLIANT_SABOTAGE';
        else if (f > 75 && a < 40) calculatedVerdictKey = 'INVISIBILE_CEILING';
        else if (r > 70 && e > 55) calculatedVerdictKey = 'LEAKY_BUCKET';
        else if (a < 35 && e > 45) calculatedVerdictKey = 'PARALYZED_GIANT';
        else if (f < 50 && a < 50 && r < 50 && e < 40) calculatedVerdictKey = 'FROZEN_POTENTIAL';

        // 3.3 Compare Provided vs Calculated
        const providedArchetypeKey = ARCHETYPE_INDEX_MAP[archIdx];
        const providedVerdictKey = VERDICT_INDEX_MAP[verdictIdx];
        
        let integrityStatus: 'VALID' | 'SUSPICIOUS' = 'VALID';
        
        if (providedArchetypeKey !== calculatedArchetypeKey || providedVerdictKey !== calculatedVerdictKey) {
            console.warn(`INTEGRITY MISMATCH: Provided [${providedVerdictKey}] != Calculated [${calculatedVerdictKey}]`);
            integrityStatus = 'SUSPICIOUS';
        }

        return {
            timestamp: Date.now(),
            createdAt: Date.now(),
            shareCode: sanitized,
            state: { foundation: f, agency: a, resource: r, entropy: e },
            integrity: Math.round(((f + a + r) / 3) * (1 - (e / 150))),
            capacity: Math.round((f + r) / 2),
            entropyScore: e,
            neuroSync: sync,
            systemHealth: Math.round(((f + a + r) / 3) * 0.6 + sync * 0.4),
            phase: 'STABILIZATION',
            archetypeKey: calculatedArchetypeKey,
            archetypeMatch: 100,
            archetypeSpectrum: [],
            verdictKey: calculatedVerdictKey, 
            lifeScriptKey: 'healthy_integration',
            roadmap: [],
            graphPoints: [{ x: 50, y: 50 - f / 2.5 }, { x: 50 + r / 2.2, y: 50 + r / 3.5 }, { x: 50 - a / 2.2, y: 50 + a / 3.5 }],
            status: f < 25 ? 'PROTECTIVE' : 'OPTIMAL',
            validity: integrityStatus,
            activePatterns: [],
            correlations: [],
            conflicts: [],
            somaticDissonance: [],
            somaticProfile: { blocks: 0, resources: 0, dominantSensation: 's0' },
            integrityBreakdown: { 
                coherence: integrityStatus === 'SUSPICIOUS' ? 50 : 100, 
                sync, 
                stability: f, 
                label: integrityStatus === 'SUSPICIOUS' ? 'SEMANTIC_MISMATCH' : 'SECURE_IMPORT', 
                description: integrityStatus === 'SUSPICIOUS' ? 'Recalculated from metrics.' : '', 
                status: 'STABLE' 
            },
            interventionStrategy: '',
            coreConflict: '',
            shadowDirective: '',
            clarity: 100,
            confidenceScore: integrityStatus === 'SUSPICIOUS' ? 0 : 100,
            warnings: [],
            flags: { 
                isAlexithymiaDetected: false, 
                isSlowProcessingDetected: false, 
                isNeuroSyncReliable: true, 
                isSocialDesirabilityBiasDetected: integrityStatus === 'SUSPICIOUS', 
                processingSpeedCompensation: 1.0, 
                entropyType: 'NEUTRAL', 
                isL10nRiskDetected: false 
            },
            patternFlags: { isMonotonic: false, isHighSkipRate: false, isFlatline: false, dominantPosition: null, isRoboticTiming: false, isSomaticMonotony: false, isEarlyTermination: false },
            skippedCount: 0,
            sessionPulse: [] // CRITICAL FIX: Add empty pulse for legacy codes
        };
    } catch (e) {
        return null;
    }
  },

  createBreachObject(): AnalysisResult {
      return {
          timestamp: Date.now(),
          createdAt: Date.now(),
          shareCode: "BREACH",
          state: { foundation: 0, agency: 0, resource: 0, entropy: 999 },
          integrity: 0, capacity: 0, entropyScore: 999, neuroSync: 0, systemHealth: 0,
          phase: 'SANITATION',
          archetypeKey: 'THE_CHAOS_SURFER',
          archetypeMatch: 0, archetypeSpectrum: [],
          verdictKey: 'CRITICAL_DEFICIT',
          lifeScriptKey: 'breach', roadmap: [], graphPoints: [],
          status: 'UNSTABLE',
          validity: 'BREACH',
          activePatterns: [], correlations: [], conflicts: [], somaticDissonance: [], somaticProfile: { blocks: 0, resources: 0, dominantSensation: 's0' },
          integrityBreakdown: { coherence: 0, sync: 0, stability: 0, label: 'BREACH', description: 'TAMPERING', status: 'UNSTABLE' },
          interventionStrategy: '', coreConflict: '', shadowDirective: '', clarity: 0, confidenceScore: 0, warnings: [],
          flags: { isAlexithymiaDetected: false, isSlowProcessingDetected: false, isNeuroSyncReliable: false, isSocialDesirabilityBiasDetected: true, processingSpeedCompensation: 0, entropyType: 'STRUCTURAL', isL10nRiskDetected: false },
          patternFlags: { isMonotonic: true, isHighSkipRate: true, isFlatline: true, dominantPosition: 0, isRoboticTiming: true, isSomaticMonotony: true, isEarlyTermination: false },
          skippedCount: 0,
          sessionPulse: [] // CRITICAL FIX
      };
  }
};
