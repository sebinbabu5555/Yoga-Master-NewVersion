import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import GoogleLogin from '../../components/headers/Social/GoogleLogin'
import useAuth from '../../hooks/useAuth'
import { getOnboardingDraft, syncOnboardingDraft } from '../../ultilities/onboardingSync'
import { API_BASE_URL } from '../../config/api'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { login, error, setError, setLoader } = useAuth()
  const hasOnboardingDraft = !!getOnboardingDraft()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const data = new FormData(e.target)
    const { email, password } = Object.fromEntries(data)

    login(email, password)
      .then(async (userCredential) => {
        const user = userCredential?.user
        let token = localStorage.getItem('token')
        if (!token && user?.email) {
          try {
            const tokenRes = await axios.post(`${API_BASE_URL}/api/set-token`, {
              email: user.email,
              name: user.displayName || user.email.split('@')[0]
            })
            token = tokenRes.data?.token
            if (token) localStorage.setItem('token', token)
          } catch (e) {
            console.error('Failed to get token during login:', e)
          }
        }

        const draft = getOnboardingDraft()
        if (draft && token) {
          await syncOnboardingDraft(token)
          navigate('/dashboard/recommendations')
        } else {
          navigate(location.state?.from || '/dashboard')
        }
      })
      .catch((err) => {
        setError(err.code)
        setLoader(false)
        setLoading(false)
      })
  }

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Left: form */}
      <div className="flex-1 flex flex-col px-6 py-8 sm:py-12 overflow-y-auto">
        <div className="max-w-md mx-auto w-full my-auto">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-7 h-7 rounded-lg bg-teal flex items-center justify-center transition-transform group-hover:scale-105">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 12H8v-1c0-2.21 3.58-4 4-4s4 1.79 4 4v1z" fill="white"/>
              </svg>
            </div>
            <span className="text-navy font-bold text-base group-hover:text-teal transition-colors">Yoga Master</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-1 tracking-tight">Welcome back</h1>
          <p className="text-sm text-text-secondary mb-6">Sign in to continue your training.</p>

          {hasOnboardingDraft && (
            <div className="mb-4 p-3 bg-teal-100/60 border border-teal/40 rounded-lg text-xs text-navy font-semibold flex items-center gap-2">
              <span className="text-sm">✨</span>
              <span>Your onboarding answers are saved! Sign in to view your personalized class recommendations.</span>
            </div>
          )}

        {error && (
          <div className="mb-4 px-4 py-3 bg-error/10 border border-error/30 rounded-lg text-sm text-error font-medium">
            {error === 'auth/invalid-credential' || error === 'auth/wrong-password'
              ? 'Incorrect email or password.'
              : error === 'auth/user-not-found'
              ? 'No account found with this email.'
              : 'Sign in failed. Please try again.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-text-primary mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 text-sm border border-border-ui rounded-btn focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all bg-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-xs font-bold text-text-primary">Password</label>
              <button type="button" className="text-xs text-teal font-semibold hover:text-teal-600 transition-colors">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 text-sm border border-border-ui rounded-btn focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all bg-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  {showPassword
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeWidth="2"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="2"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-teal text-white text-sm font-bold rounded-btn hover:bg-teal-600 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-border-ui"></div>
          <span className="text-xs text-text-secondary font-medium">or</span>
          <div className="flex-1 h-px bg-border-ui"></div>
        </div>

        <GoogleLogin />

        <p className="text-sm text-text-secondary text-center mt-6">
          Don't have an account?{' '}
          <Link to="/onboarding" className="font-bold text-teal hover:text-teal-600 transition-colors">
            Get started
          </Link>
        </p>
        </div>
      </div>

      {/* Right: brand panel */}
      <div className="hidden lg:flex flex-1 bg-navy items-center justify-center p-12">
        <div className="text-center text-white max-w-sm">
          <p className="text-4xl mb-6">🏃</p>
          <h2 className="text-2xl font-bold mb-3">Ready for today's session?</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Pick up where you left off. Your classes, plan, and progress are waiting.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-left">
            {[
              { label: 'Classes', value: '200+' },
              { label: 'Instructors', value: '40+' },
              { label: 'Active learners', value: '8k+' },
              { label: 'Goal completion', value: '87%' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-xl font-bold text-teal">{value}</p>
                <p className="text-xs text-white/50 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
