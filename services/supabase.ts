import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables without crashing
const getEnv = (key: string) => {
  try {
    const meta = import.meta as any;
    // Check if meta and meta.env exist before accessing the key
    return (meta && meta.env) ? meta.env[key] : undefined;
  } catch (e) {
    console.warn(`Failed to read env var ${key}`, e);
    return undefined;
  }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://ygxkkviplhvxgntwnjdi.supabase.co';
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_xI5rijR8ObKgwL0SFOIG3w_mhmSfzHF';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * SCHEMA DEFINITION (SQL):
 * 
 * create table licenses (
 *   key text primary key,
 *   client_name text,
 *   tier text default 'CLINICAL',
 *   status text default 'ACTIVE',
 *   created_at timestamptz default now(),
 *   expires_at timestamptz
 * );
 * 
 * -- Enable RLS (Row Level Security)
 * -- Policy: "Enable read access for all" (SELECT * FROM licenses)
 */