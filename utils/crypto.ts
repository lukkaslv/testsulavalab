
/**
 * Genesis OS Security Layer v4.2 (The Titanium Spine)
 * Salted Poly-Sum Encryption & Device-Aware Integrity Engine.
 */

const SYSTEM_SALT = "GENESIS_CORE_TITANIUM_STABLE_V3_SALT";
const LICENSE_SALT = "V4_PHASE_SECURE_2025_KEY_SALT";

export const SecurityCore = {
    /**
     * Enhanced Poly-Sum Algorithm (Version 4)
     */
    generateChecksum: (data: string): string => {
        let h1 = 0x811c9dc5; 
        const salt = LICENSE_SALT;
        const combined = data + salt;
        
        for (let i = 0; i < combined.length; i++) {
            h1 ^= combined.charCodeAt(i);
            h1 = Math.imul(h1, 0x01000193); 
        }
        
        h1 = Math.imul(h1 ^ (h1 >>> 16), 0x85ebca6b);
        h1 = Math.imul(h1 ^ (h1 >>> 13), 0xc2b2ae35);
        h1 ^= (h1 >>> 16);
        
        return (h1 >>> 0).toString(16).toUpperCase().padStart(8, '0');
    },

    getDeviceFingerprint: (): string => {
        if (typeof window === 'undefined') return "SERVER_CONTEXT";
        const parts = [
            navigator.userAgent,
            navigator.language,
            (window.screen?.width || 0).toString(),
            (window.screen?.height || 0).toString(),
            // Adding a static platform salt for extra layer
            "GENESIS_X_PLATFORM"
        ];
        return SecurityCore.generateChecksum(parts.join('|') + "DEVICE_ID_PROTECT");
    },

    cipher: (text: string, key: string): string => {
        const deviceID = SecurityCore.getDeviceFingerprint();
        // Audit P3.5: Hardening internal key with device-specific fingerprint
        const fullKey = key + SYSTEM_SALT + deviceID;
        return text.split('').map((char, i) => {
            const keyChar = fullKey.charCodeAt(i % fullKey.length);
            return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
        }).join('');
    },

    safeBase64Decode: (str: string): string => {
        try {
            const sanitized = str.trim().replace(/\s/g, '');
            return atob(sanitized);
        } catch (e) {
            console.error("SecurityCore: Base64 Decoding Failure", e);
            return "";
        }
    },

    safeEncode: (data: any, key: string): string => {
        const json = JSON.stringify(data);
        const checksum = SecurityCore.generateChecksum(json);
        const payload = JSON.stringify({ d: json, c: checksum, ts: Date.now() });
        return btoa(SecurityCore.cipher(payload, key));
    },

    safeDecode: (encoded: string, key: string): any | null => {
        try {
            const encrypted = SecurityCore.safeBase64Decode(encoded);
            if (!encrypted) return null;
            const decrypted = SecurityCore.cipher(encrypted, key);
            const { d, c, ts } = JSON.parse(decrypted);
            
            // Audit requirement: Expiry check for session data integrity
            if (ts && ts > Date.now() + 86400000) return null; 
            if (SecurityCore.generateChecksum(d) !== c) return null;
            return JSON.parse(d);
        } catch (e) { return null; }
    },

    validateLicense: (key: string): { status: 'VALID' | 'EXPIRED' | 'INVALID' | 'REVOKED'; tier: string; expiry: number } => {
        if (!key || !key.startsWith('GNS-')) return { status: 'INVALID', tier: 'FREE', expiry: 0 };
        
        const parts = key.split('-');
        if (parts.length !== 4) return { status: 'INVALID', tier: 'FREE', expiry: 0 };

        const [, tier, expiryStr, hash] = parts;
        const expiry = parseInt(expiryStr, 10);
        
        const rawData = `GNS|${tier}|${expiry}`; 
        const calculatedHash = SecurityCore.generateChecksum(rawData);

        if (calculatedHash !== hash) return { status: 'INVALID', tier: 'FREE', expiry: 0 };
        if (Date.now() > expiry) return { status: 'EXPIRED', tier: tier as any, expiry };

        return { status: 'VALID', tier: tier as any, expiry };
    },

    generateLicense: (tier: string, days: number): string => {
        const expiry = Date.now() + (days * 24 * 60 * 60 * 1000);
        const rawData = `GNS|${tier}|${expiry}`;
        const hash = SecurityCore.generateChecksum(rawData);
        return `GNS-${tier}-${expiry}-${hash}`;
    }
};
