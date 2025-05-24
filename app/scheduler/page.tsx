'use client'

import dynamic from 'next/dynamic'
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Twitter } from "lucide-react"

// Dynamically import components that use auth context
const SchedulerForm = dynamic(() => import("@/components/scheduler-form").then(mod => ({ default: mod.SchedulerForm })), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-muted rounded-lg"></div>
})

const AuthenticatedScheduler = dynamic(() => import('./scheduler-content'), {
  ssr: false,
  loading: () => (
    <DashboardShell>
      <DashboardHeader heading="Post Scheduler" description="Schedule automated posts to maintain your X presence." />
      <div className="grid gap-4">
        <div className="animate-pulse h-64 bg-muted rounded-lg"></div>
      </div>
    </DashboardShell>
  )
})

export default function SchedulerPage() {
  return <AuthenticatedScheduler />
}
