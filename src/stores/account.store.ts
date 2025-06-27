import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, Auth0User } from 'src/types'
import { useUserStore } from 'src/stores/user.store'
import { apiService } from 'src/services/api.service'

export const useAccountStore = defineStore('account', () => {
  const userStore = useUserStore()
  const isLoading = ref(false)

  const authenticate = async () => {
    try {
      isLoading.value = true
      const response = await apiService.login()
      console.log('Login response:', response)
      
      return userStore.setUser(response.user)
    } catch (err) {
      console.error('Failed to authenticate user:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (auth0User: Auth0User) => {
    try {
      isLoading.value = true
      const registerData = {
        userId: auth0User.sub,
        emailAddress: auth0User.emailAddress,
      }
      
      await apiService.register(registerData)
      
      // After registration, fetch the complete user profile from MongoDB
      const userProfileResponse = await apiService.getUser()
      //console.log('User profile response after registration:', userProfileResponse)
      
      return userStore.setUser(userProfileResponse.user)
    } catch (err) {
      console.error('Failed to register user:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getUserProfile = async () => {
    try {
      isLoading.value = true
      const response = await apiService.getUser()
      
      return  userStore.setUser(response.user)
    } catch (err) {
      console.error('Failed to load user profile:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (profile: User['profile']) => {
    try {
      isLoading.value = true
      return await userStore.updateProfile(profile)
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      isLoading.value = true
      // Call backend API to logout
      await apiService.logout()
      console.log('User logged out from server')
    } catch (err) {
      console.error('Failed to logout from server:', err)
      // Don't throw here - we still want to clear local state even if server logout fails
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    authenticate,
    register,
    getUserProfile,
    updateProfile,
    logout
  }
}) 