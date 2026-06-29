import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

declare const __VITE_SUPABASE_URL__: string | undefined;
declare const __VITE_SUPABASE_ANON_KEY__: string | undefined;

function readInjectedEnv(key: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string {
  const maybeWindow = globalThis as typeof globalThis & {
    __ENV__?: Record<string, string | undefined>;
  };
  return maybeWindow.__ENV__?.[key] || '';
}

const injectedUrl = typeof __VITE_SUPABASE_URL__ !== 'undefined' ? __VITE_SUPABASE_URL__ : '';
const injectedAnonKey = typeof __VITE_SUPABASE_ANON_KEY__ !== 'undefined' ? __VITE_SUPABASE_ANON_KEY__ : '';
const fallbackUrl = 'https://xorfzgubieexgmqhiwiu.supabase.co';
const fallbackAnonKey = 'sb_publishable_quoVdpgWKxB3Z4wcCPjZLg_jkWUjM_a';

const supabaseUrl = (injectedUrl || readInjectedEnv('VITE_SUPABASE_URL') || fallbackUrl).trim();
const supabaseAnonKey = (injectedAnonKey || readInjectedEnv('VITE_SUPABASE_ANON_KEY') || fallbackAnonKey).trim();

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
