'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Processing...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Checking authentication...')
        
        // Wait a moment for the page to fully load
        await new Promise(resolve => setTimeout(resolve, 500))

        // Check if we're on the client side
        if (typeof window === 'undefined') {
          return
        }

        // Get the current URL and hash
        const url = new URL(window.location.href)
        const urlHash = window.location.hash
        
        // Check for parameters in both search params and hash
        let code = url.searchParams.get('code')
        let error = url.searchParams.get('error')
        let errorDescription = url.searchParams.get('error_description')
        
        // Also check in the hash fragment (some OAuth flows use this)
        if (!code && urlHash) {
          const hashParams = new URLSearchParams(urlHash.substring(1))
          code = hashParams.get('code')
          error = hashParams.get('error')
          errorDescription = hashParams.get('error_description')
        }

        console.log('Auth callback params:', { 
          code: code ? 'present' : 'missing', 
          error, 
          errorDescription,
          fullURL: window.location.href,
          hash: urlHash
        })

        // If no code and no error, this might be a direct visit to callback page
        if (!code && !error) {
          console.log('No OAuth parameters found, redirecting to profile')
          setStatus('Redirecting to profile...')
          setTimeout(() => {
            router.push('/profile')
          }, 1000)
          return
        }

        if (error) {
          console.error('OAuth error:', error, errorDescription)
          setStatus('Authentication failed')
          setTimeout(() => {
            router.push('/profile?error=' + encodeURIComponent(error))
          }, 2000)
          return
        }

        if (code) {
          setStatus('Completing sign in...')
          console.log('Processing OAuth code...')
          
          try {
            const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
            
            if (sessionError) {
              console.error('Session exchange error:', sessionError)
              setStatus('Session creation failed')
              setTimeout(() => {
                router.push('/profile?error=' + encodeURIComponent(sessionError.message))
              }, 2000)
              return
            }

            console.log('Session created successfully:', data)
            setStatus('Success! Redirecting...')
            
            // Wait for the session to be properly set
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            router.push('/profile?success=true')
          } catch (exchangeError) {
            console.error('Code exchange failed:', exchangeError)
            setStatus('Authentication failed')
            setTimeout(() => {
              router.push('/profile?error=' + encodeURIComponent('Code exchange failed'))
            }, 2000)
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('Authentication failed')
        setTimeout(() => {
          router.push('/profile?error=' + encodeURIComponent('Authentication failed'))
        }, 2000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen" suppressHydrationWarning>
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">{status}</p>
        <p className="text-sm text-muted-foreground">
          {status.includes('failed') ? 
            'Something went wrong. Redirecting back...' : 
            'Please wait while we sign you in.'
          }
        </p>
      </div>
    </div>
  )
} 