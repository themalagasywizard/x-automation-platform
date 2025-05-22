import { createClient } from '@supabase/supabase-js'

// These environment variables are set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create Supabase client only if URL and key are available
let supabase: any

// Avoid errors during build time by checking if environment variables are available
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Create a mock client or handle the case where credentials are not available
  supabase = {
    auth: {
      signInWithOAuth: () => ({ data: null, error: new Error('Supabase not configured') }),
      signOut: () => ({ error: null }),
      getSession: () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      exchangeCodeForSession: () => ({ data: null, error: null }),
    },
  }
}

export { supabase } 