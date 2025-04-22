"use client"

import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
// import VideoPlayer from "../components/video-player"
import { getContentById, getRelatedContent } from "../lib/data.ts"
// import ContentRow from "../components/content-row"
// import { Button } from "../components/ui/button"
import { ArrowLeft, Plus, ThumbsUp, Share2 } from "lucide-react"
import React from "react"
import { Button } from "../ui/button.tsx"
import VideoPlayer from "../VideoPlayer.tsx"
import ContentRow from "../contenRow.tsx"
import { FeedbackDialog } from "../feedback-dialog.tsx"
// import { FeedbackDialog } from "../components/feedback-dialog"

export default function WatchPage() {
  const { id } = useParams<{ id: string }>()
  const content = getContentById(id || "")
  const relatedContent = getRelatedContent(id || "")
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    // Simulate video completion after 30 seconds (for demo purposes)
    // In a real app, this would be triggered by the video player's "ended" event
    const timer = setTimeout(() => {
      setShowFeedback(true)
    }, 30000)

    return () => clearTimeout(timer)
  }, [id])

  if (!content) {
    return <div className="flex items-center justify-center h-screen text-white">Content not found</div>
  }

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </Link>

        <VideoPlayer src={content.videoUrl} poster={content.coverImage} />

        <div className="mt-6 space-y-4">
          <h1 className="text-3xl font-bold">{content.title}</h1>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">{content.releaseYear}</span>
            <span className="text-sm text-gray-400">{content.duration}</span>
            <span className="text-sm bg-gray-800 px-2 py-1 rounded">{content.rating}</span>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              My List
            </Button>
            <Button variant="outline" size="sm">
              <ThumbsUp className="mr-2 h-4 w-4" />
              Rate
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>

            {/* For demo purposes, add a button to manually trigger feedback */}
            <Button variant="outline" size="sm" onClick={() => setShowFeedback(true)}>
              Give Feedback
            </Button>
          </div>

          <p className="text-gray-300">{content.description}</p>

          <div className="text-sm text-gray-400">
            <span className="font-semibold text-white">Cast: </span>
            {content.cast.join(", ")}
          </div>

          <div className="text-sm text-gray-400">
            <span className="font-semibold text-white">Genres: </span>
            {content.genres.join(", ")}
          </div>
        </div>

        <div className="mt-12">
          <ContentRow title="More Like This" content={relatedContent} />
        </div>

        {/* Feedback Dialog */}
        <FeedbackDialog isOpen={showFeedback} onClose={() => setShowFeedback(false)} contentTitle={content.title} />
      </div>
    </main>
  )
}
