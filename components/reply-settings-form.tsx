"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  tone: z.string({
    required_error: "Please select a tone for your replies.",
  }),
  accounts: z.string().min(1, {
    message: "Please enter at least one account to monitor.",
  }),
  keywords: z.string().min(1, {
    message: "Please enter at least one keyword to monitor.",
  }),
  styleSamples: z.string().min(10, {
    message: "Please provide sample text to help the AI match your style.",
  }),
})

export function ReplySettingsForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tone: "",
      accounts: "",
      keywords: "",
      styleSamples: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // In a real app, this would send the data to your backend
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reply Configuration</CardTitle>
        <CardDescription>Customize how the AI generates replies on your behalf.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reply Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone for your replies" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="humorous">Humorous</SelectItem>
                          <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>This sets the overall tone for all your automated replies.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accounts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monitored Accounts</FormLabel>
                      <FormControl>
                        <Input placeholder="@username1, @username2, @username3" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter X handles to monitor, separated by commas. Leave blank to monitor all followed accounts.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Input placeholder="tech, AI, innovation, marketing" {...field} />
                      </FormControl>
                      <FormDescription>Enter keywords to trigger replies, separated by commas.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="styleSamples"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Style Samples</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste 3-5 examples of your writing style to help the AI match your voice."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>The AI will analyze these samples to match your writing style.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Save Settings</Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="advanced">
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium">Reply Approval</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose whether replies need manual approval before posting.
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Button variant="outline" size="sm">
                    Manual Approval
                  </Button>
                  <Button variant="outline" size="sm">
                    Auto-Approve
                  </Button>
                </div>
              </div>
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium">Reply Frequency</h3>
                <p className="text-sm text-muted-foreground mt-1">Set the maximum number of replies per day.</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Button variant="outline" size="sm">
                    5
                  </Button>
                  <Button variant="outline" size="sm">
                    10
                  </Button>
                  <Button variant="secondary" size="sm">
                    20
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">Your settings will be applied to all future automated replies.</p>
      </CardFooter>
    </Card>
  )
}
