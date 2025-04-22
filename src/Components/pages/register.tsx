"use client"

import React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
// import { useAuth } from "../contexts/auth-context"
// import { Button } from "../components/ui/button"
// import { Input } from "../components/ui/input"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Input } from "../ui/input.tsx"
import { Button } from "../ui/button.tsx"
import { useAuth } from "../../contexts/auth-context.tsx"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate inputs
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields")
      return
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address")
      return
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      const success = await register(name, email, password)
      if (!success) {
        setError("Email already in use")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-90 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-900 rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">VL Stream</h1>
          <h2 className="mt-6 text-2xl font-bold text-white">Create your account</h2>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 bg-gray-800 border-gray-700 text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 bg-gray-800 border-gray-700 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 bg-gray-800 border-gray-700 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="mt-1 flex items-center">
                <div
                  className={`h-1 flex-1 rounded-full ${password ? (validatePassword(password) ? "bg-green-500" : "bg-red-500") : "bg-gray-700"}`}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-400">Password must be at least 8 characters long</p>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 bg-gray-800 border-gray-700 text-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {password && confirmPassword && (
                <div className="mt-1 flex items-center">
                  {password === confirmPassword ? (
                    <p className="text-xs text-green-500 flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Passwords match
                    </p>
                  ) : (
                    <p className="text-xs text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" /> Passwords do not match
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
