import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'
import { getOnboardingDraft, saveOnboardingDraft, clearOnboardingDraft } from '../../ultilities/onboardingSync'
import { API_BASE_URL } from '../../config/api'

// Option Card Helper Component
const OptionCard = ({ selected, onClick, title, description, icon }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left p-4 rounded-card border transition-all duration-200 flex items-center justify-between ${
      selected
        ? 'border-teal bg-teal-100/50 shadow-sm ring-2 ring-teal ring-opacity-50'
        : 'border-border-ui bg-surface hover:border-teal/50 hover:bg-surface-2/60'
    }`}
  >
    <div className="flex items-center gap-3.5">
      {icon && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
          selected ? 'bg-teal text-white' : 'bg-surface-2 text-navy'
        }`}>
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-bold text-navy text-sm md:text-base">{title}</h3>
        {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
      </div>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
      selected ? 'border-teal bg-teal' : 'border-border-ui'
    }`}>
      {selected && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  </button>
)

// Multi-select toggle chip for injury areas
const ToggleChip = ({ selected, onClick, label, icon }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-btn border text-sm font-semibold transition-all duration-200 ${
      selected
        ? 'border-teal bg-teal text-white shadow-sm'
        : 'border-border-ui bg-surface text-navy hover:border-teal/50 hover:bg-surface-2/60'
    }`}
  >
    {icon && <span>{icon}</span>}
    {label}
  </button>
)

const Onboarding = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(false)

  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    yogaExperience: '',
    primaryGoal: '',
    yogaStyle: '',
    fitnessLevel: '',
    diet: '',
    waterIntake: '',
    hasInjuries: '',
    injuryAreas: [],
    injuryDetails: '',
    heightUnit: 'cm',
    heightCm: '170',
    heightFt: '5',
    heightIn: '7',
    weightUnit: 'kg',
    weight: '70',
    targetWeight: '65',
    preferredDuration: '30'
  })

  useEffect(() => {
    const existingDraft = getOnboardingDraft()
    if (existingDraft) {
      setFormData((prev) => ({
        ...prev,
        ...existingDraft,
        injuryAreas: existingDraft.injuryAreas || [],
        heightCm: existingDraft.heightUnit === 'cm' && typeof existingDraft.height === 'string' ? existingDraft.height : prev.heightCm,
        heightFt: existingDraft.heightUnit === 'ft' && existingDraft.height?.ft ? existingDraft.height.ft : prev.heightFt,
        heightIn: existingDraft.heightUnit === 'ft' && existingDraft.height?.in ? existingDraft.height.in : prev.heightIn
      }))
      setProfileLoaded(true)
      return
    }

    if (user?.email) {
      const token = localStorage.getItem('token')
      if (!token) { setProfileLoaded(true); return }
      axios
        .get(`${API_BASE_URL}/api/user/onboarding`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          const p = res.data?.onboardingProfile
          if (p) {
            setFormData((prev) => ({
              ...prev,
              age: p.age || '',
              gender: p.gender || '',
              yogaExperience: p.yogaExperience || '',
              primaryGoal: p.primaryGoal || '',
              yogaStyle: p.yogaStyle || '',
              fitnessLevel: p.fitnessLevel || '',
              diet: p.diet || '',
              waterIntake: p.waterIntake || '',
              hasInjuries: p.hasInjuries || '',
              injuryAreas: p.injuryAreas || [],
              injuryDetails: p.injuryDetails || '',
              heightUnit: p.heightUnit || 'cm',
              heightCm: p.heightUnit === 'cm' ? String(p.height || '170') : '170',
              heightFt: p.heightUnit === 'ft' && p.height?.ft ? String(p.height.ft) : '5',
              heightIn: p.heightUnit === 'ft' && p.height?.in ? String(p.height.in) : '7',
              weightUnit: p.weightUnit || 'kg',
              weight: String(p.weight || '70'),
              targetWeight: String(p.targetWeight || '65'),
              preferredDuration: String(p.preferredDuration || '30')
            }))
          }
        })
        .catch(() => {})
        .finally(() => setProfileLoaded(true))
    } else {
      setProfileLoaded(true)
    }
  }, [user])

  const yogaStyleMap = {
    'Stress Relief & Mental Wellness': [
      { id: 'Restorative', label: 'Restorative Yoga', desc: 'Passive poses held long to deeply relax the nervous system' },
      { id: 'Yin Yoga', label: 'Yin Yoga', desc: 'Floor-based, long-hold stretches targeting connective tissue' },
      { id: 'Yoga Nidra', label: 'Yoga Nidra', desc: 'Guided meditative sleep for profound mental reset' }
    ],
    'Build Flexibility & Mobility': [
      { id: 'Hatha', label: 'Hatha Yoga', desc: 'Classic postures with emphasis on alignment and flexibility' },
      { id: 'Yin Yoga', label: 'Yin Yoga', desc: 'Deep stretch through long-held passive poses' },
      { id: 'Ashtanga', label: 'Ashtanga Yoga', desc: 'Dynamic flowing sequences that deepen range of motion' }
    ],
    'Strength & Toning': [
      { id: 'Power Yoga', label: 'Power Yoga', desc: 'High-intensity flow building full-body strength' },
      { id: 'Ashtanga', label: 'Ashtanga Yoga', desc: 'Structured progressive series with bodyweight challenges' },
      { id: 'Vinyasa', label: 'Vinyasa Flow', desc: 'Continuous movement sequences building endurance and tone' }
    ],
    'Weight Management': [
      { id: 'Vinyasa', label: 'Vinyasa Flow', desc: 'Flowing cardio-style yoga to burn calories' },
      { id: 'Power Yoga', label: 'Power Yoga', desc: 'High-energy sessions for metabolism boost' },
      { id: 'Bikram', label: 'Bikram / Hot Yoga', desc: 'Heated practice for maximum caloric burn' }
    ],
    'Posture Correction & Alignment': [
      { id: 'Hatha Alignment', label: 'Hatha Alignment', desc: 'Structural alignment and posture awareness for spine and shoulders' },
      { id: 'Desk Reset Flow', label: 'Desk Reset Flow', desc: 'Targeted mobility to counteract sitting and forward-head posture' },
      { id: 'Core & Spine Stability', label: 'Core & Spine Stability', desc: 'Deep stabilizer work to support spinal alignment' }
    ],
    'Spiritual Growth & Mindfulness': [
      { id: 'Hatha Alignment', label: 'Hatha Alignment', desc: 'Structural alignment and posture awareness for spine and shoulders' },
      { id: 'Desk Reset Flow', label: 'Desk Reset Flow', desc: 'Targeted mobility to counteract sitting and forward-head posture' },
      { id: 'Core & Spine Stability', label: 'Core & Spine Stability', desc: 'Deep stabilizer work to support spinal alignment' }
    ],
    'Post-Injury Recovery & Rehabilitation': [
      { id: 'Restorative', label: 'Restorative Yoga', desc: 'Supported, gentle poses that encourage healing' },
      { id: 'Chair Yoga', label: 'Chair Yoga', desc: 'Accessible seated and standing sequences for limited mobility' },
      { id: 'Therapeutic', label: 'Therapeutic Yoga', desc: 'Targeted sequences guided by injury type' }
    ]
  }

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

  const updateField = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'primaryGoal' && prev.primaryGoal !== value) {
        updated.yogaStyle = ''
      }
      return updated
    })
  }

  const toggleInjuryArea = (areaId) => {
    setFormData((prev) => {
      const exists = prev.injuryAreas.includes(areaId)
      return {
        ...prev,
        injuryAreas: exists ? prev.injuryAreas.filter((a) => a !== areaId) : [...prev.injuryAreas, areaId]
      }
    })
  }

  const getLiveBMI = () => {
    let heightInM = 0
    let weightInKg = 0
    if (formData.heightUnit === 'ft') {
      const ft = Number(formData.heightFt) || 0
      const inch = Number(formData.heightIn) || 0
      heightInM = (ft * 12 + inch) * 0.0254
    } else {
      heightInM = (Number(formData.heightCm) || 0) / 100
    }
    if (formData.weightUnit === 'lbs') {
      weightInKg = (Number(formData.weight) || 0) * 0.45359237
    } else {
      weightInKg = Number(formData.weight) || 0
    }
    if (!heightInM || heightInM <= 0 || !weightInKg || weightInKg <= 0) return { bmi: 0, category: 'Enter details' }
    const val = weightInKg / (heightInM * heightInM)
    const bmi = Math.round(val * 10) / 10
    let category = 'Normal weight'
    if (bmi < 18.5) category = 'Underweight'
    else if (bmi < 25) category = 'Normal weight'
    else if (bmi < 30) category = 'Overweight'
    else category = 'Obese'
    return { bmi, category }
  }

  const isStepValid = () => {
    switch (step) {
      case 1: return !!formData.age
      case 2: return !!formData.gender
      case 3: return !!formData.yogaExperience
      case 4: return !!formData.primaryGoal
      case 5: return !!formData.yogaStyle
      case 6: return !!formData.fitnessLevel
      case 7: return !!formData.diet
      case 8: return !!formData.waterIntake
      case 9:
        if (!formData.hasInjuries) return false
        if (formData.hasInjuries === 'Yes' && formData.injuryAreas.length === 0) return false
        return true
      case 10:
        if (formData.heightUnit === 'cm') {
          if (!formData.heightCm || Number(formData.heightCm) <= 0) return false
        } else {
          if (!formData.heightFt || Number(formData.heightFt) < 0) return false
        }
        if (!formData.weight || Number(formData.weight) <= 0) return false
        if (!formData.targetWeight || Number(formData.targetWeight) <= 0) return false
        if (!formData.preferredDuration) return false
        return true
      case 11: return true
      default: return false
    }
  }

  const buildPayload = () => {
    const heightVal = formData.heightUnit === 'cm'
      ? formData.heightCm
      : { ft: formData.heightFt, in: formData.heightIn }
    return {
      age: formData.age,
      gender: formData.gender,
      yogaExperience: formData.yogaExperience,
      primaryGoal: formData.primaryGoal,
      yogaStyle: formData.yogaStyle,
      fitnessLevel: formData.fitnessLevel,
      diet: formData.diet,
      waterIntake: formData.waterIntake,
      hasInjuries: formData.hasInjuries,
      injuryAreas: formData.injuryAreas,
      injuryDetails: formData.injuryDetails,
      height: heightVal,
      heightUnit: formData.heightUnit,
      weight: formData.weight,
      weightUnit: formData.weightUnit,
      targetWeight: formData.targetWeight,
      preferredDuration: formData.preferredDuration
    }
  }

  const handleSubmit = async () => {
    const payload = buildPayload()
    if (user && user.email) {
      setSubmitting(true)
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No authentication token found. Please sign in again.')
        const res = await axios.post(`${API_BASE_URL}/api/onboarding`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data?.success) {
          clearOnboardingDraft()
          Swal.fire({
            icon: 'success',
            title: 'Profile Saved!',
            text: 'Your personalized yoga onboarding is complete. Here are your recommendations!',
            confirmButtonColor: '#12B8A6',
            timer: 2000
          })
          navigate('/dashboard/recommendations')
        }
      } catch (err) {
        console.error('Error submitting onboarding:', err)
        const msg = err.response?.data?.message || err.message || 'Something went wrong saving your profile.'
        if (err.response?.status === 401 || err.response?.status === 403) {
          Swal.fire({
            icon: 'warning',
            title: 'Session Expired',
            text: 'Your session has expired. Please sign in again to save your profile.',
            confirmButtonColor: '#12B8A6',
            confirmButtonText: 'Sign In'
          }).then(() => navigate('/login'))
        } else {
          Swal.fire({ icon: 'error', title: 'Submission Failed', text: msg, confirmButtonColor: '#12B8A6' })
        }
      } finally {
        setSubmitting(false)
      }
    } else {
      saveOnboardingDraft(payload)
      Swal.fire({
        icon: 'success',
        title: 'Answers Saved!',
        text: 'Please create your free account or sign in to view your personalized recommendations.',
        confirmButtonColor: '#12B8A6',
        confirmButtonText: 'Continue to Sign Up',
        timer: 2500
      }).then(() => navigate('/register', { state: { fromOnboarding: true } }))
    }
  }

  const TOTAL_STEPS = 11
  const progressPercent = Math.round((step / TOTAL_STEPS) * 100)
  const liveBMI = getLiveBMI()

  return (
    <div className="min-h-screen bg-bg-base py-8 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-card border border-border-ui shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-border-ui">
          <div className="flex items-center justify-between gap-4 mb-3">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-teal flex items-center justify-center transition-transform group-hover:scale-105">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 12H8v-1c0-2.21 3.58-4 4-4s4 1.79 4 4v1z" fill="white"/>
                </svg>
              </div>
              <span className="text-navy font-bold text-sm">Yoga Master</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary hidden sm:inline">Already have an account?</span>
              <Link to="/login" className="text-xs font-bold text-teal hover:text-teal-600 transition-colors px-2 py-1 rounded hover:bg-teal-100/50">Sign In</Link>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">Step {step} of {TOTAL_STEPS}</span>
            <span className="text-xs font-semibold text-text-secondary">{progressPercent}% Completed</span>
          </div>
          <div className="w-full bg-surface-2 rounded-full h-2 overflow-hidden">
            <div className="bg-teal h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex-1"
            >
              {/* STEP 1: Age */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Select your Age Group</h2>
                  <p className="text-sm text-text-secondary mb-6">Helps us tailor yoga flow intensity and pose modifications to your life stage.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {['18-29', '30-39', '40-49', '50+'].map((ageOpt) => (
                      <OptionCard key={ageOpt} title={ageOpt} selected={formData.age === ageOpt} onClick={() => updateField('age', ageOpt)} icon="🎂" />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Gender */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">What is your Gender?</h2>
                  <p className="text-sm text-text-secondary mb-6">Used to personalize physiological recommendations and breathing guidance.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'Male', label: 'Male', icon: '👨' },
                      { id: 'Female', label: 'Female', icon: '👩' },
                      { id: 'Non-binary', label: 'Non-binary / Other', icon: '🧑' },
                      { id: 'Prefer not to say', label: 'Prefer not to say', icon: '🙈' }
                    ].map((g) => (
                      <OptionCard key={g.id} title={g.label} selected={formData.gender === g.id} onClick={() => updateField('gender', g.id)} icon={g.icon} />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Yoga Experience */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Your Yoga Experience Level</h2>
                  <p className="text-sm text-text-secondary mb-6">We will recommend classes and poses matching your current level of practice.</p>
                  <div className="space-y-3">
                    {[
                      { id: 'Complete Beginner', label: 'Complete Beginner', desc: 'I have never done yoga before or have very limited experience', icon: '🌱' },
                      { id: 'Beginner', label: 'Beginner', desc: 'I know a few basic poses and have practiced occasionally', icon: '🌿' },
                      { id: 'Intermediate', label: 'Intermediate', desc: 'I practice regularly and can hold most foundational poses', icon: '🧘' },
                      { id: 'Advanced', label: 'Advanced', desc: 'I have an established practice and can perform challenging asanas', icon: '🏆' }
                    ].map((exp) => (
                      <OptionCard key={exp.id} title={exp.label} description={exp.desc} selected={formData.yogaExperience === exp.id} onClick={() => updateField('yogaExperience', exp.id)} icon={exp.icon} />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Primary Yoga Goal */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">What is your Primary Yoga Goal?</h2>
                  <p className="text-sm text-text-secondary mb-6">Your main intention will shape your personalized class and pose recommendations.</p>
                  <div className="space-y-3">
                    {[
                      { id: 'Stress Relief & Mental Wellness', label: 'Stress Relief & Mental Wellness', desc: 'Calm the mind, reduce anxiety and improve emotional balance', icon: '🧠' },
                      { id: 'Build Flexibility & Mobility', label: 'Build Flexibility & Mobility', desc: 'Deepen stretches, loosen joints and improve range of motion', icon: '🤸' },
                      { id: 'Strength & Toning', label: 'Strength & Toning', desc: 'Build core strength, endurance and lean muscle through asanas', icon: '💪' },
                      { id: 'Weight Management', label: 'Weight Management', desc: 'Burn calories, boost metabolism and support a healthy weight', icon: '⚖️' },
                      { id: 'Posture Correction & Alignment', label: 'Posture Correction & Alignment', desc: 'Target forward-head tilt, rounded shoulders and spinal alignment', icon: '🧍' },
                      { id: 'Post-Injury Recovery & Rehabilitation', label: 'Post-Injury Recovery & Rehabilitation', desc: 'Gentle, targeted practice to heal and rebuild safely', icon: '🩹' }
                    ].map((g) => (
                      <OptionCard key={g.id} title={g.label} description={g.desc} selected={formData.primaryGoal === g.id} onClick={() => updateField('primaryGoal', g.id)} icon={g.icon} />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: Preferred Yoga Style (Dynamic) */}
              {step === 5 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Preferred Yoga Style</h2>
                  <p className="text-sm text-text-secondary mb-6">Choose the yoga tradition that resonates most with your goal of <strong>{formData.primaryGoal}</strong>.</p>
                  <div className="space-y-3">
                    {(yogaStyleMap[formData.primaryGoal] || []).map((style) => (
                      <OptionCard key={style.id} title={style.label} description={style.desc} selected={formData.yogaStyle === style.id} onClick={() => updateField('yogaStyle', style.id)} />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: Physical Activity Level */}
              {step === 6 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Current Physical Activity Level</h2>
                  <p className="text-sm text-text-secondary mb-6">Helps us gauge the right intensity and pacing for your yoga sessions.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      { id: 'Sedentary', label: 'Sedentary', desc: 'Little to no regular physical activity', icon: '🛋️' },
                      { id: 'Lightly Active', label: 'Lightly Active', desc: 'Light walks or exercise 1-2 days per week', icon: '🚶' },
                      { id: 'Moderately Active', label: 'Moderately Active', desc: 'Moderate exercise or activity 3-4 days per week', icon: '🏃' },
                      { id: 'Very Active', label: 'Very Active', desc: 'Intense daily exercise or physically demanding lifestyle', icon: '⚡' }
                    ].map((fl) => (
                      <OptionCard key={fl.id} title={fl.label} description={fl.desc} selected={formData.fitnessLevel === fl.id} onClick={() => updateField('fitnessLevel', fl.id)} icon={fl.icon} />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: Diet */}
              {step === 7 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Dietary Lifestyle</h2>
                  <p className="text-sm text-text-secondary mb-6">Helps align holistic wellness, energy management and recovery guidance with your yoga practice.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      { id: 'Vegetarian', label: 'Vegetarian', icon: '🥗' },
                      { id: 'Vegan', label: 'Vegan', icon: '🌱' },
                      { id: 'Keto', label: 'Keto', icon: '🥑' },
                      { id: 'Non-vegetarian', label: 'Non-vegetarian', icon: '🍗' },
                      { id: 'Other', label: 'Other / Flexible', icon: '🍽️' }
                    ].map((d) => (
                      <OptionCard key={d.id} title={d.label} selected={formData.diet === d.id} onClick={() => updateField('diet', d.id)} icon={d.icon} />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: Water Intake */}
              {step === 8 && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Daily Water Intake</h2>
                  <p className="text-sm text-text-secondary mb-6">Adequate hydration supports joint flexibility, muscle recovery and pranayama breathing during yoga.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      { id: '1-2 Liters', label: '1 - 2 Liters', desc: 'Mild hydration' },
                      { id: '2-3 Liters', label: '2 - 3 Liters', desc: 'Recommended baseline' },
                      { id: '3-4 Liters', label: '3 - 4 Liters', desc: 'High active hydration' },
                      { id: '4+ Liters', label: '4+ Liters', desc: 'Intense daily hydration' }
                    ].map((w) => (
                      <OptionCard key={w.id} title={w.label} description={w.desc} selected={formData.waterIntake === w.id} onClick={() => updateField('waterIntake', w.id)} icon="💧" />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 9: Injuries & Safety */}
              {step === 9 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Injuries & Areas to Protect</h2>
                    <p className="text-sm text-text-secondary">This helps us avoid poses that could aggravate existing injuries and suggest safe modifications throughout your practice.</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-bold text-navy">Do you currently have any injuries or chronic pain?</p>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard
                        title="Yes, I have injuries / pain"
                        selected={formData.hasInjuries === 'Yes'}
                        onClick={() => updateField('hasInjuries', 'Yes')}
                        icon="🩹"
                      />
                      <OptionCard
                        title="No, I am injury-free"
                        selected={formData.hasInjuries === 'No'}
                        onClick={() => setFormData((prev) => ({ ...prev, hasInjuries: 'No', injuryAreas: [], injuryDetails: '' }))}
                        icon="✅"
                      />
                    </div>
                  </div>

                  {formData.hasInjuries === 'Yes' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                        <span className="text-base mt-0.5">⚠️</span>
                        <p className="text-xs text-amber-800 font-medium">
                          Always consult a medical professional before starting yoga with existing injuries. Your instructor will be informed to suggest safe modifications.
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy mb-2.5">Select all affected areas <span className="text-teal font-semibold">(select at least one)</span></p>
                        <div className="flex flex-wrap gap-2">
                          {INJURY_AREAS.map((area) => (
                            <ToggleChip key={area.id} label={area.label} icon={area.icon} selected={formData.injuryAreas.includes(area.id)} onClick={() => toggleInjuryArea(area.id)} />
                          ))}
                        </div>
                      </div>
                      {formData.injuryAreas.length > 0 && (
                        <div className="bg-teal-100/50 border border-teal/20 rounded-xl p-3">
                          <p className="text-xs font-bold text-teal-700 mb-1">Poses involving these areas will be flagged for modification:</p>
                          <p className="text-xs text-teal-800">{formData.injuryAreas.join(', ')}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-1.5">
                          Any additional details? <span className="font-normal normal-case">(optional)</span>
                        </label>
                        <textarea
                          rows={2}
                          value={formData.injuryDetails}
                          onChange={(e) => updateField('injuryDetails', e.target.value)}
                          placeholder="e.g. Herniated disc at L4-L5, avoid deep forward folds and inversions..."
                          className="w-full px-3.5 py-2.5 rounded-btn border border-border-ui bg-white text-navy text-sm focus:outline-none focus:border-teal resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {formData.hasInjuries === 'No' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2.5">
                      <span className="text-lg">🎉</span>
                      <p className="text-xs text-green-800 font-medium">
                        Great! You will have access to the full range of poses and sequences. You can always update this later if needed.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 10: Body Measurements */}
              {step === 10 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Body Measurements & Session Target</h2>
                    <p className="text-sm text-text-secondary">We will automatically calculate your Body Mass Index (BMI) to better align pose intensity.</p>
                  </div>
                  <div className="bg-surface-2/60 p-4 rounded-card border border-border-ui space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Height</label>
                      <div className="inline-flex rounded-lg border border-border-ui bg-white p-0.5">
                        <button type="button" onClick={() => updateField('heightUnit', 'cm')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${formData.heightUnit === 'cm' ? 'bg-teal text-white' : 'text-text-secondary hover:text-navy'}`}>cm</button>
                        <button type="button" onClick={() => updateField('heightUnit', 'ft')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${formData.heightUnit === 'ft' ? 'bg-teal text-white' : 'text-text-secondary hover:text-navy'}`}>ft / in</button>
                      </div>
                    </div>
                    {formData.heightUnit === 'cm' ? (
                      <input type="number" value={formData.heightCm} onChange={(e) => updateField('heightCm', e.target.value)} placeholder="Height in cm (e.g. 175)" className="w-full px-3.5 py-2.5 rounded-btn border border-border-ui bg-white text-navy font-semibold focus:outline-none focus:border-teal" />
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-text-secondary font-semibold">Feet</label>
                          <input type="number" value={formData.heightFt} onChange={(e) => updateField('heightFt', e.target.value)} placeholder="ft" className="w-full px-3 py-2 rounded-btn border border-border-ui bg-white text-navy font-semibold focus:outline-none focus:border-teal" />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-secondary font-semibold">Inches</label>
                          <input type="number" value={formData.heightIn} onChange={(e) => updateField('heightIn', e.target.value)} placeholder="in" className="w-full px-3 py-2 rounded-btn border border-border-ui bg-white text-navy font-semibold focus:outline-none focus:border-teal" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-surface-2/60 p-4 rounded-card border border-border-ui space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Weight & Target</label>
                      <div className="inline-flex rounded-lg border border-border-ui bg-white p-0.5">
                        <button type="button" onClick={() => updateField('weightUnit', 'kg')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${formData.weightUnit === 'kg' ? 'bg-teal text-white' : 'text-text-secondary hover:text-navy'}`}>kg</button>
                        <button type="button" onClick={() => updateField('weightUnit', 'lbs')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${formData.weightUnit === 'lbs' ? 'bg-teal text-white' : 'text-text-secondary hover:text-navy'}`}>lbs</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-text-secondary font-semibold">Current Weight ({formData.weightUnit})</label>
                        <input type="number" value={formData.weight} onChange={(e) => updateField('weight', e.target.value)} placeholder={`Current (${formData.weightUnit})`} className="w-full px-3 py-2 rounded-btn border border-border-ui bg-white text-navy font-semibold focus:outline-none focus:border-teal" />
                      </div>
                      <div>
                        <label className="text-[10px] text-text-secondary font-semibold">Target Weight ({formData.weightUnit})</label>
                        <input type="number" value={formData.targetWeight} onChange={(e) => updateField('targetWeight', e.target.value)} placeholder={`Target (${formData.weightUnit})`} className="w-full px-3 py-2 rounded-btn border border-border-ui bg-white text-navy font-semibold focus:outline-none focus:border-teal" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-2/60 p-4 rounded-card border border-border-ui space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Preferred Daily Yoga Session Duration</label>
                    <div className="grid grid-cols-5 gap-2">
                      {['10', '20', '30', '45', '60'].map((mins) => (
                        <button key={mins} type="button" onClick={() => updateField('preferredDuration', mins)} className={`py-2 text-xs font-bold rounded-btn border transition-all ${formData.preferredDuration === mins ? 'bg-teal text-white border-teal shadow-sm' : 'bg-white text-navy border-border-ui hover:border-teal/50'}`}>
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>
                  {liveBMI.bmi > 0 && (
                    <div className="bg-navy text-white p-4 rounded-card flex items-center justify-between">
                      <div>
                        <p className="text-xs text-teal-100 font-semibold uppercase tracking-wider">Calculated BMI Preview</p>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-2xl font-extrabold">{liveBMI.bmi}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-teal/30 text-teal-100">{liveBMI.category}</span>
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-text-secondary">Standard formula calculation</div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 11: Review & Summary */}
              {step === 11 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-navy mb-1">Review & Complete Profile</h2>
                    <p className="text-sm text-text-secondary">
                      {user ? 'Confirm your details to save to your account and generate custom yoga recommendations.' : 'Confirm your details to unlock customized yoga recommendations!'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-surface-2/70 p-3 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-text-secondary">Age & Gender</p>
                      <p className="text-sm font-bold text-navy mt-0.5">{formData.age} - {formData.gender}</p>
                    </div>
                    <div className="bg-surface-2/70 p-3 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-text-secondary">Yoga Experience</p>
                      <p className="text-sm font-bold text-navy mt-0.5">{formData.yogaExperience}</p>
                    </div>
                    <div className="bg-surface-2/70 p-3 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-text-secondary">Primary Goal</p>
                      <p className="text-sm font-bold text-navy mt-0.5">{formData.primaryGoal}</p>
                    </div>
                    <div className="bg-surface-2/70 p-3 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-text-secondary">Yoga Style</p>
                      <p className="text-sm font-bold text-navy mt-0.5">{formData.yogaStyle}</p>
                    </div>
                    <div className="bg-surface-2/70 p-3 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-text-secondary">Activity Level</p>
                      <p className="text-sm font-bold text-navy mt-0.5">{formData.fitnessLevel}</p>
                    </div>
                    <div className="bg-surface-2/70 p-3 rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-text-secondary">Diet & Water</p>
                      <p className="text-sm font-bold text-navy mt-0.5">{formData.diet} - {formData.waterIntake}</p>
                    </div>
                    <div className={`p-3 rounded-xl col-span-2 sm:col-span-3 ${formData.hasInjuries === 'Yes' ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
                      <p className="text-[10px] uppercase font-bold text-text-secondary">Injuries & Safety</p>
                      {formData.hasInjuries === 'Yes' ? (
                        <div className="mt-0.5">
                          <p className="text-sm font-bold text-amber-800">⚠️ Injury areas flagged for modification</p>
                          <p className="text-xs text-amber-700 mt-0.5">{formData.injuryAreas.join(', ')}</p>
                          {formData.injuryDetails && <p className="text-xs text-amber-600 mt-1 italic">"{formData.injuryDetails}"</p>}
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-green-700 mt-0.5">✅ No injuries - full practice access</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-teal-100/60 p-4 rounded-card border border-teal/30 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase font-bold text-teal-600">Calculated Body Mass Index (BMI)</p>
                      <p className="text-2xl font-black text-navy mt-0.5">
                        {liveBMI.bmi} <span className="text-sm font-bold text-teal-600">({liveBMI.category})</span>
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Daily Target: {formData.preferredDuration} mins yoga - Weight Goal: {formData.targetWeight} {formData.weightUnit}
                      </p>
                    </div>
                    <div className="text-3xl">🧘‍♂️</div>
                  </div>
                  {!user && (
                    <div className="p-3 bg-blue-ai-100/40 rounded-xl border border-blue-ai/20 text-xs text-navy flex items-center gap-2.5">
                      <span className="text-base">💡</span>
                      <span>Next, you will be prompted to create your free account or sign in to save this profile and access your recommendations.</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 pt-4 border-t border-border-ui flex items-center justify-between">
            {step > 1 ? (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="px-5 py-2.5 border border-border-ui hover:border-teal rounded-btn text-sm font-bold text-text-secondary hover:text-teal transition-colors">Back</button>
            ) : (
              <button type="button" onClick={() => navigate('/')} className="px-5 py-2.5 border border-border-ui hover:border-text-secondary rounded-btn text-sm font-bold text-text-secondary transition-colors">Back to Home</button>
            )}
            {step < TOTAL_STEPS ? (
              <button type="button" disabled={!isStepValid()} onClick={() => setStep((s) => s + 1)} className={`px-6 py-2.5 rounded-btn text-sm font-bold text-white transition-all shadow-sm ${isStepValid() ? 'bg-teal hover:bg-teal-600' : 'bg-border-ui cursor-not-allowed opacity-60'}`}>
                Next Step
              </button>
            ) : (
              <button type="button" disabled={submitting} onClick={handleSubmit} className="px-6 py-2.5 bg-teal hover:bg-teal-600 text-white rounded-btn text-sm font-bold transition-all shadow-md flex items-center gap-2">
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <span>{user ? 'Complete Onboarding & View Classes' : 'Continue to Register & Save'}</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
