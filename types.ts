import React from 'react';

export type DomainType = 'foundation' | 'agency' | 'money' | 'social' | 'legacy';

export type BeliefKey = 
  | 'family_loyalty' | 'scarcity_mindset' | 'fear_of_punishment' | 'imposter_syndrome' 
  | 'poverty_is_virtue' | 'hard_work_only' | 'self_permission' | 'capacity_expansion' 
  | 'boundary_collapse' | 'shame_of_success' | 'hero_martyr' | 'latency_resistance' 
  | 'body_mind_conflict' | 'ambivalence_loop' | 'autopilot_mode' | 'golden_cage' 
  | 'money_is_tool' | 'fear_of_conflict' | 'betrayal_trauma' | 'unconscious_fear' 
  | 'money_is_danger' | 'impulse_spend' | 'resource_toxicity' | 'short_term_bias' | 'default';

export type ArchetypeKey = 'THE_ARCHITECT' | 'THE_DRIFTER' | 'THE_BURNED_HERO' | 'THE_GOLDEN_PRISONER' | 'THE_CHAOS_SURFER' | 'THE_GUARDIAN';

export type VerdictKey = 'HEALTHY_SCALE' | 'BRILLIANT_SABOTAGE' | 'INVISIBILE_CEILING' | 'LEAKY_BUCKET' | 'PARALYZED_GIANT' | 'FROZEN_POTENTIAL' | 'CRITICAL_DEFICIT';

export type PhaseType = 'SANITATION' | 'STABILIZATION' | 'EXPANSION';

export type TaskKey = string;

export type SubscriptionTier = 'FREE' | 'SOLO' | 'CLINICAL' | 'LAB';

export type LifeContext = 'NORMAL' | 'HIGH_LOAD' | 'CRISIS' | 'TRANSITION';

export type ResonanceState = 'COHERENT' | 'DISSONANT' | 'NEUTRAL' | 'INITIALIZING';

export type InterventionMode = 'HOLDING' | 'STABILIZING' | 'CONFRONTING';

export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

export interface StructuralFracture {
    nodeId: string;
    domain: DomainType;
    intensity: number;
    description: string;
    beliefKey: string;
}

export interface BifurcationNode {
    id: string;
    belief: BeliefKey;
    actualArchetype: ArchetypeKey;
    shadowArchetype: ArchetypeKey;
    sensitivity: number;
    delta: number;
}

export class DataCorruptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataCorruptionError';
  }
}

export interface Choice {
  id: string;
  textKey: string;
  beliefKey: string;
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

export interface EntropyFluxVector {
  from: DomainType;
  to: DomainType;
  intensity: number;
  velocity: number;
}

export interface RawAnalysisResult {
  context: LifeContext;
  state: {
    foundation: number;
    agency: number;
    resource: number;
    entropy: number;
  };
  domainProfile: Record<DomainType, number>;
  integrity: number;
  capacity: number;
  entropyScore: number;
  neuroSync: number;
  systemHealth: number;
  phase: PhaseType;
  status: string;
  validity: 'VALID' | 'INVALID' | 'INITIALIZING' | 'BREACH';
  activePatterns: BeliefKey[];
  somaticDissonance: BeliefKey[];
  history: GameHistoryItem[];
  correlations: any[];
  conflicts: any[];
  somaticProfile: {
    blocks: number;
    resources: number;
    dominantSensation: string;
  };
  integrityBreakdown: {
    coherence: number;
    sync: number;
    stability: number;
    label: string;
    description?: string;
    status: string;
  };
  clarity: number;
  confidenceScore: number;
  warnings: string[];
  flags: {
    isAlexithymiaDetected?: boolean;
    isSlowProcessingDetected?: boolean;
    isNeuroSyncReliable?: boolean;
    isSocialDesirabilityBiasDetected?: boolean;
    processingSpeedCompensation?: number;
    entropyType?: 'CREATIVE' | 'NEUTRAL';
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

export interface ForecastMetrics {
  horizonMonths: number;
  momentum: number;
  friction: number;
  inertialPath: number[];
  decayPath: number[];
  growthPath: number[];
  tippingPointMonth: number | null;
  targetIntegrity?: number;
}

export interface AuditMetrics {
  timestamp: number;
  integrityScore: number;
  entropyLevels: number[];
}

export interface AnalysisResult extends RawAnalysisResult {
  timestamp: number;
  createdAt: number;
  shareCode: string;
  archetypeKey: ArchetypeKey;
  secondaryArchetypeKey?: ArchetypeKey;
  archetypeMatch: number;
  archetypeSpectrum: { key: ArchetypeKey; score: number }[];
  refraction: { key: ArchetypeKey; match: number; description: string }[];
  shadowArchetype?: { key: ArchetypeKey; tension: number; description: string };
  verdictKey: VerdictKey;
  lifeScriptKey: string;
  roadmap: any[];
  graphPoints: { x: number; y: number; label?: string }[];
  shadowPoints?: { x: number; y: number; label?: string }[];
  interventionStrategy: string;
  coreConflict: string;
  shadowDirective: string;
  confidenceScore: number;
  patternFlags: PatternFlags;
  audit?: AuditMetrics; 
  butterflySensitivity: number;
  isCrisis?: boolean;
  forecast?: ForecastMetrics;
  bifurcationHistory?: any[];
  entropyFlux: EntropyFluxVector[];
  fractures: StructuralFracture[];
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
  timestamp: number;
  nodeId: string;
  domain: DomainType;
  latency: number;
  sensation: string;
  beliefKey: string;
  isOutlier: boolean;
  variantId: string;
}

export interface FeedbackEntry {
  timestamp: number;
  clientId: string;
  rating: number;
  comment: string;
}

export interface LicenseRecord {
  id: string;
  clientName: string;
  key: string;
  tier: string;
  issuedAt: number;
  expiresAt: number;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
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
  intervention: InterventionType | null;
}

export interface InterventionType {
  code: 'MANIC_BREAK' | 'SOMATIC_WAKEUP';
  trigger: string;
  requiredAction: string;
}

export interface ConfigError {
  type: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

export interface IntegrityCategory {
  name: string;
  score: number;
  errors: ConfigError[];
  warnings: ConfigError[];
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

export interface ComplexityMetrics {
  emergenceIndex: number;
  synergyFactor: number;
  phaseTransitionRisk: number;
  autopoiesisScore: number;
  tippingPointNode: string | null;
}

export interface NetworkAuditReport {
  totalRequests: number;
  authorizedDomains: string[];
  violations: string[];
  isSovereign: boolean;
}

export interface IntegrityReport {
  overallScore: number;
  status: 'healthy' | 'warning' | 'error' | 'lockdown';
  categories: IntegrityCategory[];
  timestamp: number;
  inflammationIndex: number;
  fragilityIndex: number;
  avalancheIndex: number;
  structuralAnomalies: StructuralAnomalies;
  complexity: ComplexityMetrics;
  narrative: string;
  networkAudit: NetworkAuditReport;
  isEnvironmentSafe: boolean;
}

export interface JourneyAnomaly {
    type: string;
    details: string;
    source?: string;
    key?: string;
    key1?: string;
    key2?: string;
    similarity?: number;
}

export interface PersonaResult {
    persona: string;
    finalState: {
        foundation: number;
        agency: number;
        resource: number;
        entropy: number;
    };
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

export interface LogEntry {
    timestamp: number;
    level: LogLevel;
    module: string;
    message: string;
    stack?: string;
    context?: Record<string, any>;
}

export interface SessionStep {
    phase: string;
    title: string;
    action: string;
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
        clinicalStrategy: string;
        triggers: string[];
        blindSpots: string[];
        sessionFlow: SessionStep[];
        clinicalProfile: string;
        systemicVectors: SystemicVector[];
        interventions: Intervention[];
        differentialHypotheses: Array<{ label: string; probability: number }>;
    };
}

export interface AutopoiesisMetrics {
    selfHealingIndex: number;
    integrationPotential: number;
    phaseTransitionReadiness: number;
    levers: Array<{ domain: DomainType; impact: number; label: string }>;
}

export interface StatisticalMarkers {
    variance: number;
    standardDeviation: number;
    skewness: number;
    kurtosis: number;
    zScoreDistribution: number[];
}

export interface NeuropsychMarkers {
    alexithymiaIndex: number;
    cognitiveFriction: number;
    prefrontalExhaustion: boolean;
    amygdalaTriggerNodes: string[];
}

export interface SystemicMetrics {
    loyaltyIndex: number;
    differentiationLevel: number;
    ancestralPressure: number;
    fieldTension: number;
    excludedPatternKey?: string;
}

export interface ClinicalInterpretation {
    systemConfiguration: {
        title: string;
        description: string;
        limitingFactor: string;
    };
    deepMechanism: { title: string; analysis: any[] };
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
    hypotheses: any[];
    risks: string[];
    sessionEntry: string;
    priority: string;
    priorityLevel: 'low' | 'medium' | 'high';
    riskProfile: { label: string; level: 'critical' | 'nominal' };
    stats: StatisticalMarkers;
    neuro: NeuropsychMarkers;
    extra: {
        diffProb: Record<string, number>;
        criticalNodes: string[];
        trapType: string;
        provocation: string;
        bifurcations: any[];
        evidence: any[];
        homeostasisCost: number;
        systemicPressure: number;
        systemicMetrics: SystemicMetrics;
        directives: string[];
        clusters: any[];
        shadowContract: string;
        antidote: string;
        contraindications: string[];
        interventionMode: InterventionMode;
        somaticMap: any[];
        trajectory: any[];
        transference: string;
        prognosis: {
            integrationDifficulty: number;
            allianceRisk: number;
            stabilizationPath: 'LONG' | 'FAST';
            primaryObstacle: string;
        };
        entropyFlux: any[];
        autopoiesis: AutopoiesisMetrics;
    };
}

export interface SynthesisInsight {
    title: string;
    icon: string;
    analysis: string;
    recommendation: string;
}

export interface ClinicalSynthesis {
    coreTension: SynthesisInsight;
    behavioralPrediction: SynthesisInsight;
    therapeuticFocus: SynthesisInsight;
    keyQuestion: string;
}

export interface NeuralBond {
    from: DomainType;
    to: DomainType;
    strength: number;
    tension: number;
    status: 'STABLE' | 'STRAINED' | 'RUPTURED' | 'SYNERGETIC';
}

export interface LatticeMetrics {
    bonds: NeuralBond[];
    coherence: number;
}

export interface ResonanceVector {
    from: DomainType;
    to: DomainType;
    strength: number;
}

export interface EntropyVector {
    from: DomainType;
    to: DomainType;
    volume: number;
    velocity: number;
}

export interface AppContextType {
    lang: string;
    t: Translations;
    view: string;
    previousView: string | null;
    setViewAndPersist: (view: string) => void;
    sessionContext: LifeContext;
    setSessionContext: (ctx: LifeContext) => void;
    isDemo: boolean;
    isPro: boolean;
    isMaster: boolean;
    licenseTier: SubscriptionTier;
    isSafeDevMode: boolean;
    setSafeDevMode: (active: boolean) => void;
    completedNodeIds: number[];
    setCompletedNodeIds: React.Dispatch<React.SetStateAction<number[]>>;
    history: GameHistoryItem[];
    setHistory: React.Dispatch<React.SetStateAction<GameHistoryItem[]>>;
    dataStatus: string;
    scanHistory: ScanHistory;
    usageStats: { used: number; limit: number; isUnlimited: boolean; canStart: boolean };
    networkReport: NetworkAuditReport;
    integrityReport: IntegrityReport | null;
    handleLogin: (password: string, demo?: boolean, tier?: SubscriptionTier) => boolean;
    handleLogout: () => void;
    handleReset: (force?: boolean) => void;
    handleFullReset: () => void;
}

export interface Translations {
    subtitle: string;
    global: { back: string; complete: string; calibrating: string; calib_desc: string };
    sync: any;
    sensation_feedback: any;
    dashboard: any;
    onboarding: any;
    informed_consent: any;
    ui: any;
    boot_sequence: any;
    auth_ui: any;
    test_metrics: any;
    results: any;
    invalid_results: any;
    data_corruption: any;
    roadmap: any;
    somatic_analysis: any;
    metric_trace: any;
    pro_hub: any;
    pro_terminal: any;
    pro_guide: any;
    academy: any;
    comparison: any;
    specialist_oath: any;
    clinical_narratives: any;
    domains: any;
    verdicts: any;
    archetypes: any;
    beliefs: any;
    pattern_library: any;
    academy_extra: any;
    safety: any;
    crisis_view: any;
    integrity_audit: any;
    security_monitor: any;
    constitution: any;
    tech_standard: any;
    changelog: any;
    scientific_foundations: any;
    privacy: any;
    legal: any;
    guide: any;
    brief_explainer: any;
    archetype_gallery: any;
    oracle: any;
    export_image: any;
    evolution_insights: any;
    transparency: any;
    tomography: any;
    tomography_controls: any;
    systemic_field: any;
    horizon_scanner: any;
    mirror_protocol: any;
    forensic: any;
    emergence_library: any;
    topology: any;
    resonance: any;
    ekg: any;
    integration: any;
    antifragility: any;
    stabilization: any;
    transition_protocol: any;
    scenes: Record<string, { title: string; desc: string; c1: string; c2: string; c3: string }>;
    session_prep_templates: any;
    shadow_logic?: any;
    synthesis: any;
    clinical_decoder: any;
    admin: any;
    pro_headers: any;
}

export type NeuralCorrelation = any;
export type ChronosMetrics = any;
export type AntifragilityMetrics = any;
export type MetricTrace = any;
export type MetricTracePoint = any;
export type ShadowPattern = any;
export type TherapyStep = any;