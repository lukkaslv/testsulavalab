
import { SYSTEM_METADATA } from '../constants';

export interface LedgerFile {
    updatedAt: string;
    revokedKeys: string[];
    broadcastMessage?: string; // Optional global message for all users
    maintenanceMode?: boolean; // Kill switch
}

export const RemoteAccess = {
    async checkKeyStatus(licenseKey: string): Promise<{ status: 'VALID' | 'REVOKED' | 'OFFLINE', message?: string, maintenance?: boolean }> {
        if (!navigator.onLine) return { status: 'OFFLINE' };

        try {
            const response = await fetch(SYSTEM_METADATA.GITHUB_LEDGER_URL, {
                cache: 'no-cache', // Important to get fresh data
            });

            if (!response.ok) {
                return { status: 'OFFLINE' }; 
            }

            const ledger: LedgerFile = await response.json();
            
            // Check Maintenance Mode
            if (ledger.maintenanceMode) {
                return { status: 'VALID', maintenance: true, message: ledger.broadcastMessage };
            }

            // Check Revocation
            if (ledger.revokedKeys && Array.isArray(ledger.revokedKeys)) {
                if (ledger.revokedKeys.includes(licenseKey)) {
                    return { status: 'REVOKED' };
                }
            }

            return { status: 'VALID', message: ledger.broadcastMessage };

        } catch (e) {
            console.warn("Remote Ledger Unreachable", e);
            return { status: 'OFFLINE' };
        }
    }
};
