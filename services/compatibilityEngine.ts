
import { AnalysisResult, ArchetypeKey, VerdictKey, DomainType } from '../types';
import { SecurityCore } from '../utils/crypto';
import { SYSTEM_METADATA } from '../constants';

const ARCHETYPE_INDEX_MAP: ArchetypeKey[] = [
  'THE_ARCHITECT', 'THE_DRIFTER', 'THE_BURNED_HERO',
  'THE_GOLDEN_PRISONER', 'THE_CHAOS_SURFER', 'THE_GUARDIAN'
];

const VERDICT_INDEX_MAP: VerdictKey[] = [
  'HEALTHY_SCALE', 'BRILLIANT_SABOTAGE', 'INVISIBILE_CEILING',
  'LEAKY_BUCKET', 'PARALYZED_GIANT', 'FROZEN_POTENTIAL', 'CRITICAL_DEFICIT'
];

export const CompatibilityEngine = {
  analyzeCompatibility(_b1: AnalysisResult, b2: AnalysisResult) {
    return {
      overallScore: 0,
      domainSynergies: [],
      domainConflicts: [],
      recommendations: [],
      relationshipType: 'Neutral',
      partnerArchetype: b2.archetypeKey
    };
  },

  createSafeSkeleton(f: number, a: number, r: number, e: number): AnalysisResult {
      return {
          timestamp: Date.now(),
          createdAt: Date.now(),
          shareCode: "RECONSTRUCTED_V4",
          state: { foundation: f, agency: a, resource: r, entropy: e },
          domainProfile: { foundation: f, agency: a, money: r, social: 50, legacy: 50 }, // Default profile for skeleton
          integrity: Math.round(((f + a + r) / 3) * (1 - (e / 150))),
          capacity: Math.round((f + r) / 2),
          entropyScore: e,
          neuroSync: 100,
          systemHealth: Math.round(((f + a + r) / 3) * 0.6 + 100 * 0.4),
          phase: 'STABILIZATION',
          archetypeKey: 'THE_DRIFTER',
          archetypeMatch: 100,
          archetypeSpectrum: [{ key: 'THE_DRIFTER', score: 100 }],
          verdictKey: 'HEALTHY_SCALE',
          lifeScriptKey: 'imported_rescue',
          roadmap: [],
          graphPoints: [], // Will be recalculated by view if needed or leave empty
          status: 'OPTIMAL',
          validity: 'SUSPICIOUS',
          activePatterns: [],
          correlations: [],
          conflicts: [],
          somaticDissonance: [],
          somaticProfile: { blocks: 0, resources: 0, dominantSensation: 's0' },
          integrityBreakdown: { 
              coherence: 100, 
              sync: 100, 
              stability: f, 
              label: 'COLD_RECONSTRUCTION', 
              description: 'Manual recovery.', 
              status: 'STABLE' 
          },
          interventionStrategy: '', coreConflict: '', shadowDirective: '', clarity: 100, confidenceScore: 70, warnings: [],
          flags: { isAlexithymiaDetected: false, isSlowProcessingDetected: false, isNeuroSyncReliable: false, isSocialDesirabilityBiasDetected: false, processingSpeedCompensation: 1.0, entropyType: 'NEUTRAL', isL10nRiskDetected: false },
          patternFlags: { isMonotonic: false, isHighSkipRate: false, isFlatline: false, dominantPosition: null, isRoboticTiming: false, isSomaticMonotony: false, isEarlyTermination: false },
          skippedCount: 0, sessionPulse: [], context: 'NORMAL'
      };
  },

  decodeSmartCode(textInput: string): AnalysisResult | null {
    try {
        if (!textInput || textInput.length < 5) return null;
        
        let codeToDecode = textInput.trim();
        const idMatch = textInput.match(/(?:CLIENT ID|Share Code|CODE|ID):\s*([A-Za-z0-9+/=]+)/i);
        if (idMatch && idMatch[1]) codeToDecode = idMatch[1].trim();
        
        const sanitized = codeToDecode.replace(/[^A-Za-z0-9+/=]/g, '');
        if (!sanitized) return null;

        let toDecode = sanitized;
        const pad = toDecode.length % 4;
        if (pad === 2) toDecode += '==';
        else if (pad === 3) toDecode += '=';
        
        let decoded = '';
        try {
            decoded = atob(toDecode);
        } catch(e) { return null; }

        const partsRaw = decoded.split('#');
        const dataWithHeader = partsRaw[0];
        const sig = partsRaw[1];
        
        let data = dataWithHeader;
        let dataVersion = 'Legacy';
        
        if (dataWithHeader.includes('::')) {
            const split = dataWithHeader.split('::');
            dataVersion = split[0];
            data = split[1];
        }
        
        const isSignatureValid = sig && SecurityCore.generateChecksum(dataWithHeader) === sig;
        if (!isSignatureValid) return CompatibilityEngine.createBreachObject();

        const parts = data.split('|').map(Number);
        if (parts.length < 7 || parts.some(isNaN)) return null;

        let [f, a, r, e, archIdx, sync, verdictIdx] = parts;
        const isVersionMismatch = dataVersion !== SYSTEM_METADATA.LOGIC_VERSION;

        return {
            timestamp: Date.now(),
            createdAt: Date.now(),
            shareCode: sanitized,
            state: { foundation: f, agency: a, resource: r, entropy: e },
            domainProfile: { foundation: f, agency: a, money: r, social: 50, legacy: 50 }, // Approximate for legacy codes
            integrity: Math.round(((f + a + r) / 3) * (1 - (e / 150))),
            capacity: Math.round((f + r) / 2),
            entropyScore: e,
            neuroSync: sync,
            systemHealth: Math.round(((f + a + r) / 3) * 0.6 + sync * 0.4),
            phase: 'STABILIZATION',
            archetypeKey: ARCHETYPE_INDEX_MAP[archIdx] || 'THE_DRIFTER', 
            archetypeMatch: 100,
            archetypeSpectrum: [{ key: ARCHETYPE_INDEX_MAP[archIdx] || 'THE_DRIFTER', score: 100 }],
            verdictKey: VERDICT_INDEX_MAP[verdictIdx] || 'HEALTHY_SCALE', 
            lifeScriptKey: 'imported',
            roadmap: [],
            graphPoints: [], // Recalculated by view
            status: 'OPTIMAL',
            validity: 'VALID',
            activePatterns: [],
            correlations: [],
            conflicts: [],
            somaticDissonance: [],
            somaticProfile: { blocks: 0, resources: 0, dominantSensation: 's0' },
            integrityBreakdown: { 
                coherence: 100, 
                sync, 
                stability: f, 
                label: isVersionMismatch ? 'LEGACY_DATA' : 'SECURE_IMPORT', 
                description: '', 
                status: 'STABLE' 
            },
            interventionStrategy: '', coreConflict: '', shadowDirective: '', clarity: 100, confidenceScore: isVersionMismatch ? 85 : 100, warnings: [],
            flags: { isAlexithymiaDetected: false, isSlowProcessingDetected: false, isNeuroSyncReliable: true, isSocialDesirabilityBiasDetected: false, processingSpeedCompensation: 1.0, entropyType: 'NEUTRAL', isL10nRiskDetected: false },
            patternFlags: { isMonotonic: false, isHighSkipRate: false, isFlatline: false, dominantPosition: null, isRoboticTiming: false, isSomaticMonotony: false, isEarlyTermination: false },
            skippedCount: 0, sessionPulse: [], context: 'NORMAL'
        };
    } catch (e) {
        return null;
    }
  },

  createBreachObject(): AnalysisResult {
      return {
          timestamp: Date.now(), createdAt: Date.now(), shareCode: "BREACH",
          state: { foundation: 0, agency: 0, resource: 0, entropy: 999 },
          domainProfile: { foundation: 0, agency: 0, money: 0, social: 0, legacy: 0 },
          integrity: 0, capacity: 0, entropyScore: 999, neuroSync: 0, systemHealth: 0,
          phase: 'SANITATION', archetypeKey: 'THE_CHAOS_SURFER',
          archetypeMatch: 0, archetypeSpectrum: [], verdictKey: 'CRITICAL_DEFICIT',
          lifeScriptKey: 'breach', roadmap: [], graphPoints: [],
          status: 'UNSTABLE', validity: 'BREACH',
          activePatterns: [], correlations: [], conflicts: [], somaticDissonance: [], somaticProfile: { blocks: 0, resources: 0, dominantSensation: 's0' },
          integrityBreakdown: { coherence: 0, sync: 0, stability: 0, label: 'BREACH', description: 'FAIL', status: 'UNSTABLE' },
          interventionStrategy: '', coreConflict: '', shadowDirective: '', clarity: 0, confidenceScore: 0, warnings: [],
          flags: { isAlexithymiaDetected: false, isSlowProcessingDetected: false, isNeuroSyncReliable: false, isSocialDesirabilityBiasDetected: true, processingSpeedCompensation: 0, entropyType: 'STRUCTURAL', isL10nRiskDetected: false },
          patternFlags: { isMonotonic: true, isHighSkipRate: true, isFlatline: true, dominantPosition: 0, isRoboticTiming: true, isSomaticMonotony: true, isEarlyTermination: false },
          skippedCount: 0, sessionPulse: [], context: 'NORMAL'
      };
  }
};
