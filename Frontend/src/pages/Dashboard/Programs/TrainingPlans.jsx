import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { HashLoader } from 'react-spinners'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useUser from '../../../hooks/useUser'

const CATEGORY_FILTERS = ['All', 'Strength', 'Posture', 'Flexibility', 'Recovery']

// Helper to normalize exercise data into visual object with image, video, cues, and duration
const parseExercise = (ex, idx) => {
  if (typeof ex === 'object' && ex !== null) {
    return {
      name: ex.name,
      duration: ex.duration || '2-3 min',
      target: ex.target || 'Core & Spinal Alignment',
      cue: ex.cue || 'Maintain rhythmic diaphragmatic breathing with proper joint stacking.',
      image: ex.image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
      videoUrl: ex.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-the-plank-exercise-41261-large.mp4',
    }
  }

  const match = typeof ex === 'string' ? ex.match(/^(.*?)(?:\((.*?)\))?$/) : null
  const name = match ? match[1].trim() : String(ex)
  const duration = match && match[2] ? match[2].trim() : '2-3 min'

  const fallbackImages = [
    'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
  ]

  const fallbackVideos = [
    'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-the-plank-exercise-41261-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-on-a-mat-41262-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-woman-stretching-her-body-on-a-yoga-mat-41260-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-young-woman-doing-stretching-exercises-on-a-mat-41258-large.mp4',
  ]

  return {
    name,
    duration,
    target: 'Functional Movement & Alignment',
    cue: 'Focus on biomechanical stability, smooth nasal breathing, and controlled movement tempo.',
    image: fallbackImages[idx % fallbackImages.length],
    videoUrl: fallbackVideos[idx % fallbackVideos.length],
  }
}

const TrainingPlans = () => {
  const axiosSecure = useAxiosSecure()
  const { currentUser } = useUser()

  const [programs, setPrograms] = useState([])
  const [activeUserData, setActiveUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDayPreview, setSelectedDayPreview] = useState(null)
  const [activeVideoModal, setActiveVideoModal] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch all programs and user's active program
  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        const [progRes, userProgRes] = await Promise.all([
          axiosSecure.get('/api/programs').catch(() => ({ data: [] })),
          axiosSecure.get('/api/user-programs/active').catch(() => ({ data: { active: false } })),
        ])

        if (isMounted) {
          setPrograms(Array.isArray(progRes.data) ? progRes.data : [])
          if (userProgRes.data?.active) {
            setActiveUserData(userProgRes.data)
          } else {
            setActiveUserData(null)
          }
        }
      } catch (err) {
        console.error('Error loading training plans:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()
    return () => {
      isMounted = false
    }
  }, [axiosSecure])

  // Refresh active user program
  const refreshActiveProgram = async () => {
    try {
      const res = await axiosSecure.get('/api/user-programs/active')
      if (res.data?.active) {
        setActiveUserData(res.data)
      } else {
        setActiveUserData(null)
      }
    } catch (err) {
      console.error('Error refreshing active program:', err)
    }
  }

  // Handle enrolling into a program
  const handleEnroll = async (programId, title) => {
    const isSwitching = !!activeUserData?.active
    const confirm = await Swal.fire({
      title: isSwitching ? 'Switch Active Plan?' : 'Start Free Challenge?',
      text: isSwitching
        ? `Switching to "${title}" will set it as your primary active challenge.`
        : `Ready to start the free "${title}"? Daily guided routines and workout videos will be loaded onto your schedule.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#12B8A6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: isSwitching ? 'Yes, switch plan' : 'Start My Plan',
    })

    if (confirm.isConfirmed) {
      try {
        setActionLoading(true)
        const res = await axiosSecure.post('/api/user-programs/enroll', { programId })
        if (res.data?.success) {
          await refreshActiveProgram()
          Swal.fire({
            title: 'Challenge Started!',
            text: `You have successfully enrolled in ${title}. Let's conquer Day 1 today!`,
            icon: 'success',
            confirmButtonColor: '#12B8A6',
          })
        }
      } catch (err) {
        console.error('Enrollment error:', err)
        Swal.fire('Notice', 'Could not enroll in program. Please try again.', 'error')
      } finally {
        setActionLoading(false)
      }
    }
  }

  // Mark Day Complete
  const handleCompleteDay = async (dayNumber) => {
    if (!activeUserData?.program) return

    try {
      setActionLoading(true)
      const res = await axiosSecure.post('/api/user-programs/complete-day', {
        programId: activeUserData.program.id,
        day: dayNumber,
      })

      if (res.data?.success) {
        await refreshActiveProgram()
        Swal.fire({
          title: '🔥 Day Complete!',
          html: `
            <div class="text-center space-y-2">
              <p class="text-sm font-semibold text-navy">Great work completing Day ${dayNumber}!</p>
              <p class="text-xs text-coral font-bold">Current Streak: ${res.data.streak} Day${res.data.streak > 1 ? 's' : ''} in a row!</p>
              ${
                res.data.isFullyCompleted
                  ? '<p class="text-xs text-teal font-black uppercase tracking-wider">🏆 Congratulations! You have conquered the entire program!</p>'
                  : '<p class="text-xs text-text-secondary">Keep the momentum going tomorrow for your next mission.</p>'
              }
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#12B8A6',
        })
      }
    } catch (err) {
      console.error('Failed to mark day complete:', err)
      Swal.fire('Notice', 'Unable to complete day. Please try again.', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Reset Progress
  const handleResetProgress = async () => {
    const confirm = await Swal.fire({
      title: 'Reset Program Progress?',
      text: 'This will reset your completed days count and current streak back to Day 1.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, reset',
    })

    if (confirm.isConfirmed) {
      try {
        setActionLoading(true)
        await axiosSecure.post('/api/user-programs/reset')
        await refreshActiveProgram()
        Swal.fire('Reset Complete', 'Your program tracker has been reset to Day 1.', 'info')
      } catch (err) {
        console.error('Reset failed:', err)
      } finally {
        setActionLoading(false)
      }
    }
  }

  const filteredPrograms =
    selectedCategory === 'All'
      ? programs
      : programs.filter((p) => p.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <HashLoader color="#12B8A6" size={45} />
        <p className="text-sm font-bold text-navy mt-4">Loading free goal programs...</p>
      </div>
    )
  }

  const activeEnrollment = activeUserData?.enrollment
  const activeProgram = activeUserData?.program
  const nextDay = activeEnrollment?.nextDay || 1
  const completedDays = activeEnrollment?.completedDays || []

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-navy via-navy to-coral/80 text-white rounded-card p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/20 text-coral-200 text-xs font-bold uppercase tracking-wider">
            <span>⚡</span>
            <span>Free Goal-Oriented Programs & Challenges</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Curated Progressive Plans with Guided Exercise Sequences & Demos
          </h1>
          <p className="text-surface-2 text-sm md:text-base leading-relaxed">
            Choose a targeted challenge like <strong>60-Day Core & Abs</strong> or <strong>30-Day Posture Reset</strong>. Follow daily workout routines complete with exercise photos, video form demos, and alignment cues. Zero equipment needed.
          </p>
        </div>
      </div>

      {/* ── ACTIVE PLAN TRACKER WIDGET (If user is enrolled) ── */}
      {activeUserData?.active && activeProgram ? (
        <div className="bg-white rounded-card border-2 border-teal/40 p-6 md:p-8 shadow-sm space-y-6">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-ui pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-700 uppercase tracking-wider">
                  Active Challenge
                </span>
                <span className="text-xs font-bold text-coral flex items-center gap-1">
                  🔥 {activeEnrollment?.streak || 0} Day Streak
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-navy">
                {activeProgram.title}
              </h2>
              <p className="text-xs text-text-secondary">{activeProgram.subtitle}</p>
            </div>

            {/* Progress Bar & Reset */}
            <div className="flex flex-col items-start md:items-end gap-2 min-w-[200px]">
              <div className="flex items-baseline gap-1 text-sm font-bold text-navy">
                <span>Day {completedDays.length}</span>
                <span className="text-text-secondary font-medium">/ {activeProgram.durationDays}</span>
                <span className="text-xs text-teal font-black ml-1.5">
                  ({activeEnrollment?.percentage || 0}%)
                </span>
              </div>
              <div className="w-full bg-surface-2 rounded-full h-2">
                <div
                  className="bg-teal h-2 rounded-full transition-all duration-500"
                  style={{ width: `${activeEnrollment?.percentage || 0}%` }}
                ></div>
              </div>
              <button
                type="button"
                onClick={handleResetProgress}
                className="text-[11px] text-text-secondary hover:text-red-500 underline cursor-pointer"
              >
                Reset challenge
              </button>
            </div>
          </div>

          {/* Today's Mission Card */}
          <div className="bg-gradient-to-br from-bg-base to-teal-100/20 border border-teal/30 rounded-xl p-5 md:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal text-white font-black text-base flex items-center justify-center shadow-md">
                  D{nextDay}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base md:text-lg font-bold text-navy">
                      Today's Mission: {activeUserData?.nextDayDetails?.title || `Day ${nextDay} Training`}
                    </h3>
                    {activeUserData?.nextDayDetails?.intensity && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-border-ui text-text-secondary">
                        {activeUserData.nextDayDetails.intensity}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {activeUserData?.nextDayDetails?.minutes || activeProgram.dailyMinutes} Minutes · Guided movement sequence with video demos
                  </p>
                </div>
              </div>

              {/* Complete Action Button */}
              <div>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleCompleteDay(nextDay)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-teal hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-xs rounded-btn shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>✓</span>
                  <span>Mark Day {nextDay} Complete</span>
                </button>
              </div>
            </div>

            {/* Visual Exercises Sequence Grid with Images & Video Triggers */}
            {activeUserData?.nextDayDetails?.exercises && (
              <div className="pt-3 border-t border-border-ui/60 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                    <span>🎬</span>
                    <span>Workout Sequence ({activeUserData.nextDayDetails.exercises.length} Exercises)</span>
                  </p>
                  <span className="text-[11px] text-text-secondary">Click any exercise card to watch video demo</span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {activeUserData.nextDayDetails.exercises.map((rawEx, idx) => {
                    const ex = parseExercise(rawEx, idx)
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveVideoModal(ex)}
                        className="group bg-white rounded-xl border border-border-ui overflow-hidden shadow-xs hover:border-teal hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                      >
                        {/* Image Thumbnail with Video Trigger Overlay */}
                        <div className="relative h-32 bg-navy overflow-hidden">
                          <img
                            src={ex.image}
                            alt={ex.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80'
                            }}
                          />
                          <div className="absolute inset-0 bg-navy/30 group-hover:bg-navy/15 transition-colors flex items-center justify-center">
                            <div className="w-9 h-9 rounded-full bg-white/95 text-navy group-hover:bg-teal group-hover:text-white flex items-center justify-center shadow-lg transition-all transform group-hover:scale-110">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-navy/85 text-white font-black text-[9px] backdrop-blur-xs">
                            Step #{idx + 1}
                          </div>
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/75 text-white font-bold text-[9px] backdrop-blur-xs">
                            {ex.duration}
                          </div>
                        </div>

                        {/* Exercise Information */}
                        <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-navy group-hover:text-teal transition-colors line-clamp-1">
                              {ex.name}
                            </h4>
                            <p className="text-[10px] text-teal font-semibold line-clamp-1">
                              {ex.target}
                            </p>
                          </div>
                          <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed">
                            {ex.cue}
                          </p>
                          <div className="pt-1.5 border-t border-border-ui/50 flex items-center justify-between text-[10px] font-bold text-teal">
                            <span>Watch Form Demo</span>
                            <span className="group-hover:translate-x-0.5 transition-transform">▶</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Curriculum Weeks & Days Visualizer */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy">
              Progress & Roadmap
            </h3>

            {activeProgram.weeks && activeProgram.weeks.length > 0 ? (
              <div className="space-y-4">
                {activeProgram.weeks.map((week) => (
                  <div
                    key={week.weekNumber}
                    className="p-4 rounded-xl border border-border-ui bg-bg-base/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 bg-navy text-white rounded">
                          Week {week.weekNumber}
                        </span>
                        <span className="text-xs font-bold text-navy">{week.theme}</span>
                      </div>
                      <span className="text-[11px] text-text-secondary">{week.focus}</span>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {week.days.map((item) => {
                        const isDone = completedDays.includes(item.day)
                        const isCurrent = item.day === nextDay
                        return (
                          <button
                            key={item.day}
                            type="button"
                            onClick={() => setSelectedDayPreview(item)}
                            className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                              isDone
                                ? 'bg-teal text-white border-teal shadow-xs'
                                : isCurrent
                                ? 'bg-white border-coral ring-2 ring-coral/40 text-coral font-bold'
                                : 'bg-white border-border-ui text-text-secondary hover:border-teal'
                            }`}
                          >
                            <span className="block text-[10px] uppercase font-bold">
                              {isDone ? '✓' : `D${item.day}`}
                            </span>
                            <span className="block text-[9px] truncate">
                              {item.intensity === 'Rest' ? 'Rest' : `${item.minutes}m`}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-1.5">
                {Array.from({ length: activeProgram.durationDays || 30 }, (_, i) => i + 1).map((d) => {
                  const isDone = completedDays.includes(d)
                  const isCurrent = d === nextDay
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleCompleteDay(d)}
                      className={`h-9 rounded-lg text-xs font-bold border flex items-center justify-center transition-all cursor-pointer ${
                        isDone
                          ? 'bg-teal text-white border-teal'
                          : isCurrent
                          ? 'bg-white border-coral ring-2 ring-coral/40 text-coral'
                          : 'bg-white border-border-ui text-text-secondary hover:border-teal'
                      }`}
                    >
                      {isDone ? '✓' : d}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State banner if not yet enrolled */
        <div className="bg-white rounded-card border border-border-ui p-6 md:p-8 text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-coral-100 text-coral text-2xl flex items-center justify-center mx-auto">
            🚀
          </div>
          <h2 className="text-xl font-bold text-navy">No Active Challenge Yet</h2>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            Select one of the free goal-oriented programs below to lock in your daily tasks, start your streak, and follow along with exercise demo videos!
          </p>
        </div>
      )}

      {/* ── EXPLORE ALL FREE GOAL PROGRAMS ── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-navy">Available Free Goal Programs</h2>
            <p className="text-xs text-text-secondary">
              Structured progressive protocols with full video sequences designed by verified coaches.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-btn transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-navy text-white shadow-xs'
                    : 'bg-white text-text-secondary border border-border-ui hover:border-navy/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => {
            const isEnrolled = activeUserData?.program?.id === program.id

            return (
              <div
                key={program.id}
                className={`bg-white rounded-card border flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md ${
                  isEnrolled ? 'border-teal ring-2 ring-teal/30' : 'border-border-ui'
                }`}
              >
                {/* Image & Header */}
                <div className="relative h-44 overflow-hidden bg-navy">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80'
                    }}
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-navy/90 text-white backdrop-blur-sm">
                      {program.durationDays} Days · {program.dailyMinutes} min/day
                    </span>
                    {program.tag && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${program.badgeColor || 'bg-coral-100 text-coral'}`}>
                        {program.tag}
                      </span>
                    )}
                  </div>
                  {isEnrolled && (
                    <div className="absolute bottom-3 right-3 bg-teal text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                      ✓ Currently Active
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-text-secondary">
                      <span className="font-bold text-teal">{program.primaryGoal}</span>
                      <span>{program.level}</span>
                    </div>

                    <h3 className="text-base font-bold text-navy leading-snug">
                      {program.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {program.overview}
                    </p>

                    {/* Bullet Benefits */}
                    <ul className="space-y-1 pt-2 border-t border-border-ui/60">
                      {(program.benefits || []).slice(0, 3).map((b, i) => (
                        <li key={i} className="text-[11px] text-text-secondary flex items-start gap-1.5">
                          <span className="text-teal font-black">✓</span>
                          <span className="line-clamp-1">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-border-ui/60">
                    {isEnrolled ? (
                      <button
                        type="button"
                        disabled
                        className="w-full py-2.5 bg-teal/10 text-teal border border-teal/30 font-bold text-xs rounded-btn cursor-default"
                      >
                        ✓ In Progress (Day {completedDays.length} of {program.durationDays})
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleEnroll(program.id, program.title)}
                        className="w-full py-2.5 bg-navy hover:bg-teal text-white font-bold text-xs rounded-btn transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>{activeUserData?.active ? 'Switch to This Challenge' : 'Start Free Challenge'}</span>
                        <span>→</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── DAY DETAILS PREVIEW MODAL (ROADMAP) ── */}
      {selectedDayPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-card max-w-2xl w-full p-6 space-y-4 shadow-xl border border-border-ui animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border-ui pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-full bg-teal text-white font-black text-xs flex items-center justify-center shadow-xs">
                  D{selectedDayPreview.day}
                </span>
                <div>
                  <h3 className="text-base font-bold text-navy">{selectedDayPreview.title}</h3>
                  <p className="text-[11px] text-text-secondary">
                    {selectedDayPreview.minutes} Mins · Intensity: {selectedDayPreview.intensity}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDayPreview(null)}
                className="w-8 h-8 rounded-full bg-surface-2 hover:bg-border-ui text-text-secondary font-bold text-sm flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              <p className="text-xs font-bold uppercase tracking-wider text-navy">Planned Exercise Sequence:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {selectedDayPreview.exercises?.map((rawEx, i) => {
                  const ex = parseExercise(rawEx, i)
                  return (
                    <div
                      key={i}
                      onClick={() => setActiveVideoModal(ex)}
                      className="group p-2.5 rounded-xl bg-bg-base hover:bg-white border border-border-ui hover:border-teal text-xs transition-all cursor-pointer flex gap-3 shadow-2xs hover:shadow-sm"
                    >
                      <div className="relative w-16 h-16 rounded-lg bg-navy overflow-hidden flex-shrink-0">
                        <img
                          src={ex.image}
                          alt={ex.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80'
                          }}
                        />
                        <div className="absolute inset-0 bg-navy/30 group-hover:bg-navy/10 flex items-center justify-center">
                          <span className="text-[11px] text-white">▶</span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-bold text-navy group-hover:text-teal transition-colors truncate">
                            {ex.name}
                          </p>
                          <p className="text-[10px] text-teal font-semibold truncate">{ex.target}</p>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-text-secondary">
                          <span>{ex.duration}</span>
                          <span className="text-teal font-bold">Watch Demo →</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-border-ui flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDayPreview(null)}
                className="px-6 py-2 bg-navy text-white text-xs font-bold rounded-btn hover:bg-navy-800 transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIDEO & FORM DEMONSTRATION MODAL ── */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-navy-800 border border-white/20 rounded-card max-w-xl w-full overflow-hidden shadow-2xl text-white animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 bg-navy border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{activeVideoModal.name}</h3>
                <p className="text-xs text-teal-300 font-semibold">{activeVideoModal.target} · {activeVideoModal.duration}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Video Player */}
            <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
              <video
                src={activeVideoModal.videoUrl}
                poster={activeVideoModal.image}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Alignment Cues & Details */}
            <div className="p-5 space-y-3 bg-navy-800">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-teal-300">Form & Biomechanics Cue:</p>
                <p className="text-xs text-white/90 leading-relaxed">{activeVideoModal.cue}</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-white/60">
                  Target: <strong className="text-white">{activeVideoModal.target}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="px-5 py-2 bg-teal hover:bg-teal-600 text-white font-bold text-xs rounded-btn transition-colors shadow-sm cursor-pointer"
                >
                  Got It, Back to Routine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrainingPlans
