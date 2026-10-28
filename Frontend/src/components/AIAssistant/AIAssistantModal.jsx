import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useUser from '../../hooks/useUser'
import useAxiosFetch from '../../hooks/useAxiosFetch'

const INITIAL_PROMPTS = [
  'Schedule my workouts for this week',
  'What is my active goal challenge?',
  'Book 1-to-1 personal training',
  'I only have 15 minutes today',
  'Desk posture fix for back pain',
  'Recommend classes for my profile',
]

// Intelligent yoga AI response generator (client-side fallback)
const getFallbackAIResponse = (userPrompt, userName, profile, activePlan) => {
  const q = userPrompt.toLowerCase().trim()
  const prefTime = profile?.preferredTimeOfDay || 'morning'
  const prefDuration = profile?.preferredDuration || 25
  const userGoal = profile?.primaryGoal || 'Core Strength & Posture'
  const activeTitle = activePlan?.program?.title || '60-Day Core, Abs & Functional Strength'
  const nextDay = activePlan?.enrollment?.nextDay || 1
  const streak = activePlan?.enrollment?.streak || 0

  if (
    q.includes('schedule') ||
    q.includes('calendar') ||
    q.includes('plan my week') ||
    q.includes('availability') ||
    q.includes('when should i') ||
    q.includes('when to train')
  ) {
    const slotTime = prefTime.toLowerCase().includes('evening') ? '06:30 PM - 07:00 PM' : '07:15 AM - 07:45 AM'
    return {
      text: `Here is your **Personalized Weekly Schedule**, optimized for your **${prefTime.toUpperCase()}** availability window (${prefDuration} mins/day) and your focus on **${userGoal}**:

• **Time Slot:** ${slotTime} (matched to your habit profile)
• **Active Plan:** ${activeTitle}
• **Balance:** 5 focused training days + 2 active recovery days

I've balanced dynamic mobility, core endurance, and spinal decompression to keep you consistent without overtraining.`,
      schedule: {
        title: `Your ${prefTime.toUpperCase()} Weekly Schedule (${prefDuration} min/day)`,
        timeSlot: slotTime,
        days: [
          { day: 'Monday', time: slotTime, session: `${activeTitle} (Day ${nextDay})`, type: 'Active Challenge', duration: `${prefDuration}m` },
          { day: 'Tuesday', time: slotTime, session: 'Thoracic Mobility & Spinal Decompression', type: 'Posture Focus', duration: '20m' },
          { day: 'Wednesday', time: slotTime, session: `${activeTitle} (Day ${nextDay + 1})`, type: 'Active Challenge', duration: `${prefDuration}m` },
          { day: 'Thursday', time: 'Rest / Light', session: 'Diaphragmatic Breathwork & Vagal Reset', type: 'Recovery', duration: '15m' },
          { day: 'Friday', time: slotTime, session: `${activeTitle} (Day ${nextDay + 2})`, type: 'Active Challenge', duration: `${prefDuration}m` },
          { day: 'Saturday', time: 'Flexible', session: '1-to-1 Private Form Check or Long Flow', type: 'Coaching / Flow', duration: '45m' },
          { day: 'Sunday', time: 'Rest', session: 'Full Body Myofascial Release & Rest', type: 'Rest', duration: '10m' },
        ],
      },
      action: { label: 'View Active Training Plan', to: '/dashboard/training-plan' },
      quickSuggestions: [
        'I only have 15 minutes today',
        'Book 1-to-1 personal training',
        'Adjust availability in Profile',
      ],
    }
  }

  if (
    q.includes('1-to-1') ||
    q.includes('1-on-1') ||
    q.includes('personal training') ||
    q.includes('private') ||
    q.includes('coach')
  ) {
    return {
      text: `Hello ${userName}! Our **1-to-1 Personal Coaching** is tailored 100% to you rather than group classes:

• **Live Real-time Form Check:** Ensure joint alignment in planks, down dogs, and lunges.
• **Personal Injury Safeguards:** Custom adaptations for back, knee, or wrist sensitivity.
• **Private Booking Engine:** 45-minute live HD video session with certified master instructors.
• **Rate:** Included with your access pass.`,
      action: { label: 'Book 1-to-1 Private Session', to: '/dashboard/personal-training' },
      quickSuggestions: ['Schedule my workouts for this week', 'What is my active goal challenge?'],
    }
  }

  if (
    q.includes('challenge') ||
    q.includes('60 day') ||
    q.includes('30 day') ||
    q.includes('abs') ||
    q.includes('my plan') ||
    q.includes('streak') ||
    q.includes('today')
  ) {
    return {
      text: `Here is your current challenge status, ${userName}:

• **Program:** **${activeTitle}**
• **Today's Mission:** **Day ${nextDay}**
• **Active Streak:** 🔥 **${streak} Day${streak === 1 ? '' : 's'} in a row!**

Keep up the daily momentum to build lifelong athletic habits.`,
      action: { label: `Start Day ${nextDay} Challenge`, to: '/dashboard/training-plan' },
      quickSuggestions: ['Schedule my workouts for this week', 'I only have 15 minutes today'],
    }
  }

  if (q.includes('only have 10') || q.includes('only have 15') || q.includes('short on time')) {
    return {
      text: `No problem, ${userName}! A 12-minute express micro-routine keeps your streak alive:

1. **Cat-Cow Spine Waves (2 min):** Mobilize cervical & lumbar vertebrae.
2. **Plank to Down Dog Holds (3 min):** Fire up the transverse abdominis.
3. **Low Lunge Hip Opener (3 min):** Reverse desk-sitting stiffness.
4. **Child's Pose Rest (2 min):** Cortisol down-regulation.

Consistent 10-minute micro-habits beat sporadic hour-long workouts every single time!`,
      action: { label: "Log Today's Quick Session", to: '/dashboard/training-plan' },
      quickSuggestions: ['Schedule my workouts for this week', 'Book 1-to-1 personal training'],
    }
  }

  if (q.includes('posture') || q.includes('desk') || q.includes('back')) {
    return {
      text: `Here is an athletic 15-minute Posture & Decompression Protocol:

• **Cactus Arms Chest Opener:** 8 deep breaths with thoracic extension.
• **Cat-Cow Flow:** 10 cycles linking movement to inhalation/exhalation.
• **Thread-the-Needle:** 5 breaths per side for thoracic spine rotation.
• **Low Lunge:** 90s per side to open tight hip flexors.

Check our free **30-Day Mobility & Posture Reset** for long-term correction!`,
      action: { label: 'Join 30-Day Posture Reset', to: '/dashboard/training-plan' },
      quickSuggestions: ['Schedule my workouts for this week', 'Book 1-to-1 personal training'],
    }
  }

  return {
    text: `That is a great question regarding **"${userPrompt}"**!

As your Yoga Master AI Coach, I can help you with anything across our website:
• **Weekly Scheduling:** Plan training times tailored to your habit profile (${prefTime}).
• **1-to-1 Coaching:** Book private live form assessments with master instructors.
• **Free Goal Programs:** 60-Day Core, 30-Day Posture, and 21-Day Flexibility challenges.
• **Personalized Recommendations:** Explore scored classes matched to your goals.`,
    action: { label: 'Explore Recommendations', to: '/dashboard/recommendations' },
    quickSuggestions: [
      'Schedule my workouts for this week',
      'Book 1-to-1 personal training',
      'What is my active goal challenge?',
    ],
  }
}

const AIAssistantModal = ({ isOpen: controlledIsOpen, onClose: controlledOnClose }) => {
  const { user } = useAuth()
  const { currentUser } = useUser()
  const axiosFetch = useAxiosFetch()

  const userName = currentUser?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Yogi'
  const onboardingProfile = currentUser?.onboardingProfile || null

  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isControlled = typeof controlledIsOpen === 'boolean'
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const [activePlan, setActivePlan] = useState(null)
  const [quickSuggestions, setQuickSuggestions] = useState(INITIAL_PROMPTS)

  const handleClose = () => {
    if (isControlled && controlledOnClose) {
      controlledOnClose()
    }
    setInternalIsOpen(false)
  }

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hi ${userName}! 👋 I'm your Yoga Master AI Coach.

I can organize your **weekly training schedule**, track your **goal challenge tasks & streaks**, connect you with **1-to-1 private coaches**, or answer anything about our platform.

How can I help your practice today?`,
      time: 'Just now',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  // Fetch active goal program when opened to calibrate context
  useEffect(() => {
    if (isOpen && user?.email) {
      const token = localStorage.getItem('token')
      axiosFetch
        .get('/api/user-programs/active', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .then((res) => {
          if (res.data?.active) {
            setActivePlan(res.data)
          }
        })
        .catch(() => {})
    }
  }, [isOpen, user?.email, axiosFetch])

  // Listen for global custom events to open with optional prompt
  useEffect(() => {
    const handleGlobalOpen = (e) => {
      setInternalIsOpen(true)
      const prompt = e.detail?.prompt
      if (prompt) {
        handleSendPrompt(prompt)
      }
    }
    window.addEventListener('open-ai-assistant', handleGlobalOpen)
    return () => window.removeEventListener('open-ai-assistant', handleGlobalOpen)
  }, [])

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleSendPrompt = async (promptText) => {
    const textToSend = promptText || input.trim()
    if (!textToSend) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      // Call backend AI chat endpoint
      const res = await axiosFetch.post(
        '/api/ai/chat',
        { prompt: textToSend },
        { headers }
      )

      if (res.data?.success && res.data?.reply) {
        const reply = res.data.reply
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: reply.text,
          action: reply.action,
          schedule: reply.schedule,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, aiMsg])
        if (Array.isArray(reply.quickSuggestions) && reply.quickSuggestions.length > 0) {
          setQuickSuggestions(reply.quickSuggestions)
        }
      } else {
        throw new Error('Fallback')
      }
    } catch {
      // Graceful local intelligence fallback
      const fallback = getFallbackAIResponse(textToSend, userName, onboardingProfile, activePlan)
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: fallback.text,
        action: fallback.action,
        schedule: fallback.schedule,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMsg])
      if (fallback.quickSuggestions) {
        setQuickSuggestions(fallback.quickSuggestions)
      }
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSendPrompt(input)
  }

  // Active status chips for top bar
  const activeProgramTitle = activePlan?.program?.title
  const currentStreak = activePlan?.enrollment?.streak || 0
  const prefTime = onboardingProfile?.preferredTimeOfDay || 'Morning'
  const prefDuration = onboardingProfile?.preferredDuration || 25

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-navy/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-navy-800 border border-white/15 rounded-card shadow-2xl overflow-hidden flex flex-col z-10 max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-4 sm:px-6 sm:py-3.5 bg-navy/95 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal via-blue-ai to-coral flex items-center justify-center text-white shadow-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal border-2 border-navy-800 rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Yoga Master AI Assistant
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-teal/20 text-teal rounded-full border border-teal/30">
                      Smart Scheduler
                    </span>
                  </div>
                  <p className="text-xs text-white/60">
                    Schedules workouts, tracks goal plans & manages 1-to-1 coaching
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard/training-plan"
                  onClick={handleClose}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-btn bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/15"
                >
                  <span>⚡</span>
                  <span>My Plan</span>
                </Link>

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close AI Assistant"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* User Context Strip (shows active plan & habit preferences) */}
            <div className="px-4 py-2 bg-navy border-b border-white/10 flex items-center justify-between text-[11px] text-white/70 overflow-x-auto no-scrollbar gap-3">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-white/40">Profile Context:</span>
                <span className="px-2 py-0.5 rounded-full bg-teal/20 text-teal-300 font-bold border border-teal/30 flex items-center gap-1">
                  <span>🎯</span>
                  <span className="truncate max-w-[150px]">
                    {activeProgramTitle || onboardingProfile?.primaryGoal || 'Goal Ready'}
                  </span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-coral/20 text-coral-300 font-bold border border-coral/30 flex items-center gap-1">
                  <span>🔥</span>
                  <span>{currentStreak}d Streak</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-ai/20 text-blue-300 font-bold border border-blue-ai/30 flex items-center gap-1">
                  <span>⏰</span>
                  <span className="capitalize">{prefTime} · {prefDuration}m</span>
                </span>
              </div>

              <Link
                to="/dashboard/personal-training"
                onClick={handleClose}
                className="text-[11px] text-teal-300 hover:text-teal font-bold flex-shrink-0 underline"
              >
                Book 1-to-1 Coach →
              </Link>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 min-h-[280px] max-h-[52vh]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-teal/20 border border-teal/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-teal">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="max-w-[88%] sm:max-w-[82%] space-y-2.5">
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-teal text-white rounded-tr-xs shadow-md'
                          : 'bg-navy/95 text-white/90 border border-white/10 rounded-tl-xs shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Interactive Weekly Schedule Card */}
                    {msg.schedule && (
                      <div className="p-3.5 rounded-xl bg-navy/90 border border-teal/40 space-y-2.5 shadow-md text-xs">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="font-bold text-teal-300 flex items-center gap-1.5">
                            <span>📅</span>
                            <span>{msg.schedule.title}</span>
                          </span>
                          <span className="text-[10px] text-white/50">{msg.schedule.timeSlot}</span>
                        </div>

                        <div className="space-y-1.5">
                          {msg.schedule.days?.map((d, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-1.5 rounded bg-white/5 border border-white/10 hover:border-teal/40 transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-16 font-bold text-white text-[11px]">{d.day}</span>
                                <span className="text-white/80 truncate text-[11px]">{d.session}</span>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                                  {d.duration}
                                </span>
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                    d.type.includes('Challenge')
                                      ? 'bg-coral-100/20 text-coral border border-coral/30'
                                      : d.type.includes('Recovery') || d.type.includes('Rest')
                                      ? 'bg-teal-100/20 text-teal border border-teal/30'
                                      : 'bg-blue-ai-100/20 text-blue-ai border border-blue-ai/30'
                                  }`}
                                >
                                  {d.type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    {msg.action && (
                      <div className="pt-0.5">
                        <Link
                          to={msg.action.to}
                          onClick={handleClose}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal text-white text-xs font-bold rounded-btn hover:bg-teal-600 transition-colors shadow-sm"
                        >
                          <span>{msg.action.label}</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </div>
                    )}

                    <span className="block text-[10px] text-white/40 px-1">{msg.time}</span>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-teal/20 border border-teal/30 flex items-center justify-center flex-shrink-0 text-teal">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="bg-navy/90 border border-white/10 text-white text-xs px-4 py-2.5 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-blue-ai rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-coral rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2.5 bg-navy/70 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-semibold text-white/50 flex-shrink-0">Suggested:</span>
              {quickSuggestions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSendPrompt(p)}
                  className="text-xs px-3 py-1 bg-white/5 border border-white/15 text-white/80 rounded-full hover:bg-teal hover:border-teal hover:text-white transition-all whitespace-nowrap cursor-pointer flex-shrink-0"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-navy border-t border-white/10">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask to schedule your week, check your plan, book coaching, or poses..."
                  className="flex-1 bg-white/5 border border-white/15 rounded-btn px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-teal transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-2.5 bg-teal text-white font-bold text-sm rounded-btn hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0 shadow-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AIAssistantModal
