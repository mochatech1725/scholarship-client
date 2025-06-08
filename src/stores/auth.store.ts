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

    if (!isInitialized.value) return false
    return auth0?.isAuthenticated?.value ?? false
  })

  const initialize = () => {

    // Don't re-initialize if already initialized
    if (isInitialized.value) {
      return
    }

    try {
      isInitialized.value = true
    } catch (err) {
      console.error('Failed to initialize auth store:', err)
      throw err
    }
  }

  const handleCallback = async () => {
   
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
      isInitialized.value = false
  
      if (!auth0) {
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
      console.log('Auth store - Logging out complete')
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
    isLoggingIn,
    initialize,
    login,
    logout,
    getToken,
    handleCallback
  }
}) 