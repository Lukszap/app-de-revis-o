'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
  user: User | null
  access_token: string | null
  refresh_token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, access_token: string, refresh_token: string) => void
  logout: () => void
  setUser: (user: User) => void
  setAccessToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      access_token: null,
      refresh_token: null,
      isAuthenticated: false,
      
      setAuth: (user, access_token, refresh_token) => {
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        localStorage.setItem('user', JSON.stringify(user))
        set({ user, access_token, refresh_token, isAuthenticated: true })
      },
      
      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        set({ user: null, access_token: null, refresh_token: null, isAuthenticated: false })
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      },
      
      setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user))
        set({ user })
      },
      
      setAccessToken: (token) => {
        localStorage.setItem('access_token', token)
        set({ access_token: token })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

