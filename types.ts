
// types.ts
// Single Source of Truth for all Genesis OS Types.

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
        showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
        showPopup: (params: { title?: string; message: string; buttons?: { id: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text?: string }[] }, callback?: (id: string) => void) => void;
        isVersionAtLeast: (version: string) => boolean;
        openLink: (url: string) => void;
        initData: string;
      };
    };
  }
}

export type SubscriptionTier = 'FREE' | 'SOLO' | 'CLINICAL' | 'LAB';
export type LifeContext = 'NORMAL' | 'HIGH_LOAD' | 'CRISIS' | 'TRANSITION';

export interface LicenseInfo {
    tier: SubscriptionTier;
    expiresAt: string;
    licenseKey: string;
    clientLimit: number;
    features: string[];
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

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  errors: number;
  warnings: number;
}

export interface Translations {
  subtitle: string;
  onboarding: Record<string, string>;
  invalid_results: Record<string, string>;
  data_corruption: Record<string, string>;
  boot_sequence: string[];
  ui: Record<string, string>;
  auth_ui: {
      verifying: string;
      authenticate: string;
      cancel: string;
      checking_crypto: string;
      invalid_format: string;
      license_expired: string;
      revoked: string;
      offline_mode: string;
      maintenance: string;
  };
  context_check: {
      title: string;
      desc: string;
      options: Record<LifeContext, { label: string; sub: string }>;
  };
  admin: Record<string, string> & {
    billing: string;
    license_key: string;
    tier_label: string;
    status_active: string;
    status_expired: string;
    upgrade_btn: string;
  };
  guide: { title: string; subtitle: string; sections: Array<{ title: string; content: string[] }>; metaphor: string; };
  pro_guide: { title: string; subtitle: string; sections: Array<{ title: string; content: string[] }>; closing: string; };
  brief_explainer: Record<string, string>;
  clinical_decoder: {
    somatic_dissonance_title: string;
    somatic_dissonance_desc: string;
    disclaimer: string;
    analysis_patterns: Record<string, string>;
    common_hypotheses: Record<string, { h: string; q: string }>;
    configs: Record<string, { title: string; desc: string }>;
    headers: Record<string, string>;
    sync_patterns: Record<string, string>;
    archetype_strategies: Record<string, { strategy: string; func: string; limit: string }>;
    risks: Record<string, string>;
    session_entries: Record<string, string>;
  };
  global: Record<string, string>;
  sync: Record<string, string>;
  sensation_feedback: Record<string, string>;
  domains: Record<string, string>;
  dashboard: Record<string, string>;
  results: Record<string, string> & {
      blueprint: string;
      confidence: string;
      consistency: string;
      psychometric_signature: string;
  };
  ekg: {
      title: string;
      tension: string;
      block: string;
      flow: string;
      start: string;
      end: string;
      breakdown: string;
  };
  pro_terminal: {
      title: string;
      access_restricted: string;
      enter_code: string;
      paste_placeholder: string;
      decrypt_btn: string;
      active_session: string;
      decode_current: string;
      security_breach: string;
      tamper_detected: string;
      terminate_session: string;
      risk_high: string;
      dissociated: string;
      creative_chaos: string;
      run_protocol: string;
      calculating: string;
      supervisor_note: string;
      close_session: string;
      clinical_hypotheses: string;
      verdict_protocol: string;
      client_id_label: string;
      signal_quality: string;
      shadow_mechanic: string;
      alliance_label: string;
      contract_label: string;
      resistance_label: string;
  };
  pro_headers: Record<string, string>;
  phases: Record<string, string>;
  tasks: Record<string, any>;
  scenes: Record<string, { title: string; desc: string; c1: string; c2: string; c3: string }>;
  beliefs: Record<string, string>;
  explanations: Record<string, string>;
  pattern_library: Record<string, { protection: string; cost: string; antidote: string }>;
  archetypes: Record<string, { title: string; desc: string; superpower: string; shadow: string; quote: string }>;
  verdicts: Record<string, { label: string; impact: string }>;
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

export type DomainType = 'foundation' | 'agency' | 'money' | 'social' | 'legacy';
export type ArchetypeKey = 'THE_ARCHITECT' | 'THE_DRIFTER' | 'THE_BURNED_HERO' | 'THE_GOLDEN_PRISONER' | 'THE_CHAOS_SURFER' | 'THE_GUARDIAN';
export type BeliefKey = 'family_loyalty' | 'scarcity_mindset' | 'fear_of_punishment' | 'imposter_syndrome' | 'poverty_is_virtue' | 'hard_work_only' | 'self_permission' | 'fear_of_conflict' | 'betrayal_trauma' | 'unconscious_fear' | 'money_is_danger' | 'impulse_spend' | 'resource_toxicity' | 'short_term_bias' | 'capacity_expansion' | 'boundary_collapse' | 'shame_of_success' | 'hero_martyr' | 'latency_resistance' | 'body_mind_conflict' | 'ambivalence_loop' | 'autopilot_mode' | 'golden_cage' | 'money_is_tool' | 'default';
export type PhaseType = 'SANITATION' | 'STABILIZATION' | 'EXPANSION';
export type VerdictKey = 'HEALTHY_SCALE' | 'BRILLIANT_SABOTAGE' | 'INVISIBILE_CEILING' | 'LEAKY_BUCKET' | 'PARALYZED_GIANT' | 'FROZEN_POTENTIAL' | 'CRITICAL_DEFICIT';

export interface MathSignature {
    sigma: number; 
    friction: number; 
    volatilityScore: number; 
    zScoreProfile: 'STABLE' | 'ERRATIC' | 'ACCELERATED' | 'FROZEN';
    neuroPlasticity: number; 
}

export interface SessionPulseNode {
    id: number;
    domain: DomainType;
    tension: number; 
    isBlock: boolean; 
    isFlow: boolean; 
    zScore: number; 
}

export interface ClinicalWarning { type: string; severity: 'LOW' | 'MEDIUM' | 'HIGH'; messageKey: string; }
export type TaskKey = string;
export interface ProtocolStep { day: number; phase: PhaseType; taskKey: TaskKey; targetMetricKey: string; }
export interface PatternFlags { isMonotonic: boolean; isHighSkipRate: boolean; isFlatline: boolean; dominantPosition: number | null; isRoboticTiming: boolean; isSomaticMonotony: boolean; isEarlyTermination: boolean; }

export interface AnalysisFlags { 
    isAlexithymiaDetected: boolean; 
    isSlowProcessingDetected: boolean; 
    isNeuroSyncReliable: boolean; 
    isSocialDesirabilityBiasDetected: boolean; 
    processingSpeedCompensation: number; 
    entropyType: 'NEUTRAL' | 'CREATIVE' | 'STRUCTURAL'; 
    isL10nRiskDetected: boolean; 
}

export interface RawAnalysisResult { state: { foundation: number; agency: number; resource: number; entropy: number }; integrity: number; capacity: number; entropyScore: number; neuroSync: number; systemHealth: number; phase: PhaseType; status: MetricLevel; validity: 'VALID' | 'SUSPICIOUS' | 'INVALID' | 'BREACH'; activePatterns: BeliefKey[]; correlations: NeuralCorrelation[]; conflicts: SystemConflict[]; somaticDissonance: BeliefKey[]; somaticProfile: { blocks: number; resources: number; dominantSensation: string }; integrityBreakdown: IntegrityBreakdown; clarity: number; confidenceScore: number; warnings: ClinicalWarning[]; flags: AnalysisFlags; skippedCount: number; mathSignature?: MathSignature; sessionPulse: SessionPulseNode[]; context: LifeContext; }
export interface AnalysisResult extends RawAnalysisResult { timestamp: number; createdAt: number; shareCode: string; archetypeKey: ArchetypeKey; secondaryArchetypeKey?: ArchetypeKey; matchPercent?: number; archetypeMatch: number; archetypeSpectrum: Array<{ key: ArchetypeKey; score: number }>; verdictKey: VerdictKey; lifeScriptKey: string; roadmap: ProtocolStep[]; graphPoints: Array<{ x: number; y: number }>; interventionStrategy: string; coreConflict: string; shadowDirective: string; patternFlags: PatternFlags; variantId?: string; }
export type MetricLevel = 'OPTIMAL' | 'STABLE' | 'STRAINED' | 'PROTECTIVE' | 'UNSTABLE';
export interface NeuralCorrelation { nodeId: string; domain: DomainType; type: 'resistance' | 'resonance'; descriptionKey: string; }
export interface SystemConflict { key: string; severity: 'high' | 'medium' | 'low'; domain: DomainType; }
export interface IntegrityBreakdown { coherence: number; sync: number; stability: number; label: string; description: string; status: MetricLevel; }

export interface GameHistoryItem {
    beliefKey: string;
    sensation: string;
    latency: number;
    nodeId: string;
    domain: DomainType;
    choicePosition: number;
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

export class DataCorruptionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DataCorruptionError";
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

export interface CompatibilityReport {
    overallScore: number;
    domainSynergies: any[];
    domainConflicts: any[];
    recommendations: string[];
    relationshipType: string;
    partnerArchetype: ArchetypeKey;
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
}

export interface SystemicVector {
    origin: string;
    strength: number;
    description: string;
    proNote?: string;
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
        tone: 'alert' | 'supportive';
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
        differentialHypotheses: Array<{ label: string; probability: number }>;
    };
}

export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

export interface LogEntry {
    timestamp: number;
    level: LogLevel;
    module: string;
    message: string;
    stack?: string;
    context?: Record<string, any>;
}

export interface IntegrityReport {
    status: 'healthy' | 'warning' | 'error';
    errors: ConfigError[];
    warnings: ConfigError[];
    healthy: string[];
    timestamp: number;
    semanticDensity: { parity: number };
}

export interface ConfigError {
    severity: 'low' | 'high';
    type: string;
    details: string;
    fix: string;
    file: string;
    impact: string;
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
    variantId: string;
    isOutlier: boolean;
}

export interface FeedbackEntry {
    [key: string]: any;
}
