'use client'

import dynamic from 'next/dynamic'
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

// Dynamically import the content that uses auth context
const ReplySettingsContent = dynamic(() => import('./reply-settings-content'), {
  ssr: false,
  loading: () => (
    <DashboardShell>
      <DashboardHeader heading="Reply Settings" description="Configure your AI-powered reply preferences." />
      <div className="grid gap-4">
        <div className="animate-pulse h-64 bg-muted rounded-lg"></div>
      </div>
    </DashboardShell>
  )
})

export default function ReplySettingsPage() {
  return <ReplySettingsContent />
}
