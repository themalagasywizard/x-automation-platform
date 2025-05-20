"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  subject: z.string().min(3, {
    message: "Subject must be at least 3 characters.",
  }),
  keywords: z.string().min(1, {
    message: "Please enter at least one keyword.",
  }),
  date: z.date({
    required_error: "Please select a date to schedule your post.",
  }),
  postPreview: z.string().optional(),
})

export function SchedulerForm() {
  const [date, setDate] = useState<Date>()
  const [postPreview, setPostPreview] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      keywords: "",
      postPreview: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // In a real app, this would send the data to your backend
  }

  function generatePreview() {
    const subject = form.getValues("subject")
    const keywords = form.getValues("keywords")

    if (subject && keywords) {
      // In a real app, this would call your AI API
      setPostPreview(
        `This is a generated post about ${subject} that includes keywords like ${keywords}. The AI would create a more natural and engaging post based on your writing style and preferences. #${keywords.split(",")[0].trim()}`,
      )
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Schedule a Post</CardTitle>
          <CardDescription>Create and schedule one post per day on your chosen subject.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="AI innovations" {...field} />
                    </FormControl>
                    <FormDescription>The main topic of your scheduled post.</FormDescription>
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
                      <Input placeholder="tech, AI, future" {...field} />
                    </FormControl>
                    <FormDescription>Keywords to include in your post, separated by commas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Post Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>The date when your post will be published.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" onClick={generatePreview}>
                Generate Preview
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Post Preview</CardTitle>
          <CardDescription>Review your AI-generated post before scheduling.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={postPreview}
            onChange={(e) => setPostPreview(e.target.value)}
            placeholder="Generate a preview to see how your post will look."
            className="min-h-[200px]"
          />
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline">Regenerate</Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={!postPreview}>
            Schedule Post
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
