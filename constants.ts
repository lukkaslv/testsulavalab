
import { Scene, BeliefKey, DomainType, DomainConfig, SubscriptionTier } from './types';

export const STORAGE_KEYS = {
  LANG: 'genesis_lang',
  SESSION: 'genesis_session',
  SESSION_STATE: 'genesis_session_state',
  SCAN_HISTORY: 'genesis_scan_history',
  AUDIT_LOG: 'genesis_audit_log',
  ROADMAP_STATE: 'genesis_roadmap_state',
  TELEMETRY_DATA: 'genesis_telemetry',
  CLINICAL_FEEDBACK: 'genesis_clinical_feedback',
  SESSION_CONTEXT: 'genesis_session_context'
} as const;

// ВЕРСИОНИРОВАНИЕ И НАДЗОР СИСТЕМЫ
export const SYSTEM_METADATA = {
    VERSION: '16.0.0-EMERGENCE', 
    CONSTITUTION: '2.0',
    LOGIC_VERSION: '11.0-EMG',
    LAST_UPDATED: '2026-01-05',
    CODENAME: 'Матрица Эмерджентности', // Переведено
    GITHUB_LEDGER_URL: 'https://raw.githubusercontent.com/genesis-os/ledger/main/ledger.json',
    CORE_LOGIC_ANCHOR: 'E1M_EFF_V16_PRO'
};

// БИЗНЕС-КОНФИГУРАЦИЯ
export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, number> = {
    FREE: 1,
    SOLO: 30, 
    CLINICAL: 30,
    LAB: 9999
};

export const PRICING_CONFIG = {
    CURRENCY: '₽',
    PLANS: {
        FREE: 0,
        PRO: 8990
    }
};

// СИСТЕМНЫЕ ПОРОГИ (ПСИХОМЕТРИКА)
export const PSYCHO_CONFIG = {
  DISTRACTION_THRESHOLD_MS: 30000, 
  IMPULSE_THRESHOLD_MS: 800,      
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

export const DOMAIN_SETTINGS: DomainConfig[] = RAW_DOMAINS.reduce((acc, domain, index) => {
    const prev = index > 0 ? acc[index - 1] : { startId: 0, count: 0 };
    const startId = prev.startId + prev.count;
    const colors: Record<DomainType, string> = {
        foundation: 'rgba(16, 185, 129, 0.08)',
        agency: 'rgba(59, 130, 246, 0.08)',
        money: 'rgba(99, 102, 241, 0.08)',
        social: 'rgba(192, 132, 252, 0.08)',
        legacy: 'rgba(244, 114, 182, 0.08)',
    };
    acc.push({
        key: domain,
        count: DOMAIN_COUNTS[domain],
        color: colors[domain],
        startId,
    });
    return acc;
}, [] as DomainConfig[]);

export const TOTAL_NODES = DOMAIN_SETTINGS.reduce((sum, d) => sum + d.count, 0);

type NodeConfigMap = { [key: string]: Scene };
export const NODE_CONFIGS: NodeConfigMap = {};
export const MODULE_REGISTRY: { [domain in DomainType]?: { [id: string]: Scene } } = {};

DOMAIN_SETTINGS.forEach(domainConfig => {
    const domainModule: { [id: string]: Scene } = {};
    for (let i = 0; i < domainConfig.count; i++) {
        const absoluteId = domainConfig.startId + i;
        const nodeKey = `${domainConfig.key}_${i}`;
        const scene: Scene = {
            id: absoluteId.toString(),
            key: nodeKey,
            titleKey: `scenes.${nodeKey}.title`,
            descKey: `scenes.${nodeKey}.desc`,
            intensity: (i % 5) + 1,
            choices: [
                { id: 'c1', textKey: `scenes.${nodeKey}.c1`, beliefKey: ALL_BELIEFS[(i * 3) % ALL_BELIEFS.length], position: 0 },
                { id: 'c2', textKey: `scenes.${nodeKey}.c2`, beliefKey: ALL_BELIEFS[(i * 3 + 1) % ALL_BELIEFS.length], position: 1 },
                { id: 'c3', textKey: `scenes.${nodeKey}.c3`, beliefKey: ALL_BELIEFS[(i * 3 + 2) % ALL_BELIEFS.length], position: 2 },
            ]
        };
        NODE_CONFIGS[nodeKey] = scene;
        domainModule[absoluteId.toString()] = scene;
    }
    MODULE_REGISTRY[domainConfig.key] = domainModule;
});
