'use client'

import dynamic from 'next/dynamic'
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

// Dynamically import components that use auth context
const ProfileContent = dynamic(() => import('./profile-content'), {
  ssr: false,
  loading: () => (
    <DashboardShell>
      <DashboardHeader heading="Profile" description="Manage your X account and platform settings." />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="animate-pulse h-64 bg-muted rounded-lg"></div>
        <div className="animate-pulse h-64 bg-muted rounded-lg"></div>
      </div>
    </DashboardShell>
  )
})

export default function ProfilePage() {
  return <ProfileContent />
}
