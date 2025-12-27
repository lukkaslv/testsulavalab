
/**
 * Genesis OS Security Layer v2.0 (The Glass Vault)
 * Device-Bound Encryption & Integrity Engine.
 */

const SYSTEM_SALT = "GENESIS_CORE_9.8";
const LICENSE_SALT = "MASTER_KEY_GENESIS_2025";

export const SecurityCore = {
    // Generate a simple integrity checksum
    generateChecksum: (data: string): string => {
        let a = 1, b = 0;
        for (let i = 0; i < data.length; i++) {
            a = (a + data.charCodeAt(i)) % 65521;
            b = (b + a) % 65521;
        }
        return ((b << 16) | a).toString(16).toUpperCase();
    },

    // Generates a unique fingerprint based on the browser/device environment.
    // This binds the storage data to the specific machine.
    getDeviceFingerprint: (): string => {
        if (typeof window === 'undefined') return "SERVER_FALLBACK";
        const parts = [
            navigator.userAgent || "UA",
            navigator.language || "LANG",
            (window.screen?.width || 0).toString(),
            (navigator.hardwareConcurrency || 1).toString()
        ];
        // Create a hash of the environment to avoid storing PII directly
        return SecurityCore.generateChecksum(parts.join('|'));
    },

    // XOR Cipher with Device Binding
    cipher: (text: string, key: string): string => {
        // The effective key is the Static Key + Device Fingerprint
        // This prevents "Session Cloning" attacks (copying localStorage to another device).
        const deviceID = SecurityCore.getDeviceFingerprint();
        const fullKey = key + SYSTEM_SALT + deviceID;
        
        return text.split('').map((char, i) => {
            const keyChar = fullKey.charCodeAt(i % fullKey.length);
            return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
        }).join('');
    },

    safeEncode: (data: any, key: string): string => {
        const json = JSON.stringify(data);
        const checksum = SecurityCore.generateChecksum(json);
        const payload = JSON.stringify({ d: json, c: checksum });
        const encrypted = SecurityCore.cipher(payload, key);
        return btoa(encrypted);
    },

    safeDecode: (encoded: string, key: string): any | null => {
        try {
            const encrypted = atob(encoded);
            const decrypted = SecurityCore.cipher(encrypted, key);
            const { d, c } = JSON.parse(decrypted);
            
            // Integrity Check 1: Hash mismatch (Tampering)
            if (SecurityCore.generateChecksum(d) !== c) {
                console.warn("SecurityCore: Checksum Mismatch (Tampering Detected)");
                return null;
            }
            
            return JSON.parse(d);
        } catch (e) {
            // Integrity Check 2: Decryption failure (Wrong Device or Corrupt Data)
            console.warn("SecurityCore: Decryption Failed (Device Mismatch or Corruption)");
            return null; 
        }
    },

    /**
     * OFFLINE LICENSE SYSTEM
     * Format: GNS-[TIER]-[EXPIRY_TS]-[HASH]
     */
    validateLicense: (key: string): { status: 'VALID' | 'EXPIRED' | 'INVALID'; tier: string; expiry: number } => {
        if (!key || !key.startsWith('GNS-')) return { status: 'INVALID', tier: 'FREE', expiry: 0 };
        
        const parts = key.split('-');
        if (parts.length !== 4) return { status: 'INVALID', tier: 'FREE', expiry: 0 };

        const [, tier, expiryStr, hash] = parts;
        const expiry = parseInt(expiryStr, 10);
        
        // 1. Verify Integrity (Math)
        const rawData = `GNS|${tier}|${expiry}|${LICENSE_SALT}`;
        const calculatedHash = SecurityCore.generateChecksum(rawData);

        if (calculatedHash !== hash) {
            return { status: 'INVALID', tier: 'FREE', expiry: 0 };
        }

        // 2. Verify Expiration (Time)
        if (Date.now() > expiry) {
            return { status: 'EXPIRED', tier: tier as any, expiry };
        }

        return {
            status: 'VALID',
            tier: tier as any,
            expiry
        };
    },

    generateLicense: (tier: string, days: number): string => {
        const expiry = Date.now() + (days * 24 * 60 * 60 * 1000);
        const rawData = `GNS|${tier}|${expiry}|${LICENSE_SALT}`;
        const hash = SecurityCore.generateChecksum(rawData);
        return `GNS-${tier}-${expiry}-${hash}`;
    }
};
