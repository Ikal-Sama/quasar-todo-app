// Exposes Quasar's fetch wrapper as $api on the Vue instance, with a
// request interceptor that attaches the Sanctum Bearer token from
// the auth Pinia store. The api service in src/services/api.js is
// the only place that should import $api from this boot file.

import { defineBoot } from '#q-app'
import { useAuthStore } from '@/stores/auth-store'

// A WeakSet tag for requests that should skip the auth header.
// Currently unused, but kept for future external-API calls.
const AUTH_SKIP = new WeakSet()

function attachAuthHeader(url, init = {}) {
  const auth = useAuthStore()
  if (!auth.token) return init

  try {
    const target = new URL(url, window.location.origin)
    const allowedOrigin = import.meta.env.VITE_API_URL
      ? new URL(import.meta.env.VITE_API_URL).origin
      : 'http://127.0.0.1:8000'

    // Allow headers if hitting either local client origin OR your backend API origin
    if (target.origin !== window.location.origin && target.origin !== allowedOrigin) {
      return init
    }
  } catch {
    return init
  }

  init.headers = {
    ...(init.headers || {}),
    Authorization: `Bearer ${auth.token}`,
  }
  return init
}

// Module-scoped handle so non-Vue code (services/api.js) can call
// the wrapper without depending on the Vue global being ready at
// import-time.
export const $api = (url, init = {}) => {
  const tagged = AUTH_SKIP.has(init)
  if (!tagged) attachAuthHeader(url, init)
  return fetch(url, init)
}

export default defineBoot(({ app }) => {
  app.config.globalProperties.$api = $api
})
