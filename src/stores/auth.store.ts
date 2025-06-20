import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { waitForAuth0Initialization } from 'src/boot/auth0'
import type { User } from 'src/types'
import { useUserStore } from 'src/stores/user.store'

// Import the API service
import { apiService } from 'src/services/api.service'

export type AuthStore = ReturnType<typeof useAuthStore>

export const useAuthStore = defineStore('auth', () => {
  const auth0 = useAuth0()
  const userStore = useUserStore()
  const isInitialized = ref(false)
  const isLoggingIn = ref(false)
  const user = ref<User | null>(null)

  const isUserAuthenticated = computed(() => {
    if (!isInitialized.value) return false
    return auth0?.isAuthenticated?.value ?? false
  })

  const initialize = async () => {
    if (isInitialized.value) return

    try {
      await waitForAuth0Initialization(auth0)
      isInitialized.value = true
      
      // If user is authenticated, load user data from backend
      if (auth0?.isAuthenticated?.value && auth0.user.value) {
        await loadUserFromBackend()
      }
    } catch (err) {
      console.error('Failed to initialize auth:', err)
      throw err
    }
  }

  const handleCallback = async () => {
    try {
      await waitForAuth0Initialization(auth0)
      isInitialized.value = true
      
      // After successful authentication, load user data from backend
      if (auth0?.isAuthenticated?.value && auth0.user.value) {
        await loadUserFromBackend()
      }
      return true
    } catch (err) {
      console.error('Failed to handle callback:', err)
      return false
    }
  }

  const loadUserFromBackend = async () => {
    try {
      // Call backend API to get/create user profile
      const response = await apiService.getProfile()
      
      // Update user store with backend data
      userStore.loadUserFromBackend(response.user)
      user.value = userStore.user
      
      console.log('User loaded from backend:', response.user)
    } catch (err) {
      console.error('Failed to load user from backend:', err)
      // Fallback to Auth0 user data if backend fails
      const auth0User = auth0.user.value
      if (auth0User) {
        await userStore.loadUser(auth0User.sub || '')
        user.value = userStore.user
      }
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
      return await auth0.getAccessTokenSilently()
    } catch (err) {
      console.error('Failed to get token:', err)
      return null
    }
  }

  // Method to refresh user data from backend
  const refreshUser = async () => {
    if (auth0?.isAuthenticated?.value) {
      await loadUserFromBackend()
    }
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
    getToken,
    refreshUser
  }
}) 