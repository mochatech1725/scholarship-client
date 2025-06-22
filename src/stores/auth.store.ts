import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { waitForAuth0Initialization } from 'src/boot/auth0'
import type { User } from 'src/types'
import { useUserStore } from 'src/stores/user.store'
import { useAccountStore } from 'src/stores/account.store'

export type AuthStore = ReturnType<typeof useAuthStore>

export const useAuthStore = defineStore('auth', () => {
  const auth0 = useAuth0()
  const userStore = useUserStore()
  const accountStore = useAccountStore()
  const isInitialized = ref(false)
  const isLoggingIn = ref(false)
  const user = ref<User | null>(null)

  const isUserAuthenticated = computed(() => {
    if (!isInitialized.value) return false
    return auth0?.isAuthenticated?.value ?? false
  })

  const initialize = async () => {
    if (isInitialized.value) {
      return
    }

    try {
      console.log('Auth store: Initializing...')
      
      if (!auth0) {
        isInitialized.value = true
        return
      }
      
      await waitForAuth0Initialization(auth0)
      
      // If user is authenticated, load user data from server
      if (auth0?.isAuthenticated?.value && auth0.user.value) {
        try {
          const userData = await accountStore.authenticate()
          user.value = userData
          isInitialized.value = true
        } catch (err) {
          console.error('Failed to load user profile:', err)
          isInitialized.value = false
          user.value = null
          userStore.clearUser()
          throw err
        }
      } else {
        isInitialized.value = true
      }
    } catch (err) {
      console.error('Failed to initialize auth:', err)
      throw err
    }
  }

  const handleCallback = async () => {
    try {
      console.log('Auth store: Starting callback processing...')
      await waitForAuth0Initialization(auth0)
      
      // After successful authentication, load user data from backend
      if (auth0?.isAuthenticated?.value && auth0.user.value) {
        try {
          const userData = await accountStore.authenticate()
          user.value = userData
          isInitialized.value = true
        } catch (err) {
          console.error('Failed to load user profile:', err)
          // If backend authentication fails, reset the auth state
          isInitialized.value = false
          user.value = null
          userStore.clearUser()
          throw err
        }
      } else {
        // If not authenticated, we can still initialize
        isInitialized.value = true
      }
      return true
    } catch (err) {
      console.error('Failed to handle callback:', err)
      return false
    }
  }

  const login = async () => {
    if (!auth0) return false

    try {
      isLoggingIn.value = true
      await auth0.loginWithRedirect({
        appState: { 
          target: '/dashboard/applications'
        }
      })
      return true
    } catch (err) {
      console.error('Failed to login:', err)
      return false
    } finally {
      isLoggingIn.value = false
    }
  }

  const logout = async () => {
    if (!auth0) return

    try {
      // First, logout from the backend
      await accountStore.logout()
      
      // Then clear local state (but keep isInitialized true to prevent re-initialization)
      user.value = null
      userStore.clearUser()
      
      // Finally, logout from Auth0
      await auth0.logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      })
    } catch (err) {
      console.error('Failed to logout:', err)
      // Even if there's an error, we should still clear local state
      user.value = null
      userStore.clearUser()
    }
  }

  const register = async () => {
    if (!auth0) return false

    try {
      isLoggingIn.value = true
      
      // Use Auth0's signup flow by setting screen_hint to 'signup'
      await auth0.loginWithRedirect({
        appState: { 
          target: '/dashboard/applications'
        },
        authorizationParams: {
          screen_hint: 'signup'
        }
      })
      return true
    } catch (err) {
      console.error('Failed to register:', err)
      return false
    } finally {
      isLoggingIn.value = false
    }
  }

  const getToken = async () => {
    if (!auth0) return null

    try {
      return await auth0.getAccessTokenSilently()
    } catch (err) {
      console.error('Failed to get token:', err)
      return null
    }
  }

  // Method to refresh user data from backend
  const refreshUser = async () => {
    if (auth0?.isAuthenticated?.value) {
      try {
        const userData = await accountStore.authenticate()
        user.value = userData
      } catch (err) {
        console.error('Failed to refresh user:', err)
        // Don't throw here, just log the error
      }
    }
  }

  // Method to reset the store state (useful for testing or force refresh)
  const reset = () => {
    isInitialized.value = false
    isLoggingIn.value = false
    user.value = null
    userStore.clearUser()
    console.log('Auth store: Reset complete')
  }

  return {
    isInitialized,
    isLoggingIn,
    user,
    isAuthenticated: isUserAuthenticated,
    initialize,
    handleCallback,
    login,
    logout,
    register,
    getToken,
    refreshUser,
    reset
  }
}) 