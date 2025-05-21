'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Twitter } from "lucide-react"
import { useSupabase } from "./supabase-provider"

export function ProfileCard() {
  const { user, isLoading, signInWithTwitter, signOut } = useSupabase()

  const handleSignIn = async () => {
    try {
      await signInWithTwitter()
    } catch (error) {
      console.error("Error signing in with Twitter:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>X Account</CardTitle>
        <CardDescription>Manage your connected X account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : user ? (
          <>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile" 
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <Twitter className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {user.user_metadata?.preferred_username ? 
                    `@${user.user_metadata.preferred_username}` : 
                    user.email || "Twitter User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Connected on {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="outline" className="ml-auto">Connected</Badge>
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-32">
            <Twitter className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground mb-4">
              Connect your X account to use this platform
            </p>
            <Button onClick={handleSignIn} className="gap-2">
              <Twitter className="h-4 w-4" />
              Connect X Account
            </Button>
          </div>
        )}
      </CardContent>
      {user && (
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" onClick={handleSignIn}>Refresh Connection</Button>
          <Button variant="destructive" onClick={handleSignOut}>Disconnect</Button>
        </CardFooter>
      )}
    </Card>
  )
}
