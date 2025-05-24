'use client'

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { SchedulerForm } from "@/components/scheduler-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Twitter } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function SchedulerContent() {
  const { user, loading, signInWithTwitter } = useAuth()

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Post Scheduler" description="Schedule automated posts to maintain your X presence." />
        <div className="grid gap-4">
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </DashboardShell>
    )
  }

  if (!user) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Post Scheduler" description="Schedule automated posts to maintain your X presence." />
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>You need to connect your X account to use the post scheduler.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <Twitter className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">Connect Your X Account</h3>
                    <p className="text-sm text-muted-foreground">
                      To schedule posts, you need to connect your X account first. This allows us to post on your behalf.
                    </p>
                  </div>
                  <Button onClick={signInWithTwitter} className="mt-4">
                    Connect X Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Post Scheduler" description="Schedule automated posts to maintain your X presence." />
      <div className="grid gap-4">
        <SchedulerForm />
      </div>
    </DashboardShell>
  )
} 