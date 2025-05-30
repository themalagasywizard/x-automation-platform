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
          console.log('Initial session:', session ? 'Found' : 'None')
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
          console.log('Auth state changed:', event, session ? 'Has session' : 'No session')
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
          
          // Handle specific auth events
          if (event === 'SIGNED_IN') {
            console.log('User signed in successfully')
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
      // Multiple checks to prevent OAuth initiation from callback page
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        const currentUrl = window.location.href
        
        // Prevent OAuth from callback page
        if (currentPath.includes('/auth/callback') || currentUrl.includes('/auth/callback')) {
          console.error('OAuth cannot be initiated from callback page:', currentPath)
          throw new Error('Authentication cannot be started from callback page')
        }
        
        // Prevent OAuth from Supabase callback URL
        if (currentUrl.includes('supabase.co') || currentUrl.includes('/auth/v1/callback')) {
          console.error('OAuth cannot be initiated from Supabase callback URL:', currentUrl)
          throw new Error('Authentication cannot be started from Supabase callback')
        }
      }

      setLoading(true)
      console.log('Initiating Twitter OAuth from:', window?.location?.pathname || 'unknown')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        console.error('OAuth initiation error:', error)
        throw error
      }
      
      console.log('OAuth redirect URL generated:', data.url)
    } catch (error) {
      console.error('Twitter auth error:', error)
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        throw error
      }
      console.log('User signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    } finally {
      setLoading(false)
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