import { SYSTEM_METADATA } from '../constants';
import { supabase } from './supabase';
import { LicenseRecord } from '../types';

export interface LedgerFile {
    updatedAt: string;
    revokedKeys: string[];
    broadcastMessage?: string; 
    maintenanceMode?: boolean; 
}

export const RemoteAccess = {
    async checkKeyStatus(licenseKey: string): Promise<{ status: 'VALID' | 'REVOKED' | 'OFFLINE', message?: string, maintenance?: boolean }> {
        if (!navigator.onLine) return { status: 'OFFLINE' };

        // 1. SUPABASE CHECK (Primary)
        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from('licenses')
                    .select('status, expires_at')
                    .eq('key', licenseKey)
                    .single();

                if (error || !data) {
                    // Если ключа нет в базе, проверяем GitHub (обратная совместимость)
                    console.warn("Supabase miss, checking legacy ledger...");
                } else {
                    if (data.status === 'REVOKED') return { status: 'REVOKED' };
                    if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) return { status: 'REVOKED' }; // Expired handled as revoked for safety
                    return { status: 'VALID' };
                }
            } catch (e) {
                console.error("Supabase Connection Failed", e);
            }
        }

        // 2. GITHUB LEDGER CHECK (Fallback / Legacy)
        try {
            const response = await fetch(SYSTEM_METADATA.GITHUB_LEDGER_URL, {
                cache: 'no-cache', 
            });

            if (!response.ok) return { status: 'OFFLINE' }; 

            const ledger: LedgerFile = await response.json();
            
            if (ledger.maintenanceMode) {
                return { status: 'VALID', maintenance: true, message: ledger.broadcastMessage };
            }

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
    },

    async registerLicense(record: LicenseRecord): Promise<boolean> {
        if (!supabase) return false;
        
        try {
            const { error } = await supabase
                .from('licenses')
                .insert([{
                    key: record.key,
                    client_name: record.clientName,
                    tier: record.tier,
                    status: record.status,
                    created_at: new Date(record.issuedAt).toISOString(),
                    expires_at: new Date(record.expiresAt).toISOString()
                }]);
            
            if (error) {
                console.error("Supabase Registration Error:", error);
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    },

    // New: Fetch all licenses for Admin Panel
    async getAllLicenses(): Promise<LicenseRecord[]> {
        if (!supabase) return [];
        try {
            const { data, error } = await supabase
                .from('licenses')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data.map((row: any) => ({
                id: row.key, // Using key as ID map
                key: row.key,
                clientName: row.client_name,
                tier: row.tier,
                status: row.status,
                issuedAt: new Date(row.created_at).getTime(),
                expiresAt: new Date(row.expires_at).getTime()
            }));
        } catch (e) {
            console.error("Failed to fetch licenses", e);
            return [];
        }
    },

    // New: Revoke license
    async revokeLicense(key: string): Promise<boolean> {
        if (!supabase) return false;
        try {
            const { error } = await supabase
                .from('licenses')
                .update({ status: 'REVOKED' })
                .eq('key', key);
            
            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Failed to revoke license", e);
            return false;
        }
    }
};