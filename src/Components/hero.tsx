"use client"

import { useState } from "react"
import { Button } from "./ui/button.tsx"
import { Play, Info } from "lucide-react"
import { Link } from "react-router-dom"
import { ContentType } from "./lib/types"
import React from "react"
// import type { ContentType } from "../lib/types"

interface HeroProps {
  content: ContentType[]
}

export default function Hero({ content }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const featuredContent = content[currentIndex]

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${featuredContent.coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>

      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">{featuredContent.title}</h1>

          <div className="flex items-center space-x-4">
            <span className="text-green-500 font-semibold">{featuredContent.matchPercentage}% Match</span>
            <span>{featuredContent.releaseYear}</span>
            <span className="border border-gray-600 px-1 text-xs">{featuredContent.rating}</span>
            <span>{featuredContent.duration}</span>
          </div>

          <p className="text-lg text-gray-300 line-clamp-3">{featuredContent.description}</p>

          <div className="flex items-center space-x-4 pt-4">
            <Link to={`/watch/${featuredContent.id}`}>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                <Play className="mr-2 h-5 w-5 fill-black" />
                Play
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Info className="mr-2 h-5 w-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

