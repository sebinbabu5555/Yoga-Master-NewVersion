import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useUser from '../../../hooks/useUser'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const StudentCP = () => {
  const { currentUser } = useUser()
  const axiosSecure = useAxiosSecure()

  const [activePlan, setActivePlan] = useState(null)
  const [upcomingSession, setUpcomingSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const firstName = currentUser?.name?.split(' ')[0] || 'there'
  const isInstructor = currentUser?.role === 'instructor'

  useEffect(() => {
    let isMounted = true
    const fetchStudentData = async () => {
      try {
        const [planRes, sessRes] = await Promise.all([
          axiosSecure.get('/api/user-programs/active').catch(() => ({ data: { active: false } })),
          axiosSecure.get('/api/appointments/my-sessions').catch(() => ({ data: [] })),
        ])

        if (isMounted) {
          if (planRes.data?.active) {
            setActivePlan(planRes.data)
          }
          const validSessions = Array.isArray(sessRes.data)
            ? sessRes.data.filter((s) => s.status !== 'cancelled')
            : []
          if (validSessions.length > 0) {
            setUpcomingSession(validSessions[0])
          }
        }
      } catch (err) {
        console.error('Error fetching student dashboard widgets:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchStudentData()
    return () => {
      isMounted = false
    }
  }, [axiosSecure])

  // Compute dynamic day of week activity
  const dayIndex = (new Date().getDay() + 6) % 7 // Mon=0, Sun=6
  const weekActivity = weekDays.map((_, i) => i <= dayIndex)

  const program = activePlan?.program
  const enrollment = activePlan?.enrollment
  const nextDay = enrollment?.nextDay || 1
  const percentage = enrollment?.percentage || 0
  const streak = enrollment?.streak || 0

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-navy">
              {getGreeting()}, {firstName}
            </h1>
            {isInstructor && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-ai-100 text-blue-ai uppercase tracking-wider">
                Instructor (Practice Mode)
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary mt-0.5">
            {isInstructor
              ? 'Your personal practice space. Track your mat sessions, recommendations, and goals alongside your teaching.'
              : streak > 0
              ? `You are on an active ${streak}-day streak! Keep up your consistency.`
              : 'Welcome back to your daily fitness and yoga practice hub.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {isInstructor && (
            <Link
              to="/dashboard/instructor-cp"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-ai-100 hover:bg-blue-ai/20 text-blue-ai text-xs font-bold rounded-btn transition-colors border border-blue-ai/30 shadow-sm"
            >
              <span>🎓</span>
              <span>Teaching Overview</span>
            </Link>
          )}
          <Link
            to="/dashboard/explore-classes"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-600 text-white text-xs font-semibold rounded-btn transition-colors shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
            </svg>
            <span>Explore Classes</span>
          </Link>
        </div>
      </div>

      {/* Onboarding Banner / Summary Card */}
      {!currentUser?.onboardingCompleted ? (
        <div className="bg-gradient-to-r from-navy via-navy-800 to-teal/90 text-white rounded-card p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-teal/30">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal/20 text-teal-100 text-[11px] font-bold uppercase tracking-wider">
              ✨ Personalize Your Experience
            </div>
            <h2 className="text-lg font-bold text-white">Complete Your Yoga Onboarding</h2>
            <p className="text-xs text-surface-2 max-w-xl">
              Tell us your fitness goals, body type, and daily schedule to get personalized class recommendations and automatic BMI calculations.
            </p>
          </div>
          <Link
            to="/dashboard/onboarding"
            className="px-4 py-2.5 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn transition-all shadow-md flex-shrink-0 text-center self-start sm:self-auto"
          >
            Start Onboarding
          </Link>
        </div>
      ) : (
        <div className="bg-teal-100/40 border border-teal/30 rounded-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Target Goal Calibrated</p>
              <p className="text-sm font-semibold text-navy">
                {currentUser?.onboardingProfile?.primaryGoal || 'Athletic Mobility'}{' '}
                <span className="text-xs font-normal text-text-secondary">
                  · {currentUser?.onboardingProfile?.preferredDuration || '25'} min/day target
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/training-plan"
              className="text-xs font-bold px-3 py-1.5 bg-coral text-white rounded-btn hover:bg-coral-600 transition-colors shadow-xs"
            >
              Goal Challenges
            </Link>
            <Link
              to="/dashboard/recommendations"
              className="text-xs font-bold px-3 py-1.5 bg-teal text-white rounded-btn hover:bg-teal-600 transition-colors shadow-xs"
            >
              Recommendations
            </Link>
          </div>
        </div>
      )}

      {/* Primary Row: Goal Program & Weekly Goal */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Today's Goal Program Plan */}
        <div className="md:col-span-2 bg-white rounded-card border border-border-ui p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                {activePlan?.active ? 'Active Goal Challenge' : "Today's Plan"}
              </p>
              {activePlan?.active && (
                <span className="text-[11px] font-bold text-coral flex items-center gap-1">
                  🔥 {streak} Day Streak
                </span>
              )}
            </div>

            {activePlan?.active && program ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-coral-100 text-coral rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm shadow-xs">
                  D{nextDay}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-text-primary truncate">
                    {activePlan.nextDayDetails?.title || `Day ${nextDay}: ${program.title}`}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {program.title} · {program.dailyMinutes} min · {program.level}
                  </p>
                </div>
                <Link
                  to="/dashboard/training-plan"
                  className="px-4 py-2 bg-coral text-white text-xs font-bold rounded-btn hover:bg-coral-600 transition-colors flex-shrink-0 inline-block shadow-xs"
                >
                  Start Day {nextDay}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-100 text-teal rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 3l14 9-14 9V3z" fill="#12B8A6"/></svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-text-primary">Choose a Free Goal Challenge</p>
                  <p className="text-xs text-text-secondary">
                    Like "60-Day Core & Abs" or "30-Day Posture Reset" to unlock daily guided tasks.
                  </p>
                </div>
                <Link
                  to="/dashboard/training-plan"
                  className="px-4 py-2 bg-teal text-white text-xs font-bold rounded-btn hover:bg-teal-600 transition-colors flex-shrink-0 inline-block shadow-xs"
                >
                  Pick Plan
                </Link>
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="bg-surface-2 rounded-full h-1.5">
              <div
                className="bg-teal h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${activePlan?.active ? percentage : 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-1.5 text-xs text-text-secondary">
              <span>{activePlan?.active ? `${percentage}% program completed` : '0% complete'}</span>
              {activePlan?.active && <span>Day {nextDay} of {program?.durationDays}</span>}
            </div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="bg-white rounded-card border border-border-ui p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Weekly Goal</p>
          <p className="text-3xl font-bold text-navy">
            {streak > 0 ? Math.min(5, streak) : 3}{' '}
            <span className="text-text-secondary text-xl font-medium">/ 5</span>
          </p>
          <p className="text-xs text-text-secondary mb-3">sessions target</p>
          <div className="flex gap-1.5">
            {weekDays.map((d, i) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full h-1.5 rounded-full ${weekActivity[i] ? 'bg-teal' : 'bg-surface-2'}`}></div>
                <span className="text-[9px] text-text-secondary">{d[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second row: Training Stats & Next Appointment */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Training Stats */}
        <div className="md:col-span-2 bg-white rounded-card border border-border-ui p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4">Training Stats</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: 'Minutes trained',
                value: activePlan?.active ? (enrollment?.completedDays?.length || 0) * (program?.dailyMinutes || 25) : '0',
                color: 'text-teal',
              },
              {
                label: 'Sessions done',
                value: activePlan?.active ? `${enrollment?.completedDays?.length || 0}` : '0',
                color: 'text-navy',
              },
              {
                label: 'Active streak',
                value: `${streak}d`,
                color: 'text-coral',
              },
              {
                label: 'Goal plan progress',
                value: `${percentage}%`,
                color: 'text-blue-ai',
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-bg-base rounded-xl p-3">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-text-secondary mt-0.5 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Appointment / 1-to-1 Private Session */}
        <div className="bg-white rounded-card border border-border-ui p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">Next 1-to-1 Session</p>
              <Link to="/dashboard/personal-training" className="text-[11px] text-teal font-bold hover:underline">
                Portal →
              </Link>
            </div>

            {upcomingSession ? (
              <div className="flex items-start gap-3">
                <img
                  src={upcomingSession.instructorPhoto}
                  alt={upcomingSession.instructorName}
                  className="w-10 h-10 rounded-full object-cover border border-teal flex-shrink-0"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-text-primary leading-tight truncate">
                    {upcomingSession.focusArea || '1-to-1 Coaching'}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {upcomingSession.date} · {upcomingSession.timeSlot}
                  </p>
                  <p className="text-xs text-teal font-semibold mt-0.5 truncate">
                    with {upcomingSession.instructorName}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 py-1">
                <p className="text-sm font-bold text-navy">No Private Session Booked</p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Book 1-on-1 personal training for posture assessment and form corrections focused on you.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border-ui/60 mt-3">
            {upcomingSession ? (
              <a
                href={upcomingSession.meetingLink || 'https://meet.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-teal text-white text-xs font-bold rounded-btn hover:bg-teal-600 transition-colors text-center block shadow-sm"
              >
                Join Video Call
              </a>
            ) : (
              <Link
                to="/dashboard/personal-training"
                className="w-full py-2 bg-navy hover:bg-teal text-white text-xs font-bold rounded-btn transition-colors text-center block shadow-xs"
              >
                Book 1-to-1 Coaching
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentCP