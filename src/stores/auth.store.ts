import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
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
  const isInitialized = ref(false)

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
    if (!isInitialized.value) return false
    return auth0?.isAuthenticated?.value ?? false
  })

  const initialize = async () => {
    if (isInitialized.value) return

    try {
      console.log('Initializing auth store...')
      
      // Wait for Auth0 to finish loading
      while (auth0.isLoading.value) {
        console.log('Auth store - Waiting for Auth0 to finish loading...')
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Force a session check
      await auth0.checkSession()
      console.log('Auth store - Session checked')

      // Wait for authentication state to be properly set
      let attempts = 0
      const maxAttempts = 20
      while (!auth0.isAuthenticated.value && attempts < maxAttempts) {
        console.log('Auth store - Waiting for authentication state...', {
          attempt: attempts + 1,
          isAuthenticated: auth0.isAuthenticated.value,
          isLoading: auth0.isLoading.value,
          user: auth0.user.value
        })
        await new Promise(resolve => setTimeout(resolve, 250))
        attempts++
      }

      isInitialized.value = true
      console.log('Auth store initialized:', {
        isAuthenticated: auth0.isAuthenticated.value,
        user: auth0.user.value
      })
    } catch (err) {
      console.error('Failed to initialize auth store:', err)
      throw err
    }
  }

  const login = async () => {
    if (!auth0) {
      console.log('auth.store - auth0 not initialized')
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
    isInitialized,
    initialize,
    login,
    logout,
    getToken
  }
}) 