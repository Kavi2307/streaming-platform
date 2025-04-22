"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog.tsx"
import { Button } from "./ui/button.tsx"
// import { Textarea } from "./ui/textarea"
import { Star } from "lucide-react"
// import { Checkbox } from "./ui/checkbox"
// import { Label } from "./ui/label"
import React from "react"
import { Checkbox } from "@radix-ui/react-checkbox"
import { Label } from "@radix-ui/react-label"
import { Textarea } from "./ui/textarea.tsx"
import { DialogFooter, DialogHeader } from "./dialog.tsx"
// import { Dialog } from "@radix-ui/react-dialog"

interface FeedbackDialogProps {
  isOpen: boolean
  onClose: () => void
  contentTitle: string
}

export function FeedbackDialog({ isOpen, onClose, contentTitle }: FeedbackDialogProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [feedbackOptions, setFeedbackOptions] = useState({
    enjoyedStory: false,
    goodActing: false,
    highQuality: false,
    wouldRecommend: false,
    poorPacing: false,
    technicalIssues: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)

    // In a real app, this would be an API call
    // For now, we'll just log to console and store in localStorage
    const feedback = {
      contentTitle,
      rating,
      comment,
      feedbackOptions,
      timestamp: new Date().toISOString(),
    }

    console.log("Feedback submitted:", feedback)

    // Store in localStorage
    const storedFeedback = JSON.parse(localStorage.getItem("feedback") || "[]")
    storedFeedback.push(feedback)
    localStorage.setItem("feedback", JSON.stringify(storedFeedback))

    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false)
      onClose()

      // Reset form
      setRating(0)
      setComment("")
      setFeedbackOptions({
        enjoyedStory: false,
        goodActing: false,
        highQuality: false,
        wouldRecommend: false,
        poorPacing: false,
        technicalIssues: false,
      })
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle>How was your experience?</DialogTitle>
          <DialogDescription className="text-gray-400">Share your thoughts about "{contentTitle}"</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                  <Star className={`h-8 w-8 ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium">What did you think?</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enjoyedStory"
                  checked={feedbackOptions.enjoyedStory}
                  onCheckedChange={(checked) =>
                    setFeedbackOptions({ ...feedbackOptions, enjoyedStory: checked as boolean })
                  }
                />
                <Label htmlFor="enjoyedStory" className="text-sm">
                  Enjoyed the story
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="goodActing"
                  checked={feedbackOptions.goodActing}
                  onCheckedChange={(checked) =>
                    setFeedbackOptions({ ...feedbackOptions, goodActing: checked as boolean })
                  }
                />
                <Label htmlFor="goodActing" className="text-sm">
                  Good acting
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="highQuality"
                  checked={feedbackOptions.highQuality}
                  onCheckedChange={(checked) =>
                    setFeedbackOptions({ ...feedbackOptions, highQuality: checked as boolean })
                  }
                />
                <Label htmlFor="highQuality" className="text-sm">
                  High quality
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wouldRecommend"
                  checked={feedbackOptions.wouldRecommend}
                  onCheckedChange={(checked) =>
                    setFeedbackOptions({ ...feedbackOptions, wouldRecommend: checked as boolean })
                  }
                />
                <Label htmlFor="wouldRecommend" className="text-sm">
                  Would recommend
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="poorPacing"
                  checked={feedbackOptions.poorPacing}
                  onCheckedChange={(checked) =>
                    setFeedbackOptions({ ...feedbackOptions, poorPacing: checked as boolean })
                  }
                />
                <Label htmlFor="poorPacing" className="text-sm">
                  Poor pacing
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="technicalIssues"
                  checked={feedbackOptions.technicalIssues}
                  onCheckedChange={(checked) =>
                    setFeedbackOptions({ ...feedbackOptions, technicalIssues: checked as boolean })
                  }
                />
                <Label htmlFor="technicalIssues" className="text-sm">
                  Technical issues
                </Label>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Comments</label>
            <Textarea
              placeholder="Share your thoughts..."
              className="bg-gray-800 border-gray-700 text-white"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-700">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700"
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
