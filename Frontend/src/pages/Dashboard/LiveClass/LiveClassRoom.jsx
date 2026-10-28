import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  FiArrowLeft,
  FiRadio,
  FiShield,
  FiUserCheck,
  FiUsers,
  FiCheckCircle,
  FiExternalLink,
  FiCopy,
  FiVideo,
  FiCheck
} from 'react-icons/fi'
import Swal from 'sweetalert2'
import useUser from '../../../hooks/useUser'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const LiveClassRoom = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, isLoading } = useUser()
  const axiosSecure = useAxiosSecure()

  const [sessionData, setSessionData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [copied, setCopied] = useState(false)

  // Verify enrollment/host permissions and fetch room details
  useEffect(() => {
    if (currentUser?.email && id) {
      setLoading(true)
      axiosSecure
        .get(`/classes/live-session/${id}`)
        .then((res) => {
          setSessionData(res.data)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error fetching live session:', err)
          setError(
            err.response?.data?.message ||
              'You are not authorized to access this live session or the class was not found.'
          )
          setLoading(false)
        })
    } else if (!isLoading && !currentUser) {
      setLoading(false)
      setError('Please log in to join this live session.')
    }
  }, [id, currentUser?.email, isLoading])

  // Instructor toggling live status (broadcast vs ended)
  const handleToggleLiveStatus = async (newStatus) => {
    setIsUpdatingStatus(true)
    try {
      await axiosSecure.put(`/classes/live-status/${id}`, { liveStatus: newStatus })
      setSessionData((prev) => ({
        ...prev,
        classItem: {
          ...prev.classItem,
          liveStatus: newStatus
        }
      }))
      Swal.fire({
        title: newStatus === 'live' ? 'Broadcast Live!' : 'Session Ended',
        text:
          newStatus === 'live'
            ? 'Your live studio is marked as active. Students can now join.'
            : 'Live class has been marked as completed.',
        icon: 'success',
        confirmButtonColor: '#12B8A6',
        timer: 2000
      })
    } catch (err) {
      console.error('Failed to update live status:', err)
      Swal.fire({
        title: 'Status Update Failed',
        text: err.response?.data?.message || 'Could not update status.',
        icon: 'error',
        confirmButtonColor: '#E5484D'
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const classItem = sessionData?.classItem
  const isInstructor = sessionData?.isInstructor
  const isCurrentlyLive = classItem?.liveStatus === 'live'

  // Construct direct Jitsi studio URL (unlimited duration, forced English, pre-configured flags)
  const directRoomUrl = sessionData?.roomName
    ? `https://meet.jit.si/${sessionData.roomName}?lang=en#config.defaultLanguage="en"&config.disableLanguageDetection=true&config.startWithAudioMuted=${!isInstructor}&userInfo.displayName="${encodeURIComponent(
        currentUser?.name || 'Yogi'
      )}"`
    : ''

  const handleLaunchStudio = () => {
    if (directRoomUrl) {
      window.open(directRoomUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleCopyLink = () => {
    if (directRoomUrl) {
      navigator.clipboard.writeText(directRoomUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleClose = () => {
    if (isInstructor) {
      navigate('/dashboard/my-classes')
    } else {
      navigate('/dashboard/enrolled-class')
    }
  }

  if (loading || isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-base font-semibold text-navy">Preparing Your Live Yoga Studio...</p>
        <p className="text-xs text-text-secondary">Verifying your enrollment & permissions</p>
      </div>
    )
  }

  if (error || !sessionData?.authorized) {
    return (
      <div className="max-w-xl mx-auto my-14 p-8 bg-white rounded-card border border-border-ui text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto text-2xl">
          <FiShield className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-navy">Live Class Access Restricted</h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          {error || 'You must be enrolled in this class to access the live video session.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-border-ui text-text-primary text-xs font-semibold rounded-btn hover:bg-surface-2 transition-colors"
          >
            Go Back
          </button>
          <Link
            to={`/class/${id}`}
            className="px-4 py-2 bg-teal text-white text-xs font-semibold rounded-btn hover:bg-teal-600 transition-colors shadow-sm"
          >
            View Course & Enroll
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleClose}
          className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-navy transition-colors py-1"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to {isInstructor ? 'My Classes' : 'My Training'}</span>
        </button>

        <div className="flex items-center gap-2">
          {isInstructor ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100 text-teal rounded-full text-xs font-bold border border-teal/20">
              <FiUserCheck className="w-3.5 h-3.5" />
              <span>Instructor (Host)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-2 text-text-primary rounded-full text-xs font-semibold border border-border-ui">
              <FiUsers className="w-3.5 h-3.5 text-teal" />
              <span>Student Attendee</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Studio Launchpad Hero Card */}
      <div className="bg-white rounded-card border border-border-ui shadow-md overflow-hidden">
        {/* Cover & Live Badge */}
        <div className="relative aspect-[21/9] w-full bg-navy overflow-hidden">
          {classItem?.image ? (
            <img
              src={classItem.image}
              alt={classItem.name}
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-navy via-navy-800 to-teal/30"></div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent flex flex-col justify-end p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                  isCurrentlyLive
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-white/20 text-white backdrop-blur-md'
                }`}
              >
                <FiRadio className="w-3.5 h-3.5" />
                <span>{isCurrentlyLive ? 'LIVE BROADCAST ACTIVE' : 'STUDIO READY'}</span>
              </span>
              <span className="text-xs text-white/80">• Max 50 Yogis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{classItem?.name}</h1>
            <p className="text-xs text-white/70 mt-1">
              Instructor: <strong className="text-white">{classItem?.instructorName || 'Yoga Master'}</strong>
            </p>
          </div>
        </div>

        {/* Launchpad Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-card bg-teal-100/50 border border-teal/30">
            <div>
              <h2 className="text-base font-bold text-navy flex items-center gap-2">
                <span>Dedicated Studio Window</span>
                <span className="text-[11px] font-bold text-teal bg-white px-2 py-0.5 rounded-full border border-teal/20">
                  Unlimited Duration
                </span>
              </h2>
              <p className="text-xs text-text-secondary mt-1 max-w-md">
                Opens your live yoga room in a distraction-free window with no 5-minute timeout, full camera view, and crystal-clear audio.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleLaunchStudio}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal hover:bg-teal-600 text-white font-bold text-sm rounded-btn shadow-md hover:shadow-lg transition-all duration-150 flex-shrink-0"
              >
                <FiVideo className="w-4 h-4" />
                <span>{isInstructor ? 'Open Studio Window (Host)' : 'Join Live Class Window'}</span>
                <FiExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>

              <button
                onClick={handleCopyLink}
                title="Copy Direct Room URL"
                className="p-3 bg-white border border-border-ui text-text-secondary hover:text-navy rounded-btn hover:bg-surface-2 transition-colors shadow-sm"
              >
                {copied ? <FiCheck className="w-4 h-4 text-teal" /> : <FiCopy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role-Specific Instructions Box */}
          {isInstructor ? (
            <div className="p-4 rounded-card bg-blue-ai-100/60 border border-blue-ai/30 text-xs text-navy space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm flex items-center gap-1.5 text-navy">
                  <span>👑 Instructor Host Controls</span>
                </p>
                {/* Broadcast toggle */}
                {isCurrentlyLive ? (
                  <button
                    onClick={() => handleToggleLiveStatus('ended')}
                    disabled={isUpdatingStatus}
                    className="px-3 py-1 bg-error text-white font-bold rounded-btn hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    End Live Broadcast
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleLiveStatus('live')}
                    disabled={isUpdatingStatus}
                    className="px-3 py-1 bg-success text-white font-bold rounded-btn hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <FiRadio className="w-3.5 h-3.5" />
                    <span>Set Status to Live Now</span>
                  </button>
                )}
              </div>
              <p className="text-text-secondary leading-relaxed">
                When you click <strong>"Open Studio Window"</strong>, click <strong>"I am the host"</strong> on the video screen and log in with Google once. This officially unlocks the meeting room for all your 50 students.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-card bg-surface-2 border border-border-ui text-xs text-text-secondary space-y-1.5">
              <p className="font-bold text-sm text-navy flex items-center gap-1.5">
                <span>🧘 Student Preparation</span>
              </p>
              <p className="leading-relaxed">
                Click <strong>"Join Live Class Window"</strong> above to enter. You do <strong>not</strong> need to log in to Jitsi. Your microphone is automatically muted to keep the class quiet—use the <strong>Raise Hand (✋)</strong> button if you have an asana question.
              </p>
            </div>
          )}

          {/* Studio Checklist */}
          <div>
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
              Studio Setup Checklist
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-lg border border-border-ui bg-bg-base space-y-1">
                <span className="text-lg">🧘</span>
                <p className="font-bold text-navy">Mat Position</p>
                <p className="text-text-secondary">Place your yoga mat 6–8 feet away from your screen horizontally.</p>
              </div>

              <div className="p-3.5 rounded-lg border border-border-ui bg-bg-base space-y-1">
                <span className="text-lg">📷</span>
                <p className="font-bold text-navy">Camera Angle</p>
                <p className="text-text-secondary">Tilt your camera slightly down so your full standing & floor poses are in view.</p>
              </div>

              <div className="p-3.5 rounded-lg border border-border-ui bg-bg-base space-y-1">
                <span className="text-lg">💧</span>
                <p className="font-bold text-navy">Hydration & Props</p>
                <p className="text-text-secondary">Keep a water bottle, towel, and any blocks or straps ready before joining.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveClassRoom
