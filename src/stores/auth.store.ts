import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { waitForAuth0Initialization } from 'src/boot/auth0'
import type { User } from 'src/types'
import { useUserStore } from 'src/stores/user.store'
import { useAccountStore } from 'src/stores/account.store'

interface TokenMetadata {
  expiresAt: number
  tokenType: string
}

export type AuthStore = ReturnType<typeof useAuthStore>

export const useAuthStore = defineStore('auth', () => {
  const auth0 = useAuth0()
  const userStore = useUserStore()
  const accountStore = useAccountStore()
  const isInitialized = ref(false)
  const isLoggingIn = ref(false)
  const user = ref<User | null>(null)
  const tokenMetadata = ref<TokenMetadata | null>(null)

  const isUserAuthenticated = computed(() => {
    if (!isInitialized.value) return false
    return auth0?.isAuthenticated?.value ?? false
  })

  // Check if token is expired
  const isTokenExpired = computed(() => {
    if (!tokenMetadata.value) return true
    return Date.now() >= tokenMetadata.value.expiresAt
  })

  // Load session data from localStorage
  const loadSession = () => {
    try {
      const sessionData = localStorage.getItem('auth_session')
      if (sessionData) {
        const parsed = JSON.parse(sessionData)
        tokenMetadata.value = parsed.tokenMetadata
      }
    } catch (error) {
      console.error('Failed to load session:', error)
      clearSession()
    }
  }

  const saveSession = () => {
    try {
      const sessionData = {
        tokenMetadata: tokenMetadata.value,
        timestamp: Date.now()
      }
      localStorage.setItem('auth_session', JSON.stringify(sessionData))
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }

  const clearSession = () => {
    localStorage.removeItem('auth_session')
    tokenMetadata.value = null
  }

  // Update token metadata from Auth0
  const updateTokenMetadata = async () => {
    try {
      if (auth0?.isAuthenticated?.value) {
        // Get the token to ensure it's available (this triggers Auth0's token management)
        await auth0.getAccessTokenSilently()
        
        const expiresAt = Date.now() + (60 * 60 * 1000) // 1 hour from now
        
        tokenMetadata.value = {
          expiresAt,
          tokenType: 'Bearer'
        }
        
        saveSession()
        console.log('Token metadata updated, expires at:', new Date(expiresAt))
      }
    } catch (error) {
      console.error('Failed to update token metadata:', error)
    }
  }

  const initialize = async () => {
    if (isInitialized.value) return

    try {
      await waitForAuth0Initialization(auth0)
      
      // Load existing session data
      loadSession()
      
      // If user is authenticated, load user data from backend
      if (auth0?.isAuthenticated?.value && auth0.user.value) {
        try {
          const userData = await accountStore.getUserProfile()
          user.value = userData
          await updateTokenMetadata()
          // Only set initialized to true if backend loading succeeds
          isInitialized.value = true
        } catch (err) {
          console.error('Failed to load user profile:', err)
          // If backend authentication fails, reset the auth state
          isInitialized.value = false
          user.value = null
          userStore.clearUser()
          clearSession()
          throw err
        }
      } else {
        // If not authenticated, we can still initialize
        isInitialized.value = true
      }
    } catch (err) {
      console.error('Failed to initialize auth:', err)
      throw err
    }
  }

  const handleCallback = async () => {
    try {
      await waitForAuth0Initialization(auth0)
      
      // After successful authentication, load user data from backend
      if (auth0?.isAuthenticated?.value && auth0.user.value) {
        try {
          const userData = await accountStore.getUserProfile()
          user.value = userData
          await updateTokenMetadata()
          // Only set initialized to true if backend loading succeeds
          isInitialized.value = true
        } catch (err) {
          console.error('Failed to load user profile:', err)
          // If backend authentication fails, reset the auth state
          isInitialized.value = false
          user.value = null
          userStore.clearUser()
          clearSession()
          throw err
        }
      } else {
        // If not authenticated, we can still initialize
        isInitialized.value = true
      }
      return true
    } catch (err) {
      console.error('Failed to handle callback:', err)
      // Even if there's an error, we should still mark as initialized
      // so the app can continue and show appropriate error messages
      isInitialized.value = true
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
      isInitialized.value = false
      user.value = null
      userStore.clearUser()
      clearSession()
      await auth0.logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      })
    } catch (err) {
      console.error('Failed to logout:', err)
    }
  }

  const getToken = async () => {
    if (!auth0) return null

    try {
      // Check if token is expired and refresh if needed
      if (isTokenExpired.value) {
        console.log('Token expired, refreshing...')
        await updateTokenMetadata()
      }
      
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
        const userData = await accountStore.getUserProfile()
        user.value = userData
        await updateTokenMetadata()
      } catch (err) {
        console.error('Failed to refresh user:', err)
        // Don't throw here, just log the error
      }
    }
  }

  return {
    isInitialized,
    isLoggingIn,
    user,
    tokenMetadata,
    isAuthenticated: isUserAuthenticated,
    isTokenExpired,
    initialize,
    handleCallback,
    login,
    logout,
    getToken,
    refreshUser,
    updateTokenMetadata
  }
}) 