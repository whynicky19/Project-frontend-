import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  role: string
  is_active: boolean
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    init() {
      if (import.meta.client) {
        const token = localStorage.getItem('access_token')
        const user = localStorage.getItem('user')
        if (token) this.token = token
        if (user) this.user = JSON.parse(user)
      }
    },

    setAuth(token: string, user: User) {
      this.token = token
      this.user = user
      if (import.meta.client) {
        localStorage.setItem('access_token', token)
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    logout() {
      this.token = null
      this.user = null
      if (import.meta.client) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
      }
      navigateTo('/login')
    },
  },
})
