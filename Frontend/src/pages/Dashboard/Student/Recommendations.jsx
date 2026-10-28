import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const Recommendations = () => {
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ completed: false, profile: null, recommendations: [] })
  const [coaches, setCoaches] = useState([])
  const [programs, setPrograms] = useState([])
  const [activeTab, setActiveTab] = useState('classes') // 'classes' | 'coaching' | 'programs'
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const [recRes, coachRes, progRes] = await Promise.all([
          axiosSecure.get('/api/recommendations'),
          axiosSecure.get('/api/coaching/instructors').catch(() => ({ data: [] })),
          axiosSecure.get('/api/programs').catch(() => ({ data: [] })),
        ])

        if (isMounted) {
          setData(recRes.data)
          setCoaches(Array.isArray(coachRes.data) ? coachRes.data : [])
          setPrograms(Array.isArray(progRes.data) ? progRes.data : [])
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        if (isMounted) setError('Unable to load personalized recommendations.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchRecommendations()
    return () => {
      isMounted = false
    }
  }, [axiosSecure])

  // Quick enroll in a goal program from recommendations
  const handleQuickEnroll = async (programId, title) => {
    try {
      const res = await axiosSecure.post('/api/user-programs/enroll', { programId })
      if (res.data?.success) {
        Swal.fire({
          title: 'Challenge Started!',
          text: `You have enrolled in ${title}. Redirecting to your daily plan tracker...`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        })
        setTimeout(() => {
          navigate('/dashboard/training-plan')
        }, 1500)
      }
    } catch (err) {
      console.error('Error quick enrolling:', err)
      navigate('/dashboard/training-plan')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <HashLoader color="#12B8A6" size={45} />
        <p className="text-sm font-bold text-navy mt-4">Generating your personalized yoga recommendations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-error rounded-card border border-red-200">
        <p className="font-bold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-1.5 bg-teal text-white text-xs font-bold rounded-btn"
        >
          Try Again
        </button>
      </div>
    )
  }

  const { completed, profile, recommendations } = data

  if (!completed || !profile) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-card border border-border-ui p-8 md:p-12 shadow-sm space-y-6">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto text-3xl">
            🧘‍♀️
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-navy">Personalized Recommendations</h2>
            <p className="text-sm text-text-secondary">
              Complete your short fitness & yoga onboarding profile to unlock customized class recommendations, 1-to-1 coach pairings, and goal-oriented training plans!
            </p>
          </div>
          <Link
            to="/dashboard/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal hover:bg-teal-600 text-white font-bold rounded-btn shadow-md transition-all"
          >
            <span>Start Onboarding Flow</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  // Determine which program best matches user's primary goal
  const userGoalLower = (profile.primaryGoal || '').toLowerCase()
  const matchedProgramId =
    userGoalLower.includes('strength') || userGoalLower.includes('tone') || userGoalLower.includes('core')
      ? 'core-strength-60'
      : userGoalLower.includes('posture') || userGoalLower.includes('align') || userGoalLower.includes('desk')
      ? 'mobility-posture-30'
      : userGoalLower.includes('flexibility') || userGoalLower.includes('mobility')
      ? 'flexibility-hamstring-21'
      : userGoalLower.includes('stress') || userGoalLower.includes('mental') || userGoalLower.includes('calm')
      ? 'stress-nervous-system-14'
      : 'weight-conditioning-45'

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Overview Header Card */}
      <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-600">
                Personalized Profile
              </span>
              <span className="text-xs text-text-secondary">
                Updated {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'Recently'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy">Curated Recommendations For You</h1>
              <p className="text-sm text-text-secondary mt-0.5">
                Calibrated to your primary goal:{' '}
                <strong className="text-navy font-semibold">
                  {profile.primaryGoal} ({profile.yogaStyle || profile.goalPreference || 'Flow'})
                </strong>
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/profile"
            className="px-4 py-2 border border-teal text-teal hover:bg-teal-100/50 text-xs font-bold rounded-btn transition-colors self-start md:self-auto inline-flex items-center gap-1.5 shadow-xs"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Profile & Settings</span>
          </Link>
        </div>

        {/* Profile Metrics Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-border-ui">
          <div className="bg-bg-base p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-text-secondary">BMI & Category</p>
            <p className="text-base font-bold text-navy mt-0.5">
              {profile.bmi} <span className="text-xs font-semibold text-teal-600">({profile.bmiCategory || 'Normal'})</span>
            </p>
          </div>
          <div className="bg-bg-base p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-text-secondary">Target Time</p>
            <p className="text-base font-bold text-navy mt-0.5">{profile.preferredDuration} mins / day</p>
          </div>
          <div className="bg-bg-base p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-text-secondary">Experience & Safeguard</p>
            <p className="text-base font-bold text-navy mt-0.5">
              {profile.yogaExperience || 'Practitioner'}{' '}
              {profile.hasInjuries === 'yes' && profile.injuryAreas?.length > 0 ? `· 🛡️ ${profile.injuryAreas.length} Areas` : ''}
            </p>
          </div>
          <div className="bg-bg-base p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-text-secondary">Diet & Hydration</p>
            <p className="text-base font-bold text-navy mt-0.5">
              {profile.diet || 'Balanced'} · {profile.waterIntake || '2L'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-border-ui">
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2 text-xs font-bold rounded-btn transition-all flex items-center gap-1.5 ${
              activeTab === 'classes'
                ? 'bg-navy text-white shadow-sm'
                : 'bg-bg-base text-text-secondary hover:text-navy hover:bg-border-ui/50'
            }`}
          >
            <span>🎯 Matched Classes</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white">
              {recommendations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('coaching')}
            className={`px-4 py-2 text-xs font-bold rounded-btn transition-all flex items-center gap-1.5 ${
              activeTab === 'coaching'
                ? 'bg-navy text-white shadow-sm'
                : 'bg-bg-base text-text-secondary hover:text-navy hover:bg-border-ui/50'
            }`}
          >
            <span>🧘 1-to-1 Private Coaching</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-teal text-white font-bold">
              Personalized
            </span>
          </button>

          <button
            onClick={() => setActiveTab('programs')}
            className={`px-4 py-2 text-xs font-bold rounded-btn transition-all flex items-center gap-1.5 ${
              activeTab === 'programs'
                ? 'bg-navy text-white shadow-sm'
                : 'bg-bg-base text-text-secondary hover:text-navy hover:bg-border-ui/50'
            }`}
          >
            <span>⚡ Free Goal Programs</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-coral text-white font-bold">
              60-Day & More
            </span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: MATCHED CLASSES ── */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">
              AI-Scored Class Matches <span className="text-sm font-medium text-text-secondary">({recommendations.length})</span>
            </h2>
            <Link to="/dashboard/explore-classes" className="text-xs text-teal font-bold hover:underline">
              Browse all classes →
            </Link>
          </div>

          {recommendations.length === 0 ? (
            <div className="p-8 bg-white rounded-card border border-border-ui text-center">
              <p className="text-sm text-text-secondary">No approved classes currently available for scoring.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.map((cls) => (
                <div
                  key={cls._id}
                  className="bg-white rounded-card border border-border-ui overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    {/* Image & Match Badge */}
                    <div className="relative h-44 bg-surface-2 overflow-hidden">
                      <img
                        src={cls.image}
                        alt={cls.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80'
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-navy/90 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-white/20">
                        <span className="text-teal font-extrabold">{cls.matchPercentage}%</span>
                        <span className="text-[10px] font-medium text-surface-2">Match</span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-white/95 text-navy text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        {cls.category || cls.level || 'All Levels'}
                      </div>
                    </div>

                    {/* Class Details */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-navy line-clamp-1">{cls.name}</h3>
                        <p className="text-xs text-text-secondary mt-0.5">By {cls.instructorName || 'Certified Instructor'}</p>
                      </div>

                      {/* Match Reasons */}
                      <div className="space-y-1.5 pt-2 border-t border-border-ui">
                        <p className="text-[10px] uppercase font-bold text-teal tracking-wider">Why It Matches:</p>
                        {cls.matchReasons && cls.matchReasons.slice(0, 2).map((reason, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-text-primary">
                            <span className="text-teal font-bold flex-shrink-0">✓</span>
                            <span className="text-[11px] line-clamp-1">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="p-5 pt-0 border-t border-border-ui/50 mt-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-navy">
                      {cls.price ? `$${cls.price}` : 'Free Access'}
                    </span>
                    <Link
                      to={`/class/${cls._id}`}
                      className="px-4 py-2 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn transition-colors shadow-xs"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: 1-TO-1 PRIVATE COACHING ── */}
      {activeTab === 'coaching' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-navy to-teal/80 text-white rounded-card p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal/30 text-teal-200 uppercase tracking-wider">
                Private Attention
              </span>
              <h2 className="text-xl font-bold">1-to-1 Form Correction & Private Coaching</h2>
              <p className="text-xs text-surface-2 leading-relaxed">
                Rather than mass classes, schedule a private session focused 100% on your posture alignment, safe modifications for injury protection, and personal yoga progression.
              </p>
            </div>
            <Link
              to="/dashboard/personal-training"
              className="px-5 py-2.5 bg-teal hover:bg-teal-600 text-white font-bold text-xs rounded-btn transition-all shadow-md flex-shrink-0 text-center"
            >
              Open Booking Portal →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coaches.map((coach) => (
              <div
                key={coach.email || coach.id}
                className="bg-white rounded-card border border-border-ui p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={coach.photoUrl}
                      alt={coach.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-teal"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
                      }}
                    />
                    <div>
                      <h3 className="text-base font-bold text-navy">{coach.name}</h3>
                      <p className="text-xs text-text-secondary">{coach.experience || 'Master Instructor'}</p>
                      <span className="text-xs font-bold text-coral flex items-center gap-1 mt-0.5">
                        ★ {coach.rating || '4.9'} ({coach.reviewCount || 40}+ private sessions)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border-ui">
                    <p className="text-[10px] uppercase font-bold text-teal tracking-wider">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {(coach.specialties || []).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-bg-base text-text-primary border border-border-ui"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary">
                    Format: <strong>{coach.sessionFormat || '1-on-1 HD Live Form Assessment'}</strong>
                  </p>
                </div>

                <Link
                  to="/dashboard/personal-training"
                  className="w-full py-2 bg-navy hover:bg-teal text-white text-xs font-bold rounded-btn transition-colors text-center block shadow-xs"
                >
                  Book 1-to-1 Session
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: FREE GOAL PROGRAMS ── */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-navy to-coral/80 text-white rounded-card p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-coral/30 text-coral-100 uppercase tracking-wider">
                100% Free Structured Plans
              </span>
              <h2 className="text-xl font-bold">Goal-Driven Programs & Daily Habit Trackers</h2>
              <p className="text-xs text-surface-2 leading-relaxed">
                Just like top athletic challenge apps, select a target challenge (e.g. 60-Day Core, 30-Day Posture Reset). Complete daily 20-30 min routines, maintain streaks, and reach your goal.
              </p>
            </div>
            <Link
              to="/dashboard/training-plan"
              className="px-5 py-2.5 bg-coral hover:bg-coral-600 text-white font-bold text-xs rounded-btn transition-all shadow-md flex-shrink-0 text-center"
            >
              Open Plan Tracker →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog) => {
              const isGoalMatched = prog.id === matchedProgramId

              return (
                <div
                  key={prog.id}
                  className={`bg-white rounded-card border flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md ${
                    isGoalMatched ? 'border-coral ring-2 ring-coral/40' : 'border-border-ui'
                  }`}
                >
                  <div className="relative h-44 bg-navy overflow-hidden">
                    <img
                      src={prog.image}
                      alt={prog.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80'
                      }}
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-navy/90 text-white">
                        {prog.durationDays} Days · {prog.dailyMinutes} min/day
                      </span>
                      {isGoalMatched && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-coral text-white shadow-md">
                          ★ Best Match for Your Goal
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-text-secondary">
                        <span className="font-bold text-teal">{prog.primaryGoal}</span>
                        <span>{prog.level}</span>
                      </div>
                      <h3 className="text-base font-bold text-navy leading-snug">{prog.title}</h3>
                      <p className="text-xs text-text-secondary line-clamp-2">{prog.overview}</p>
                    </div>

                    <div className="pt-3 border-t border-border-ui space-y-2">
                      <button
                        type="button"
                        onClick={() => handleQuickEnroll(prog.id, prog.title)}
                        className={`w-full py-2.5 font-bold text-xs rounded-btn transition-colors text-center shadow-xs ${
                          isGoalMatched
                            ? 'bg-coral hover:bg-coral-600 text-white'
                            : 'bg-navy hover:bg-teal text-white'
                        }`}
                      >
                        Start Free Challenge →
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Recommendations
