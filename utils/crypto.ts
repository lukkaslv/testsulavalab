
/**
 * Genesis OS Security Layer v2.1 (The Glass Vault)
 * Device-Bound Encryption & Integrity Engine.
 */

const SYSTEM_SALT = "GENESIS_CORE_9.9_STABLE";
const LICENSE_SALT = "MASTER_KEY_GENESIS_2025_SECURE_PHASE";

export const SecurityCore = {
    // Generate a robust integrity checksum (Adler-32 improved)
    generateChecksum: (data: string): string => {
        let a = 1, b = 0;
        for (let i = 0; i < data.length; i++) {
            a = (a + data.charCodeAt(i)) % 65521;
            b = (b + a) % 65521;
        }
        // Ensuring strictly unsigned 32-bit hex representation
        return (((b << 16) | a) >>> 0).toString(16).toUpperCase().padStart(8, '0');
    },

    getDeviceFingerprint: (): string => {
        if (typeof window === 'undefined') return "SERVER_CONTEXT";
        const parts = [
            navigator.userAgent,
            navigator.language,
            window.screen?.width.toString(),
            window.screen?.height.toString(),
            (navigator.hardwareConcurrency || 4).toString()
        ];
        return SecurityCore.generateChecksum(parts.join('|'));
    },

    cipher: (text: string, key: string): string => {
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
        const payload = JSON.stringify({ d: json, c: checksum, ts: Date.now() });
        return btoa(SecurityCore.cipher(payload, key));
    },

    safeDecode: (encoded: string, key: string): any | null => {
        try {
            const encrypted = atob(encoded);
            const decrypted = SecurityCore.cipher(encrypted, key);
            const { d, c, ts } = JSON.parse(decrypted);
            
            // Check for massive time drifts in state (anti-rollback)
            if (ts && ts > Date.now() + 86400000) {
                console.error("GENESIS_INTEGRITY: FUTURE_TIMESTAMP_DETECTED");
                return null;
            }

            if (SecurityCore.generateChecksum(d) !== c) return null;
            return JSON.parse(d);
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
        
        // Validation against the SECRET salt
        const rawData = `GNS|${tier}|${expiry}|${LICENSE_SALT}`;
        const calculatedHash = SecurityCore.generateChecksum(rawData);

        if (calculatedHash !== hash) {
            return { status: 'INVALID', tier: 'FREE', expiry: 0 };
        }

        if (Date.now() > expiry) {
            return { status: 'EXPIRED', tier: tier as any, expiry };
        }

        return { status: 'VALID', tier: tier as any, expiry };
    },

    generateLicense: (tier: string, days: number): string => {
        const expiry = Date.now() + (days * 24 * 60 * 60 * 1000);
        const rawData = `GNS|${tier}|${expiry}|${LICENSE_SALT}`;
        const hash = SecurityCore.generateChecksum(rawData);
        return `GNS-${tier}-${expiry}-${hash}`;
    }
};
