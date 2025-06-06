import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  console.log('Auth callback received:', {
    code: code ? 'present' : 'missing',
    next,
    searchParams: Object.fromEntries(requestUrl.searchParams.entries())
  })

  if (code) {
    try {
      console.log('Exchanging code for session...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(`${requestUrl.origin}/?error=auth_error`)
      }
      
      console.log('Successfully exchanged code for session:', {
        user: data.user?.id,
        session: !!data.session
      })
      
      // Redirect to dashboard or specified next URL
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/?error=auth_error`)
    }
  }

  // If no code, redirect to home with error
  console.log('No code in callback, redirecting to home')
  return NextResponse.redirect(`${requestUrl.origin}/?error=no_code`)
} 