import React, { useEffect, useState } from 'react'
import useUser from '../../../../hooks/useUser'
import useAxiosFetch from '../../../../hooks/useAxiosFetch'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { 
  FiBriefcase, 
  FiMail, 
  FiSend, 
  FiUser, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiPhone,
  FiRefreshCw
} from 'react-icons/fi'

const AsInstructor = () => {
  const { currentUser } = useUser()
  const [submittedData, setSubmittedData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  const axiosFetch = useAxiosFetch()

  const fetchApplicationStatus = () => {
    if (!currentUser?.email) return
    setLoading(true)
    axiosFetch.get(`/applied-instructors/${currentUser?.email}`)
      .then(res => {
        setSubmittedData(res.data?._id ? res.data : null)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching application:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchApplicationStatus()
  }, [currentUser?.email])

  const onSubmit = (e) => {
    e.preventDefault()
    const name = e.target.name.value
    const email = e.target.email.value
    const phone = e.target.phone.value
    const experience = e.target.experience.value

    if (!experience || experience.trim().length < 15) {
      Swal.fire({
        title: 'More details needed',
        text: 'Please describe your yoga teaching experience or certifications in at least 15 characters.',
        icon: 'warning',
        confirmButtonColor: '#12B8A6'
      })
      return
    }

    setSubmitting(true)

    const payload = {
      name,
      email,
      phone,
      experience
    }

    axiosFetch.post('/as-instructor', payload)
      .then(res => {
        setSubmitting(false)
        setIsEditing(false)
        Swal.fire({
          title: 'Application Submitted!',
          text: 'Thank you for applying. An administrator will review your credentials shortly.',
          icon: 'success',
          confirmButtonColor: '#12B8A6'
        })
        fetchApplicationStatus()
      })
      .catch(err => {
        setSubmitting(false)
        const msg = err.response?.data?.message || 'An error occurred while submitting your application.'
        Swal.fire({
          title: 'Submission Issue',
          text: msg,
          icon: 'error',
          confirmButtonColor: '#12B8A6'
        })
      })
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center text-text-secondary">
        <div className="inline-block w-8 h-8 border-3 border-teal border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm">Checking application status...</p>
      </div>
    )
  }

  // Case 1: Already an instructor
  if (currentUser?.role === 'instructor') {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <div className="bg-white rounded-card border border-border-ui p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            <FiCheckCircle />
          </div>
          <h2 className="text-2xl font-bold text-navy">You are already an Instructor!</h2>
          <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto">
            You currently have full instructor privileges. You can publish yoga classes, manage registered students, and host live sessions.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/dashboard/add-class"
              className="px-5 py-2.5 bg-teal hover:bg-teal-600 text-white text-xs font-semibold rounded-btn transition-colors shadow-sm"
            >
              Create New Class
            </Link>
            <Link
              to="/dashboard/my-classes"
              className="px-5 py-2.5 border border-border-ui bg-white hover:bg-surface-2 text-text-primary text-xs font-semibold rounded-btn transition-colors"
            >
              View My Classes
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Case 2: Has an active application (Pending or Rejected, unless isEditing)
  const isPending = submittedData && (submittedData.status === 'pending' || !submittedData.status)
  const isRejected = submittedData && submittedData.status === 'rejected'

  if (submittedData && !isEditing) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        {/* Status banner */}
        {isPending ? (
          <div className="bg-amber-50 border border-amber-200 rounded-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl flex-shrink-0">
                <FiClock />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-navy">Application Under Review</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                    Pending Admin Approval
                  </span>
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  We received your instructor application. Our administrator team will review your qualifications and update your account role.
                </p>
                <div className="mt-4 pt-4 border-t border-amber-200/60 text-xs text-text-secondary space-y-1">
                  <p><span className="font-semibold text-navy">Applicant Name:</span> {submittedData.name}</p>
                  <p><span className="font-semibold text-navy">Email:</span> {submittedData.email}</p>
                  {submittedData.phone && <p><span className="font-semibold text-navy">Phone:</span> {submittedData.phone}</p>}
                  <p className="pt-2"><span className="font-semibold text-navy">Submitted Experience:</span></p>
                  <p className="bg-white/80 p-3 rounded-lg border border-amber-200 text-text-primary text-xs whitespace-pre-wrap">
                    {submittedData.experience}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : isRejected ? (
          <div className="bg-rose-50 border border-rose-200 rounded-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-2xl flex-shrink-0">
                <FiAlertCircle />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-navy">Application Needs Revision</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
                    Not Approved
                  </span>
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  Your instructor application was not approved at this time. Please review the admin feedback below and feel free to re-apply.
                </p>

                {submittedData.feedback && (
                  <div className="mt-3 p-3 bg-white/80 rounded-lg border border-rose-200 text-xs text-rose-900">
                    <span className="font-bold">Admin Feedback: </span>
                    {submittedData.feedback}
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-600 text-white text-xs font-semibold rounded-btn transition-colors shadow-sm"
                  >
                    <FiRefreshCw className="w-3.5 h-3.5" />
                    <span>Update Details & Re-apply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  // Case 3: Fresh application form or editing re-application
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-card border border-border-ui p-6 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">Become an Instructor</h1>
          <p className="text-sm text-text-secondary mt-1">
            Join our certified yoga instructors to publish courses, schedule live sessions, and inspire students worldwide.
          </p>
        </div>

        {isEditing && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between">
            <span>Updating your previous application. You can provide updated credentials.</span>
            <button 
              onClick={() => setIsEditing(false)}
              className="text-xs font-bold text-navy underline hover:no-underline"
            >
              Cancel
            </button>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={currentUser?.name}
                  readOnly
                  className="w-full pl-10 pr-3.5 py-2.5 bg-bg-base border border-border-ui rounded-btn text-sm text-text-primary cursor-not-allowed outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  defaultValue={currentUser?.email}
                  readOnly
                  className="w-full pl-10 pr-3.5 py-2.5 bg-bg-base border border-border-ui rounded-btn text-sm text-text-primary cursor-not-allowed outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5" htmlFor="phone">
              Contact Phone (Optional)
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
              <input
                type="tel"
                name="phone"
                id="phone"
                defaultValue={currentUser?.phone || submittedData?.phone || ''}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-3.5 py-2.5 border border-border-ui rounded-btn text-sm text-navy placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
              />
            </div>
          </div>

          {/* Experience & Certifications */}
          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5" htmlFor="experience">
              Teaching Experience & Certifications
            </label>
            <div className="relative">
              <textarea
                name="experience"
                id="experience"
                rows={5}
                required
                defaultValue={submittedData?.experience || ''}
                placeholder="Detail your yoga teaching background, styles taught (e.g., Vinyasa, Hatha, Yin), certifications (e.g., RYT 200/500), and years of practice..."
                className="w-full p-3.5 border border-border-ui rounded-btn text-sm text-navy placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all resize-y"
              ></textarea>
            </div>
            <p className="text-[11px] text-text-secondary mt-1">
              Include any relevant credentials or links to your teaching profiles/social channels.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 border border-border-ui bg-white hover:bg-surface-2 text-text-primary text-xs font-semibold rounded-btn transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal hover:bg-teal-600 disabled:opacity-60 text-white text-xs font-semibold rounded-btn transition-colors shadow-sm"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <FiSend className="w-3.5 h-3.5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AsInstructor