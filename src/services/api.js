// Thin wrapper around Quasar's $api fetch helper that
// - prefixes the Laravel API base URL
// - parses JSON
// - throws an Error with a useful message + Laravel validation errors
//
// Callers should use the helpers below instead of touching $api directly
// so the auth boot file can intercept and attach the Bearer token.

import { $api } from '@/boot/api'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/'

async function parseResponse(res) {
  // 204 No Content
  if (res.status === 204) return null

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      data?.message ||
      (data?.errors ? Object.values(data.errors).flat().join(' ') : null) ||
      `Request failed with status ${res.status}`
    const error = new Error(message)
    error.status = res.status
    error.errors = data?.errors || null
    throw error
  }

  return data
}

function buildHeaders(body, extra) {
  const headers = {
    Accept: 'application/json',
    ...(extra || {}),
  }
  const isFormData = body instanceof FormData || extra?.body instanceof FormData
  if (body !== undefined && !isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  return headers
}

export const api = {
  get(path, { query, headers } = {}) {
    // 1. Build the full URL path cleanly using string template formatting
    let fullUrl = `${BASE_URL}${path}`

    // 2. Safely attach URL parameters if queries exist
    if (query) {
      const urlParams = new URLSearchParams()
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== '') {
          urlParams.set(key, value)
        }
      }
      const queryString = urlParams.toString()
      if (queryString) {
        fullUrl += `?${queryString}`
      }
    }

    // 3. Make the clean request out to the $api handler
    return $api(fullUrl, {
      method: 'GET',
      headers: buildHeaders(undefined, headers),
    }).then(parseResponse)
  },

  post(path, body, { headers } = {}) {
    return $api(BASE_URL + path, {
      method: 'POST',
      // FIX: Pass body first, then headers object
      headers: buildHeaders(body, headers),
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }).then(parseResponse)
  },

  put(path, body, { headers } = {}) {
    return $api(BASE_URL + path, {
      method: 'PUT',
      // FIX: Pass body first, then headers object
      headers: buildHeaders(body, headers),
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }).then(parseResponse)
  },

  patch(path, body, { headers } = {}) {
    return $api(BASE_URL + path, {
      method: 'PATCH',
      // FIX: Pass body first, then headers object
      headers: buildHeaders(body, headers),
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }).then(parseResponse)
  },

  delete(path, { headers } = {}) {
    return $api(BASE_URL + path, {
      method: 'DELETE',
      // Fix DELETE header build
      headers: buildHeaders(undefined, headers),
    }).then(parseResponse)
  },
}

export default api
