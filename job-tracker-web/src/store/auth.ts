import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../service'

export interface AuthState {
  token: string | null

  // Actions
  loginUser: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,

      loginUser: async () => {
        const loginRes = await authService.loginUser()

        set({
          token: loginRes.data.token
        })
      }
    }),
    { name: 'job-tracker-auth' }
  )
)
