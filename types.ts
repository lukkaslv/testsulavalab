
export type DomainType = 'foundation' | 'agency' | 'money' | 'social' | 'legacy';

export type BeliefKey = 
  | 'family_loyalty' | 'scarcity_mindset' | 'fear_of_punishment' | 'imposter_syndrome' 
  | 'poverty_is_virtue' | 'hard_work_only' | 'self_permission' | 'fear_of_conflict' 
  | 'betrayal_trauma' | 'unconscious_fear' | 'money_is_danger' | 'impulse_spend' 
  | 'resource_toxicity' | 'short_term_bias' | 'capacity_expansion' | 'boundary_collapse' 
  | 'shame_of_success' | 'hero_martyr' | 'latency_resistance' | 'body_mind_conflict' 
  | 'ambivalence_loop' | 'autopilot_mode' | 'golden_cage' | 'money_is_tool' | 'default';

export type SubscriptionTier = 'FREE' | 'SOLO' | 'CLINICAL' | 'LAB';

export type PhaseType = 'SANITATION' | 'STABILIZATION' | 'EXPANSION';

export type LifeContext = 'NORMAL' | 'HIGH_LOAD' | 'CRISIS' | 'TRANSITION';

export type ArchetypeKey = 
  | 'THE_ARCHITECT' | 'THE_DRIFTER' | 'THE_BURNED_HERO' 
  | 'THE_GOLDEN_PRISONER' | 'THE_CHAOS_SURFER' | 'THE_GUARDIAN';

export type VerdictKey = 
  | 'HEALTHY_SCALE' | 'BRILLIANT_SABOTAGE' | 'INVISIBILE_CEILING' 
  | 'LEAKY_BUCKET' | 'PARALYZED_GIANT' | 'FROZEN_POTENTIAL' | 'CRITICAL_DEFICIT';

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

export interface DomainConfig {
  key: DomainType;
  count: number;
  color: string;
  startId: number;
}

export interface GameHistoryItem {
  nodeId: string;
  domain: DomainType;
  beliefKey: string;
  latency: number;
  sensation: string;
  choicePosition: number;
}

export interface SessionPulseNode {
  id: number;
  domain: DomainType;
  tension: number;
  isBlock: boolean;
  isFlow: boolean;
  zScore: number;
}

export interface NeuralCorrelation {
  key1: string;
  key2: string;
  coefficient: number;
  type: string;
}

export interface RawAnalysisResult {
  context: LifeContext;
  state: { foundation: number; agency: number; resource: number; entropy: number };
  domainProfile: Record<DomainType, number>;
  integrity: number;
  capacity: number;
  entropyScore: number;
  neuroSync: number;
  systemHealth: number;
  phase: PhaseType;
  status: string;
  validity: 'VALID' | 'SUSPICIOUS' | 'INVALID' | 'BREACH' | 'INITIALIZING' | 'PROTECTIVE' | 'STABLE' | 'UNSTABLE';
  activePatterns: BeliefKey[];
  correlations: NeuralCorrelation[];
  conflicts: any[];
  somaticDissonance: BeliefKey[];
  somaticProfile: { blocks: number; resources: number; dominantSensation: string };
  integrityBreakdown: { coherence: number; sync: number; stability: number; label: string; status: string; description?: string };
  clarity: number;
  confidenceScore: number;
  warnings: string[];
  flags: { 
    isAlexithymiaDetected?: boolean; 
    isSocialDesirabilityBiasDetected?: boolean; 
    isSlowProcessingDetected?: boolean; 
    isNeuroSyncReliable?: boolean;
    processingSpeedCompensation?: number;
    entropyType?: 'NEUTRAL' | 'CREATIVE' | 'STRUCTURAL';
    isL10nRiskDetected?: boolean;
  };
  skippedCount: number;
  sessionPulse: SessionPulseNode[];
}

export interface PatternFlags {
  isMonotonic: boolean;
  isHighSkipRate: boolean;
  isFlatline: boolean;
  isRoboticTiming: boolean;
  isSomaticMonotony: boolean;
  isEarlyTermination: boolean;
  dominantPosition: number | null;
  isInconsistentRhythm?: boolean;
}

export interface AnalysisResult extends RawAnalysisResult {
  timestamp: number;
  createdAt: number;
  shareCode: string;
  archetypeKey: ArchetypeKey;
  secondaryArchetypeKey?: ArchetypeKey;
  archetypeMatch: number;
  archetypeSpectrum: { key: ArchetypeKey; score: number }[];
  verdictKey: VerdictKey;
  lifeScriptKey: string;
  roadmap: any[];
  graphPoints: { x: number; y: number; label?: string }[];
  patternFlags: PatternFlags;
  interventionStrategy: string;
  coreConflict: string;
  shadowDirective: string;
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

export interface SystemLogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  module: string;
  action: string;
  details: any;
}

export interface TelemetryEvent {
  nodeId: string;
  domain: DomainType;
  latency: number;
  sensation: string;
  beliefKey: string;
  variantId: string;
  timestamp: number;
  isOutlier: boolean;
}

export interface FeedbackEntry {
  timestamp: number;
  clientId: string;
  feedback: string;
  rating: number;
}

export interface LicenseRecord {
  id: string;
  clientName: string;
  key: string;
  tier: string;
  issuedAt: number;
  expiresAt: number;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'INVALID';
}

export class DataCorruptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataCorruptionError';
  }
}

export type TaskKey = string;

export interface Translations {
  subtitle: string;
  onboarding: any;
  pro_hub: any;
  invalid_results: any;
  data_corruption: any;
  boot_sequence: string[];
  ui: any;
  auth_ui: any;
  context_check: any;
  admin: any;
  guide: any;
  pro_guide: any;
  brief_explainer: any;
  clinical_decoder: any;
  clinical_narratives: any;
  global: any;
  sync: any;
  sensation_feedback: any;
  domains: Record<string, string>;
  dashboard: any;
  results: any;
  ekg: any;
  pro_terminal: any;
  pro_headers: any;
  phases: any;
  tasks: any;
  scenes: Record<string, { title: string; desc: string; c1: string; c2: string; c3: string }>;
  beliefs: Record<string, string>;
  explanations: any;
  pattern_library: Record<string, { protection: string; cost: string; antidote: string }>;
  archetypes: Record<string, { title: string; desc: string; superpower: string; shadow: string; quote: string }>;
  verdicts: Record<string, { label: string; impact: string }>;
  metric_definitions: any;
  conflicts: any;
  system_commentary: string[];
  auth_hint: string;
  legal_disclaimer: string;
  safety: any;
  session_prep_templates: any;
  synthesis_categories: any;
  synthesis: any;
  interventions: Record<string, string>;
  directives: Record<string, string>;
  interferences: Record<string, string>;
  correlation_types: any;
  integrity_audit: any;
  methodology_faq: { q: string; a: string }[];
  soft_mode: { archetype_prefix: string; verdict_softened: Record<string, string> };
  test_metrics: any;
  legal: any;
  oracle: any;
  export_image: any;
}

export interface ConfigError {
  severity: 'high' | 'medium' | 'low';
  type: string;
  details: string;
  fix: string;
  file?: string;
  impact?: string;
}

export interface IntegrityCategory {
  name: 'NERVOUS_SYSTEM' | 'METABOLISM' | 'VOICE' | 'IMMUNITY' | 'STRUCTURE';
  score: number; 
  errors: ConfigError[];
  warnings: ConfigError[];
  totalChecks: number;
}

export interface ComplexityMetrics {
    emergenceIndex: number;
    synergyFactor: number;
    phaseTransitionRisk: number;
    autopoiesisScore: number;
    tippingPointNode: string | null;
}

export interface StructuralAnomalies {
    deadCode: string[]; 
    spof: string[]; 
    butterflyEffect: string[]; 
    dominoEffect: string[]; 
    hysteresis: string[]; 
    technicalDebt: string[]; 
    coupling: string[]; 
    conwayViolations: string[]; 
    determinismRisk: string[]; 
    circuitBreakers: string[]; 
    bifurcationPoints: string[]; 
    strangeAttractors: string[]; 
    stableAttractors: string[]; 
    resonanceZones: string[]; 
}

export interface IntegrityReport {
  overallScore: number;
  status: 'healthy' | 'warning' | 'error';
  categories: IntegrityCategory[];
  timestamp: number;
  inflammationIndex: number;
  fragilityIndex: number;
  avalancheIndex: number;
  structuralAnomalies: StructuralAnomalies;
  complexity: ComplexityMetrics;
  narrative: string; 
}

export interface AppContextType {
  lang: 'ru' | 'ka';
  setLang: (lang: 'ru' | 'ka') => void;
  t: Translations;
  view: string;
  setViewAndPersist: (view: string) => void;
  isDemo: boolean;
  isPro: boolean;
  isMaster: boolean;
  licenseTier: SubscriptionTier;
  completedNodeIds: number[];
  setCompletedNodeIds: (fn: (prev: number[]) => number[]) => void;
  history: GameHistoryItem[];
  setHistory: (fn: (prev: GameHistoryItem[]) => GameHistoryItem[]) => void;
  dataStatus: string;
  scanHistory: ScanHistory;
  usageStats: { used: number; limit: number; isUnlimited: boolean; canStart: boolean };
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  handleLogin: (password: string, demo?: boolean, tier?: SubscriptionTier) => boolean;
  handleLogout: () => void;
  handleReset: (force?: boolean) => void;
  onLangChange: (lang: 'ru' | 'ka') => void;
}

export interface ClinicalProfile {
  p_profile: string;
  deep_expl: string;
  behavior: string;
  hypo: string;
  contract: string;
  goal: string;
  process: string;
  strategies: string[];
  transference: string;
  counter_transference: string;
  trap: string;
  fragility: string;
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

export interface SessionStep {
  phase: string;
  title: string;
  action: string;
}

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
    extra: {
        diffProb: Record<string, number>;
        criticalNodes: number[];
        trapType: string;
        provocation: string;
    };
}

export interface SystemicVector {
    origin: string;
    strength: number;
    description: string;
    proNote: string;
}

export interface Intervention {
    type: string;
    text: string;
    purpose: string;
}

export interface ClinicalNarrative {
    level1: {
        title: string;
        statusTag: string;
        summary: string;
        focusQuestion: string;
        tone: string;
        recommendation: string;
    };
    level2: {
        introduction: string;
        generalConfig: string;
        psychodynamicProfile: string;
        deepAnalysis: string;
        deepExpl: string;
        behaviorExpl: string;
        hypoExpl: string;
        interExpl: string;
        diffExpl: string;
        validityExpl: string;
        archetypeAnalysis: string;
        clinicalHypotheses: string;
        activePatterns: string;
        verdictAndRecommendations: string;
        resistanceProfile: string;
        behavioralMarkers: string;
        systemicRoot: string;
        therapeuticAlliance: string;
        shadowContract: string;
        evolutionGoal: string;
        shadowContractExpl: string;
        evolutionProcess: string;
        counterTransference: string;
        primaryDefense: string;
        therapeuticTrap: string;
        fragilityPoint: string;
        clinicalStrategy: string[];
        triggers: string[];
        blindSpots: string[];
        sessionFlow: SessionStep[];
        clinicalProfile: string;
        systemicVectors: SystemicVector[];
        interventions: Intervention[];
        differentialHypotheses: { label: string; probability: number }[];
    };
}

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  module: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
}

export interface JourneyAnomaly {
    type: string;
    details: string;
    key?: string;
    key1?: string;
    key2?: string;
    similarity?: number;
    source?: string;
}

export interface PersonaResult {
    persona: string;
    finalState: { foundation: number; agency: number; resource: number; entropy: number };
    dominantArchetype: string;
    stabilityIndex: number;
}

export interface SimulationReport {
    pathfinder: {
        anomalies: JourneyAnomaly[];
        pathsChecked: number;
        coverage: number;
    };
    calibrator: {
        results: PersonaResult[];
        chaosStressTest: {
            successRate: number;
            failureModes: string[];
        };
    };
    semanticGhost: {
        duplicates: JourneyAnomaly[];
        averageSimilarity: number;
        vocabularySize: number;
    };
    assetGuardian: {
        orphans: JourneyAnomaly[];
    };
    timestamp: number;
}

export interface SupervisorPattern {
    obs: string;
    risk: string;
    trap: string;
    provocation: string;
    transfer?: string;
    tactics?: string;
}
