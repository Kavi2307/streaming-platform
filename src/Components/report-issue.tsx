"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
// import { Button } from "./ui/button.tsx"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../Components/dialog.tsx"
import { Textarea } from "./ui/textarea.tsx"
import { Input } from "./ui/input.tsx"
import { Label } from "./ui/label.tsx"
import { useAuth } from "../contexts/auth-context.tsx"
import React from "react"
import { Button } from "./ui/button.tsx"

// Replace with your actual webhook URL
// http://localhost:5000/api/slack-webhook
const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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"

export function ReportIssueButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [issueTitle, setIssueTitle] = useState("")
  const [issueDescription, setIssueDescription] = useState("")
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const { user } = useAuth()

  const handleSubmit = async () => {
    if (!issueTitle.trim() || !issueDescription.trim()) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Collect system information
      const systemInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date().toISOString(),
      }

      // Prepare payload for Slack
      const payload = {
        text: "New Issue Report from VL Stream",
        'title': issueTitle,
        'description': issueDescription,
        'vesrion': "1.0.0",
        'Movie':'RRR-HD',
        'playerDetails':['videojsplayer-v8.8.0','videojs-contrib-hls-v6.2.1',],
        'systemInfo': systemInfo,

        // blocks: [
        //   {
        //     type: "header",
        //     text: {
        //       type: "plain_text",
        //       text: `🐛 Issue Report: ${issueTitle}`,
        //       emoji: true,
        //     },
        //   },
        //   {
        //     type: "section",
        //     fields: [
        //       {
        //         type: "mrkdwn",
        //         text: `*Reported by:*\n${user?.name || "Anonymous"} (${user?.email || "No email"})`,
        //       },
        //       {
        //         type: "mrkdwn",
        //         text: `*Time:*\n${new Date().toLocaleString()}`,
        //       },
        //     ],
        //   },
        //   {
        //     type: "section",
        //     text: {
        //       type: "mrkdwn",
        //       text: `*Description:*\n${issueDescription}`,
        //     },
        //   },
        //   {
        //     type: "section",
        //     text: {
        //       type: "mrkdwn",
        //       text: "*System Information:*\n```" + JSON.stringify(systemInfo, null, 2) + "```",
        //     },
        //   },
        // ],
      }
      const postBody = { text: `${'```' + JSON.stringify(payload) + '```'}` };

      // SOLUTION 1: Use a proxy service to avoid CORS (for development)
      // This uses a public CORS proxy - replace with your own proxy in production
      const corsProxyUrl = "https://cors-anywhere.herokuapp.com/"
    //   https://cors-anywhere.herokuapp.com/corsdemo

      // SOLUTION 2: Use a serverless function approach (commented out)
      // For production, uncomment this and deploy a serverless function
      // const response = await fetch("/api/report-issue", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ slackPayload: payload }),
      // });

      // For development, use the CORS proxy
      const response = await fetch(corsProxyUrl+SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest", // Required by cors-anywhere
        },
        body: JSON.stringify(postBody),
      })

      if (response.ok) {
        setSubmitStatus("success")
        // Reset form after successful submission
        setTimeout(() => {
          setIsOpen(false)
          setIssueTitle("")
          setIssueDescription("")
          setSubmitStatus("idle")
        }, 2000)
      } else {
        console.error("Error response:", await response.text())
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting issue:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800" onClick={() => setIsOpen(true)}>
        <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
        Report an Issue
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
            <DialogDescription className="text-gray-400">
              Describe the problem you're experiencing. Our team will look into it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="issue-title">Issue Title</Label>
              <Input
                id="issue-title"
                placeholder="Brief description of the issue"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue-description">Detailed Description</Label>
              <Textarea
                id="issue-description"
                placeholder="Please provide as much detail as possible..."
                rows={5}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {submitStatus === "error" && (
              <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded">
                <p>Failed to submit the issue. Please try again later.</p>
                <p className="text-xs mt-1">
                  Note: If using the CORS proxy, you may need to request temporary access at{" "}
                  <a
                    href="https://cors-anywhere.herokuapp.com/corsdemo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    cors-anywhere.herokuapp.com/corsdemo
                  </a>
                </p>
              </div>
            )}

            {submitStatus === "success" && (
              <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-3 rounded">
                Issue reported successfully! Thank you for your feedback.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="border-gray-700">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting || !issueTitle.trim() || !issueDescription.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
