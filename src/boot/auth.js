// On app boot:
// - load the current user if a token is already in localStorage
//   so the layout can show the user's name without a hard reload
// - if the token is rejected (401), clear it
//
// Note: this boot file runs after `api` so $api is available.

import { defineBoot } from '#q-app'
import { useAuthStore } from '@/stores/auth-store'

export default defineBoot(async () => {
  const auth = useAuthStore()
  if (!auth.token) return

  try {
    await auth.fetchUser()
  } catch (err) {
    if (err.status === 401) {
      auth.setToken(null)
      auth.user = null
    }
  }
})
