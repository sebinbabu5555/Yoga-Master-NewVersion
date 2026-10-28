import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Navbar from "../components/headers/Navbar"
import Footer from "../pages/Home/Footer/Footer"
import AIAssistantModal from "../components/AIAssistant/AIAssistantModal"

const MainLayout = () => {
  const location = useLocation()
  const isAuthPage = ['/login', '/register', '/onboarding'].includes(location.pathname)
  const [isAIOpen, setIsAIOpen] = useState(false)

  return (
    <main className='overflow-hidden dark:bg-black relative min-h-screen'>
      {!isAuthPage && <Navbar />}
      <Outlet />
      {!isAuthPage && <footer><Footer /></footer>}

      {/* Floating AI Coach Trigger - Elegant athletic design apt to Yoga Master */}
      {!isAuthPage && (
        <button
          onClick={() => setIsAIOpen(true)}
          aria-label="Open AI Coach"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 bg-navy hover:bg-navy-800 text-white rounded-full shadow-lg shadow-navy/20 border border-teal/40 hover:border-teal transition-all duration-200 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-teal group-hover:scale-110 transition-transform">
              <path
                d="M12 2L14.7 7.7L21 8.5L16.2 12.8L17.6 19L12 15.8L6.4 19L7.8 12.8L3 8.5L9.3 7.7L12 2Z"
                fill="currentColor"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal rounded-full animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal rounded-full" />
          </div>
          <span className="text-xs font-bold tracking-tight text-white group-hover:text-teal transition-colors">
            AI Coach
          </span>
        </button>
      )}

      {/* Global AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />
    </main>
  )
}

export default MainLayout

