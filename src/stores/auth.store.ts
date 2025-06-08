import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { waitForAuth0Initialization } from 'src/boot/auth0'

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
  const isLoggingOut = ref(false)
  const isLoggingIn = ref(false)

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
    console.log('Checking isAuthenticated:', {
      isInitialized: isInitialized.value,
      isLoggingOut: isLoggingOut.value,
      auth0Authenticated: auth0?.isAuthenticated?.value
    })
    if (!isInitialized.value || isLoggingOut.value) return false
    return auth0?.isAuthenticated?.value ?? false
  })

  const initialize = async () => {
    console.log('Auth store - Initialize called with state:', {
      isLoggingOut: isLoggingOut.value,
      isLoggingIn: isLoggingIn.value,
      isInitialized: isInitialized.value,
      isAuthenticated: auth0.isAuthenticated.value,
      isLoading: auth0.isLoading.value,
      user: auth0.user.value
    })

    // Don't re-initialize if already initialized
    if (isInitialized.value) {
      console.log('Auth store - Already initialized')
      return
    }

    // Don't initialize if we're logging out
    if (isLoggingOut.value) {
      console.log('Auth store - Not initializing because we are logging out')
      return
    }

    try {
      console.log('Auth store - Waiting for Auth0 initialization')
      await waitForAuth0Initialization(auth0)
      isInitialized.value = true
      console.log('Auth store initialized:', {
        isAuthenticated: auth0.isAuthenticated.value,
        isLoading: auth0.isLoading.value,
        user: auth0.user.value,
        isInitialized: isInitialized.value
      })
    } catch (err) {
      console.error('Failed to initialize auth store:', err)
      throw err
    }
  }

  const handleCallback = async () => {
    // Don't handle callback if we're logging out
    if (isLoggingOut.value) {
      console.log('Auth store - Not handling callback because we are logging out')
      return false
    }

    try {
      await waitForAuth0Initialization(auth0)
      return isInitialized.value = true
    } catch (err) {
      console.error('Failed to handle callback:', err)
      return false
    }
  }

  const login = async () => {
    if (!auth0) {
      console.log('auth.store - auth0 not initialized')
      return false
    }
    try {
      isLoggingIn.value = true
      await auth0.loginWithRedirect({
        appState: { 
          target: '/dashboard/applications'
        }
      })
      return true
    } catch (err) {
      console.error('Login failed:', err)
      return false
    } finally {
      isLoggingIn.value = false
    }
  }

  const logout = async () => {
   
    try {
      console.log('Auth store - Starting logout process')
      isLoggingOut.value = true
      isInitialized.value = false
  
      if (!auth0) {
        console.error('Auth0 not initialized')
        return
      }

      await auth0.logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      })
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      isLoggingOut.value = false
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
    isLoggingOut,
    isLoggingIn,
    initialize,
    login,
    logout,
    getToken,
    handleCallback
  }
}) 