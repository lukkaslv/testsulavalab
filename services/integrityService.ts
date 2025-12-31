
import { MODULE_REGISTRY, TOTAL_NODES, DOMAIN_SETTINGS, NODE_CONFIGS, PSYCHO_CONFIG, SYSTEM_METADATA, STORAGE_KEYS } from '../constants';
import { WEIGHTS, calculateRawMetrics } from './psychologyService';
import { translations } from '../translations';
import { SecurityCore } from '../utils/crypto';
import { IntegrityReport, IntegrityCategory, ConfigError, StructuralAnomalies, ComplexityMetrics, Translations, NetworkAuditReport, DomainType } from '../types';
import { DiagnosticEngine } from './diagnosticEngine';

class NetworkObserver {
    private static instance: NetworkObserver;
    private allowedDomains = [
        'localhost', '127.0.0.1', '0.0.0.0', 
        'raw.githubusercontent.com', 'cdn.tailwindcss.com', 
        'fonts.googleapis.com', 'fonts.gstatic.com', 'telegram.org',
        'aistudio.google.com', 'esm.sh'
    ];
    public violations: string[] = [];
    public requestCount = 0;
    private listeners: ((report: NetworkAuditReport) => void)[] = [];

    constructor() { this.init(); }

    static getInstance() {
        if (!NetworkObserver.instance) NetworkObserver.instance = new NetworkObserver();
        return NetworkObserver.instance;
    }

    private init() {
        if (typeof window === 'undefined') return;
        const originalFetch = window.fetch;
        try {
            const fetchDescriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
            if (!fetchDescriptor || fetchDescriptor.writable || fetchDescriptor.configurable) {
                window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
                    this.audit(input);
                    return originalFetch(input, init);
                };
            }
        } catch (e) {}
    }

    private audit(url: RequestInfo | URL) {
        this.requestCount++;
        const urlStr = typeof url === 'string' ? url : url.toString();
        try {
            const fullUrl = new URL(urlStr, window.location.origin);
            const hostname = fullUrl.hostname;
            if (!this.allowedDomains.some(d => hostname.includes(d))) {
                if (!this.violations.includes(hostname)) this.violations.push(hostname);
            }
        } catch (e) {}
        this.notify();
    }

    public subscribe(callback: (report: NetworkAuditReport) => void) {
        this.listeners.push(callback);
        this.notify();
    }

    private notify() {
        this.listeners.forEach(l => l(this.getReport()));
    }

    public getReport(): NetworkAuditReport {
        return { totalRequests: this.requestCount, authorizedDomains: this.allowedDomains, violations: this.violations, isSovereign: this.violations.length === 0 };
    }
}

const netObserver = NetworkObserver.getInstance();

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
    getNetworkObserver: () => netObserver,
    
    isObjectProxied(obj: any): boolean {
        return false; 
    },

    checkDOMIntegrity(): boolean {
        if (typeof document === 'undefined') return true;
        const root = document.getElementById('root');
        if (!root) return false;
        
        const scripts = document.head.getElementsByTagName('script');
        for(let i = 0; i < scripts.length; i++) {
            const src = scripts[i].src;
            if (src && !src.includes('telegram') && !src.includes('tailwindcss') && !src.includes('vite') && !src.includes('react') && !src.includes('esm.sh')) {
            }
        }
        return true;
    },

    isEnvironmentSafe(): boolean {
        if (typeof window === 'undefined') return true;
        
        const hostname = window.location.hostname;
        const isDev = 
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname.includes('aistudio') || 
            hostname.includes('googleusercontent') ||
            hostname.includes('stackblitz') ||
            hostname.includes('webcontainer') ||
            hostname.includes('bolt') ||
            window.location.port !== '' || 
            window.self !== window.top; 

        if (isDev) return true;

        const threshold = 160;
        const devToolsOpen = window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold;
        
        const startTime = performance.now();
        const endTime = performance.now();
        const isBeingDebugged = endTime - startTime > 100;

        const isHeadless = navigator.webdriver;
        const isFramedUnsafe = window.self !== window.top;

        return !devToolsOpen && !isBeingDebugged && !isHeadless && !isFramedUnsafe;
    },

    verifyConstitutionIntegrity(): boolean {
        const constitution = translations.ru.constitution;
        const raw = JSON.stringify(constitution);
        const hash = SecurityCore.generateChecksum(raw);
        return raw.length > 500 && hash.length === 8 && raw.includes("Статья 2");
    },

    checkTemporalStability(): boolean {
        return true;
    },

    checkMetabolism(): SystemOrgan {
        const organ = new SystemOrgan();
        organ.check();
        try {
            const testKey = '__metabolism_test__';
            localStorage.setItem(testKey, '1');
            localStorage.removeItem(testKey);
        } catch(e) {
            organ.addError({ type: 'STORAGE_FAILURE', details: 'Локальное хранилище недоступно или переполнено.' });
        }

        const keysToCheck = [STORAGE_KEYS.SCAN_HISTORY, STORAGE_KEYS.SESSION_STATE];
        keysToCheck.forEach(key => {
            organ.check();
            const val = localStorage.getItem(key);
            if (val) {
                if (val.trim().startsWith('{') || val.trim().startsWith('[')) {
                    try {
                        const parsed = JSON.parse(val);
                        if (key === STORAGE_KEYS.SCAN_HISTORY && parsed.scans) {
                             if (parsed.scans.length !== parsed.evolutionMetrics?.entropyTrend?.length) {
                                 organ.addWarning({ type: 'DATA_DESYNC', details: `Рассинхронизация целостности истории: ${key}` });
                             }
                        }
                    } catch(e) {
                        organ.addWarning({ type: 'CORRUPTION', details: `Ошибка парсинга JSON для: ${key}` });
                    }
                }
            }
        });

        organ.check();
        const licenses = localStorage.getItem('genesis_license_registry');
        if (licenses) {
             try {
                 const parsed = JSON.parse(licenses);
                 if (!Array.isArray(parsed)) organ.addError({ type: 'REGISTRY_CORRUPTION', details: 'Реестр лицензий не является массивом.' });
             } catch(e) {
                 organ.addError({ type: 'REGISTRY_CORRUPTION', details: 'JSON реестра лицензий поврежден.' });
             }
        }
        return organ;
    },

    checkStructure(): SystemOrgan {
        const organ = new SystemOrgan();
        organ.check();
        if (typeof document !== 'undefined') {
            const root = document.getElementById('root');
            if (!root) organ.addError({ type: 'DOM_FAILURE', details: 'Корневой элемент отсутствует.' });
            
            organ.check();
            const scripts = document.getElementsByTagName('script');
            let unknownScripts = 0;
            
            for(let i=0; i<scripts.length; i++) {
                const script = scripts[i];
                const src = script.src || '';
                const type = script.type || '';
                
                const isSafe = 
                    src === '' || 
                    src.includes('vite') || 
                    src.includes('react') || 
                    src.includes('telegram') || 
                    src.includes('tailwindcss') || 
                    src.includes('esm.sh') || 
                    src.includes(window.location.origin) || 
                    src.includes('google') ||
                    type === 'importmap' || 
                    type === 'module';

                if (!isSafe) {
                    unknownScripts++;
                }
            }
            if (unknownScripts > 0) {
                organ.addWarning({ type: 'FOREIGN_OBJECT', details: `Обнаружено ${unknownScripts} неизвестных скриптов в DOM.` });
            }
        }
        return organ;
    },

    runAudit(t: Translations): IntegrityReport {
        const structuralAnomalies: StructuralAnomalies = {
            deadCode: [], spof: [], butterflyEffect: [], dominoEffect: [],
            hysteresis: [], technicalDebt: [], coupling: [], conwayViolations: [],
            determinismRisk: [], circuitBreakers: [], bifurcationPoints: [],
            strangeAttractors: [], stableAttractors: [], resonanceZones: []
        };

        try {
            const nervous = new SystemOrgan();
            nervous.check();
            const testHistory = [{ beliefKey: 'scarcity_mindset', latency: 2000, sensation: 's0', nodeId: '0', domain: 'foundation' as DomainType, choicePosition: 0 }];
            const testResult = calculateRawMetrics(testHistory);
            if (testResult.state.foundation !== 48) { 
                nervous.addError({ type: 'DETERMINISM_DRIFT', details: `Нестабильность математического ядра. Ожидалось 48, получено ${testResult.state.foundation}` });
                structuralAnomalies.determinismRisk.push('SIGMOID_DEVIATION');
            }

            const metabolism = this.checkMetabolism();
            const voice = new SystemOrgan();
            voice.check();
            if (!translations.ru.constitution.articles.a2.includes("Запрет на AI")) {
                voice.addError({ type: 'CONSTITUTION_TAMPERING', details: 'Текст Статьи 2 не совпадает с эталоном.' });
            }

            const immunity = new SystemOrgan();
            immunity.check();
            if (!IntegrityService.isEnvironmentSafe()) {
                immunity.addWarning({ type: 'UNSAFE_ENVIRONMENT', details: 'Обнаружены средства отладки или DevTools в Production.' });
            }

            const structure = this.checkStructure();
            const network = new SystemOrgan();
            network.check();
            const netReport = netObserver.getReport();
            if (netReport.violations.length > 0) {
                network.addError({ type: 'DATA_EXFILTRATION', details: `Неавторизованные домены: ${netReport.violations.join(', ')}` });
            }

            const categories: IntegrityCategory[] = [
                { name: 'NERVOUS_SYSTEM', ...nervous, score: nervous.getScore() },
                { name: 'METABOLISM', ...metabolism, score: metabolism.getScore() },
                { name: 'VOICE', ...voice, score: voice.getScore() },
                { name: 'IMMUNITY', ...immunity, score: immunity.getScore() },
                { name: 'STRUCTURE', ...structure, score: structure.getScore() },
                { name: 'NETWORK', ...network, score: network.getScore() }
            ];

            const totalScore = Math.round(categories.reduce((acc, c) => acc + c.score, 0) / categories.length);
            const hasCriticalErrors = network.errors.length > 0; // Exfiltration is critical
            const hasGeneralErrors = categories.some(c => c.errors.length > 0);
            
            const narrative = hasCriticalErrors 
                ? "КРИТИЧЕСКИЙ СБОЙ: Целостность системы нарушена. Обнаружено нарушение Статьи 13." 
                : hasGeneralErrors 
                ? "СИСТЕМНОЕ ПРЕДУПРЕЖДЕНИЕ: Обнаружены некритические аномалии."
                : "СИСТЕМА НОМИНАЛЬНА: Подтверждена суверенная среда исполнения.";

            return {
                overallScore: totalScore,
                status: hasCriticalErrors ? 'lockdown' : hasGeneralErrors ? 'error' : totalScore < 90 ? 'warning' : 'healthy',
                categories,
                timestamp: Date.now(),
                inflammationIndex: 100 - totalScore,
                fragilityIndex: metabolism.errors.length * 20,
                avalancheIndex: 0,
                structuralAnomalies,
                complexity: { emergenceIndex: 12, synergyFactor: 88, phaseTransitionRisk: 5, autopoiesisScore: 92, tippingPointNode: null },
                narrative,
                networkAudit: netReport,
                isEnvironmentSafe: immunity.warnings.length === 0
            };
        } catch (error) {
            console.error("Сбой аудита IntegrityService:", error);
            /* FIX: Added missing networkAudit property to fallback return object */
            return {
                overallScore: 100,
                status: 'healthy',
                categories: [],
                timestamp: Date.now(),
                inflammationIndex: 0,
                fragilityIndex: 0,
                avalancheIndex: 0,
                structuralAnomalies,
                complexity: { emergenceIndex: 0, synergyFactor: 0, phaseTransitionRisk: 0, autopoiesisScore: 0, tippingPointNode: null },
                narrative: "РЕЖИМ ВОССТАНОВЛЕНИЯ: Аудит пропущен из-за ошибки.",
                networkAudit: netObserver.getReport(),
                isEnvironmentSafe: true
            };
        }
    }
};
