import { supabase } from './supabase'

export async function signInWithTwitter() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  if (error) {
    console.error('Error signing in with Twitter:', error)
    throw error
  }
  
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    throw error
  }
  
  return data.session
}

export async function getUserProfile() {
  const { data: session } = await supabase.auth.getSession()
  
  if (!session.session) {
    return null
  }
  
  return session.session.user
} 