
import { AnalysisResult, ScanHistory, DataCorruptionError, SystemLogEntry, TelemetryEvent, FeedbackEntry } from '../types';
import { STORAGE_KEYS } from '../constants';

export { STORAGE_KEYS };

export interface SessionState {
  nodes: number[];
  history: any[]; 
}

const memoryStore: Record<string, string> = {};

const getStorageProvider = () => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    return {
      getItem: (key: string) => memoryStore[key] || null,
      setItem: (key: string, val: string) => { memoryStore[key] = val; },
      removeItem: (key: string) => { delete memoryStore[key]; },
      getAllKeys: () => Object.keys(memoryStore),
      clear: () => { 
          for (const key in memoryStore) {
              delete memoryStore[key];
          }
      }
    };
  }
};

const provider = getStorageProvider();

const loadHistory = (): ScanHistory => {
  const item = provider.getItem(STORAGE_KEYS.SCAN_HISTORY);
  if (!item) return { 
    scans: [], 
    latestScan: null, 
    evolutionMetrics: { entropyTrend: [], integrityTrend: [], dates: [] } 
  };
  try {
    return JSON.parse(item) as ScanHistory;
  } catch (e) {
    return { scans: [], latestScan: null, evolutionMetrics: { entropyTrend: [], integrityTrend: [], dates: [] } };
  }
};

export const StorageService = {
  save: (key: string, data: unknown) => {
    try {
      provider.setItem(key, JSON.stringify(data));
    } catch (e) {
      StorageService.logEvent('ERROR', 'STORAGE', 'SAVE_FAILED', { key, error: String(e) });
    }
  },
  
  load: <T,>(key: string, fallback: T): T => {
    const item = provider.getItem(key);
    if (!item) return fallback;
    try {
      return JSON.parse(item) as T;
    } catch (e) {
      StorageService.logEvent('ERROR', 'STORAGE', 'PARSE_FAILED', { key, error: String(e) });
      throw new DataCorruptionError(`Failed to parse data for key: ${key}`);
    }
  },

  logTelemetry: (event: Omit<TelemetryEvent, 'timestamp' | 'isOutlier'>) => {
      try {
          const raw = provider.getItem(STORAGE_KEYS.TELEMETRY_DATA);
          const data: TelemetryEvent[] = raw ? JSON.parse(raw) : [];
          
          const newEvent: TelemetryEvent = {
              ...event,
              timestamp: Date.now(),
              isOutlier: event.latency > 30000 || event.latency < 200
          };
          
          data.push(newEvent);
          if (data.length > 200) data.shift();
          
          provider.setItem(STORAGE_KEYS.TELEMETRY_DATA, JSON.stringify(data));
      } catch (e) {
          console.error("Telemetry failed", e);
      }
  },

  getTelemetry: (): TelemetryEvent[] => {
      return StorageService.load<TelemetryEvent[]>(STORAGE_KEYS.TELEMETRY_DATA, []);
  },

  saveFeedback: (entry: FeedbackEntry) => {
      const logs = StorageService.load<FeedbackEntry[]>(STORAGE_KEYS.CLINICAL_FEEDBACK, []);
      logs.unshift(entry);
      if (logs.length > 50) logs.length = 50;
      StorageService.save(STORAGE_KEYS.CLINICAL_FEEDBACK, logs);
      StorageService.logEvent('INFO', 'LEARNING', 'FEEDBACK_RECORDED', { accuracy: entry.isAccurate });
  },

  getFeedback: (): FeedbackEntry[] => {
      return StorageService.load<FeedbackEntry[]>(STORAGE_KEYS.CLINICAL_FEEDBACK, []);
  },

  async saveScan(result: AnalysisResult): Promise<void> {
    const history = loadHistory();
    const deterministicResult: AnalysisResult = { ...result, timestamp: Date.now() };
    
    history.scans.push(deterministicResult);
    history.latestScan = deterministicResult;
    history.evolutionMetrics.entropyTrend.push(deterministicResult.entropyScore);
    history.evolutionMetrics.integrityTrend.push(deterministicResult.integrity);
    history.evolutionMetrics.dates.push(new Date().toISOString());

    StorageService.save(STORAGE_KEYS.SCAN_HISTORY, history);
    StorageService.logEvent('INFO', 'SCANS', 'SCAN_SAVED', { integrity: result.integrity, variant: result.variantId });
  },

  getScanHistory(): ScanHistory { return loadHistory(); },
  
  logEvent: (level: SystemLogEntry['level'], module: string, action: string, details?: any) => {
    try {
        const item = provider.getItem(STORAGE_KEYS.AUDIT_LOG);
        const logs: SystemLogEntry[] = item ? JSON.parse(item) : [];
        const newLog: SystemLogEntry = {
            timestamp: new Date().toISOString(), level, module, action, details: details || null
        };
        logs.unshift(newLog);
        if (logs.length > 50) logs.length = 50;
        provider.setItem(STORAGE_KEYS.AUDIT_LOG, JSON.stringify(logs));
        window.dispatchEvent(new CustomEvent('system_log_update', { detail: newLog }));
    } catch (e) {
        console.error("Critical logging failure:", e);
    }
  },

  repairSession: () => {
    try {
        const state = provider.getItem(STORAGE_KEYS.SESSION_STATE);
        if (!state) return { success: false, message: "No session found" };
        const parsed = JSON.parse(state);
        if (Array.isArray(parsed.nodes) && Array.isArray(parsed.history)) {
            let repaired = false;
            if (parsed.nodes.length !== parsed.history.length) {
                const minLen = Math.min(parsed.nodes.length, parsed.history.length);
                parsed.nodes = parsed.nodes.slice(0, minLen);
                parsed.history = parsed.history.slice(0, minLen);
                repaired = true;
            }
            parsed.nodes = [...new Set(parsed.nodes)];
            StorageService.save(STORAGE_KEYS.SESSION_STATE, parsed);
            StorageService.logEvent('SYSTEM', 'RECOVERY', 'SESSION_REPAIRED', { repaired });
            return { success: true, message: repaired ? "Length mismatch repaired" : "Session validated as healthy" };
        }
        return { success: false, message: "Incompatible data structure" };
    } catch (e) {
        StorageService.logEvent('ERROR', 'RECOVERY', 'REPAIR_FAILED', { error: String(e) });
        return { success: false, message: "Fatal corruption. Reset required." };
    }
  },

  injectState: (newState: string) => {
      try {
          const parsed = JSON.parse(newState);
          if (!parsed.nodes || !parsed.history) throw new Error("Invalid structure");
          provider.setItem(STORAGE_KEYS.SESSION_STATE, newState);
          StorageService.logEvent('SYSTEM', 'RECOVERY', 'STATE_INJECTED');
          return true;
      } catch(e) { return false; }
  },

  clear: () => {
    const preservedKeys: string[] = [STORAGE_KEYS.LANG, STORAGE_KEYS.AUDIT_LOG, STORAGE_KEYS.TELEMETRY_DATA, STORAGE_KEYS.CLINICAL_FEEDBACK];
    Object.values(STORAGE_KEYS).forEach(key => {
      if (!preservedKeys.includes(key as any)) {
        provider.removeItem(key as any);
      }
    });
    StorageService.logEvent('SYSTEM', 'STORAGE', 'FACTORY_WIPE');
  }
};
