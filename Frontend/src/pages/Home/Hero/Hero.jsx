import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuth from '../../../hooks/useAuth'
import useUser from '../../../hooks/useUser'
import AIAssistantModal from '../../../components/AIAssistant/AIAssistantModal'

// Animated product-preview card shown on the right side of the hero
const PreviewCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-card shadow-md border border-[#DDE3EA] ${className}`}>
    {children}
  </div>
)

const Hero = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentUser } = useUser()
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const isPlanCompleted = Boolean(user || currentUser?.onboardingCompleted)

  return (
    <section
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #101828 0%, #1D2939 60%, #12B8A6 100%)' }}
    >
      {/* Subtle background grid pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #12B8A6 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 w-full pt-20 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: Copy ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-white"
          >


            <h1 className="text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight">
              Train smarter.
              <br />
              <span className="text-teal">Move better.</span>
            </h1>

            <p className="text-lg text-white/70 max-w-md leading-relaxed">
              Yoga classes, personal coaching, and smart training plans built around your goals and schedule.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!isPlanCompleted ? (
                <>
                  <Link
                    to="/onboarding"
                    id="hero-get-started"
                    className="inline-flex items-center justify-center px-6 py-3 bg-teal text-white font-bold rounded-btn hover:bg-teal-600 transition-all duration-200 hover:shadow-lg hover:shadow-teal/30 text-sm cursor-pointer select-none"
                  >
                    Find My Plan
                  </Link>
                  <Link
                    to="/classes"
                    className="inline-flex items-center justify-center px-5 py-3 bg-white/10 text-white font-semibold rounded-btn border border-white/20 hover:bg-white/20 transition-all duration-200 text-sm backdrop-blur-sm cursor-pointer select-none"
                  >
                    Explore Classes
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center px-6 py-3 bg-teal text-white font-bold rounded-btn hover:bg-teal-600 transition-all duration-200 hover:shadow-lg hover:shadow-teal/30 text-sm cursor-pointer select-none"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/classes"
                    className="inline-flex items-center justify-center px-5 py-3 bg-white/10 text-white font-semibold rounded-btn border border-white/20 hover:bg-white/20 transition-all duration-200 text-sm backdrop-blur-sm cursor-pointer select-none"
                  >
                    Explore Classes
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsAIAssistantOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-ai/20 text-white font-semibold rounded-btn border border-blue-ai/40 hover:bg-blue-ai/30 transition-all duration-200 text-sm backdrop-blur-sm cursor-pointer select-none shadow-sm hover:shadow-lg hover:shadow-blue-ai/20 group"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-ai flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                      </svg>
                    </span>
                    <span>AI Assistant</span>
                  </button>
                </>
              )}
            </div>

            {/* Quick stats */}
            <div className="flex gap-8 pt-4">
              {[
                { value: '200+', label: 'Classes' },
                { value: '40+', label: 'Instructors' },
                { value: '8k+', label: 'Active learners' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-white/50 uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Product Preview ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hidden lg:block relative"
          >
            <div className="relative space-y-3">

              {/* Today's Training card */}
              <PreviewCard className="p-4">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Today's Training</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M5 3l14 9-14 9V3z" fill="#12B8A6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">Mobility Reset</p>
                    <p className="text-xs text-text-secondary">25 min · Beginner · Low Impact</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs font-bold px-2.5 py-1 bg-teal text-white rounded-full">Resume</span>
                  </div>
                </div>
                <div className="mt-3 bg-surface-2 rounded-full h-1.5">
                  <div className="bg-teal h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-text-secondary mt-1">60% complete</p>
              </PreviewCard>

              {/* Weekly streak + goal */}
              <div className="grid grid-cols-2 gap-3">
                <PreviewCard className="p-4">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Weekly Goal</p>
                  <p className="text-2xl font-bold text-text-primary">3 <span className="text-text-secondary text-base font-medium">/ 5</span></p>
                  <p className="text-xs text-text-secondary mt-1">sessions this week</p>
                  <div className="flex gap-1 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
                      <div key={d} className={`flex-1 h-1.5 rounded-full ${i < 3 ? 'bg-teal' : 'bg-surface-2'}`}></div>
                    ))}
                  </div>
                </PreviewCard>
                <PreviewCard className="p-4">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Current Streak</p>
                  <p className="text-2xl font-bold text-coral">🔥 12</p>
                  <p className="text-xs text-text-secondary mt-1">days in a row</p>
                </PreviewCard>
              </div>

              {/* Next Appointment */}
              <PreviewCard className="p-4">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Next Appointment</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-sm font-bold text-teal flex-shrink-0">RK</div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">1-to-1 Mobility Session</p>
                    <p className="text-xs text-text-secondary">Thursday · 6:30 PM · with Rohan Kumar</p>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 bg-blue-ai-100 text-blue-ai rounded-full">Join</span>
                  </div>
                </div>
              </PreviewCard>

              {/* AI Coach pill */}
              <div
                onClick={() => setIsAIAssistantOpen(true)}
                className="cursor-pointer group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setIsAIAssistantOpen(true)}
              >
                <PreviewCard className="p-3 flex items-center gap-3 group-hover:border-blue-ai/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-ai flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary"><span className="font-bold">AI Coach:</span> <span className="text-text-secondary">Recommended because you're working on mobility.</span></p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-ai bg-blue-ai-100 px-2 py-0.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
                    Chat
                  </span>
                </PreviewCard>
              </div>

            </div>
          </motion.div>
        </div>
      </div>

      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </section>
  )
}

export default Hero
