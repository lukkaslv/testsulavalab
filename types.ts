
export type DomainType = 'foundation' | 'agency' | 'money' | 'social' | 'legacy';

export type ArchetypeKey = 
  | 'THE_ARCHITECT' 
  | 'THE_DRIFTER' 
  | 'THE_BURNED_HERO' 
  | 'THE_GOLDEN_PRISONER' 
  | 'THE_CHAOS_SURFER' 
  | 'THE_GUARDIAN';

export type BeliefKey = 
  | 'family_loyalty' | 'scarcity_mindset' | 'fear_of_punishment' | 'imposter_syndrome' | 'poverty_is_virtue'
  | 'hard_work_only' | 'self_permission' | 'fear_of_conflict' | 'betrayal_trauma' | 'unconscious_fear'
  | 'money_is_danger' | 'impulse_spend' | 'resource_toxicity' | 'short_term_bias' | 'capacity_expansion'
  | 'boundary_collapse' | 'shame_of_success' | 'hero_martyr' | 'latency_resistance' | 'body_mind_conflict'
  | 'ambivalence_loop' | 'autopilot_mode' | 'golden_cage' | 'money_is_tool' | 'default';

export type PhaseType = 'SANITATION' | 'STABILIZATION' | 'EXPANSION';

export type TaskKey = string;

export type VerdictKey = 
  | 'HEALTHY_SCALE' 
  | 'BRILLIANT_SABOTAGE' 
  | 'INVISIBILE_CEILING' 
  | 'LEAKY_BUCKET' 
  | 'PARALYZED_GIANT' 
  | 'FROZEN_POTENTIAL' 
  | 'CRITICAL_DEFICIT';

export class DataCorruptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataCorruptionError';
  }
}

export interface Choice {
  id: string;
  textKey: string;
  beliefKey: BeliefKey;
  position: number;
}

export interface ChoiceWithLatency extends Choice {
  latency: number;
}

export interface Scene {
  id: string;
  key: string;
  titleKey: string;
  descKey: string;
  intensity: number;
  choices: Choice[];
}

export interface GameHistoryItem {
  beliefKey: string;
  sensation: string;
  latency: number;
  nodeId: string;
  domain: DomainType;
  choicePosition: number;
}

export interface NeuralCorrelation {
  nodeId: string;
  domain: DomainType;
  type: 'resistance' | 'resonance';
  descriptionKey: string;
}

export interface SystemConflict {
  key: string;
  severity: 'high' | 'medium' | 'low';
  domain: DomainType;
}

export type MetricLevel = 'OPTIMAL' | 'STABLE' | 'STRAINED' | 'PROTECTIVE' | 'UNSTABLE';

export interface ClinicalWarning {
  type: string;
  severity: 'HIGH' | 'LOW';
  messageKey: string;
}

export interface AnalysisFlags {
  isAlexithymiaDetected: boolean;
  isSlowProcessingDetected: boolean;
  isNeuroSyncReliable: boolean;
  isSocialDesirabilityBiasDetected: boolean;
  processingSpeedCompensation: number;
  entropyType: 'NEUTRAL' | 'CREATIVE' | 'STRUCTURAL';
}

export interface PatternFlags {
    isMonotonic: boolean;
    isHighSkipRate: boolean;
    isFlatline: boolean;
    isRoboticTiming: boolean;
    isSomaticMonotony: boolean;
    isEarlyTermination: boolean;
    dominantPosition: number | null;
}

export interface IntegrityBreakdown {
  coherence: number;
  sync: number;
  stability: number;
  label: string;
  description: string;
  status: MetricLevel;
}

export interface ProtocolStep {
  day: number;
  phase: PhaseType;
  taskKey: TaskKey;
  targetMetricKey: string;
}

export interface Contradiction {
  type: string;
  nodeId: string;
  beliefKey: string;
  severity: number;
  description: string;
}

export interface AdaptiveState {
  clarity: number;
  contradictions: Contradiction[];
  isComplete: boolean;
  suggestedNextNodeId: string | null;
  confidenceScore: number;
}

export interface RawAnalysisResult {
  state: { foundation: number; agency: number; resource: number; entropy: number };
  integrity: number;
  capacity: number;
  entropyScore: number;
  neuroSync: number;
  systemHealth: number;
  phase: PhaseType;
  status: MetricLevel;
  validity: 'VALID' | 'SUSPICIOUS' | 'INVALID';
  activePatterns: BeliefKey[];
  correlations: NeuralCorrelation[];
  conflicts: SystemConflict[];
  somaticDissonance: BeliefKey[];
  somaticProfile: { blocks: number; resources: number; dominantSensation: string };
  integrityBreakdown: IntegrityBreakdown;
  clarity: number;
  confidenceScore: number;
  warnings: ClinicalWarning[];
  flags: AnalysisFlags;
  skippedCount: number;
}

export interface AnalysisResult extends RawAnalysisResult {
  timestamp: number;
  createdAt: number;
  shareCode: string;
  archetypeKey: ArchetypeKey;
  secondaryArchetypeKey?: ArchetypeKey;
  archetypeMatch: number;
  archetypeSpectrum: Array<{ key: ArchetypeKey; score: number }>;
  verdictKey: VerdictKey;
  lifeScriptKey: string;
  roadmap: ProtocolStep[];
  graphPoints: Array<{ x: number; y: number }>;
  interventionStrategy: string;
  coreConflict: string;
  shadowDirective: string;
  interferenceInsight?: string;
  patternFlags: PatternFlags;
}

export interface ScanHistory {
  scans: AnalysisResult[];
  latestScan: AnalysisResult | null;
  evolutionMetrics: {
    entropyTrend: number[];
    integrityTrend: number[];
    dates: string[];
  };
}

export interface SessionStep {
  phase: string;
  title: string;
  action: string;
}

export interface ClinicalNarrative {
  level1: {
    title: string;
    statusTag: string;
    summary: string;
    focusQuestion: string;
    tone: 'alert' | 'supportive';
    recommendation: string;
  };
  level2: {
    introduction: string;
    generalConfig: string;
    deepAnalysis: string;
    archetypeAnalysis: string;
    clinicalHypotheses: string;
    activePatterns: string;
    verdictAndRecommendations: string;
    resistanceProfile: string;
    behavioralMarkers: string;
    systemicRoot: string;
    therapeuticAlliance: string;
    shadowContract: string;
    sessionFlow: SessionStep[];
    clinicalProfile: string;
    mechanismAnalysis: string[];
    somaticMarkers: string;
    riskAssessment: string[];
    therapeuticEntry: string;
  };
}

// FIX: Added missing DomainRawConfig and DomainConfig used in constants.ts
export interface DomainRawConfig {
  key: DomainType;
  count: number;
  color: string;
}

export interface DomainConfig extends DomainRawConfig {
  startId: number;
}

// FIX: Added missing CompatibilityReport used in compatibilityEngine.ts
export interface CompatibilityReport {
  overallScore: number;
  domainSynergies: DomainType[];
  domainConflicts: DomainType[];
  recommendations: string[];
  relationshipType: 'Synergy' | 'Complementary' | 'Challenging' | 'Neutral';
  partnerArchetype: ArchetypeKey;
}

// FIX: Added missing TherapyHypothesis and ClinicalInterpretation used in clinicalDecoder.ts
export interface TherapyHypothesis {
    id: string;
    hypothesis: string;
    basedOn: string;
    focusForSession: string;
}

export interface ClinicalInterpretation {
    systemConfiguration: {
        title: string;
        description: string;
        limitingFactor: string;
    };
    deepMechanism: {
        title: string;
        analysis: string[];
    };
    metricInteractions: {
        farDescription: string;
        syncDescription: string;
    };
    archetypeClinical: {
        strategy: string;
        functionality: string;
        limit: string;
    };
    beliefImpact: string;
    hypotheses: TherapyHypothesis[];
    risks: string[];
    sessionEntry: string;
}

export interface Translations {
  subtitle: string;
  onboarding: Record<string, string>;
  invalid_results: Record<string, string>;
  boot_sequence: string[];
  ui: Record<string, string>;
  admin: Record<string, string>;
  guide: any;
  pro_guide: any;
  brief_explainer: Record<string, string>;
  clinical_decoder: any;
  global: Record<string, string>;
  sync: Record<string, string>;
  sensation_feedback: Record<string, string>;
  domains: Record<string, string>;
  dashboard: Record<string, string>;
  results: Record<string, string>;
  phases: Record<string, string>;
  tasks: Record<string, any>;
  scenes: Record<string, any>;
  beliefs: Record<string, string>;
  explanations: Record<string, string>;
  pattern_library: Record<string, { protection: string; cost: string; antidote: string }>;
  archetypes: Record<string, any>;
  verdicts: Record<string, any>;
  metric_definitions: Record<string, string>;
  conflicts: Record<string, string>;
  system_commentary: string[];
  auth_hint: string;
  legal_disclaimer: string;
  safety: Record<string, string>;
  session_prep_templates: Record<string, string>;
  synthesis_categories: Record<string, any>;
  synthesis: Record<string, any>;
  interventions: Record<string, any>;
  directives: Record<string, any>;
  interferences: Record<string, any>;
  correlation_types: Record<string, any>;
  integrity_audit: Record<string, any>;
}

declare global {
  interface Window {
    Telegram?: any;
    webkitAudioContext?: any;
  }
}
