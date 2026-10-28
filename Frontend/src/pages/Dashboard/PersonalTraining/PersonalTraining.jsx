import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { HashLoader } from 'react-spinners'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useUser from '../../../hooks/useUser'

const SESSION_FOCUS_OPTIONS = [
  {
    id: 'posture-alignment',
    title: 'Posture & Spinal Decompression',
    desc: 'Targeted correction for rounded shoulders, forward head tilt, and desk fatigue.',
    badge: 'Posture',
  },
  {
    id: 'core-athletic',
    title: 'Core Conditioning & Functional Power',
    desc: 'Deep transverse abdominis activation, pelvic stability, and isometric plank holds.',
    badge: 'Strength',
  },
  {
    id: 'injury-rehab',
    title: 'Injury Recovery & Safe Biomechanics',
    desc: 'Joint-protective flows with custom modifications for knee, shoulder, or lower back issues.',
    badge: 'Rehab',
  },
  {
    id: 'mobility-hips',
    title: 'Deep Hip Mobility & Flexibility Range',
    desc: 'Hamstring release, psoas elongation, and active mobility prep for athletic movement.',
    badge: 'Mobility',
  },
  {
    id: 'breath-nervous-system',
    title: 'Vagal Nerve & Breathwork Pacing',
    desc: 'Parasympathetic down-regulation, diaphragmatic cadence, and stress relief protocol.',
    badge: 'Recovery',
  },
]

const PersonalTraining = () => {
  const axiosSecure = useAxiosSecure()
  const { currentUser } = useUser()

  const [activeTab, setActiveTab] = useState('book') // 'book' | 'my-sessions'
  const [instructors, setInstructors] = useState([])
  const [mySessions, setMySessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Booking Form State
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [sessionFocus, setSessionFocus] = useState('posture-alignment')
  const [sessionDate, setSessionDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  })
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 10:45 AM')
  const [experienceLevel, setExperienceLevel] = useState(
    currentUser?.onboardingProfile?.yogaExperience || 'Intermediate'
  )
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '')
  const [notes, setNotes] = useState('')

  // Fetch instructors & user's sessions
  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        const [instRes, sessRes] = await Promise.all([
          axiosSecure.get('/api/coaching/instructors').catch(() => ({ data: [] })),
          axiosSecure.get('/api/appointments/my-sessions').catch(() => ({ data: [] })),
        ])

        if (isMounted) {
          const coachList = Array.isArray(instRes.data) ? instRes.data : []
          setInstructors(coachList)
          if (coachList.length > 0) {
            setSelectedInstructor(coachList[0])
          }
          setMySessions(Array.isArray(sessRes.data) ? sessRes.data : [])
        }
      } catch (err) {
        console.error('Error loading coaching data:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()
    return () => {
      isMounted = false
    }
  }, [axiosSecure])

  // Refresh user sessions
  const refreshSessions = async () => {
    try {
      const res = await axiosSecure.get('/api/appointments/my-sessions')
      setMySessions(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('Error refreshing sessions:', err)
    }
  }

  // Handle booking confirmation
  const handleBooking = async (e) => {
    e.preventDefault()
    if (!selectedInstructor) {
      Swal.fire({
        title: 'Choose a Coach',
        text: 'Please pick an instructor for your 1-to-1 session.',
        icon: 'warning',
      })
      return
    }

    const focusObj = SESSION_FOCUS_OPTIONS.find((f) => f.id === sessionFocus)

    try {
      setSubmitting(true)
      const bookingData = {
        instructorEmail: selectedInstructor.email,
        instructorName: selectedInstructor.name,
        instructorPhoto: selectedInstructor.photoUrl,
        sessionType: '1-to-1 Personalized Athletic Coaching',
        focusArea: focusObj ? focusObj.title : 'General Form Correction',
        date: sessionDate,
        timeSlot: timeSlot,
        notes: notes,
        userPhone: userPhone,
        userExperienceLevel: experienceLevel,
      }

      const res = await axiosSecure.post('/api/appointments', bookingData)

      if (res.data?.success) {
        await refreshSessions()
        setActiveTab('my-sessions')
        Swal.fire({
          title: 'Session Confirmed!',
          html: `
            <div class="text-left text-sm space-y-2">
              <p>Your 1-to-1 session with <strong>${selectedInstructor.name}</strong> has been secured.</p>
              <p class="text-gray-600">📅 <strong>${sessionDate}</strong> at <strong>${timeSlot}</strong></p>
              <p class="text-gray-600">🎯 Focus: <strong>${focusObj?.title || 'Form & Posture'}</strong></p>
              <p class="text-xs text-teal-600 mt-2">A private HD video room link has been generated in your sessions dashboard.</p>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#12B8A6',
          confirmButtonText: 'View My Sessions',
        })
      }
    } catch (err) {
      console.error('Booking failed:', err)
      Swal.fire({
        title: 'Booking Notice',
        text: err?.response?.data?.message || 'Could not complete your booking. Please try again.',
        icon: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle session cancellation
  const handleCancelSession = async (id, coachName) => {
    const result = await Swal.fire({
      title: 'Cancel Session?',
      text: `Are you sure you want to cancel your 1-to-1 training session with ${coachName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, cancel session',
    })

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/api/appointments/${id}/cancel`)
        if (res.data?.success) {
          await refreshSessions()
          Swal.fire({
            title: 'Cancelled',
            text: 'Your private coaching session has been cancelled.',
            icon: 'info',
            confirmButtonColor: '#12B8A6',
          })
        }
      } catch (err) {
        console.error('Cancellation failed:', err)
        Swal.fire('Error', 'Unable to cancel session. Please try again.', 'error')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <HashLoader color="#12B8A6" size={45} />
        <p className="text-sm font-bold text-navy mt-4">Loading private coaching portal...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-navy via-navy to-teal/80 text-white rounded-card p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/20 text-teal-200 text-xs font-bold uppercase tracking-wider">
            <span>🎯</span>
            <span>Personalized 1-to-1 Private Training</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Dedicated Private Coaching Focused 100% on You
          </h1>
          <p className="text-surface-2 text-sm md:text-base leading-relaxed">
            Move beyond mass group classes. Work privately with verified master athletic coaches for real-time form correction, joint decompression, injury rehab, and biomechanically customized yoga sequences.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('book')}
              className={`px-4 py-2 text-xs font-bold rounded-btn transition-all ${
                activeTab === 'book'
                  ? 'bg-teal text-white shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Book New Session
            </button>
            <button
              onClick={() => setActiveTab('my-sessions')}
              className={`px-4 py-2 text-xs font-bold rounded-btn transition-all flex items-center gap-1.5 ${
                activeTab === 'my-sessions'
                  ? 'bg-teal text-white shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span>My Booked Sessions</span>
              {mySessions.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-navy font-black text-[10px] flex items-center justify-center">
                  {mySessions.filter((s) => s.status !== 'cancelled').length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Content */}
      {activeTab === 'book' ? (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Focus */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Select Session Focus */}
            <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border-ui/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-base font-bold text-navy">Choose Your Private Focus</h2>
                </div>
                <span className="text-xs text-text-secondary">45-min private slot</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {SESSION_FOCUS_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSessionFocus(f.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      sessionFocus === f.id
                        ? 'border-teal bg-teal-100/30 ring-2 ring-teal/30'
                        : 'border-border-ui hover:border-teal/50 bg-bg-base/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-navy">{f.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-border-ui text-text-secondary">
                        {f.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                      {f.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Schedule & Availability */}
            <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-border-ui/60 pb-3">
                <span className="w-6 h-6 rounded-full bg-teal text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base font-bold text-navy">Select Date & Time Slot</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Session Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-bg-base border border-border-ui rounded-btn focus:outline-none focus:border-teal font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-bg-base border border-border-ui rounded-btn focus:outline-none focus:border-teal font-medium"
                  >
                    <option value="Beginner">Beginner (Foundations & Alignment)</option>
                    <option value="Intermediate">Intermediate (Core & Mobility)</option>
                    <option value="Advanced">Advanced (Dynamic Asanas & Power)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                  Available Daily Slots
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(selectedInstructor?.timeSlots || [
                    '08:00 AM - 08:45 AM',
                    '10:00 AM - 10:45 AM',
                    '02:00 PM - 02:45 PM',
                    '05:30 PM - 06:15 PM',
                    '07:00 PM - 07:45 PM',
                  ]).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`px-3 py-2 text-xs font-semibold rounded-btn border transition-all text-center ${
                        timeSlot === slot
                          ? 'border-teal bg-teal text-white shadow-sm'
                          : 'border-border-ui bg-bg-base hover:border-teal text-text-primary'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Notes / Physical Injuries / Goals for Your Coach
                </label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., I have tight lower back from sitting at a computer all day and want help checking my downward dog and plank form."
                  className="w-full px-3.5 py-2 text-xs bg-bg-base border border-border-ui rounded-btn focus:outline-none focus:border-teal"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Right Column: Coach Picker & Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Step 3: Select Coach */}
            <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-border-ui/60 pb-3">
                <span className="w-6 h-6 rounded-full bg-teal text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="text-base font-bold text-navy">Choose Your Certified Coach</h2>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {instructors.length === 0 ? (
                  <p className="text-xs text-text-secondary py-4 text-center">
                    No coaches currently active for booking.
                  </p>
                ) : (
                  instructors.map((coach) => {
                    const isSelected = selectedInstructor?.email === coach.email
                    return (
                      <div
                        key={coach.email || coach.id}
                        onClick={() => setSelectedInstructor(coach)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-teal bg-teal-100/30 ring-2 ring-teal/30'
                            : 'border-border-ui hover:border-teal/40 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={coach.photoUrl}
                            alt={coach.name}
                            className="w-12 h-12 rounded-full object-cover border border-border-ui flex-shrink-0"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-navy truncate">{coach.name}</h3>
                              <span className="text-[11px] font-bold text-coral flex items-center gap-0.5">
                                ★ {coach.rating || '4.9'}
                              </span>
                            </div>
                            <p className="text-[11px] text-text-secondary truncate">
                              {coach.experience || 'Certified Movement Coach'}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {(coach.specialties || []).slice(0, 2).map((s, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-bg-base text-text-secondary border border-border-ui"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Booking Summary & Action */}
            <div className="bg-navy text-white rounded-card p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-300">
                Session Summary
              </h3>

              <div className="space-y-2 text-xs border-y border-white/10 py-3">
                <div className="flex justify-between">
                  <span className="text-surface-2">Coach:</span>
                  <span className="font-semibold">{selectedInstructor?.name || 'Not chosen'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-2">Format:</span>
                  <span className="font-semibold">Private 1-to-1 Live Video</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-2">Focus:</span>
                  <span className="font-semibold truncate max-w-[200px]">
                    {SESSION_FOCUS_OPTIONS.find((f) => f.id === sessionFocus)?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-2">Date & Time:</span>
                  <span className="font-semibold text-teal-300">
                    {sessionDate} · {timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-2">Cost:</span>
                  <span className="font-bold text-emerald-400">Included with Membership</span>
                </div>
              </div>

              <button
                type="button"
                disabled={submitting || !selectedInstructor}
                onClick={handleBooking}
                className="w-full py-3 bg-teal hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-sm rounded-btn transition-all shadow-md flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <HashLoader color="#FFFFFF" size={18} />
                    <span>Confirming Private Slot...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm 1-to-1 Booking</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* My Booked Sessions Tab */
        <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border-ui pb-4">
            <div>
              <h2 className="text-lg font-bold text-navy">My 1-to-1 Training Sessions</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Manage your scheduled private appointments, join video calls, or reschedule.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('book')}
              className="px-4 py-2 bg-teal text-white text-xs font-bold rounded-btn hover:bg-teal-600 transition-colors"
            >
              + Book Another Session
            </button>
          </div>

          {mySessions.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal flex items-center justify-center mx-auto text-xl">
                🗓️
              </div>
              <h3 className="text-base font-bold text-navy">No 1-to-1 sessions booked yet</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                Schedule your first private personal coaching session with one of our certified instructors today.
              </p>
              <button
                onClick={() => setActiveTab('book')}
                className="px-5 py-2.5 bg-teal text-white text-xs font-bold rounded-btn hover:bg-teal-600 transition-all shadow-sm"
              >
                Schedule My First Session
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {mySessions.map((session) => {
                const isCancelled = session.status === 'cancelled'
                return (
                  <div
                    key={session._id}
                    className={`p-5 rounded-xl border transition-all ${
                      isCancelled
                        ? 'border-border-ui bg-bg-base/40 opacity-70'
                        : 'border-teal/30 bg-teal-100/10 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={session.instructorPhoto}
                          alt={session.instructorName}
                          className="w-11 h-11 rounded-full object-cover border border-border-ui"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
                          }}
                        />
                        <div>
                          <h4 className="text-sm font-bold text-navy">{session.instructorName}</h4>
                          <p className="text-xs text-teal font-semibold">{session.focusArea}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isCancelled
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {session.status || 'Confirmed'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-text-secondary bg-white p-3 rounded-lg border border-border-ui mb-4">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <strong className="text-navy">{session.date}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⏰</span>
                        <span>{session.timeSlot}</span>
                      </div>
                      {session.notes && (
                        <div className="flex items-start gap-2 pt-1 border-t border-border-ui/50">
                          <span>📝</span>
                          <span className="italic">{session.notes}</span>
                        </div>
                      )}
                    </div>

                    {!isCancelled && (
                      <div className="flex items-center gap-2">
                        <a
                          href={session.meetingLink || 'https://meet.google.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn text-center transition-colors shadow-sm"
                        >
                          Join Video Room
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCancelSession(session._id, session.instructorName)}
                          className="px-3 py-2 border border-border-ui hover:border-red-300 text-text-secondary hover:text-red-600 text-xs font-bold rounded-btn transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PersonalTraining
