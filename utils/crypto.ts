
/**
 * Слой Безопасности Genesis OS v10.0 (Адамантовый Якорь)
 * Целостность Исходного Кода и Строгое Соблюдение Конституции.
 */

import { forensicHash } from './helpers';

const SYSTEM_SALT = "GENESIS_CORE_V10_STABLE_SALT";
const LICENSE_SALT = "V10_PHASE_SECURE_2026_SALT";

export const SecurityCore = {
    // Генерация контрольной суммы для блоков данных (Ст. 28)
    generateChecksum: (data: string, type: 'license' | 'system' = 'system'): string => {
        const salt = type === 'license' ? LICENSE_SALT : SYSTEM_SALT;
        return forensicHash(data + salt).toUpperCase();
    },

    // Ст. 28: Верификатор Адамантового Якоря
    // Проверяет, что функции ядра логики не были изменены
    verifyAnchor: (fn: Function, expectedHash: string): boolean => {
        const source = fn.toString().replace(/\s/g, '');
        const actualHash = forensicHash(source).substring(0, 8).toUpperCase();
        return actualHash === expectedHash;
    },

    getDeviceFingerprint: (): string => {
        if (typeof window === 'undefined') return "SERVER_CONTEXT";
        const parts = [
            navigator.userAgent,
            navigator.language,
            navigator.hardwareConcurrency || 4,
            (window.screen?.width || 0).toString(),
            (window.screen?.height || 0).toString(),
            "GENESIS_V10_STABLE_SOVEREIGN"
        ];
        return forensicHash(parts.join('|')).substring(0, 12).toUpperCase();
    },

    cipher: (text: string, key: string, dynamicSalt: string = ""): string => {
        const deviceID = SecurityCore.getDeviceFingerprint();
        const fullKey = key + SYSTEM_SALT + deviceID + dynamicSalt;
        return text.split('').map((char, i) => {
            const keyChar = fullKey.charCodeAt(i % fullKey.length);
            return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
        }).join('');
    },

    // Unicode-safe Base64 Encode
    toBase64: (str: string): string => {
        try {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                (_match, p1) => String.fromCharCode(parseInt(p1, 16)))
            );
        } catch (e) {
            console.error("Base64 Encode Error", e);
            return "";
        }
    },

    // Unicode-safe Base64 Decode
    fromBase64: (str: string): string => {
        try {
            return decodeURIComponent(atob(str).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            return "";
        }
    },

    safeEncode: (data: any, key: string): string => {
        const json = JSON.stringify(data);
        const checksum = SecurityCore.generateChecksum(json);
        const ts = Date.now().toString();
        const payload = JSON.stringify({ d: json, c: checksum, ts: ts });
        const encryptedPayload = SecurityCore.cipher(payload, key, ts);
        return SecurityCore.toBase64(`${ts}::${encryptedPayload}`);
    },

    safeDecode: (encoded: string, key: string): any | null => {
        try {
            const decodedString = SecurityCore.fromBase64(encoded.trim().replace(/\s/g, ''));
            const parts = decodedString.split('::');
            if (parts.length !== 2) return null;
            
            const [ts, encrypted] = parts;
            const decrypted = SecurityCore.cipher(encrypted, key, ts);
            const payload = JSON.parse(decrypted);

            // Проверка TTL 1 год для чувствительных токенов
            if (payload.ts && Math.abs(Date.now() - parseInt(payload.ts)) > 31536000000) return null; 
            if (SecurityCore.generateChecksum(payload.d) !== payload.c) return null;
            return JSON.parse(payload.d);
        } catch (e) {
            return null;
        }
    },

    validateLicense: (key: string): { status: 'VALID' | 'EXPIRED' | 'INVALID' | 'REVOKED'; tier: string; expiry: number } => {
        if (!key || !key.startsWith('GNS-')) return { status: 'INVALID', tier: 'FREE', expiry: 0 };
        const parts = key.split('-');
        if (parts.length !== 4) return { status: 'INVALID', tier: 'FREE', expiry: 0 };
        const [, tier, expiryStr, hash] = parts;
        const expiry = parseInt(expiryStr, 10);
        const calculatedHash = SecurityCore.generateChecksum(`GNS|${tier}|${expiry}`, 'license');
        if (calculatedHash !== hash) return { status: 'INVALID', tier: 'FREE', expiry: 0 };
        if (Date.now() > expiry) return { status: 'EXPIRED', tier: tier as any, expiry };
        return { status: 'VALID', tier: tier as any, expiry };
    },

    generateLicense: (tier: string, days: number): string => {
        const expiry = Date.now() + (days * 24 * 60 * 60 * 1000);
        const rawData = `GNS|${tier}|${expiry}`;
        const hash = SecurityCore.generateChecksum(rawData, 'license');
        return `GNS-${tier}-${expiry}-${hash}`;
    },

    nullify: (obj: any) => {
        if (!obj) return;
        Object.keys(obj).forEach(key => {
            try { obj[key] = null; } catch(e) {}
        });
    }
};
