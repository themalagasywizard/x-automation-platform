'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithTwitter: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Fix hydration issues
    setIsClient(true)
    
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        } else {
          console.log('Initial session:', session)
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Session fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    // Only run on client side
    if (typeof window !== 'undefined') {
      getSession()

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session)
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
          
          // Handle specific auth events
          if (event === 'SIGNED_IN') {
            console.log('User signed in:', session?.user)
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out')
          } else if (event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed')
          }
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [])

  const signInWithTwitter = async () => {
    try {
      // Prevent OAuth initiation from callback page
      if (typeof window !== 'undefined' && window.location.pathname === '/auth/callback') {
        console.error('Cannot initiate OAuth from callback page')
        throw new Error('OAuth cannot be initiated from callback page')
      }

      setLoading(true)
      console.log('Initiating Twitter OAuth from:', window.location.pathname)
      
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
      
      console.log('OAuth redirect initiated:', data)
    } catch (error) {
      console.error('Twitter auth error:', error)
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        throw error
      }
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signInWithTwitter,
    signOut,
  }

  // Prevent hydration issues by not rendering until client-side
  if (!isClient) {
    return <div suppressHydrationWarning>{children}</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 