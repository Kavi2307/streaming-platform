"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface VoiceSearchContextType {
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

const VoiceSearchContext = createContext<VoiceSearchContextType | undefined>(undefined)

export function VoiceSearchProvider({ children }: { children: ReactNode }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = false
      recognitionInstance.interimResults = true
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex
        const result = event.results[current]
        const transcriptValue = result[0].transcript

        setTranscript(transcriptValue)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start()
        setIsListening(true)
        setTranscript("")
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    } else {
      console.warn("Speech recognition not supported in this browser")
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition, isListening])

  const resetTranscript = useCallback(() => {
    setTranscript("")
  }, [])

  return (
    <VoiceSearchContext.Provider
      value={{
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
      }}
    >
      {children}
    </VoiceSearchContext.Provider>
  )
}

export function useVoiceSearch() {
  const context = useContext(VoiceSearchContext)

  if (context === undefined) {
    throw new Error("useVoiceSearch must be used within a VoiceSearchProvider")
  }

  return context
}
