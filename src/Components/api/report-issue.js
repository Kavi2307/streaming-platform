// This file should be placed in the /api directory at the root of your project
// Vercel will automatically recognize it as a serverless function

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" })
    }
  
    try {
      const { slackPayload } = req.body
  
      // Get the Slack webhook URL from environment variables
      const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL
  
      if (!SLACK_WEBHOOK_URL) {
        throw new Error("Slack webhook URL is not configured")
      }
  
      // Server-side request to Slack (no CORS issues)
      const response = await fetch(SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slackPayload),
      })
  
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Slack API responded with ${response.status}: ${errorText}`)
      }
  
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error("Error sending to Slack:", error)
      return res.status(500).json({
        message: "Failed to send to Slack",
        error: error.message,
      })
    }
  }
  