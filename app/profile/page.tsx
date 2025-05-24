'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ProfileCard } from "@/components/profile-card"
import { UsageStats } from "@/components/usage-stats"
import { AuthDebug } from "@/components/auth-debug"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')

    if (success) {
      setMessage({ type: 'success', text: 'Successfully connected your X account!' })
    } else if (error) {
      setMessage({ type: 'error', text: `Authentication failed: ${decodeURIComponent(error)}` })
    }

    // Clear URL parameters after showing message
    if (success || error) {
      const timeout = setTimeout(() => {
        window.history.replaceState({}, '', '/profile')
        setMessage(null)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [searchParams])

  return (
    <DashboardShell>
      <DashboardHeader heading="Profile" description="Manage your X account and platform settings." />
      
      {message && (
        <Alert className={message.type === 'error' ? 'border-destructive' : 'border-green-500'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        <ProfileCard />
        <UsageStats />
      </div>
      <AuthDebug />
    </DashboardShell>
  )
}
