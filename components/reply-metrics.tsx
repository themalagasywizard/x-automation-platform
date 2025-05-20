"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ReplyMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reply Performance</CardTitle>
        <CardDescription>Track the performance of your automated replies over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="7days">
          <TabsList className="mb-4">
            <TabsTrigger value="7days">7 days</TabsTrigger>
            <TabsTrigger value="30days">30 days</TabsTrigger>
            <TabsTrigger value="90days">90 days</TabsTrigger>
          </TabsList>
          <TabsContent value="7days">
            <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
              <p className="text-muted-foreground">Reply metrics chart will appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="30days">
            <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
              <p className="text-muted-foreground">30-day metrics chart will appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="90days">
            <div className="h-[300px] flex items-center justify-center bg-muted rounded-md">
              <p className="text-muted-foreground">90-day metrics chart will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
