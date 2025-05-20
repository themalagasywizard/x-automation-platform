"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react"

// Mock data for recent replies
const recentReplies = [
  {
    id: "1",
    originalPost: "Just saw an amazing AI demo that blew my mind! #AI #Innovation",
    reply:
      "That sounds incredible! AI is evolving so rapidly these days. Would love to hear more about what impressed you the most! #AI #Innovation",
    status: "posted",
    date: "2 hours ago",
    engagement: 5,
  },
  {
    id: "2",
    originalPost: "Struggling with React state management. Any recommendations?",
    reply:
      "Have you tried using Redux Toolkit or Zustand? They're both excellent options for React state management with different complexity levels. Happy to share some resources if you need!",
    status: "posted",
    date: "5 hours ago",
    engagement: 12,
  },
  {
    id: "3",
    originalPost: "Just launched our new product! Check it out at example.com",
    reply:
      "Congratulations on the launch! The product looks fantastic. Love the clean design and intuitive interface. Looking forward to seeing how it evolves!",
    status: "pending",
    date: "Just now",
    engagement: 0,
  },
  {
    id: "4",
    originalPost: "What's your favorite productivity hack?",
    reply:
      "Time blocking has been a game-changer for me! I schedule specific blocks for deep work and stick to them religiously. Also, the Pomodoro technique helps maintain focus during those blocks.",
    status: "pending",
    date: "Just now",
    engagement: 0,
  },
]

export function RecentRepliesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Replies</CardTitle>
        <CardDescription>View and manage your recent automated replies.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Original Post</TableHead>
              <TableHead className="w-[300px]">Reply</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentReplies.map((reply) => (
              <TableRow key={reply.id}>
                <TableCell className="font-medium">{reply.originalPost}</TableCell>
                <TableCell>{reply.reply}</TableCell>
                <TableCell>
                  <Badge variant={reply.status === "posted" ? "default" : "outline"}>
                    {reply.status === "posted" ? "Posted" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>{reply.date}</TableCell>
                <TableCell>{reply.engagement}</TableCell>
                <TableCell className="text-right">
                  {reply.status === "pending" ? (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View on X
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
