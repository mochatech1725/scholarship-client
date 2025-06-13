import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { waitForAuth0Initialization } from 'src/boot/auth0'
import type { User } from 'src/types'
import { useUserStore } from 'src/stores/user.store'

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
      
      // If user is authenticated, set user data from Auth0
      if (auth0?.isAuthenticated?.value && auth0.user.value) {
        const auth0User = auth0.user.value
        await userStore.loadUser(auth0User.sub || '')
        user.value = userStore.user
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
      
      // After successful authentication, set user data from Auth0
      if (auth0?.isAuthenticated?.value && auth0.user.value) {
        const auth0User = auth0.user.value
        await userStore.loadUser(auth0User.sub || '')
        user.value = userStore.user
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
      isInitialized.value = false
      user.value = null
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

  return {
    isInitialized,
    isLoggingIn,
    user,
    isAuthenticated: isUserAuthenticated,
    initialize,
    handleCallback,
    login,
    logout,
    getToken
  }
}) 