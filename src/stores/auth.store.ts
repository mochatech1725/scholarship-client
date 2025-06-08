import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

interface User {
  personId: string
  firstName: string
  lastName: string
  emailAddress: string
  phoneNumber?: string | undefined
}

export const useAuthStore = defineStore('auth', () => {
  const auth0 = useAuth0()

  const userInfo = computed<User | null>(() => {
    if (!auth0?.user?.value) return null
    const user = auth0.user.value
    return {
      personId: user.sub || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      emailAddress: user.email || '',
      phoneNumber: user.phoneNumber
    }
  })

  const isAuthenticated = computed(() => {
    return auth0?.isAuthenticated?.value ?? false
  })

  const login = async () => {
    if (!auth0) {
      console.error('Auth0 not initialized')
      return false
    }
    try {
      await auth0.loginWithRedirect({
        appState: { 
          target: '/dashboard/applications'
        }
      })
      return true
    } catch (err) {
      console.error('Login failed:', err)
      return false
    }
  }

  const logout = async () => {
    if (!auth0) {
      console.error('Auth0 not initialized')
      return
    }
    try {
      await auth0.logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      })
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const getToken = async () => {
    if (!auth0) {
      console.error('Auth0 not initialized')
      return null
    }
    try {
      const token = await auth0.getAccessTokenSilently()
      return token
    } catch (err) {
      console.error('Failed to get token:', err)
      return null
    }
  }

  return {
    user: userInfo,
    isAuthenticated,
    login,
    logout,
    getToken
  }
}) 