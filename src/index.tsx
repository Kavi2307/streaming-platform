import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx"
import "./index.css"
import  ThemeProvider  from "./Components/ThemeProvider.tsx"
import { VoiceSearchProvider } from "./Components/VoiceSearchProvider.tsx"
import { AuthProvider } from "./contexts/auth-context.tsx"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="VL Stream-theme">
          <VoiceSearchProvider>
            <App />
          </VoiceSearchProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
