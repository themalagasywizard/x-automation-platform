'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current URL
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')
        const error = url.searchParams.get('error')
        const errorDescription = url.searchParams.get('error_description')

        console.log('Auth callback params:', { code, error, errorDescription })

        if (error) {
          console.error('OAuth error:', error, errorDescription)
          router.push('/profile?error=' + encodeURIComponent(error))
          return
        }

        if (code) {
          console.log('Processing OAuth code...')
          const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (sessionError) {
            console.error('Session exchange error:', sessionError)
            router.push('/profile?error=' + encodeURIComponent(sessionError.message))
            return
          }

          console.log('Session created successfully:', data)
          router.push('/profile?success=true')
        } else {
          console.log('No code parameter, redirecting to profile')
          router.push('/profile')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/profile?error=' + encodeURIComponent('Authentication failed'))
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">Completing authentication...</p>
        <p className="text-sm text-muted-foreground">Please wait while we sign you in.</p>
      </div>
    </div>
  )
} 