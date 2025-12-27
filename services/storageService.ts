import { AnalysisResult, ScanHistory, SystemLogEntry, TelemetryEvent, FeedbackEntry, LicenseRecord } from '../types';
import { STORAGE_KEYS } from '../constants';
import { SecurityCore } from '../utils/crypto';

export { STORAGE_KEYS };

const INTERNAL_KEY = "genesis_stable_v3";

export interface SessionState {
  nodes: number[];
  history: any[]; 
}

const getStorageProvider = () => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    return null; 
  }
};

const provider = getStorageProvider();

const loadHistory = (): ScanHistory => {
  const item = provider?.getItem(STORAGE_KEYS.SCAN_HISTORY);
  if (!item) return { scans: [], latestScan: null, evolutionMetrics: { entropyTrend: [], integrityTrend: [], dates: [] } };
  
  const decrypted = SecurityCore.safeDecode(item, INTERNAL_KEY);
  
  if (decrypted) {
      return decrypted;
  }

  try {
    const raw = JSON.parse(item);
    if (raw.scans) return raw;
  } catch (e) {
     console.error("StorageService: History unrecoverable.");
  }

  return { scans: [], latestScan: null, evolutionMetrics: { entropyTrend: [], integrityTrend: [], dates: [] } };
};

export const StorageService = {
  save: (key: string, data: unknown) => {
    try {
      const isSensitive = [STORAGE_KEYS.SCAN_HISTORY, STORAGE_KEYS.SESSION_STATE, STORAGE_KEYS.TELEMETRY_DATA, 'genesis_license_registry'].includes(key as any);
      const payload = isSensitive ? SecurityCore.safeEncode(data, INTERNAL_KEY) : JSON.stringify(data);
      provider?.setItem(key, payload);
    } catch (e) {
      StorageService.logEvent('ERROR', 'STORAGE', 'SAVE_FAILED', { key, error: String(e) });
    }
  },
  
  load: <T,>(key: string, fallback: T): T => {
    const item = provider?.getItem(key);
    if (!item) return fallback;
    
    const isSensitive = [STORAGE_KEYS.SCAN_HISTORY, STORAGE_KEYS.SESSION_STATE, STORAGE_KEYS.TELEMETRY_DATA, 'genesis_license_registry'].includes(key as any);
    if (isSensitive) {
        const decrypted = SecurityCore.safeDecode(item, INTERNAL_KEY);
        if (decrypted) return decrypted as T;
        
        console.warn(`StorageService: Access Denied for ${key} (Integrity/Device Mismatch)`);
        return fallback; 
    }

    try {
      return JSON.parse(item) as T;
    } catch (e) {
      return fallback;
    }
  },

  saveLicenseRecord: (record: LicenseRecord) => {
      const registry = StorageService.load<LicenseRecord[]>('genesis_license_registry', []);
      registry.unshift(record);
      StorageService.save('genesis_license_registry', registry);
  },

  updateLicenseStatus: (key: string, status: LicenseRecord['status']) => {
      const registry = StorageService.load<LicenseRecord[]>('genesis_license_registry', []);
      const updated = registry.map(r => r.key === key ? { ...r, status } : r);
      StorageService.save('genesis_license_registry', updated);
  },

  getLicenseRegistry: (): LicenseRecord[] => StorageService.load<LicenseRecord[]>('genesis_license_registry', []),

  logTelemetry: (event: Omit<TelemetryEvent, 'timestamp' | 'isOutlier'>) => {
      try {
          const data = StorageService.load<TelemetryEvent[]>(STORAGE_KEYS.TELEMETRY_DATA, []);
          const newEvent: TelemetryEvent = {
              ...event,
              timestamp: Date.now(),
              isOutlier: event.latency > 30000 || event.latency < 200
          };
          data.push(newEvent);
          if (data.length > 200) data.shift();
          StorageService.save(STORAGE_KEYS.TELEMETRY_DATA, data);
      } catch (e) {
          console.error("Telemetry failed", e);
      }
  },

  getTelemetry: (): TelemetryEvent[] => StorageService.load<TelemetryEvent[]>(STORAGE_KEYS.TELEMETRY_DATA, []),

  saveFeedback: (entry: FeedbackEntry) => {
      const logs = StorageService.load<FeedbackEntry[]>(STORAGE_KEYS.CLINICAL_FEEDBACK, []);
      logs.unshift(entry);
      if (logs.length > 50) logs.length = 50;
      StorageService.save(STORAGE_KEYS.CLINICAL_FEEDBACK, logs);
  },

  getFeedback: (): FeedbackEntry[] => StorageService.load<FeedbackEntry[]>(STORAGE_KEYS.CLINICAL_FEEDBACK, []),

  async saveScan(result: AnalysisResult): Promise<void> {
    const history = loadHistory();
    const deterministicResult: AnalysisResult = { ...result, timestamp: Date.now() };
    
    history.scans.push(deterministicResult);
    history.latestScan = deterministicResult;
    history.evolutionMetrics.entropyTrend.push(deterministicResult.entropyScore);
    history.evolutionMetrics.integrityTrend.push(deterministicResult.integrity);
    history.evolutionMetrics.dates.push(new Date().toISOString());

    StorageService.save(STORAGE_KEYS.SCAN_HISTORY, history);
  },

  getScanHistory(): ScanHistory { return loadHistory(); },
  
  logEvent: (level: SystemLogEntry['level'], module: string, action: string, details?: any) => {
    try {
        const item = provider?.getItem(STORAGE_KEYS.AUDIT_LOG);
        const logs: SystemLogEntry[] = item ? JSON.parse(item) : [];
        const newLog: SystemLogEntry = {
            timestamp: new Date().toISOString(), level, module, action, details: details || null
        };
        logs.unshift(newLog);
        if (logs.length > 50) logs.length = 50;
        provider?.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(logs));
    } catch (e) {}
  },

  injectState: (json: string): boolean => {
    try {
      const data = JSON.parse(json);
      if (!data || typeof data !== 'object') return false;

      if (data.history && Array.isArray(data.history)) {
          StorageService.save(STORAGE_KEYS.SESSION_STATE, {
              nodes: data.nodes || [],
              history: data.history
          });
          return true;
      }

      let injected = false;
      Object.entries(data).forEach(([key, value]) => {
          if (Object.values(STORAGE_KEYS).includes(key as any)) {
              StorageService.save(key, value);
              injected = true;
          }
      });
      return injected;
    } catch (e) {
      return false;
    }
  },

  clear: () => {
    const preservedKeys: string[] = [STORAGE_KEYS.LANG, STORAGE_KEYS.AUDIT_LOG, STORAGE_KEYS.CLINICAL_FEEDBACK, 'genesis_license_registry'];
    Object.values(STORAGE_KEYS).forEach(key => {
      if (!preservedKeys.includes(key as any)) {
        provider?.removeItem(key as any);
      }
    });
  }
};