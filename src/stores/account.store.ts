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
      
      const userData = userStore.setUser(response.user)
      
      console.log('User authenticated and loaded from server:', userData)
      return userData
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
      // Call backend API to register new user
      const registerData = {
        userId: auth0User.sub,
        emailAddress: auth0User.emailAddress,
      }
      
      const response = await apiService.register(registerData)
      console.log('Register response:', response)
      
      // After registration, fetch the complete user profile from MongoDB
      const userProfileResponse = await apiService.getUser()
      console.log('User profile response after registration:', userProfileResponse)
      
      const registeredUser = userStore.setUser(userProfileResponse.user)
      
      console.log('User registered and loaded from server:', registeredUser)
      return registeredUser
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
      // Call backend API to get user profile
      const response = await apiService.getUser()
      
      const userData = userStore.setUser(response.user)
      
      console.log('User profile loaded from server:', userData)
      return userData
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
      const updatedUser = await userStore.updateProfile(profile)
      return updatedUser
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