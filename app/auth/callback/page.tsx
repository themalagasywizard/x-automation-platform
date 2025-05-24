'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Checking authentication...')
  const [hasProcessed, setHasProcessed] = useState(false)

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed) return

    const handleAuthCallback = async () => {
      try {
        setHasProcessed(true)
        
        // Check if we're on the client side
        if (typeof window === 'undefined') {
          return
        }

        console.log('Callback page loaded, current URL:', window.location.href)

        // Get the current URL and hash
        const url = new URL(window.location.href)
        const urlHash = window.location.hash
        
        // Check for parameters in both search params and hash
        let code = url.searchParams.get('code')
        let error = url.searchParams.get('error')
        let errorDescription = url.searchParams.get('error_description')
        
        // Also check in the hash fragment
        if (!code && urlHash) {
          const hashParams = new URLSearchParams(urlHash.substring(1))
          code = hashParams.get('code')
          error = hashParams.get('error')
          errorDescription = hashParams.get('error_description')
        }

        console.log('Auth callback analysis:', { 
          hasCode: !!code,
          hasError: !!error,
          error,
          errorDescription,
          searchParams: url.search,
          hash: urlHash
        })

        // If this is a direct visit to callback (no OAuth params), redirect immediately
        if (!code && !error && !urlHash) {
          console.log('Direct callback visit detected, redirecting to profile')
          setStatus('Redirecting to profile...')
          router.replace('/profile')
          return
        }

        if (error) {
          console.error('OAuth error detected:', error, errorDescription)
          setStatus(`Authentication failed: ${error}`)
          setTimeout(() => {
            router.replace(`/profile?error=${encodeURIComponent(error)}`)
          }, 2000)
          return
        }

        if (code) {
          setStatus('Processing authentication...')
          console.log('Processing OAuth code exchange...')
          
          try {
            const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
            
            if (sessionError) {
              console.error('Session exchange failed:', sessionError)
              setStatus('Session creation failed')
              setTimeout(() => {
                router.replace(`/profile?error=${encodeURIComponent(sessionError.message)}`)
              }, 2000)
              return
            }

            console.log('Session created successfully:', data.session ? 'Yes' : 'No')
            setStatus('Success! Redirecting...')
            
            // Clear the URL and redirect
            setTimeout(() => {
              router.replace('/profile?success=true')
            }, 1000)
            
          } catch (exchangeError) {
            console.error('Code exchange exception:', exchangeError)
            setStatus('Authentication failed')
            setTimeout(() => {
              router.replace('/profile?error=authentication_failed')
            }, 2000)
          }
        } else {
          // No code, no error, but has URL params/hash - something is wrong
          console.log('Callback page visited with params but no code/error, redirecting')
          setStatus('Redirecting...')
          setTimeout(() => {
            router.replace('/profile')
          }, 1000)
        }
      } catch (error) {
        console.error('Callback handler error:', error)
        setStatus('Authentication failed')
        setTimeout(() => {
          router.replace('/profile?error=callback_error')
        }, 2000)
      }
    }

    handleAuthCallback()
  }, [router, hasProcessed])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background" suppressHydrationWarning>
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Completing Authentication</h2>
        <p className="text-muted-foreground mb-4">{status}</p>
        {status.includes('failed') && (
          <p className="text-sm text-muted-foreground">You will be redirected back to the profile page...</p>
        )}
      </div>
    </div>
  )
} 