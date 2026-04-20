import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function isValidUrl(url: string): boolean {
  try { return new URL(url).protocol.startsWith('http'); } catch { return false; }
}

export const supabaseConfigurato =
  !!(supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl))

export const supabase = createClient(
  supabaseConfigurato ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseConfigurato ? supabaseAnonKey : 'placeholder-key'
)
