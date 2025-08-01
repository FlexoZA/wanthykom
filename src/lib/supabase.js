import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('DEBUG::supabase.js', 'Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
