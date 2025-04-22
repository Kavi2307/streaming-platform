// import { Routes, Route } from "react-router-dom"
// import Header from "./Components/header.tsx"
// import React from "react"
// import HomePage from "./Components/pages/home.tsx"
// import WatchPage from "./Components/pages/watch.tsx"

// // import
// function App() {
//   return (
//     <div className="min-h-screen bg-black text-white">
//       <Header />
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/watch/:id" element={<WatchPage />} />
//       </Routes>
//     </div>
//   )
// }

// export default App

import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "./contexts/auth-context.tsx"
import SplashScreen from "./Components/splash-screen.tsx"
import React from "react"
import Header from "./Components/header.tsx"
// import Header from "./components/header"
import HomePage from "./Components/pages/home.tsx"
import WatchPage from "./Components/pages/watch.tsx"

import LoginPage from "./Components/pages/login.tsx"
import RegisterPage from "./Components/pages/register.tsx"

// import { useAuth } from "./contexts/auth-context"

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Show splash screen for 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {isAuthenticated && <Header />}
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/watch/:id" 
          element={isAuthenticated ? <WatchPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} 
        />
      </Routes>
    </div>
  )
}

export default App
