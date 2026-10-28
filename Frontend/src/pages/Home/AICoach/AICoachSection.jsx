import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuth from '../../../hooks/useAuth'

const AICoachSection = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const prompts = [
    "What should I train today?",
    "Find a 20-minute mobility session.",
    "Adjust my plan for this week.",
    "Recommend something for beginners.",
  ]

  const handleOpenAssistant = (promptText = '') => {
    window.dispatchEvent(new CustomEvent('open-ai-assistant', { detail: { prompt: promptText } }))
  }

  return (
    <section id="ai-coach" className="py-20 bg-navy scroll-mt-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-navy-800 rounded-card border border-white/10 p-6"
          >
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
              <div className="w-8 h-8 rounded-lg bg-blue-ai flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Yoga Master AI</p>
                <p className="text-xs text-white/50">Training help when you need it.</p>
              </div>
              <div className="ml-auto w-2 h-2 bg-teal rounded-full animate-pulse"></div>
            </div>

            {/* Chat messages */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-end">
                <div className="bg-white/10 text-white text-sm px-3 py-2 rounded-xl rounded-tr-sm max-w-[75%]">
                  Find a 20-minute mobility session.
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-ai flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
                  </svg>
                </div>
                <div className="bg-blue-ai/20 border border-blue-ai/30 text-white text-sm px-3 py-2 rounded-xl rounded-tl-sm max-w-[75%]">
                  Here are 3 mobility classes that fit your schedule today:
                  <div className="mt-2 space-y-1.5">
                    {['Desk Posture Fix · 25 min', 'Mobility Reset · 20 min', 'Lower Body Release · 18 min'].map((c) => (
                      <div key={c} className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1.5">
                        <div className="w-1.5 h-1.5 bg-teal rounded-full flex-shrink-0"></div>
                        <span className="text-xs">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested prompts */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
              {prompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleOpenAssistant(p)}
                  className="text-xs px-2.5 py-1.5 bg-white/5 border border-white/15 text-white/70 rounded-full hover:bg-white/15 hover:text-white hover:border-blue-ai/50 transition-all duration-150 cursor-pointer flex items-center gap-1 group"
                >
                  <span>{p}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: Copy */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white"
          >
            <div className="inline-flex items-center gap-2 bg-blue-ai/20 text-blue-ai text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-blue-ai/30 mb-4">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
              AI Coach
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Training advice, <span className="text-blue-ai">on demand</span>
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Not sure what to train? Ask. The AI coach understands your history, goals, and schedule — and gives you practical answers, not generic responses.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Recommends classes based on your progress',
                'Adjusts your plan when you miss sessions',
                'Explains exercises in plain language',
                'Available from any page while you\'re logged in',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                  <span className="w-5 h-5 rounded-full bg-blue-ai/20 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#4385F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            {user ? (
              <button
                type="button"
                onClick={() => handleOpenAssistant('What should I train today?')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-ai text-white font-bold rounded-btn hover:bg-blue-600 transition-all duration-200 text-sm cursor-pointer select-none shadow-lg shadow-blue-ai/25 group"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="group-hover:rotate-12 transition-transform">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
                </svg>
                <span>Try our AI Assistant</span>
              </button>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-ai text-white font-bold rounded-btn hover:bg-blue-600 transition-all duration-200 text-sm cursor-pointer select-none"
              >
                Try the AI Coach
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AICoachSection
