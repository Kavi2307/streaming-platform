"use client"

import React from "react"
import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Start fade out animation after 2 seconds
    const timer = setTimeout(() => {
      setFadeOut(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-black z-50 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-32 h-32 mb-8 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full text-red-600 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
      </div>
      <h1 className="text-4xl font-bold text-red-600 mb-2">VL Stream</h1>
      <p className="text-gray-400">Your Entertainment Universe</p>
      <div className="mt-8">
        <div className="w-16 h-1 bg-red-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}
