import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentRepliesTable } from "@/components/recent-replies-table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ReplyMetrics } from "@/components/reply-metrics"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" description="Monitor your X automation activity and performance." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Replies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12/20</div>
            <p className="text-xs text-muted-foreground">8 replies remaining today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6%</div>
            <p className="text-xs text-muted-foreground">+0.8% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Next post in 6 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Active</div>
            <p className="text-xs text-muted-foreground">X API connected</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="replies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="replies">Recent Replies</TabsTrigger>
          <TabsTrigger value="metrics">Reply Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="replies" className="space-y-4">
          <RecentRepliesTable />
        </TabsContent>
        <TabsContent value="metrics" className="space-y-4">
          <ReplyMetrics />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
