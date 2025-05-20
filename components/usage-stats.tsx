import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export function UsageStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Statistics</CardTitle>
        <CardDescription>Monitor your platform usage and limits.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Daily Replies</p>
            <p className="text-sm text-muted-foreground">12/20</p>
          </div>
          <Progress value={60} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Monthly Posts</p>
            <p className="text-sm text-muted-foreground">18/30</p>
          </div>
          <Progress value={60} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">API Calls</p>
            <p className="text-sm text-muted-foreground">450/1000</p>
          </div>
          <Progress value={45} className="h-2" />
        </div>
        <div className="rounded-md border p-4">
          <h3 className="text-sm font-medium">Current Plan: Free</h3>
          <p className="mt-1 text-sm text-muted-foreground">20 replies/day, 1 scheduled post/day</p>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button className="w-full">Upgrade Plan</Button>
      </CardFooter>
    </Card>
  )
}
