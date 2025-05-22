import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ProfileCard } from "@/components/profile-card"
import { UsageStats } from "@/components/usage-stats"

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
