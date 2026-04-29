import api from '@/lib/api'
import { User } from '@/types'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface RefreshResponse {
  access: string
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login/', data)
    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register/', data)
    return response.data
  },

  async me(): Promise<User> {
    const response = await api.get<User>('/auth/me/')
    return response.data
  },

  async refresh(refresh_token: string): Promise<RefreshResponse> {
    const response = await api.post<RefreshResponse>('/auth/refresh/', {
      refresh: refresh_token,
    })
    return response.data
  },
}

