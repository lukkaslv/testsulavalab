
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

// Safe deep object property access with enhanced error reporting
export const resolvePath = (obj: Record<string, any>, path: string): string => {
  if (!obj) return `[ROOT_MISSING]`;
  if (!path) return `[PATH_EMPTY]`;
  
  const keys = path.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      console.warn(`Translation path error: "${key}" not found in path "${path}"`);
      return `[KEY_ERROR: ${key}]`;
    }
  }
  
  if (typeof current === 'string') return current;
  if (typeof current === 'object' && current !== null) {
    return `[OBJECT_ERROR: ${path}]`;
  }
  
  return `[TYPE_ERROR: ${path}]`;
};

// --- PLATFORM BRIDGE ---
type HapticStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type NotificationType = 'error' | 'success' | 'warning';

export const PlatformBridge = {
  isTelegram: (): boolean => {
    return !!(window.Telegram?.WebApp?.initData);
  },

  expand: () => {
    if (window.Telegram?.WebApp?.expand) {
      window.Telegram.WebApp.expand();
    }
  },

  ready: () => {
    if (window.Telegram?.WebApp?.ready) {
      window.Telegram.WebApp.ready();
    }
  },

  showConfirm: (message: string, callback: (confirmed: boolean) => void) => {
    const tg = window.Telegram?.WebApp;
    
    // Attempting Telegram native popup first for version 6.2+
    try {
      if (tg && tg.isVersionAtLeast && tg.isVersionAtLeast('6.2') && tg.showPopup) {
        tg.showPopup({
          message: message,
          buttons: [
              { type: 'destructive', id: 'ok', text: 'OK' },
              { type: 'cancel', id: 'cancel', text: 'Cancel' }
          ]
        }, (buttonId: string) => {
          callback(buttonId === 'ok');
        });
        return;
      }
    } catch (e) {
      console.warn("Telegram showPopup failed, falling back to native confirm");
    }

    // Rock-solid fallback for all browsers and old Telegram clients
    const confirmed = window.confirm(message);
    callback(confirmed);
  },

  haptic: {
    impact: (style: HapticStyle) => {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
      } else if (navigator.vibrate) {
        const durations = { light: 10, medium: 20, heavy: 40, rigid: 15, soft: 10 };
        navigator.vibrate(durations[style] || 10);
      }
    },
    notification: (type: NotificationType) => {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
      } else if (navigator.vibrate) {
         const patterns = { success: [20, 50, 20], warning: [30, 50, 30], error: [50, 30, 50, 30, 50] };
         navigator.vibrate(patterns[type] || 50);
      }
    },
    selection: () => {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.selectionChanged();
      }
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
