
import { Scene, BeliefKey, DomainType, DomainConfig, SubscriptionTier } from './types';

export const STORAGE_KEYS = {
  LANG: 'genesis_lang',
  SESSION: 'genesis_session',
  SESSION_STATE: 'genesis_session_state',
  SCAN_HISTORY: 'genesis_scan_history',
  AUDIT_LOG: 'genesis_audit_log',
  ROADMAP_STATE: 'genesis_roadmap_state',
  TELEMETRY_DATA: 'genesis_telemetry',
  CLINICAL_FEEDBACK: 'genesis_clinical_feedback'
} as const;

// SYSTEM VERSIONING & OVERSIGHT
export const SYSTEM_METADATA = {
    VERSION: '9.9.75-TITANIUM', // Bumped version for new math model
    LOGIC_VERSION: '4E',
    LAST_UPDATED: '2025-12-31',
    CODENAME: 'Liquid State',
    GITHUB_LEDGER_URL: 'https://raw.githubusercontent.com/genesis-os/ledger/main/ledger.json',
    LANG_HEALTH: {
        ru: { status: 'VERIFIED', reliability: 1.0, notes: 'Content Complete.' },
        ka: { status: 'VERIFIED', reliability: 0.95, notes: 'Linguistic Parity Achieved.' }
    }
};

// BUSINESS CONFIGURATION
export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, number> = {
    FREE: 1,
    SOLO: 30, 
    CLINICAL: 30,
    LAB: 9999
};

export const PRICING_CONFIG = {
    CURRENCY: { ru: '₽', ka: '₾' },
    PLANS: {
        FREE: { ru: 0, ka: 0 },
        PRO: { ru: 8990, ka: 250 }
    }
};

// SYSTEM THRESHOLDS
export const PSYCHO_CONFIG = {
  DISTRACTION_THRESHOLD_MS: 30000, 
  IMPULSE_THRESHOLD_MS: 1000,      
  LATENCY_PENALTY: 3,         
  IMPULSE_PENALTY: 5,         
  MAX_LATENCY_PENALTY: 30,
  ENTROPY_DIVISOR: 120,       
  FOUNDATION_CRITICAL: 35,
  RESOURCE_GROWTH_TRIGGER: 4, 
  BODY_MIND_PENALTY: 12,
  BUG_ENTROPY_THRESHOLD: 8,
  VOLATILITY_THRESHOLD: 20
};

export const ONBOARDING_NODES_COUNT = 5;

export const ALL_BELIEFS: BeliefKey[] = [
  'family_loyalty', 'scarcity_mindset', 'fear_of_punishment', 'imposter_syndrome', 'poverty_is_virtue',
  'hard_work_only', 'self_permission', 'fear_of_conflict', 'betrayal_trauma', 'unconscious_fear',
  'money_is_danger', 'impulse_spend', 'resource_toxicity', 'short_term_bias', 'capacity_expansion',
  'boundary_collapse', 'shame_of_success', 'hero_martyr', 'latency_resistance', 'body_mind_conflict',
  'ambivalence_loop', 'autopilot_mode', 'golden_cage', 'money_is_tool'
];

const RAW_DOMAINS: DomainType[] = ['foundation', 'agency', 'money', 'social', 'legacy'];
const DOMAIN_COUNTS: Record<DomainType, number> = {
  foundation: 15, agency: 10, money: 10, social: 10, legacy: 5
};
const DOMAIN_COLORS: Record<DomainType, string> = {
  foundation: 'rgba(239, 68, 68, 0.08)',
  agency: 'rgba(34, 197, 94, 0.08)',
  money: 'rgba(99, 102, 241, 0.08)',
  social: 'rgba(168, 85, 247, 0.08)',
  legacy: 'rgba(236, 72, 153, 0.08)'
};

export const DOMAIN_SETTINGS: DomainConfig[] = RAW_DOMAINS.reduce((acc, key, index) => {
  const startId = index === 0 ? 0 : acc[index - 1].startId + acc[index - 1].count;
  acc.push({ key, count: DOMAIN_COUNTS[key], color: DOMAIN_COLORS[key], startId });
  return acc;
}, [] as DomainConfig[]);

export const TOTAL_NODES = DOMAIN_SETTINGS.reduce((acc, d) => acc + d.count, 0);

interface NodeConfig {
  intensity: number;
  choices: { idSuffix: string; beliefKey: BeliefKey; position: number }[];
}

// v9.9.75 TITANIUM UPDATE:
// 1. Butterfly Effect Mitigation: Reduced intensity for foundation_0 to foundation_4 (1-2 instead of 3-5).
// 2. SPOF Removal: Diversified initial keys.
export const NODE_CONFIGS: Record<string, NodeConfig> = {
  // --- SAFE HARBOR ENTRY (Calibration Zone) ---
  "foundation_0": { intensity: 1, choices: [{ idSuffix: "c1", beliefKey: "autopilot_mode", position: 0 }, { idSuffix: "c2", beliefKey: "fear_of_conflict", position: 1 }, { idSuffix: "c3", beliefKey: "money_is_tool", position: 2 }] },
  "foundation_1": { intensity: 1, choices: [{ idSuffix: "c1", beliefKey: "family_loyalty", position: 0 }, { idSuffix: "c2", beliefKey: "self_permission", position: 1 }, { idSuffix: "c3", beliefKey: "boundary_collapse", position: 2 }] },
  "foundation_2": { intensity: 2, choices: [{ idSuffix: "c1", beliefKey: "fear_of_punishment", position: 0 }, { idSuffix: "c2", beliefKey: "imposter_syndrome", position: 1 }, { idSuffix: "c3", beliefKey: "poverty_is_virtue", position: 2 }] },
  "foundation_3": { intensity: 2, choices: [{ idSuffix: "c1", beliefKey: "scarcity_mindset", position: 0 }, { idSuffix: "c2", beliefKey: "unconscious_fear", position: 1 }, { idSuffix: "c3", beliefKey: "short_term_bias", position: 2 }] },
  "foundation_4": { intensity: 2, choices: [{ idSuffix: "c1", beliefKey: "shame_of_success", position: 0 }, { idSuffix: "c2", beliefKey: "hero_martyr", position: 1 }, { idSuffix: "c3", beliefKey: "betrayal_trauma", position: 2 }] },
  
  // --- DEEP DIVE STARTS ---
  "foundation_5": { intensity: 3, choices: [{ idSuffix: "c1", beliefKey: "hard_work_only", position: 0 }, { idSuffix: "c2", beliefKey: "unconscious_fear", position: 1 }, { idSuffix: "c3", beliefKey: "money_is_tool", position: 2 }] },
  "foundation_6": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "ambivalence_loop", position: 0 }, { idSuffix: "c2", beliefKey: "latency_resistance", position: 1 }, { idSuffix: "c3", beliefKey: "short_term_bias", position: 2 }] }, 
  "foundation_7": { intensity: 5, choices: [{ idSuffix: "c1", beliefKey: "fear_of_punishment", position: 0 }, { idSuffix: "c2", beliefKey: "money_is_tool", position: 1 }, { idSuffix: "c3", beliefKey: "hard_work_only", position: 2 }] },
  "foundation_8": { intensity: 3, choices: [{ idSuffix: "c1", beliefKey: "unconscious_fear", position: 0 }, { idSuffix: "c2", beliefKey: "fear_of_conflict", position: 1 }, { idSuffix: "c3", beliefKey: "capacity_expansion", position: 2 }] },
  "foundation_9": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "body_mind_conflict", position: 0 }, { idSuffix: "c2", beliefKey: "autopilot_mode", position: 1 }, { idSuffix: "c3", beliefKey: "boundary_collapse", position: 2 }] },
  "foundation_10": { intensity: 3, choices: [{ idSuffix: "c1", beliefKey: "ambivalence_loop", position: 0 }, { idSuffix: "c2", beliefKey: "resource_toxicity", position: 1 }, { idSuffix: "c3", beliefKey: "capacity_expansion", position: 2 }] },
  "foundation_11": { intensity: 5, choices: [{ idSuffix: "c1", beliefKey: "unconscious_fear", position: 0 }, { idSuffix: "c2", beliefKey: "hero_martyr", position: 1 }, { idSuffix: "c3", beliefKey: "shame_of_success", position: 2 }] },
  "foundation_12": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "family_loyalty", position: 0 }, { idSuffix: "c2", beliefKey: "fear_of_conflict", position: 1 }, { idSuffix: "c3", beliefKey: "body_mind_conflict", position: 2 }] },
  "foundation_13": { intensity: 3, choices: [{ idSuffix: "c1", beliefKey: "boundary_collapse", position: 0 }, { idSuffix: "c2", beliefKey: "golden_cage", position: 1 }, { idSuffix: "c3", beliefKey: "hero_martyr", position: 2 }] },
  "foundation_14": { intensity: 3, choices: [{ idSuffix: "c1", beliefKey: "hard_work_only", position: 0 }, { idSuffix: "c2", beliefKey: "latency_resistance", position: 1 }, { idSuffix: "c3", beliefKey: "short_term_bias", position: 2 }] }, 
  "agency_0": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "imposter_syndrome", position: 0 }, { idSuffix: "c2", beliefKey: "self_permission", position: 1 }, { idSuffix: "c3", beliefKey: "fear_of_conflict", position: 2 }] },
  "agency_1": { intensity: 5, choices: [{ idSuffix: "c1", beliefKey: "hard_work_only", position: 0 }, { idSuffix: "c2", beliefKey: "autopilot_mode", position: 1 }, { idSuffix: "c3", beliefKey: "ambivalence_loop", position: 2 }] },
  "agency_2": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "imposter_syndrome", position: 0 }, { idSuffix: "c2", beliefKey: "capacity_expansion", position: 1 }, { idSuffix: "c3", beliefKey: "shame_of_success", position: 2 }] },
  "agency_3": { intensity: 3, choices: [{ idSuffix: "c1", beliefKey: "fear_of_conflict", position: 0 }, { idSuffix: "c2", beliefKey: "hero_martyr", position: 1 }, { idSuffix: "c3", beliefKey: "self_permission", position: 2 }] },
  "agency_4": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "hard_work_only", position: 0 }, { idSuffix: "c2", beliefKey: "capacity_expansion", position: 1 }, { idSuffix: "c3", beliefKey: "ambivalence_loop", position: 2 }] },
  "agency_5": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "hero_martyr", position: 0 }, { idSuffix: "c2", beliefKey: "latency_resistance", position: 1 }, { idSuffix: "c3", beliefKey: "short_term_bias", position: 2 }] },
  "agency_6": { intensity: 5, choices: [{ idSuffix: "c1", beliefKey: "betrayal_trauma", position: 0 }, { idSuffix: "c2", beliefKey: "self_permission", position: 1 }, { idSuffix: "c3", beliefKey: "capacity_expansion", position: 2 }] },
  "agency_7": { intensity: 5, choices: [{ idSuffix: "c1", beliefKey: "short_term_bias", position: 0 }, { idSuffix: "c2", beliefKey: "capacity_expansion", position: 1 }, { idSuffix: "c3", beliefKey: "money_is_tool", position: 2 }] },
  "agency_8": { intensity: 3, choices: [{ idSuffix: "c1", beliefKey: "resource_toxicity", position: 0 }, { idSuffix: "c2", beliefKey: "hero_martyr", position: 1 }, { idSuffix: "c3", beliefKey: "self_permission", position: 2 }] },
  "agency_9": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "shame_of_success", position: 0 }, { idSuffix: "c2", beliefKey: "self_permission", position: 1 }, { idSuffix: "c3", beliefKey: "imposter_syndrome", position: 2 }] },
  "money_0": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "family_loyalty", position: 0 }, { idSuffix: "c2", beliefKey: "money_is_tool", position: 1 }, { idSuffix: "c3", beliefKey: "money_is_danger", position: 2 }] },
  "money_1": { intensity: 5, choices: [{ idSuffix: "c1", beliefKey: "scarcity_mindset", position: 0 }, { idSuffix: "c2", beliefKey: "hard_work_only", position: 1 }, { idSuffix: "c3", beliefKey: "ambivalence_loop", position: 2 }] },
  "money_2": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "money_is_danger", position: 0 }, { idSuffix: "c2", beliefKey: "poverty_is_virtue", position: 1 }, { idSuffix: "c3", beliefKey: "money_is_tool", position: 2 }] },
  "money_3": { intensity: 3, choices: [{ idSuffix: "c1", beliefKey: "resource_toxicity", position: 0 }, { idSuffix: "c2", beliefKey: "self_permission", position: 1 }, { idSuffix: "c3", beliefKey: "fear_of_punishment", position: 2 }] },
  "money_4": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "family_loyalty", position: 0 }, { idSuffix: "c2", beliefKey: "money_is_tool", position: 1 }, { idSuffix: "c3", beliefKey: "shame_of_success", position: 2 }] },
  "money_5": { intensity: 5, choices: [{ idSuffix: "c1", beliefKey: "scarcity_mindset", position: 0 }, { idSuffix: "c2", beliefKey: "impulse_spend", position: 1 }, { idSuffix: "c3", beliefKey: "short_term_bias", position: 2 }] },
  "money_6": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "family_loyalty", position: 0 }, { idSuffix: "c2", beliefKey: "money_is_tool", position: 1 }, { idSuffix: "c3", beliefKey: "betrayal_trauma", position: 2 }] },
  "money_7": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "impulse_spend", position: 0 }, { idSuffix: "c2", beliefKey: "self_permission", position: 1 }, { idSuffix: "c3", beliefKey: "money_is_tool", position: 2 }] },
  "money_8": { intensity: 3, choices: [{ idSuffix: "c1", beliefKey: "money_is_danger", position: 0 }, { idSuffix: "c2", beliefKey: "impulse_spend", position: 1 }, { idSuffix: "c3", beliefKey: "capacity_expansion", position: 2 }] },
  "money_9": { intensity: 3, choices: [{ idSuffix: "c1", beliefKey: "shame_of_success", position: 0 }, { idSuffix: "c2", beliefKey: "hero_martyr", position: 1 }, { idSuffix: "c3", beliefKey: "autopilot_mode", position: 2 }] },
  "social_0": { intensity: 3, choices: [{ idSuffix: "c1", beliefKey: "fear_of_conflict", position: 0 }, { idSuffix: "c2", beliefKey: "latency_resistance", position: 1 }, { idSuffix: "c3", beliefKey: "boundary_collapse", position: 2 }] },
  "social_1": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "ambivalence_loop", position: 0 }, { idSuffix: "c2", beliefKey: "boundary_collapse", position: 1 }, { idSuffix: "c3", beliefKey: "golden_cage", position: 2 }] }, 
  "social_2": { intensity: 5, choices: [{ idSuffix: "c1", beliefKey: "betrayal_trauma", position: 0 }, { idSuffix: "c2", beliefKey: "resource_toxicity", position: 1 }, { idSuffix: "c3", beliefKey: "latency_resistance", position: 2 }] },
  "social_3": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "imposter_syndrome", position: 0 }, { idSuffix: "c2", beliefKey: "boundary_collapse", position: 1 }, { idSuffix: "c3", beliefKey: "body_mind_conflict", position: 2 }] },
  "social_4": { intensity: 3, choices: [{ idSuffix: "c1", beliefKey: "shame_of_success", position: 0 }, { idSuffix: "c2", beliefKey: "golden_cage", position: 1 }, { idSuffix: "c3", beliefKey: "autopilot_mode", position: 2 }] },
  "social_5": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "ambivalence_loop", position: 0 }, { idSuffix: "c2", beliefKey: "hard_work_only", position: 1 }, { idSuffix: "c3", beliefKey: "boundary_collapse", position: 2 }] },
  "social_6": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "fear_of_conflict", position: 0 }, { idSuffix: "c2", beliefKey: "self_permission", position: 1 }, { idSuffix: "c3", beliefKey: "boundary_collapse", position: 2 }] }, 
  "social_7": { intensity: 3, choices: [{ idSuffix: "c1", beliefKey: "unconscious_fear", position: 0 }, { idSuffix: "c2", beliefKey: "ambivalence_loop", position: 1 }, { idSuffix: "c3", beliefKey: "autopilot_mode", position: 2 }] },
  "social_8": { intensity: 5, choices: [{ idSuffix: "c1", beliefKey: "betrayal_trauma", position: 0 }, { idSuffix: "c2", beliefKey: "imposter_syndrome", position: 1 }, { idSuffix: "c3", beliefKey: "hard_work_only", position: 2 }] },
  "social_9": { intensity: 3, choices: [{ idSuffix: "c1", beliefKey: "money_is_danger", position: 0 }, { idSuffix: "c2", beliefKey: "shame_of_success", position: 1 }, { idSuffix: "c3", beliefKey: "fear_of_conflict", position: 2 }] },
  "legacy_0": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "scarcity_mindset", position: 0 }, { idSuffix: "c2", beliefKey: "capacity_expansion", position: 1 }, { idSuffix: "c3", beliefKey: "hero_martyr", position: 2 }] },
  "legacy_1": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "boundary_collapse", position: 0 }, { idSuffix: "c2", beliefKey: "family_loyalty", position: 1 }, { idSuffix: "c3", beliefKey: "unconscious_fear", position: 2 }] },
  "legacy_2": { intensity: 5, choices: [{ idSuffix: "c1", beliefKey: "unconscious_fear", position: 0 }, { idSuffix: "c2", beliefKey: "ambivalence_loop", position: 1 }, { idSuffix: "c3", beliefKey: "resource_toxicity", position: 2 }] }, 
  "legacy_3": { intensity: 4, choices: [{ idSuffix: "c1", beliefKey: "hero_martyr", position: 0 }, { idSuffix: "c2", beliefKey: "poverty_is_virtue", position: 1 }, { idSuffix: "c3", beliefKey: "autopilot_mode", position: 2 }] },
  "legacy_4": { intensity: 5, choices: [{ idSuffix: "c1", beliefKey: "family_loyalty", position: 0 }, { idSuffix: "c2", beliefKey: "golden_cage", position: 1 }, { idSuffix: "c3", beliefKey: "hero_martyr", position: 2 }] },
};

const DEFAULT_NODE_CONFIG: NodeConfig = {
    intensity: 3,
    choices: [
        { idSuffix: "c1", beliefKey: "unconscious_fear", position: 0 },
        { idSuffix: "c2", beliefKey: "capacity_expansion", position: 1 },
        { idSuffix: "c3", beliefKey: "scarcity_mindset", position: 2 }
    ]
};

const buildRegistry = () => {
  const registry: Record<string, Record<string, Scene>> = {};
  DOMAIN_SETTINGS.forEach((domain) => {
    registry[domain.key] = {};
    for (let i = 0; i < domain.count; i++) {
      const absoluteId = (domain.startId + i).toString();
      const relativeKey = `${domain.key}_${i}`;
      const config = NODE_CONFIGS[relativeKey] || DEFAULT_NODE_CONFIG;
      const translationKeyBase = `scenes.${relativeKey}`;
      registry[domain.key][absoluteId] = {
        id: absoluteId,
        key: relativeKey,
        titleKey: `${translationKeyBase}.title`,
        descKey: `${translationKeyBase}.desc`,
        intensity: config.intensity,
        choices: config.choices.map((c, idx) => ({
          id: `${absoluteId}_${c.idSuffix}`, 
          textKey: `${translationKeyBase}.c${idx + 1}`,
          beliefKey: c.beliefKey,
          position: c.position
        }))
      };
    }
  });
  return registry;
};

export const MODULE_REGISTRY = buildRegistry();
