import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from '@/services/api'

const TOKEN_KEY = 'quasar-note-app:auth-token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },

  actions: {
    setToken(token) {
      this.token = token
      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
      } else {
        localStorage.removeItem(TOKEN_KEY)
      }
    },

    async login(credentials) {
      const data = await api.post('login', credentials)
      this.setToken(data.token || data.access_token)
      this.user = data.user || null
      // Sanctum /api/user expects the token we just stored to be set,
      // which the api boot file does on the next request.
      if (!this.user) {
        await this.fetchUser()
      }
      return data
    },

    async register(payload) {
      const data = await api.post('register', payload)
      this.setToken(data.token || data.access_token)
      this.user = data.user || null
      if (!this.user) {
        await this.fetchUser()
      }
      return data
    },

    async fetchUser() {
      const user = await api.get('user')
      this.user = user
      return user
    },

    async logout() {
      try {
        await api.post('logout')
      } catch {
        // ignore — we'll clear local state regardless
      }
      this.setToken(null)
      this.user = null
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
