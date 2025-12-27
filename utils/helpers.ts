
// Deterministic simple hash for password validation
export const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
};

// Safe deep object property access
export const resolvePath = (obj: Record<string, any>, path: string): string => {
  if (!obj) return `[ROOT_MISSING]`;
  if (!path) return `[PATH_EMPTY]`;
  
  const keys = path.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return `[KEY_ERROR: ${key}]`;
    }
  }
  
  return typeof current === 'string' ? current : `[TYPE_ERROR: ${path}]`;
};

// --- PLATFORM BRIDGE ---
type HapticStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type NotificationType = 'error' | 'success' | 'warning';

export const PlatformBridge = {
  isTelegram: (): boolean => !!(window.Telegram?.WebApp?.initData),

  expand: () => window.Telegram?.WebApp?.expand?.(),
  ready: () => window.Telegram?.WebApp?.ready?.(),

  showConfirm: (message: string, callback: (confirmed: boolean) => void) => {
    const tg = window.Telegram?.WebApp;
    
    // Check for native Telegram confirmation support first (v6.2+)
    if (tg && tg.isVersionAtLeast && tg.isVersionAtLeast('6.2')) {
      try {
        tg.showConfirm(message, (confirmed: boolean) => {
          callback(confirmed);
        });
        return;
      } catch (e) {
        console.warn("Telegram showConfirm failed");
      }
    }

    // Rock-solid fallback
    const confirmed = window.confirm(message);
    callback(confirmed);
  },

  haptic: {
    impact: (style: HapticStyle) => {
      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
    },
    notification: (type: NotificationType) => {
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type);
    },
    selection: () => {
      window.Telegram?.WebApp?.HapticFeedback?.selectionChanged();
    }
  },

  openLink: (url: string) => {
    if (window.Telegram?.WebApp?.openLink) {
      window.Telegram.WebApp.openLink(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
};
