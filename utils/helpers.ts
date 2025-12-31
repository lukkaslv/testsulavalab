
/**
 * Вспомогательные функции Genesis OS v5.0 (Форензика)
 * Соответствие: Ст. 1.1 (Детерминизм), Ст. 4.1 (Целостность)
 */

// Глубокая заморозка для неизменяемых конституционных констант (Ст. 4.1)
export const deepFreeze = <T extends object>(obj: T): T => {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return obj;
};

// Детерминированный простой хеш для внутренней валидации (Ст. 1.1)
export const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
};

// Форензический хеш для суверенитета данных (Ст. 13)
export const forensicHash = (str: string): string => {
    let h1 = 0x811c9dc5, h2 = 0xcbf29ce4;
    for (let i = 0, l = str.length; i < l; i++) {
        h1 = Math.imul(h1 ^ str.charCodeAt(i), 597399067);
        h2 = Math.imul(h2 ^ str.charCodeAt(i), 285529207);
    }
    return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
};

// Безопасный доступ к глубоким свойствам объекта
export const resolvePath = (obj: Record<string, any>, path: string): string => {
  if (!obj) return `[КОРЕНЬ_ОТСУТСТВУЕТ]`;
  if (!path) return `[ПУТЬ_ПУСТ]`;
  
  const keys = path.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return `[ОШИБКА_КЛЮЧА: ${key}]`;
    }
  }
  
  return typeof current === 'string' ? current : `[ОШИБКА_ТИПА: ${path}]`;
};

// --- МОСТ ПЛАТФОРМЫ (Суверенная Реализация) ---
type HapticStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type NotificationType = 'error' | 'success' | 'warning';

export const PlatformBridge = {
  isTelegram: (): boolean => !!((window as any).Telegram?.WebApp?.initData),

  expand: () => (window as any).Telegram?.WebApp?.expand?.(),
  ready: () => (window as any).Telegram?.WebApp?.ready?.(),

  showConfirm: (message: string, callback: (confirmed: boolean) => void) => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.isVersionAtLeast?.('6.2')) {
      try {
        tg.showConfirm(message, (confirmed: boolean) => callback(confirmed));
        return;
      } catch (e) {
        console.warn("Форензика: Сбой подтверждения Telegram, откат к нативному методу.");
      }
    }
    callback(window.confirm(message));
  },

  haptic: {
    impact: (style: HapticStyle) => {
      (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
    },
    notification: (type: NotificationType) => {
      (window as any).Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type);
    },
    selection: () => {
      (window as any).Telegram?.WebApp?.HapticFeedback?.selectionChanged();
    }
  },

  openLink: (url: string) => {
    if ((window as any).Telegram?.WebApp?.openLink) {
      (window as any).Telegram.WebApp.openLink(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
};
