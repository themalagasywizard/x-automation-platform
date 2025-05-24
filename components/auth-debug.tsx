'use client'

import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function AuthDebug() {
  const { user, session, loading } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      setDebugInfo({
        session: data.session,
        error: error,
        user: data.session?.user,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        currentOrigin: window.location.origin,
      })
    } catch (err) {
      setDebugInfo({ error: err })
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Auth Debug Info</CardTitle>
        <CardDescription>Debug information for authentication troubleshooting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>User:</strong> {user ? 'Authenticated' : 'Not authenticated'}
          </div>
          <div>
            <strong>Session:</strong> {session ? 'Active' : 'None'}
          </div>
          <div>
            <strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}
          </div>
        </div>
        
        <Button onClick={checkSupabaseConnection} variant="outline">
          Check Supabase Connection
        </Button>
        
        {debugInfo && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
        
        {user && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">User Info:</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 