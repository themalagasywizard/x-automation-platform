import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ReplySettingsForm } from "@/components/reply-settings-form"

export default function ReplySettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Reply Settings" description="Configure your AI-powered reply preferences." />
      <div className="grid gap-4">
        <ReplySettingsForm />
      </div>
    </DashboardShell>
  )
}
