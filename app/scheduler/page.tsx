import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { SchedulerForm } from "@/components/scheduler-form"

export default function SchedulerPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Post Scheduler" description="Schedule automated posts to maintain your X presence." />
      <div className="grid gap-4">
        <SchedulerForm />
      </div>
    </DashboardShell>
  )
}
