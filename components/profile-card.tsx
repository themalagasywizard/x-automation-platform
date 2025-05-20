import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Twitter } from "lucide-react"

export function ProfileCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>X Account</CardTitle>
        <CardDescription>Manage your connected X account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Twitter className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">@yourusername</p>
            <p className="text-xs text-muted-foreground">Connected on May 15, 2024</p>
          </div>
          <Badge className="ml-auto">Connected</Badge>
        </div>
        <div className="rounded-md border p-4">
          <h3 className="text-sm font-medium">Account Permissions</h3>
          <ul className="mt-2 text-sm text-muted-foreground space-y-1">
            <li className="flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
              Read posts and accounts
            </li>
            <li className="flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
              Post replies and tweets
            </li>
            <li className="flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
              Access follower information
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="outline">Refresh Connection</Button>
        <Button variant="destructive">Disconnect</Button>
      </CardFooter>
    </Card>
  )
}
