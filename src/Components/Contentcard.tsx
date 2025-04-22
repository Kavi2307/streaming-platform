// "use client"

import { useState } from "react"
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react"
// import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { ContentType } from "./lib/types.ts"
import React from "react"
import { Button } from "./ui/button.tsx"
// import type { ContentType } from "../lib/types"

interface ContentCardProps {
  content: ContentType
}

export  function ContentCard({ content }: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const handlePlay = () => {
    navigate(`/watch/${content.id}`)
  }

  return (
    <div
      className="relative flex-shrink-0 w-[200px] transition-transform duration-300 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative rounded-md overflow-hidden ${isHovered ? "scale-110 shadow-xl z-10" : ""}`}>
        <img
          src={content.thumbnail || "https://via.placeholder.com/200x120"}
          alt={content.title}
          className="object-cover aspect-video w-full"
         
        />

        {isHovered && (
          <div className="absolute inset-0 bg-black/20">
            <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black to-transparent">
              <h3 className="font-medium text-sm mb-1 line-clamp-1">{content.title}</h3>

              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-500 text-xs">{content.matchPercentage}% Match</span>
                <span className="text-xs border border-gray-500 px-1">{content.rating}</span>
                <span className="text-xs">{content.duration}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-white text-black hover:bg-white/90"
                  onClick={handlePlay}
                >
                  <Play className="h-4 w-4 fill-black" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full border border-gray-400 hover:border-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full border border-gray-400 hover:border-white"
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full border border-gray-400 hover:border-white ml-auto"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {content.genres.slice(0, 3).map((genre, index) => (
                  <span key={index} className="text-xs text-gray-300">
                    {genre}
                    {index < Math.min(2, content.genres.length - 1) ? " • " : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

