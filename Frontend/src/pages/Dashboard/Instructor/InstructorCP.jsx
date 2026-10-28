import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiBookOpen, FiArrowRight, FiCompass, FiCreditCard, FiActivity, FiTarget } from 'react-icons/fi'
import useUser from '../../../hooks/useUser'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const MetricCard = ({ label, value, color, bg, icon }) => (
  <div className="bg-white rounded-card border border-border-ui p-5 flex items-center gap-4 shadow-sm">
    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 text-xl`}>{icon}</div>
    <div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-text-secondary mt-0.5">{label}</p>
    </div>
  </div>
)

const InstructorCP = () => {
  const { currentUser, isLoading } = useUser()
  const axiosSecure = useAxiosSecure()
  const [classes, setClasses] = useState([])
  const [loadingClasses, setLoadingClasses] = useState(true)

  const firstName = currentUser?.name?.split(' ')[0] || 'Instructor'

  useEffect(() => {
    if (currentUser?.email) {
      axiosSecure
        .get(`/classes/${currentUser.email}`)
        .then((res) => {
          setClasses(Array.isArray(res.data) ? res.data : [])
          setLoadingClasses(false)
        })
        .catch(() => {
          setLoadingClasses(false)
        })
    } else if (!isLoading) {
      setLoadingClasses(false)
    }
  }, [currentUser?.email, isLoading])

  const totalEnrolled = classes.reduce((sum, c) => sum + (c.totalEnrolled || 0), 0)
  const approvedClasses = classes.filter((c) => c.status === 'approved').length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">Here's your teaching overview.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/dashboard/student-cp"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-teal/40 bg-teal-50 hover:bg-teal-100 text-teal text-xs font-bold rounded-btn transition-colors shadow-sm"
          >
            <FiActivity className="w-3.5 h-3.5 text-teal" />
            <span>My Practice Hub</span>
          </Link>
          <Link
            to="/dashboard/recommendations"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-border-ui bg-white hover:bg-surface-2 text-text-primary text-xs font-semibold rounded-btn transition-colors shadow-sm"
          >
            <FiTarget className="w-3.5 h-3.5 text-teal" />
            <span>Recommendations</span>
          </Link>
          <Link
            to="/dashboard/explore-classes"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-border-ui bg-white hover:bg-surface-2 text-text-primary text-xs font-semibold rounded-btn transition-colors shadow-sm"
          >
            <FiCompass className="w-3.5 h-3.5 text-teal" />
            <span>Explore Classes</span>
          </Link>
          <Link
            to="/dashboard/my-classes"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-border-ui bg-white hover:bg-surface-2 text-text-primary text-xs font-semibold rounded-btn transition-colors shadow-sm"
          >
            <FiBookOpen className="w-3.5 h-3.5 text-teal" />
            <span>Manage Classes</span>
          </Link>
          <Link
            to="/dashboard/my-payments"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-border-ui bg-white hover:bg-surface-2 text-text-primary text-xs font-semibold rounded-btn transition-colors shadow-sm"
          >
            <FiCreditCard className="w-3.5 h-3.5 text-teal" />
            <span>Payment History</span>
          </Link>
          <Link
            to="/dashboard/add-class"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-600 text-white text-xs font-semibold rounded-btn transition-colors shadow-sm"
          >
            <FiPlus className="w-3.5 h-3.5" />
            <span>Add Class</span>
          </Link>
        </div>
      </div>

      {/* Onboarding Banner / Personal Practice Profile Card */}
      {!currentUser?.onboardingCompleted ? (
        <div className="bg-gradient-to-r from-navy via-navy-800 to-teal/90 text-white rounded-card p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-teal/30">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal/20 text-teal-100 text-[11px] font-bold uppercase tracking-wider">
              ✨ Personal Practice & Wellness
            </div>
            <h2 className="text-lg font-bold text-white">Complete Your Personal Yoga Profile</h2>
            <p className="text-xs text-surface-2 max-w-xl">
              As an instructor, you can set your own personal fitness goals, body metrics, and schedule to get AI class recommendations and track your mat time.
            </p>
          </div>
          <Link
            to="/dashboard/onboarding"
            className="px-4 py-2.5 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn transition-all shadow-md flex-shrink-0 text-center self-start sm:self-auto"
          >
            Set Up My Profile
          </Link>
        </div>
      ) : (
        <div className="bg-teal-100/40 border border-teal/30 rounded-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-bold text-lg">
              🧘
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Personal Practice Profile Active</p>
              <p className="text-sm font-bold text-navy">
                Goal: {currentUser.onboardingProfile?.primaryGoal} ({currentUser.onboardingProfile?.goalPreference}) · BMI: {currentUser.onboardingProfile?.bmi} ({currentUser.onboardingProfile?.bmiCategory})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/recommendations"
              className="px-3.5 py-1.5 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn transition-colors"
            >
              Recommendations
            </Link>
            <Link
              to="/dashboard/student-cp"
              className="px-3.5 py-1.5 bg-white border border-border-ui hover:border-teal text-navy hover:text-teal text-xs font-bold rounded-btn transition-colors shadow-sm"
            >
              Practice Hub
            </Link>
            <Link
              to="/dashboard/onboarding"
              className="px-3 py-1.5 border border-border-ui hover:border-teal text-xs font-bold text-text-secondary hover:text-teal bg-white rounded-btn transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total classes"
          value={loadingClasses ? '...' : classes.length}
          color="text-navy"
          bg="bg-teal-100"
          icon="📚"
        />
        <MetricCard
          label="Active students"
          value={loadingClasses ? '...' : totalEnrolled}
          color="text-blue-ai"
          bg="bg-blue-ai-100"
          icon="👥"
        />
        <MetricCard
          label="Approved courses"
          value={loadingClasses ? '...' : approvedClasses}
          color="text-coral"
          bg="bg-coral-100"
          icon="✅"
        />
        <MetricCard
          label="Avg rating"
          value="4.9"
          color="text-warning"
          bg="bg-surface-2"
          icon="⭐"
        />
      </div>

      {/* Multi Teaching & Learning Hub */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-card border border-border-ui p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-teal" />
              <h2 className="text-base font-bold text-navy">Teaching & Courses</h2>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Review your classes, track student enrollments, edit course details, or start live studio broadcasting.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border-ui">
            <Link
              to="/dashboard/my-classes"
              className="text-xs font-bold text-teal hover:text-teal-600 transition-colors inline-flex items-center gap-1"
            >
              <span>Manage Classes</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/dashboard/add-class"
              className="text-xs font-bold text-text-secondary hover:text-teal transition-colors"
            >
              + Create New
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-card border border-border-ui p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-ai" />
              <h2 className="text-base font-bold text-navy">My Practice & Training</h2>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Practice and learn from fellow coaches. Access classes you enrolled in and practice on your mat anytime.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border-ui">
            <Link
              to="/dashboard/enrolled-class"
              className="text-xs font-bold text-teal hover:text-teal-600 transition-colors inline-flex items-center gap-1"
            >
              <span>Enrolled Training</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/dashboard/my-selected"
              className="text-xs font-bold text-text-secondary hover:text-teal transition-colors"
            >
              Saved Classes
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-card border border-border-ui p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-coral" />
              <h2 className="text-base font-bold text-navy">Personalized AI Guidance</h2>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Explore smart recommendations calibrated for your personal goals and track your weekly session progress.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border-ui">
            <Link
              to="/dashboard/recommendations"
              className="text-xs font-bold text-teal hover:text-teal-600 transition-colors inline-flex items-center gap-1"
            >
              <span>AI Recommendations</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/dashboard/student-cp"
              className="text-xs font-bold text-text-secondary hover:text-teal transition-colors"
            >
              Practice Hub
            </Link>
          </div>
        </div>
      </div>

      {/* Getting started tips */}
      <div className="bg-navy rounded-card p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-teal mb-3">Teaching tips</p>
        <div className="space-y-3">
          {[
            { step: '1', title: 'Create & publish your classes', desc: 'Upload thumbnails, add descriptions, and set pricing.' },
            { step: '2', title: 'Manage or delete courses anytime', desc: 'Easily update information or remove outdated classes from My Classes.' },
            { step: '3', title: 'Track student progress', desc: 'See real-time enrollment and engagement directly from your dashboard.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-teal flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {step}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{title}</p>
                <p className="text-xs text-white/50 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InstructorCP