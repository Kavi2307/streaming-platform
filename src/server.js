// Simple Express server to proxy Slack webhook requests
// This is a standalone file that you would run separately from your React app
// Save this as server.js in your project root

const express = require("express")
const cors = require("cors")
const axios = require("axios")
const app = express()
const PORT = process.env.PORT || 5000

// Enable CORS for your React app's origin
app.use(
  cors({
    origin: "http://localhost:3000", // Your React app's URL
  }),
)

app.use(express.json())

// Proxy endpoint for Slack webhook
app.post("/api/slack-webhook", async (req, res) => {
  try {
    const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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"

    const response = await axios.post(SLACK_WEBHOOK_URL, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error forwarding to Slack:", error.response?.data || error.message)
    res.status(500).json({
      error: "Failed to send to Slack",
      details: error.response?.data || error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`)
})
