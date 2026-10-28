import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import GoogleLogin from '../../components/headers/Social/GoogleLogin'
import { AuthContext } from '../../ultilities/providers/AuthProvider'
import axios from 'axios'
import { updateProfile } from 'firebase/auth'
import { getOnboardingDraft, syncOnboardingDraft } from '../../ultilities/onboardingSync'
import { API_BASE_URL } from '../../config/api'

const inputClass =
  'w-full px-4 py-2.5 text-sm border border-border-ui rounded-btn focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all bg-white'
const labelClass = 'block text-xs font-bold text-text-primary mb-1.5'
const errorClass = 'text-xs text-error mt-1'

const friendlyError = (code) => {
  switch (code) {
    case 'auth/email-already-in-use': return 'This email is already registered. Try signing in instead.'
    case 'auth/invalid-email': return 'Please enter a valid email address.'
    case 'auth/weak-password': return 'Password is too weak. Use at least 6 characters.'
    case 'auth/operation-not-allowed': return 'Email/password sign-up is not enabled. Contact support.'
    case 'auth/network-request-failed': return 'Network error. Check your internet connection and try again.'
    default: return code ? `Error: ${code}` : 'Something went wrong. Please try again.'
  }
}

const Register = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signUp, error, setError } = useContext(AuthContext)
  const hasOnboardingDraft = !!getOnboardingDraft() || !!location.state?.fromOnboarding
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const password = watch('password', '')

  const onSubmit = async (data) => {
    setError('')
    try {
      const result = await signUp(data.email, data.password)
      const user = result.user
      if (user) {
        await updateProfile(user, { displayName: data.name, photoURL: data.photoUrl || '' })
        const userPayload = {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL || '',
          role: 'user',
          gender: data.gender,
          phone: data.phone,
          address: data.address,
        }
        await axios.post(`${API_BASE_URL}/new-user`, userPayload)

        // Get authentication token and store in localStorage
        const tokenRes = await axios.post(`${API_BASE_URL}/api/set-token`, {
          email: user.email,
          name: user.displayName
        })
        const token = tokenRes.data?.token
        if (token) {
          localStorage.setItem('token', token)
        }

        // If pre-registration onboarding answers exist, persist them to MongoDB
        const draft = getOnboardingDraft()
        if (draft && token) {
          await syncOnboardingDraft(token)
          setError('')
          navigate('/dashboard/recommendations')
        } else {
          setError('')
          navigate('/dashboard')
        }
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.code || 'unknown')
    }
  }

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Left: brand panel */}
      <div className="hidden lg:flex flex-1 bg-navy items-center justify-center p-12">
        <div className="text-white max-w-sm">
          <p className="text-4xl mb-6">🎯</p>
          <h2 className="text-2xl font-bold mb-3">Let's find the right training plan for you</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Join thousands of learners building better strength, mobility, and consistency with Yoga Master.
          </p>
          <div className="space-y-3">
            {[
              'Access 200+ classes instantly',
              'Get a personalized weekly plan',
              'Book sessions with certified instructors',
              'Track your progress over time',
            ].map(item => (
              <div key={item} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-teal/20 flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#12B8A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-sm text-white/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex flex-col px-4 sm:px-8 py-8 sm:py-12 overflow-y-auto">
        <div className="max-w-md mx-auto w-full my-auto">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-7 h-7 rounded-lg bg-teal flex items-center justify-center transition-transform group-hover:scale-105">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 12H8v-1c0-2.21 3.58-4 4-4s4 1.79 4 4v1z" fill="white"/>
              </svg>
            </div>
            <span className="text-navy font-bold text-base group-hover:text-teal transition-colors">Yoga Master</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-1 tracking-tight">Create your account</h1>
          <p className="text-sm text-text-secondary mb-4">Get started in under 2 minutes.</p>

          {hasOnboardingDraft && (
            <div className="mb-4 p-3 bg-teal-100/60 border border-teal/40 rounded-lg text-xs text-navy font-semibold flex items-center gap-2">
              <span className="text-sm">✨</span>
              <span>Your onboarding answers are saved! Finish creating your account to view your personalized class recommendations.</span>
            </div>
          )}

          {error && (
            <div className="mb-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
              {friendlyError(error)}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="name" className={labelClass}>Full name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Alex Johnson"
                  {...register('name', { required: 'Name is required' })}
                  className={inputClass}
                />
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email is required' })}
                  className={inputClass}
                />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="password" className={labelClass}>Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min. 6 characters' } })}
                  className={inputClass}
                />
                {errors.password && <p className={errorClass}>{errors.password.message}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: v => v === password || 'Passwords do not match',
                  })}
                  className={inputClass}
                />
                {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="phone" className={labelClass}>Phone</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+91 00000 00000"
                  {...register('phone', { required: 'Phone is required' })}
                  className={inputClass}
                />
                {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="gender" className={labelClass}>Gender</label>
                <select
                  id="gender"
                  {...register('gender', { required: 'Select gender' })}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Prefer not to say</option>
                </select>
                {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="photoUrl" className={labelClass}>Photo URL <span className="text-text-secondary font-normal">(optional)</span></label>
              <input
                id="photoUrl"
                type="url"
                placeholder="https://..."
                {...register('photoUrl')}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="address" className={labelClass}>Address</label>
              <textarea
                id="address"
                rows={2}
                placeholder="Your city / country"
                {...register('address', { required: 'Address is required' })}
                className={`${inputClass} resize-none`}
              />
              {errors.address && <p className={errorClass}>{errors.address.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-teal text-white text-sm font-bold rounded-btn hover:bg-teal-600 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-border-ui"></div>
            <span className="text-xs text-text-secondary font-medium">or</span>
            <div className="flex-1 h-px bg-border-ui"></div>
          </div>

          <GoogleLogin />

          <p className="text-sm text-text-secondary text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-teal hover:text-teal-600 transition-colors">
              Sign in
            </Link>
          </p>

          <p className="text-xs text-text-secondary text-center mt-2">
            Want custom class recommendations first?{' '}
            <Link to="/onboarding" className="font-semibold text-teal hover:text-teal-600 transition-colors">
              Take the 1-min Assessment
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
