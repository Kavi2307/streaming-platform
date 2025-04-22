
import React from "react"
import Hero from "../hero.tsx"
import { getMoviesByGenre, getFeaturedContent } from "../lib/data.ts"
import ContentRow from "../contenRow.tsx"

export default function HomePage() {
  const featuredContent = getFeaturedContent()
  const actionMovies = getMoviesByGenre("Action")
  const comedyMovies = getMoviesByGenre("Comedy")
  const dramaMovies = getMoviesByGenre("Drama")
  const sciFiMovies = getMoviesByGenre("Sci-Fi")

  return (
    <main className="min-h-screen bg-black text-white">
      <Hero content={featuredContent} />
      <div className="container px-4 py-8 mx-auto space-y-10">
        <ContentRow title="Trending Now" content={featuredContent} />
        <ContentRow title="Action" content={actionMovies} />
        <ContentRow title="Comedy" content={comedyMovies} />
        <ContentRow title="Drama" content={dramaMovies} />
        <ContentRow title="Sci-Fi" content={sciFiMovies} />
      </div>
    </main>
  )
}

