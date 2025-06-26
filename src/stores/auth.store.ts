import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { waitForAuth0Initialization } from 'src/boot/auth0'
import type { User } from 'src/types'
import { useUserStore } from 'src/stores/user.store'
import { useAccountStore } from 'src/stores/account.store'

interface TokenInfo {
  expiresAt: number
  issuedAt: number
}

export type AuthStore = ReturnType<typeof useAuthStore>

export const useAuthStore = defineStore('auth', () => {
  const auth0 = useAuth0()
  const userStore = useUserStore()
  const accountStore = useAccountStore()
  const isInitialized = ref(false)
  const isLoggingIn = ref(false)
  const user = ref<User | null>(null)
  const tokenInfo = ref<TokenInfo | null>(null)
  const tokenExpiryCheckInterval = ref<number | null>(null)

  const isUserAuthenticated = computed(() => {
    if (!isInitialized.value) return false
    return auth0?.isAuthenticated?.value ?? false
  })

  // Check if token is expired (for UI purposes)
  const isTokenExpired = computed(() => {
    if (!tokenInfo.value) return true
    return Date.now() >= tokenInfo.value.expiresAt
  })

  // Get time until token expires (in minutes)
  const timeUntilExpiry = computed(() => {
    if (!tokenInfo.value) return 0
    const timeLeft = tokenInfo.value.expiresAt - Date.now()
    return Math.max(0, Math.floor(timeLeft / (1000 * 60)))
  })

  // Check if token will expire soon (within 5 minutes)
  const isTokenExpiringSoon = computed(() => {
    return timeUntilExpiry.value <= 5 && timeUntilExpiry.value > 0
  })

  // Update token info when we get a new token
  const updateTokenInfo = async () => {
    try {
      if (auth0?.isAuthenticated?.value) {
        // Get the token to ensure it's available
        const token = await auth0.getAccessTokenSilently()
        
        if (token) {
          // Decode the JWT to get expiration time
          const parts = token.split('.')
          if (parts.length === 3 && parts[1]) {
            // Decode base64url to base64, then decode
            const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
            const payload = JSON.parse(atob(base64))
            const expiresAt = payload.exp * 1000 // Convert to milliseconds
            const issuedAt = payload.iat * 1000
            
            tokenInfo.value = {
              expiresAt,
              issuedAt
            }
            
            console.log('Token info updated, expires at:', new Date(expiresAt))
          }
        }
      }
    } catch (error) {
      console.error('Failed to update token info:', error)
    }
  }

  // Handle token expiry by attempting to refresh
  const handleTokenExpiry = async () => {
    console.log('Token expired, attempting to refresh...')
    
    try {
      // Try to get a new token silently
      const newToken = await auth0.getAccessTokenSilently()
      if (newToken) {
        await updateTokenInfo()
        console.log('Token refreshed successfully')
        return true
      }
    } catch (error) {
      console.error('Failed to refresh token:', error)
      
      // If silent refresh fails, redirect to login
      if (error instanceof Error && error.message.includes('login_required')) {
        console.log('Silent refresh failed, redirecting to login...')
        await login()
        return false
      }
    }
    
    return false
  }

  // Start monitoring token expiry
  const startTokenExpiryMonitoring = () => {
    // Clear any existing interval
    if (tokenExpiryCheckInterval.value) {
      clearInterval(tokenExpiryCheckInterval.value)
    }

    // Check every 30 seconds
    tokenExpiryCheckInterval.value = window.setInterval(() => {
      void (async () => {
        if (isTokenExpired.value && auth0?.isAuthenticated?.value) {
          console.log('Token expired detected, attempting refresh...')
          await handleTokenExpiry()
        } else if (isTokenExpiringSoon.value) {
          console.log('Token expiring soon, attempting proactive refresh...')
          await updateTokenInfo()
        }
      })()
    }, 30000) // 30 seconds
  }

  // Stop monitoring token expiry
  const stopTokenExpiryMonitoring = () => {
    if (tokenExpiryCheckInterval.value) {
      clearInterval(tokenExpiryCheckInterval.value)
      tokenExpiryCheckInterval.value = null
    }
  }

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
          await updateTokenInfo()
          startTokenExpiryMonitoring()
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
          await updateTokenInfo()
          startTokenExpiryMonitoring()
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
      // Stop token monitoring
      stopTokenExpiryMonitoring()
      
      // First, logout from the backend
      await accountStore.logout()
      
      // Then clear local state (but keep isInitialized true to prevent re-initialization)
      user.value = null
      userStore.clearUser()
      tokenInfo.value = null
      
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
      tokenInfo.value = null
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
      const token = await auth0.getAccessTokenSilently()
      
      // Update token info when we get a fresh token
      await updateTokenInfo()
      
      return token
    } catch (err) {
      console.error('Failed to get token:', err)
      
      // If the error is about missing refresh token, redirect to login
      if (err instanceof Error && err.message && err.message.includes('Missing Refresh Token')) {
        console.log('Refresh token missing, redirecting to login...')
        await login()
        return null
      }
      
      return null
    }
  }

  // Method to refresh user data from backend
  const refreshUser = async () => {
    if (auth0?.isAuthenticated?.value) {
      try {
        // Add a small delay to prevent rapid successive calls
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const userData = await accountStore.authenticate()
        user.value = userData
        await updateTokenInfo()
      } catch (err) {
        console.error('Failed to refresh user:', err)
        // Don't throw here, just log the error
      }
    }
  }

  // Method to reset the store state (useful for testing or force refresh)
  const reset = () => {
    stopTokenExpiryMonitoring()
    isInitialized.value = false
    isLoggingIn.value = false
    user.value = null
    userStore.clearUser()
    tokenInfo.value = null
    console.log('Auth store: Reset complete')
  }

  // Clean up on component unmount
  onUnmounted(() => {
    stopTokenExpiryMonitoring()
  })

  return {
    isInitialized,
    isLoggingIn,
    user,
    tokenInfo,
    isAuthenticated: isUserAuthenticated,
    isTokenExpired,
    isTokenExpiringSoon,
    timeUntilExpiry,
    initialize,
    handleCallback,
    login,
    logout,
    register,
    getToken,
    refreshUser,
    reset,
    updateTokenInfo,
    handleTokenExpiry
  }
}) 