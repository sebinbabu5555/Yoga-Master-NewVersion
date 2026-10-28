import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import { HashLoader } from 'react-spinners'
import useUser from '../../../hooks/useUser'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useAuth from '../../../hooks/useAuth'

// Curated athletic coaching and training avatars
const AVATAR_PRESETS = [
  { id: 'mobility', label: 'Mobility & Flow', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&auto=format&fit=crop&q=80' },
  { id: 'strength', label: 'Core & Strength', url: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=200&auto=format&fit=crop&q=80' },
  { id: 'posture', label: 'Posture & Alignment', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&auto=format&fit=crop&q=80' },
  { id: 'sunrise', label: 'Morning Movement', url: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?w=200&auto=format&fit=crop&q=80' },
  { id: 'athlete', label: 'Athletic Conditioning', url: 'https://images.unsplash.com/photo-1552196563-55246c789077?w=200&auto=format&fit=crop&q=80' },
  { id: 'recovery', label: 'Active Recovery', url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=200&auto=format&fit=crop&q=80' },
]

const GOAL_OPTIONS = [
  { id: 'Build Flexibility & Mobility', title: 'Flexibility & Mobility', icon: '🤸', desc: 'Expand range of motion, relieve tight hips, and improve joint movement.' },
  { id: 'Strength & Toning', title: 'Strength & Core Toning', icon: '💪', desc: 'Build functional bodyweight strength, core stability, and muscular endurance.' },
  { id: 'Posture Correction', title: 'Posture Correction & Desk Reset', icon: '🧍', desc: 'Target forward-head tilt, rounded shoulders, and spine alignment.' },
  { id: 'Stress Relief & Mental Wellness', title: 'Stress Management & Breathwork', icon: '🫁', desc: 'Down-regulate the nervous system with structured breath pacing and recovery.' },
  { id: 'Weight Management', title: 'Weight Management & Conditioning', icon: '🔥', desc: 'High-tempo active flows for cardiovascular output and metabolic vitality.' },
  { id: 'Post-Injury Recovery & Rehabilitation', title: 'Injury Recovery & Joint Care', icon: '🩹', desc: 'Low-impact sequences and joint protection modifications for safe training.' }
]

const YOGA_STYLES = [
  { id: 'Hatha', label: 'Hatha Alignment', desc: 'Classic structural postures with technique focus' },
  { id: 'Vinyasa', label: 'Vinyasa Flow', desc: 'Continuous movement linked with active breath' },
  { id: 'Power Yoga', label: 'Power Yoga', desc: 'High-intensity athletic strength & stamina' },
  { id: 'Yin Yoga', label: 'Yin & Deep Stretch', desc: 'Targeted passive holds for fascia & connective tissue' },
  { id: 'Restorative', label: 'Restorative & Recovery', desc: 'Supported, gentle movement for muscle regeneration' },
  { id: 'Ashtanga', label: 'Ashtanga Flow', desc: 'Progressive, structured athletic sequences' },
  { id: 'Chair Yoga', label: 'Chair & Accessible Movement', desc: 'Low impact, seated and modified sequences' },
  { id: 'Meditation & Pranayama', label: 'Breathwork & Pacing', desc: 'Cardiorespiratory control and focus training' }
]

const INJURY_AREAS = [
  { id: 'Lower Back', label: 'Lower Back', icon: '🔙' },
  { id: 'Upper Back', label: 'Upper Back', icon: '🫀' },
  { id: 'Neck & Shoulders', label: 'Neck & Shoulders', icon: '💆' },
  { id: 'Knees', label: 'Knees', icon: '🦵' },
  { id: 'Hips', label: 'Hips', icon: '🧍' },
  { id: 'Wrists & Hands', label: 'Wrists & Hands', icon: '🤲' },
  { id: 'Ankles & Feet', label: 'Ankles & Feet', icon: '🦶' },
  { id: 'Core / Abdomen', label: 'Core / Abdomen', icon: '🫁' },
  { id: 'Hamstrings', label: 'Hamstrings', icon: '🦿' },
  { id: 'Sciatica', label: 'Sciatica', icon: '⚡' }
]

const SOUNDSCAPES = [
  { id: 'ambient', label: 'Light Ambient Pacing' },
  { id: 'nature', label: 'Natural Soundscape' },
  { id: 'acoustic', label: 'Gentle Acoustic' },
  { id: 'silence', label: 'Voice Only (No Background)' }
]

const DIET_OPTIONS = [
  { id: 'Sattvic / Ayurvedic', label: 'Sattvic / Ayurvedic', desc: 'Pure, seasonal plant-based whole foods' },
  { id: 'Vegetarian', label: 'Vegetarian', desc: 'Plant-forward with dairy and fruits' },
  { id: 'Vegan', label: 'Vegan', desc: '100% plant-based lifestyle' },
  { id: 'Pescatarian', label: 'Pescatarian', desc: 'Plants, legumes, and sustainable seafood' },
  { id: 'Balanced Omnivore', label: 'Balanced Omnivore', desc: 'Wholesome balanced variety' },
  { id: 'Gluten-Free / Keto', label: 'Specialized / GF', desc: 'Custom nutrition guidelines' }
]

const Profile = () => {
  const { currentUser, isLoading, refetch } = useUser()
  const { user, changePassword, deleteAccount } = useAuth()
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('yoga') // 'yoga' | 'health' | 'account' | 'preferences' | 'security'
  const [saving, setSaving] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  // Password & Security State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  const isPasswordProvider = user?.providerData?.some((p) => p.providerId === 'password')

  // Form State
  const [formData, setFormData] = useState({
    // User Identity
    name: '',
    phone: '',
    address: '',
    about: '',
    mantra: '',
    photoURL: '',

    // Yoga Blueprint
    yogaExperience: 'Beginner',
    primaryGoal: 'Build Flexibility & Mobility',
    yogaStyle: 'Vinyasa',
    preferredStyles: ['Vinyasa', 'Hatha'],
    fitnessLevel: 'Moderate',
    preferredDuration: '30',
    preferredTimeOfDay: 'morning',
    weeklyPracticeGoal: 3,
    ambientSound: 'bowls',

    // Health & Injury
    hasInjuries: 'no',
    injuryAreas: [],
    injuryDetails: '',
    heightUnit: 'cm',
    heightCm: '170',
    heightFt: '5',
    heightIn: '7',
    weightUnit: 'kg',
    weight: '70',
    targetWeight: '65',
    diet: 'Vegetarian',
    waterIntake: '1.5 - 2.5 Liters',

    // Preferences & Notifications
    notifications: {
      dailyReminder: true,
      reminderTime: '07:00',
      quoteNotification: true,
      emailDigest: true,
      defaultCameraOff: false
    }
  })

  // Populate data when currentUser loads
  useEffect(() => {
    if (currentUser) {
      const p = currentUser.onboardingProfile || {}
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        about: currentUser.about || '',
        mantra: currentUser.mantra || 'Breathe with intention, move with grace.',
        photoURL: currentUser.photoURL || currentUser.photoUrl || '',

        yogaExperience: p.yogaExperience || 'Beginner',
        primaryGoal: p.primaryGoal || 'Build Flexibility & Mobility',
        yogaStyle: p.yogaStyle || 'Vinyasa',
        preferredStyles: Array.isArray(p.preferredStyles) && p.preferredStyles.length > 0
          ? p.preferredStyles
          : (p.yogaStyle ? [p.yogaStyle] : ['Vinyasa']),
        fitnessLevel: p.fitnessLevel || 'Moderate',
        preferredDuration: String(p.preferredDuration || '30'),
        preferredTimeOfDay: p.preferredTimeOfDay || 'morning',
        weeklyPracticeGoal: p.weeklyPracticeGoal || 3,
        ambientSound: p.ambientSound || 'bowls',

        hasInjuries: p.hasInjuries || (p.injuryAreas && p.injuryAreas.length > 0 ? 'yes' : 'no'),
        injuryAreas: Array.isArray(p.injuryAreas) ? p.injuryAreas : [],
        injuryDetails: p.injuryDetails || '',
        heightUnit: p.heightUnit || 'cm',
        heightCm: p.heightUnit === 'cm' && p.height ? String(p.height) : (p.heightCm ? String(p.heightCm) : '170'),
        heightFt: p.heightUnit === 'ft' && p.height?.ft ? String(p.height.ft) : '5',
        heightIn: p.heightUnit === 'ft' && p.height?.in ? String(p.height.in) : '7',
        weightUnit: p.weightUnit || 'kg',
        weight: String(p.weight || p.weightKg || '70'),
        targetWeight: String(p.targetWeight || '65'),
        diet: p.diet || 'Vegetarian',
        waterIntake: p.waterIntake || '1.5 - 2.5 Liters',

        notifications: p.notifications || {
          dailyReminder: true,
          reminderTime: '07:00',
          quoteNotification: true,
          emailDigest: true,
          defaultCameraOff: false
        }
      })
    }
  }, [currentUser])

  // Helpers
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateNestedNotification = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }))
  }

  const toggleStyle = (styleId) => {
    setFormData((prev) => {
      const exists = prev.preferredStyles.includes(styleId)
      let next = exists
        ? prev.preferredStyles.filter((s) => s !== styleId)
        : [...prev.preferredStyles, styleId]
      if (next.length === 0) next = [styleId]
      return { ...prev, preferredStyles: next, yogaStyle: next[0] }
    })
  }

  const toggleInjury = (injuryId) => {
    setFormData((prev) => {
      const exists = prev.injuryAreas.includes(injuryId)
      const next = exists
        ? prev.injuryAreas.filter((a) => a !== injuryId)
        : [...prev.injuryAreas, injuryId]
      return {
        ...prev,
        injuryAreas: next,
        hasInjuries: next.length > 0 ? 'yes' : 'no'
      }
    })
  }

  // Calculate live BMI
  const getLiveBMI = () => {
    let hInM = 0
    let wInKg = 0
    if (formData.heightUnit === 'ft') {
      const ft = Number(formData.heightFt) || 0
      const inch = Number(formData.heightIn) || 0
      hInM = (ft * 12 + inch) * 0.0254
    } else {
      hInM = (Number(formData.heightCm) || 0) / 100
    }

    if (formData.weightUnit === 'lbs') {
      wInKg = (Number(formData.weight) || 0) * 0.45359237
    } else {
      wInKg = Number(formData.weight) || 0
    }

    if (!hInM || hInM <= 0 || !wInKg || wInKg <= 0) {
      return { bmi: 0, category: 'Healthy Weight', color: 'text-teal' }
    }

    const bmi = Math.round((wInKg / (hInM * hInM)) * 10) / 10
    let category = 'Normal weight'
    let color = 'text-teal bg-teal-100'
    let meterPercent = 50

    if (bmi < 18.5) {
      category = 'Underweight'
      color = 'text-blue-ai bg-blue-ai-100'
      meterPercent = 20
    } else if (bmi < 25) {
      category = 'Optimal BMI'
      color = 'text-success bg-emerald-100'
      meterPercent = 50
    } else if (bmi < 30) {
      category = 'Overweight'
      color = 'text-warning bg-amber-100'
      meterPercent = 75
    } else {
      category = 'Obese Range'
      color = 'text-error bg-red-100'
      meterPercent = 95
    }

    return { bmi, category, color, meterPercent, weightKg: Math.round(wInKg * 10) / 10 }
  }

  const bmiInfo = getLiveBMI()

  // Save handler
  const handleSave = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        about: formData.about,
        mantra: formData.mantra,
        photoURL: formData.photoURL,
        photoUrl: formData.photoURL,

        // Yoga blueprint
        yogaExperience: formData.yogaExperience,
        primaryGoal: formData.primaryGoal,
        yogaStyle: formData.yogaStyle || formData.preferredStyles[0] || 'Vinyasa',
        preferredStyles: formData.preferredStyles,
        fitnessLevel: formData.fitnessLevel,
        preferredDuration: Number(formData.preferredDuration),
        preferredTimeOfDay: formData.preferredTimeOfDay,
        weeklyPracticeGoal: Number(formData.weeklyPracticeGoal),
        ambientSound: formData.ambientSound,

        // Health & Injury
        hasInjuries: formData.hasInjuries,
        injuryAreas: formData.injuryAreas,
        injuryDetails: formData.injuryDetails,
        heightUnit: formData.heightUnit,
        height: formData.heightUnit === 'cm'
          ? formData.heightCm
          : { ft: formData.heightFt, in: formData.heightIn },
        weightUnit: formData.weightUnit,
        weight: formData.weight,
        targetWeight: formData.targetWeight,
        diet: formData.diet,
        waterIntake: formData.waterIntake,

        // Notifications
        notifications: formData.notifications
      }

      const res = await axiosSecure.put('/api/user/profile', payload)

      if (res.data.success) {
        await refetch()
        Swal.fire({
          icon: 'success',
          title: 'Personalisation Saved!',
          text: 'Your tailored yoga blueprint and preferences have been updated.',
          confirmButtonColor: '#12B8A6',
          timer: 2000,
          showConfirmButton: false
        })
      }
    } catch (err) {
      console.error('Error saving profile personalisation:', err)
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: err?.response?.data?.message || 'Something went wrong while updating your profile.',
        confirmButtonColor: '#12B8A6'
      })
    } finally {
      setSaving(false)
    }
  }

  // Change Password Handler
  const handleChangePassword = async (e) => {
    if (e) e.preventDefault()

    if (isPasswordProvider && !currentPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Current Password Required',
        text: 'Please enter your current password to verify your identity.',
        confirmButtonColor: '#12B8A6'
      })
      return
    }

    if (!newPassword || newPassword.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'New password must be at least 6 characters long.',
        confirmButtonColor: '#12B8A6'
      })
      return
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Passwords Do Not Match',
        text: 'Please ensure your new password and confirmation match.',
        confirmButtonColor: '#12B8A6'
      })
      return
    }

    setIsUpdatingPassword(true)
    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      Swal.fire({
        icon: 'success',
        title: 'Password Updated!',
        text: 'Your account password has been successfully updated.',
        confirmButtonColor: '#12B8A6'
      })
    } catch (err) {
      console.error('Error changing password:', err)
      let msg = err.message || 'Failed to change password.'
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Your current password was entered incorrectly.'
      } else if (err.code === 'auth/weak-password') {
        msg = 'The password is too weak. Please use at least 6 characters.'
      } else if (err.code === 'auth/requires-recent-login') {
        msg = 'For security reasons, please log out and log back in before changing your password.'
      }
      Swal.fire({
        icon: 'error',
        title: 'Password Update Failed',
        text: msg,
        confirmButtonColor: '#12B8A6'
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Delete Your Account?',
      text: 'This will permanently remove your user profile, personalized yoga blueprint, practice history, and saved data. This action is irreversible!',
      icon: 'warning',
      input: isPasswordProvider ? 'password' : 'text',
      inputLabel: isPasswordProvider
        ? 'Enter your current password to verify:'
        : 'Type DELETE to confirm account removal:',
      inputPlaceholder: isPasswordProvider ? 'Your account password' : 'DELETE',
      showCancelButton: true,
      confirmButtonColor: '#E5484D',
      cancelButtonColor: '#667085',
      confirmButtonText: 'Yes, delete forever',
      cancelButtonText: 'Keep my account',
      inputValidator: (value) => {
        if (!value) {
          return isPasswordProvider ? 'Password is required to confirm!' : 'Please type DELETE to confirm!'
        }
        if (!isPasswordProvider && value !== 'DELETE') {
          return 'Please type DELETE in capital letters.'
        }
      }
    })

    if (result.isConfirmed) {
      setIsDeletingAccount(true)
      try {
        // 1. Remove user records from backend database
        await axiosSecure.delete('/api/user/account')
        // 2. Remove user from Firebase Auth
        await deleteAccount(isPasswordProvider ? result.value : null)
        
        await Swal.fire({
          icon: 'success',
          title: 'Account Deleted',
          text: 'Your account has been permanently removed. We hope to see you on the mat again in the future!',
          confirmButtonColor: '#12B8A6'
        })
        navigate('/')
      } catch (err) {
        console.error('Error deleting account:', err)
        let msg = err?.response?.data?.message || err.message || 'Failed to delete account.'
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          msg = 'The password you entered was incorrect. Account was not deleted.'
        } else if (err.code === 'auth/requires-recent-login') {
          msg = 'For security, please log out and sign back in, then try deleting again.'
        }
        Swal.fire({
          icon: 'error',
          title: 'Deletion Failed',
          text: msg,
          confirmButtonColor: '#12B8A6'
        })
      } finally {
        setIsDeletingAccount(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px]">
        <HashLoader color="#12B8A6" size={45} />
        <p className="text-sm font-semibold text-text-secondary mt-3">Loading your personalized sanctuary...</p>
      </div>
    )
  }

  const role = currentUser?.role || 'user'

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ── TOP HEADER / IDENTITY BANNER ──────────────────────────────── */}
      <div className="bg-gradient-to-r from-navy via-navy-800 to-teal/90 rounded-card p-6 md:p-8 text-white shadow-md relative overflow-hidden border border-teal/20">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <span className="text-9xl">🧘</span>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar with edit overlay */}
            <div className="relative group">
              {formData.photoURL ? (
                <img
                  src={formData.photoURL}
                  alt={formData.name || 'User'}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white/40 shadow-lg group-hover:opacity-90 transition-opacity"
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-teal text-white flex items-center justify-center text-3xl font-bold border-4 border-white/40 shadow-lg">
                  {formData.name?.[0]?.toUpperCase() || 'Y'}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowAvatarPicker(true)}
                className="absolute inset-0 bg-navy/60 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold"
                title="Change Avatar"
              >
                <span>📷</span>
                <span>Change</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  {formData.name || 'Your Yoga Space'}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal text-white uppercase tracking-wider shadow-sm">
                  {role === 'admin' ? 'Admin' : role === 'instructor' ? 'Yoga Instructor' : 'Yogi Member'}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white/90">
                  {formData.yogaExperience} Level
                </span>
              </div>
              <p className="text-sm text-teal-100 font-medium italic">
                "{formData.mantra}"
              </p>
              <p className="text-xs text-white/70 flex items-center gap-2">
                <span>✉️ {currentUser?.email}</span>
                {formData.address && <span>• 📍 {formData.address}</span>}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard/recommendations"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-btn transition-colors border border-white/20 backdrop-blur-sm flex items-center gap-1.5"
            >
              <span>✨</span>
              <span>View Recommendations</span>
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  <span>Save Personalisation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Vital Quick Indicators bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15 text-xs">
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm">
            <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Primary Focus</span>
            <span className="font-bold text-white truncate block">{formData.primaryGoal.split('&')[0]}</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm">
            <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Weekly Target</span>
            <span className="font-bold text-white block">{formData.weeklyPracticeGoal} Sessions / wk</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm">
            <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">BMI Index</span>
            <span className="font-bold text-teal-200 block">{bmiInfo.bmi > 0 ? `${bmiInfo.bmi} (${bmiInfo.category})` : 'Set metrics'}</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm">
            <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Injury Safeguard</span>
            <span className="font-bold text-white block">
              {formData.injuryAreas.length > 0 ? `🛡️ ${formData.injuryAreas.length} Areas Protected` : '✅ All Clear'}
            </span>
          </div>
        </div>
      </div>

      {/* ── NAVIGATION TABS ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-border-ui overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('yoga')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'yoga'
              ? 'border-teal text-teal bg-teal-100/30'
              : 'border-transparent text-text-secondary hover:text-navy hover:bg-surface-2'
          }`}
        >
          <span>🧘‍♀️</span>
          <span>Yoga Blueprint & Goals</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'health'
              ? 'border-teal text-teal bg-teal-100/30'
              : 'border-transparent text-text-secondary hover:text-navy hover:bg-surface-2'
          }`}
        >
          <span>🩹</span>
          <span>Health, Injuries & Metrics</span>
          {formData.injuryAreas.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-coral text-white text-[10px] flex items-center justify-center font-bold">
              {formData.injuryAreas.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'account'
              ? 'border-teal text-teal bg-teal-100/30'
              : 'border-transparent text-text-secondary hover:text-navy hover:bg-surface-2'
          }`}
        >
          <span>👤</span>
          <span>Identity & Bio</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'preferences'
              ? 'border-teal text-teal bg-teal-100/30'
              : 'border-transparent text-text-secondary hover:text-navy hover:bg-surface-2'
          }`}
        >
          <span>🔔</span>
          <span>Habits & Reminders</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'security'
              ? 'border-teal text-teal bg-teal-100/30'
              : 'border-transparent text-text-secondary hover:text-navy hover:bg-surface-2'
          }`}
        >
          <span>🔒</span>
          <span>Account & Security</span>
        </button>
      </div>

      {/* ── TAB 1: YOGA BLUEPRINT & GOALS ───────────────────────────── */}
      {activeTab === 'yoga' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Experience Level Selector */}
          <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                  <span>🌿</span> Practice Level
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Helps our AI coach adapt pose variations and class recommendations to your capability.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'Beginner', title: 'Beginner Yogi', desc: 'New to yoga or returning after a break. Focus on foundational alignment and breath.', icon: '🌱' },
                { id: 'Intermediate', title: 'Intermediate', desc: 'Comfortable with Surya Namaskar and basic flows. Ready to deepen poses and holds.', icon: '🌿' },
                { id: 'Advanced', title: 'Advanced Yogi', desc: 'Consistent practice for 2+ years. Exploring inversions, arm balances and pranayama.', icon: '🌳' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => updateField('yogaExperience', lvl.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    formData.yogaExperience === lvl.id
                      ? 'border-teal bg-teal-100/40 ring-2 ring-teal ring-opacity-40'
                      : 'border-border-ui hover:border-teal/50 hover:bg-surface-2/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{lvl.icon}</span>
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formData.yogaExperience === lvl.id ? 'border-teal bg-teal' : 'border-border-ui'
                    }`}>
                      {formData.yogaExperience === lvl.id && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy text-sm">{lvl.title}</h3>
                  <p className="text-xs text-text-secondary mt-1">{lvl.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Yoga Goal */}
          <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                <span>🎯</span> Primary Yoga & Wellness Goal
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                What brings you to the mat? Your recommended class feed will center around this intention.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {GOAL_OPTIONS.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => updateField('primaryGoal', goal.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    formData.primaryGoal === goal.id
                      ? 'border-teal bg-teal-100/40 ring-2 ring-teal ring-opacity-40 shadow-sm'
                      : 'border-border-ui hover:border-teal/50 hover:bg-surface-2/50'
                  }`}
                >
                  <span className="text-2xl p-2 rounded-lg bg-surface-2 flex-shrink-0">{goal.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-navy text-sm">{goal.title}</h3>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{goal.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Yoga Styles (Multi-select) */}
          <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                  <span>🎨</span> Preferred Yoga Styles & Disciplines
                </h2>
                <span className="text-xs font-semibold text-text-secondary">
                  {formData.preferredStyles.length} selected
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Select all styles you enjoy. We tailor class recommendations to include these traditions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {YOGA_STYLES.map((style) => {
                const isSelected = formData.preferredStyles.includes(style.id)
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => toggleStyle(style.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-teal bg-teal text-white shadow-sm'
                        : 'border-border-ui hover:border-teal/50 hover:bg-surface-2/50 text-navy'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{style.icon}</span>
                      <div>
                        <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-navy'}`}>{style.label}</p>
                        <p className={`text-[11px] ${isSelected ? 'text-teal-100' : 'text-text-secondary'}`}>{style.desc}</p>
                      </div>
                    </div>
                    <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-white bg-white text-teal' : 'border-border-ui'
                    }`}>
                      {isSelected && '✓'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Cadence & Session Environment */}
          <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <span>⏱️</span> Practice Routine & Environment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Preferred Duration */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Ideal Session Length
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { dur: '15', label: '15 min (Quick)' },
                    { dur: '30', label: '30 min (Balanced)' },
                    { dur: '45', label: '45 min (Deep)' },
                    { dur: '60', label: '60 min (Mastery)' },
                  ].map((d) => (
                    <button
                      key={d.dur}
                      type="button"
                      onClick={() => updateField('preferredDuration', d.dur)}
                      className={`p-2.5 rounded-btn border text-xs font-bold transition-all ${
                        formData.preferredDuration === d.dur
                          ? 'border-teal bg-teal text-white shadow-sm'
                          : 'border-border-ui hover:border-teal text-navy'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time of Day */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Favored Practice Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'morning', label: 'Sunrise', icon: '🌅' },
                    { id: 'afternoon', label: 'Midday', icon: '☀️' },
                    { id: 'evening', label: 'Sunset', icon: '🌙' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => updateField('preferredTimeOfDay', t.id)}
                      className={`p-2.5 rounded-btn border text-xs font-bold text-center transition-all ${
                        formData.preferredTimeOfDay === t.id
                          ? 'border-teal bg-teal text-white shadow-sm'
                          : 'border-border-ui hover:border-teal text-navy'
                      }`}
                    >
                      <span className="block text-base mb-0.5">{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly Practice Goal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Weekly Goal
                  </label>
                  <span className="text-xs font-extrabold text-teal">
                    {formData.weeklyPracticeGoal} days / week
                  </span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => updateField('weeklyPracticeGoal', num)}
                      className={`flex-1 py-2 rounded-btn border text-xs font-bold transition-all ${
                        formData.weeklyPracticeGoal === num
                          ? 'border-teal bg-teal text-white shadow-sm'
                          : 'border-border-ui hover:border-teal text-navy'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ambient Soundscapes */}
            <div className="pt-3 border-t border-border-ui space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Preferred Ambient Background for Sessions
              </label>
              <div className="flex flex-wrap gap-2">
                {SOUNDSCAPES.map((sound) => (
                  <button
                    key={sound.id}
                    type="button"
                    onClick={() => updateField('ambientSound', sound.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-btn border text-xs font-semibold transition-all ${
                      formData.ambientSound === sound.id
                        ? 'border-teal bg-teal-100 text-teal-800 ring-1 ring-teal font-bold'
                        : 'border-border-ui hover:border-teal text-navy'
                    }`}
                  >
                    <span>{sound.icon}</span>
                    <span>{sound.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TAB 2: HEALTH, INJURIES & METRICS ───────────────────────── */}
      {activeTab === 'health' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Injury & Sensitive Areas Protection */}
          <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                  <span>🛡️</span> Injury Protection & Sensitive Areas
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Select any areas that require safe modifications. Instructors and recommended classes will honor these safeguards.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-border-ui self-start">
                <span className="text-xs font-semibold text-text-secondary">Injuries?</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = formData.hasInjuries === 'yes' ? 'no' : 'yes'
                    updateField('hasInjuries', next)
                    if (next === 'no') updateField('injuryAreas', [])
                  }}
                  className={`text-xs font-bold px-2 py-0.5 rounded-full transition-all ${
                    formData.hasInjuries === 'yes'
                      ? 'bg-coral text-white'
                      : 'bg-teal text-white'
                  }`}
                >
                  {formData.hasInjuries === 'yes' ? 'Yes, protect' : 'No injuries'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
              {INJURY_AREAS.map((area) => {
                const isSelected = formData.injuryAreas.includes(area.id)
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => toggleInjury(area.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                      isSelected
                        ? 'border-coral bg-coral-100 text-coral ring-1 ring-coral shadow-sm'
                        : 'border-border-ui hover:border-coral/50 text-navy bg-surface'
                    }`}
                  >
                    <span className="text-base">{area.icon}</span>
                    <span className="flex-1 truncate">{area.label}</span>
                    {isSelected && <span className="text-coral">🛡️</span>}
                  </button>
                )
              })}
            </div>

            {formData.injuryAreas.length > 0 && (
              <div className="p-3 bg-coral-100/60 border border-coral/30 rounded-xl flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-navy">
                    Safe Practice Mode Active ({formData.injuryAreas.join(', ')})
                  </p>
                  <p className="text-text-secondary">
                    Classes with high strain on these regions will be flagged with gentle modifications, and gentle restorative sessions will be prioritized.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Additional Cautions or Notes for Instructors & AI Assistant (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.injuryDetails}
                onChange={(e) => updateField('injuryDetails', e.target.value)}
                placeholder="e.g., Avoid prolonged weight on left wrist, mild disc bulge at L4-L5, avoid deep twisting..."
                className="w-full text-xs p-3 rounded-xl border border-border-ui focus:border-teal focus:ring-1 focus:ring-teal outline-none transition-all"
              />
            </div>
          </div>

          {/* Body Metrics & Live BMI Calculator */}
          <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                  <span>⚖️</span> Body Metrics & Live BMI Meter
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Keep your metrics updated to track posture, healthy weight, and appropriate physical pacing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Height Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Height
                  </label>
                  <div className="inline-flex rounded-lg border border-border-ui p-0.5 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => updateField('heightUnit', 'cm')}
                      className={`px-2 py-0.5 rounded ${formData.heightUnit === 'cm' ? 'bg-teal text-white' : 'text-text-secondary'}`}
                    >
                      cm
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('heightUnit', 'ft')}
                      className={`px-2 py-0.5 rounded ${formData.heightUnit === 'ft' ? 'bg-teal text-white' : 'text-text-secondary'}`}
                    >
                      ft / in
                    </button>
                  </div>
                </div>

                {formData.heightUnit === 'cm' ? (
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.heightCm}
                      onChange={(e) => updateField('heightCm', e.target.value)}
                      className="w-full p-2.5 text-sm font-bold border border-border-ui rounded-btn outline-none focus:border-teal"
                      placeholder="170"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-text-secondary font-bold">cm</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.heightFt}
                        onChange={(e) => updateField('heightFt', e.target.value)}
                        className="w-full p-2.5 text-sm font-bold border border-border-ui rounded-btn outline-none focus:border-teal"
                        placeholder="5"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-text-secondary font-bold">ft</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.heightIn}
                        onChange={(e) => updateField('heightIn', e.target.value)}
                        className="w-full p-2.5 text-sm font-bold border border-border-ui rounded-btn outline-none focus:border-teal"
                        placeholder="7"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-text-secondary font-bold">in</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Current & Target Weight */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Weight & Target
                  </label>
                  <div className="inline-flex rounded-lg border border-border-ui p-0.5 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => updateField('weightUnit', 'kg')}
                      className={`px-2 py-0.5 rounded ${formData.weightUnit === 'kg' ? 'bg-teal text-white' : 'text-text-secondary'}`}
                    >
                      kg
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('weightUnit', 'lbs')}
                      className={`px-2 py-0.5 rounded ${formData.weightUnit === 'lbs' ? 'bg-teal text-white' : 'text-text-secondary'}`}
                    >
                      lbs
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => updateField('weight', e.target.value)}
                      className="w-full p-2.5 text-sm font-bold border border-border-ui rounded-btn outline-none focus:border-teal"
                      placeholder="70"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-text-secondary font-bold">{formData.weightUnit}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.targetWeight}
                      onChange={(e) => updateField('targetWeight', e.target.value)}
                      className="w-full p-2.5 text-sm font-bold border border-border-ui rounded-btn outline-none focus:border-teal"
                      placeholder="65"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-text-secondary font-bold">Target</span>
                  </div>
                </div>
              </div>

              {/* BMI Gauge Display Card */}
              <div className="bg-surface-2 rounded-xl p-4 border border-border-ui text-center space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                  <span>Calculated BMI</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${bmiInfo.color}`}>
                    {bmiInfo.category}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-navy">
                  {bmiInfo.bmi > 0 ? bmiInfo.bmi : '--'}
                </div>
                {/* Visual bar */}
                <div className="w-full h-2 rounded-full bg-border-ui overflow-hidden">
                  <div
                    className="h-full bg-teal transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(10, bmiInfo.meterPercent))}%` }}
                  />
                </div>
                <p className="text-[10px] text-text-secondary">
                  Ideal Healthy Range: 18.5 – 24.9
                </p>
              </div>
            </div>
          </div>

          {/* Diet & Hydration Routine */}
          <div className="bg-white rounded-card border border-border-ui p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <span>🥗</span> Dietary Lifestyle & Hydration Goal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Diet */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Nutritional Approach
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DIET_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateField('diet', opt.id)}
                      className={`p-2.5 rounded-btn border text-xs font-bold text-left transition-all ${
                        formData.diet === opt.id
                          ? 'border-teal bg-teal text-white shadow-sm'
                          : 'border-border-ui hover:border-teal text-navy'
                      }`}
                    >
                      <p>{opt.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Water Intake */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Daily Hydration Target
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '< 1.5 Liters', label: 'Under 1.5 L' },
                    { id: '1.5 - 2.5 Liters', label: '1.5 – 2.5 L (Optimal)' },
                    { id: '2.5 - 3.5 Liters', label: '2.5 – 3.5 L' },
                    { id: '3.5+ Liters', label: '3.5+ L (High Active)' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => updateField('waterIntake', w.id)}
                      className={`p-2.5 rounded-btn border text-xs font-bold text-center transition-all ${
                        formData.waterIntake === w.id
                          ? 'border-teal bg-teal text-white shadow-sm'
                          : 'border-border-ui hover:border-teal text-navy'
                      }`}
                    >
                      <span>💧 {w.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TAB 3: IDENTITY & BIO ───────────────────────────────────── */}
      {activeTab === 'account' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-card border border-border-ui p-6 md:p-8 shadow-sm space-y-6"
        >
          <div>
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <span>👤</span> Yogi Profile & Identity
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Personalize your public display, member card, and community information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Full Display Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Ananya Sharma"
                className="w-full p-3 rounded-btn border border-border-ui text-sm font-semibold focus:border-teal focus:ring-1 focus:ring-teal outline-none"
              />
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Registered Email (Verified)
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full p-3 rounded-btn border border-border-ui bg-surface-2 text-sm text-text-secondary cursor-not-allowed font-medium"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-3 rounded-btn border border-border-ui text-sm font-semibold focus:border-teal focus:ring-1 focus:ring-teal outline-none"
              />
            </div>

            {/* Address / Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                City / Location
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="e.g., Rishikesh, India"
                className="w-full p-3 rounded-btn border border-border-ui text-sm font-semibold focus:border-teal focus:ring-1 focus:ring-teal outline-none"
              />
            </div>
          </div>

          {/* Personal Yoga Mantra / Intention */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Personal Yoga Mantra or Daily Intention
            </label>
            <input
              type="text"
              value={formData.mantra}
              onChange={(e) => updateField('mantra', e.target.value)}
              placeholder="e.g., Inhale calm, exhale tension."
              className="w-full p-3 rounded-btn border border-border-ui text-sm font-semibold focus:border-teal focus:ring-1 focus:ring-teal outline-none"
            />
          </div>

          {/* Bio / About */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              About Your Yoga Journey & Lifestyle
            </label>
            <textarea
              rows={3}
              value={formData.about}
              onChange={(e) => updateField('about', e.target.value)}
              placeholder="Tell instructors and fellow yogis what inspires your daily practice..."
              className="w-full p-3 rounded-xl border border-border-ui text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none"
            />
          </div>

          {/* Photo URL */}
          <div className="space-y-2 pt-2 border-t border-border-ui">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Avatar Image URL
              </label>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(true)}
                className="text-xs font-bold text-teal hover:underline flex items-center gap-1"
              >
                <span>🎨</span> Choose from Presets
              </button>
            </div>
            <input
              type="url"
              value={formData.photoURL}
              onChange={(e) => updateField('photoURL', e.target.value)}
              placeholder="https://example.com/my-photo.jpg"
              className="w-full p-3 rounded-btn border border-border-ui text-sm font-semibold focus:border-teal focus:ring-1 focus:ring-teal outline-none"
            />
          </div>
        </motion.div>
      )}

      {/* ── TAB 4: HABITS & NOTIFICATIONS ───────────────────────────── */}
      {activeTab === 'preferences' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-card border border-border-ui p-6 md:p-8 shadow-sm space-y-6"
        >
          <div>
            <h2 className="text-lg font-bold text-navy flex items-center gap-2">
              <span>🔔</span> Practice Habits & Class Preferences
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Customize reminders, email digests, and live stream camera settings.
            </p>
          </div>

          <div className="space-y-4 divide-y divide-border-ui">
            {/* Daily Practice Reminder */}
            <div className="pt-4 first:pt-0 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-navy">Daily Practice Notification</p>
                <p className="text-xs text-text-secondary">
                  Gentle nudge on your device to step on the mat at your favorite practice time.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {formData.notifications.dailyReminder && (
                  <input
                    type="time"
                    value={formData.notifications.reminderTime || '07:00'}
                    onChange={(e) => updateNestedNotification('reminderTime', e.target.value)}
                    className="p-1.5 border border-border-ui rounded text-xs font-bold text-navy"
                  />
                )}
                <button
                  type="button"
                  onClick={() => updateNestedNotification('dailyReminder', !formData.notifications.dailyReminder)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    formData.notifications.dailyReminder ? 'bg-teal' : 'bg-border-ui'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      formData.notifications.dailyReminder ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Daily Mindfulness Quote */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-navy">Daily Yoga Sutra & Mindfulness Quote</p>
                <p className="text-xs text-text-secondary">
                  Receive a daily inspirational reflection to center your thoughts and intentions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateNestedNotification('quoteNotification', !formData.notifications.quoteNotification)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  formData.notifications.quoteNotification ? 'bg-teal' : 'bg-border-ui'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    formData.notifications.quoteNotification ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Weekly Progress Digest */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-navy">Weekly Practice Digest via Email</p>
                <p className="text-xs text-text-secondary">
                  A summary of total minutes on the mat, class completions, and upcoming recommended live classes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateNestedNotification('emailDigest', !formData.notifications.emailDigest)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  formData.notifications.emailDigest ? 'bg-teal' : 'bg-border-ui'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    formData.notifications.emailDigest ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Live Class Default Camera Off */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-navy">Join Live Video Classes with Camera Off</p>
                <p className="text-xs text-text-secondary">
                  Join live interactive classes in private mode by default until you choose to enable your video.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateNestedNotification('defaultCameraOff', !formData.notifications.defaultCameraOff)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  formData.notifications.defaultCameraOff ? 'bg-teal' : 'bg-border-ui'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    formData.notifications.defaultCameraOff ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── TAB 5: SECURITY & DANGER ZONE (CHANGE PASSWORD & REMOVE ACCOUNT) ── */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Change Password Card */}
          <div className="bg-white rounded-card border border-border-ui p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                  <span>🔑</span> Change Password
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Update your login credentials. Use a strong password containing letters, numbers, and symbols.
                </p>
              </div>
            </div>

            {!isPasswordProvider ? (
              <div className="p-4 rounded-xl bg-blue-ai-100/50 border border-blue-ai/20 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
                  🌐
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-navy">Google Single Sign-On Active</p>
                  <p className="text-text-secondary leading-relaxed">
                    You authenticate via Google OAuth (<strong className="text-navy">{user?.email}</strong>). You do not need a local password on Yoga Master. To manage your password, please visit your Google Account Security settings.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      required
                      className="w-full p-3 rounded-btn border border-border-ui text-sm font-medium focus:border-teal focus:ring-1 focus:ring-teal outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-xs font-bold text-text-secondary hover:text-navy"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                      New Password
                    </label>
                    <span className="text-[11px] text-text-secondary">Min. 6 characters</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new secure password"
                      required
                      minLength={6}
                      className="w-full p-3 rounded-btn border border-border-ui text-sm font-medium focus:border-teal focus:ring-1 focus:ring-teal outline-none pr-12"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type your new password"
                      required
                      className={`w-full p-3 rounded-btn border text-sm font-medium focus:ring-1 outline-none pr-12 ${
                        confirmPassword && confirmPassword !== newPassword
                          ? 'border-error focus:border-error focus:ring-error/20'
                          : 'border-border-ui focus:border-teal focus:ring-teal'
                      }`}
                    />
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-[11px] text-error font-medium">Passwords do not match</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword || (confirmPassword && confirmPassword !== newPassword)}
                    className="px-5 py-2.5 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <span>🔒</span>
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Delete Account Card */}
          <div className="bg-white rounded-card border border-border-ui p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-ui pb-4">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-navy">
                  Delete Account
                </h2>
                <p className="text-xs text-text-secondary">
                  Permanently remove your account, profile, and all associated training records.
                </p>
              </div>
            </div>

            <div className="bg-surface-2/60 rounded-xl p-4 text-xs text-text-primary space-y-2 border border-border-ui/60">
              <p className="font-bold text-navy">Please note before proceeding:</p>
              <ul className="list-disc list-inside space-y-1 text-text-secondary pl-1">
                <li>Your personalized class recommendations, BMI history, and injury safeguards will be deleted.</li>
                <li>Your saved classes, enrolled courses, and training progress cannot be recovered.</li>
                <li>You can always create a new account in the future if you wish to rejoin.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-text-secondary italic">
                Need a break? You can simply sign out and your progress will remain saved.
              </p>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="px-4 py-2.5 border border-error/50 hover:bg-red-50 text-error text-xs font-bold rounded-btn transition-colors self-start sm:self-auto flex items-center gap-2 disabled:opacity-50"
              >
                {isDeletingAccount ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-error" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Deleting Account...</span>
                  </>
                ) : (
                  <span>Delete My Account</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── BOTTOM STICKY SAVE BAR ──────────────────────────────────── */}
      <div className="bg-white rounded-card border border-border-ui p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-teal"></span>
          <span>Preferences sync across your Dashboard, Recommendations, and AI Coach.</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/onboarding"
            className="text-xs font-bold text-navy hover:text-teal transition-colors px-3 py-2 border border-border-ui rounded-btn bg-surface"
          >
            Retake Full Quiz
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── AVATAR PICKER MODAL ─────────────────────────────────────── */}
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-card max-w-lg w-full p-6 space-y-4 shadow-2xl border border-border-ui"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-navy text-base">
                  Choose Profile Photo
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(false)}
                  className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-text-secondary hover:text-navy"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {AVATAR_PRESETS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => {
                      updateField('photoURL', avatar.url)
                      setShowAvatarPicker(false)
                    }}
                    className={`group relative rounded-xl overflow-hidden border-2 transition-all p-1 ${
                      formData.photoURL === avatar.url
                        ? 'border-teal ring-2 ring-teal'
                        : 'border-border-ui hover:border-teal'
                    }`}
                  >
                    <img
                      src={avatar.url}
                      alt={avatar.label}
                      className="w-full h-24 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <p className="text-[11px] font-bold text-center mt-1 text-navy truncate">
                      {avatar.label}
                    </p>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-border-ui text-right">
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(false)}
                  className="px-4 py-2 bg-surface-2 text-navy text-xs font-bold rounded-btn hover:bg-border-ui"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Profile
