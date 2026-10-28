import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const ONBOARDING_DRAFT_KEY = 'yoga_onboarding_draft'

/**
 * Get current pre-auth onboarding draft from sessionStorage
 */
export const getOnboardingDraft = () => {
  try {
    const draft = sessionStorage.getItem(ONBOARDING_DRAFT_KEY)
    return draft ? JSON.parse(draft) : null
  } catch (e) {
    return null
  }
}

/**
 * Save pre-auth onboarding draft to sessionStorage
 */
export const saveOnboardingDraft = (data) => {
  try {
    sessionStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save onboarding draft to sessionStorage', e)
  }
}

/**
 * Clear pre-auth onboarding draft from sessionStorage
 */
export const clearOnboardingDraft = () => {
  try {
    sessionStorage.removeItem(ONBOARDING_DRAFT_KEY)
  } catch (e) {}
}

/**
 * Sync pre-auth onboarding draft to MongoDB via backend API
 * after successful registration or login.
 */
export const syncOnboardingDraft = async (token) => {
  try {
    const draft = getOnboardingDraft()
    if (!draft || !token) return null

    const res = await axios.post(`${API_BASE_URL}/api/onboarding`, draft, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (res.data?.success) {
      clearOnboardingDraft()
      return res.data
    }
  } catch (err) {
    console.error('Error syncing onboarding draft to MongoDB:', err)
  }
  return null
}
