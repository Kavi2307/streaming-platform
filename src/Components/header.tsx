"use client"

import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Bell, User, Mic, LogOut } from "lucide-react"
import { Button } from "./ui/button.tsx"
import { Input } from "./ui/input.tsx"
import { useVoiceSearch } from "./VoiceSearchProvider.tsx"
import { useAuth } from "../contexts/auth-context.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx"
import { searchContent } from "./lib/data.ts"
import { useMobile } from "./hooks/use-mobile.ts"
import { ReportIssueButton } from "./report-issue.tsx"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const { isListening, transcript, startListening, stopListening } = useVoiceSearch()
  const navigate = useNavigate()
  const isMobile = useMobile()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript)
      handleSearch(transcript)
    }
  }, [transcript])

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const results = searchContent(query)
    setSearchResults(results)
    setShowResults(true) // Always show results panel, even if empty
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    handleSearch(query)
  }

  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleResultClick = (id: string) => {
  console.log(id,'kaviii')
    setShowResults(false)
    setSearchQuery("")
    navigate(`/watch/${id}`)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"}`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-red-600 font-bold text-2xl">
              VL Stream
            </Link>

            {!isMobile && (
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-white hover:text-gray-300 transition">
                  Home
                </Link>
                <Link to="/" className="text-white hover:text-gray-300 transition">
                  TV Shows
                </Link>
                <Link to="/" className="text-white hover:text-gray-300 transition">
                  Movies
                </Link>
                <Link to="/" className="text-white hover:text-gray-300 transition">
                  New & Popular
                </Link>
                <Link to="/" className="text-white hover:text-gray-300 transition">
                  My List
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center bg-black/60 border border-gray-700 rounded-md overflow-hidden">
                <Input
                  type="text"
                  placeholder="Search titles, genres..."
                  className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => searchQuery && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${isListening ? "text-red-500" : "text-white"}`}
                  onClick={handleVoiceSearch}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Voice search prompt overlay */}
              {isListening && (
                <div className="absolute top-full mt-2 w-full bg-gray-900 rounded-md shadow-lg overflow-hidden z-50 p-4 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center animate-pulse">
                      <Mic className="h-6 w-6 text-red-500" />
                    </div>
                    <p className="text-white font-medium">Please speak now...</p>
                    <p className="text-gray-400 text-sm">
                      {transcript ? `"${transcript}"` : "Listening for your voice query"}
                    </p>
                    <Button variant="outline" size="sm" onClick={stopListening} className="mt-2 border-gray-700">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Search results dropdown */}
              {showResults && (
                <div className="absolute top-full mt-2 w-full bg-gray-900 rounded-md shadow-lg overflow-hidden z-50">
                  <div className="max-h-96 overflow-y-auto p-2">
                    <h3 className="text-sm text-gray-400 px-2 py-1">Search Results</h3>

                    {searchResults.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {searchResults.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
                            onClick={() => {
                              console.log("Clicked result", item.id);
                              handleResultClick(item.id);
                            }}
                          >
                            <img
                              src={item.thumbnail || "/placeholder.svg"}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded mr-3"
                            />
                            <div>
                              <h4 className="text-sm font-medium">{item.title}</h4>
                              <p className="text-xs text-gray-400">{item.genres.join(", ")}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <Search className="h-8 w-8 text-gray-500" />
                          <p className="text-white">No content available</p>
                          <p className="text-gray-400 text-sm">Try a different search term</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleVoiceSearch}
                            className="mt-2 border-gray-700"
                          >
                            <Mic className="mr-2 h-4 w-4" /> Try voice search again
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Report Issue Button */}
            <ReportIssueButton />

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                {user && (
                  <DropdownMenuLabel className="font-normal text-xs text-gray-400">{user.email}</DropdownMenuLabel>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

