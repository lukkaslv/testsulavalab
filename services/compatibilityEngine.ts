
import { AnalysisResult, ArchetypeKey, VerdictKey, GameHistoryItem, DomainType } from '../types';
import { SecurityCore } from '../utils/crypto';
import { ALL_BELIEFS } from '../constants';

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

  /**
   * Art. 19.2: Emergency Reconstruction for Clinical Use
   */
  createSafeSkeleton(f: number, a: number, r: number, e: number, archIdx: number = 0): AnalysisResult {
      const primaryArch = ARCHETYPE_INDEX_MAP[archIdx] || 'THE_ARCHITECT';
      return {
          timestamp: Date.now(),
          createdAt: Date.now(),
          shareCode: `MASTER_RECON_V11_${Date.now().toString(36)}`,
          state: { foundation: f, agency: a, resource: r, entropy: e },
          domainProfile: { foundation: f, agency: a, money: r, social: 50, legacy: 50 }, 
          integrity: Math.round(((f + a + r) / 3) * (1 - (e / 150))),
          capacity: Math.round((f + r) / 2),
          entropyScore: e,
          neuroSync: 100,
          systemHealth: Math.round(((f + a + r) / 3) * 0.6 + 100 * 0.4),
          phase: f < 35 ? 'SANITATION' : 'STABILIZATION',
          archetypeKey: primaryArch,
          archetypeMatch: 100,
          archetypeSpectrum: [{ key: primaryArch, score: 100 }],
          refraction: [{ 
              key: primaryArch, 
              match: 100, 
              description: 'Первичная ось реконструкции' 
          }],
          verdictKey: 'HEALTHY_SCALE',
          lifeScriptKey: 'imported_master',
          roadmap: [],
          graphPoints: [], 
          status: 'OPTIMAL',
          validity: 'VALID',
          activePatterns: [],
          correlations: [],
          conflicts: [],
          somaticDissonance: [],
          somaticProfile: { blocks: 0, resources: 0, dominantSensation: 's0' },
          integrityBreakdown: { 
              coherence: 100, 
              sync: 100, 
              stability: f, 
              label: 'MASTER_TRACE', 
              description: 'Экстренное клиническое восстановление.', 
              status: 'STABLE' 
          },
          interventionStrategy: '', coreConflict: '', shadowDirective: '', clarity: 100, confidenceScore: 100, warnings: [],
          flags: { isAlexithymiaDetected: false, isSlowProcessingDetected: false, isNeuroSyncReliable: true, isSocialDesirabilityBiasDetected: false, processingSpeedCompensation: 1.0, entropyType: 'NEUTRAL', isL10nRiskDetected: false },
          patternFlags: { isMonotonic: false, isHighSkipRate: false, isFlatline: false, dominantPosition: null, isRoboticTiming: false, isSomaticMonotony: false, isEarlyTermination: false },
          history: [],
          butterflySensitivity: 0,
          skippedCount: 0, sessionPulse: [], context: 'NORMAL',
          // FIX: Added missing 'entropyFlux' property to satisfy AnalysisResult interface (Art. 19.2)
          entropyFlux: [],
          // FIX: Added missing 'fractures' property to satisfy AnalysisResult interface requirements
          fractures: []
      };
  },

  /**
   * Генерирует массив из 50 узлов истории для тестирования максимального объема досье.
   */
  generateStressHistory(): GameHistoryItem[] {
      const history: GameHistoryItem[] = [];
      const domains: DomainType[] = ['foundation', 'agency', 'money', 'social', 'legacy'];
      
      for(let i = 0; i < 50; i++) {
          const domain = domains[i % domains.length];
          const belief = ALL_BELIEFS[i % ALL_BELIEFS.length];
          // Имитируем паттерн сопротивления (чередование длинных и коротких пауз)
          const latency = i % 7 === 0 ? 4500 : 1100 + (Math.random() * 500);
          const sensation = i % 5 === 0 ? 's4' : i % 3 === 0 ? 's1' : 's0';
          
          history.push({
              nodeId: i.toString(),
              domain,
              beliefKey: belief,
              latency,
              sensation,
              choicePosition: i % 3
          });
      }
      return history;
  },

  createBreachObject(): AnalysisResult {
    const skeleton = this.createSafeSkeleton(0, 0, 0, 100);
    return {
      ...skeleton,
      shareCode: 'BREACH_DETECTED',
      validity: 'BREACH',
      status: 'BREACH',
    };
  },

  decodeSmartCode(textInput: string): AnalysisResult | null {
    try {
        if (!textInput || textInput.length < 5) return null;
        
        const cleanInput = textInput.trim();

        // --- MASTER OVERRIDE PROTOCOLS ---
        if (cleanInput === 'SOVEREIGN_TRACE_ALPHA') return this.createSafeSkeleton(85, 75, 80, 10, 0);
        if (cleanInput === 'SOVEREIGN_TRACE_BETA') return this.createSafeSkeleton(40, 95, 30, 45, 2);
        if (cleanInput === 'SOVEREIGN_TRACE_GAMMA') return this.createSafeSkeleton(25, 30, 15, 85, 4);

        // --- STRESS TEST 20K PROTOCOL ---
        if (cleanInput === 'FORENSIC_MAX_LOAD_STRESS_2026') {
            const result = this.createSafeSkeleton(28, 88, 35, 72, 2); // Срыв в манию
            result.history = this.generateStressHistory();
            result.neuroSync = 32;
            result.verdictKey = 'BRILLIANT_SABOTAGE';
            result.validity = 'VALID';
            result.shareCode = 'STRESS_TEST_V13_FULL_LOAD';
            return result;
        }

        // --- FORENSIC BYPASS PROTOCOL ---
        const isBypassed = cleanInput.startsWith('BYPASS_');
        const processingText = isBypassed ? cleanInput.replace('BYPASS_', '') : cleanInput;
        const sanitized = processingText.replace(/[\s\u200B-\u200D\uFEFF]/g, '');
        
        const base64Regex = /[A-Za-z0-9+/=]{10,}/;
        const match = sanitized.match(base64Regex);
        if (!match) return null;
        
        const codeToDecode = match[0];
        let decoded = '';
        try {
            decoded = atob(codeToDecode);
        } catch(e) { return null; }

        const partsRaw = decoded.split('#');
        if (partsRaw.length < 2) return null;

        const dataWithHeader = partsRaw[0];
        const sig = partsRaw[1];
        const expectedSig = SecurityCore.generateChecksum(dataWithHeader);
        
        if (sig !== expectedSig && !isBypassed) {
            return this.createBreachObject();
        }

        const headerSplit = dataWithHeader.split('::');
        if (headerSplit.length < 2) return null;

        const data = headerSplit[1];
        const parts = data.split('|').map(Number);
        if (parts.length < 7 || parts.some(isNaN)) return null;

        let [f, a, r, e, archIdx, sync, verdictIdx] = parts;

        const skeleton = this.createSafeSkeleton(f, a, r, e, archIdx);
        return {
            ...skeleton,
            shareCode: codeToDecode,
            neuroSync: sync,
            verdictKey: VERDICT_INDEX_MAP[verdictIdx] || 'HEALTHY_SCALE',
            lifeScriptKey: 'imported'
        };
    } catch (err) {
      return null;
    }
  }
};
