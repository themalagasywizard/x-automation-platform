import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ProfileCard } from "@/components/profile-card"
import { UsageStats } from "@/components/usage-stats"

// Mark as client component to use hooks for auth
// This ensures the page is fully dynamic for auth state
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default function ProfilePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Profile" description="Manage your X account and platform settings." />
      <div className="grid gap-4 md:grid-cols-2">
        <ProfileCard />
        <UsageStats />
      </div>
    </DashboardShell>
  )
}
