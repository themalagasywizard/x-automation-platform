'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Twitter } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

export function ProfileCard() {
  const { user, session, loading, signInWithTwitter, signOut } = useAuth()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await signInWithTwitter()
    } catch (error) {
      console.error('Failed to connect:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    setIsDisconnecting(true)
    try {
      await signOut()
    } catch (error) {
      console.error('Failed to disconnect:', error)
    } finally {
      setIsDisconnecting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>X Account</CardTitle>
          <CardDescription>Manage your connected X account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-20 ml-auto" />
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    )
  }

  const twitterUsername = user?.user_metadata?.user_name || user?.user_metadata?.preferred_username
  const avatarUrl = user?.user_metadata?.avatar_url
  const connectedDate = user?.created_at ? new Date(user.created_at).toLocaleDateString() : null

  if (!user || !session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>X Account</CardTitle>
          <CardDescription>Connect your X account to enable automation features.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Twitter className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">No X Account Connected</h3>
                <p className="text-sm text-muted-foreground">Connect your X account to start automating your posts and replies.</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? 'Connecting...' : 'Connect X Account'}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>X Account</CardTitle>
        <CardDescription>Manage your connected X account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            ) : (
              <Twitter className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {twitterUsername ? `@${twitterUsername}` : user.email || 'Unknown User'}
            </p>
            {connectedDate && (
              <p className="text-xs text-muted-foreground">Connected on {connectedDate}</p>
            )}
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
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Connection
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleDisconnect}
          disabled={isDisconnecting}
        >
          {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
        </Button>
      </CardFooter>
    </Card>
  )
}
