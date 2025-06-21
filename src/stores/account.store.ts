import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from 'src/types'
import { useUserStore } from 'src/stores/user.store'
import { apiService } from 'src/services/api.service'

export const useAccountStore = defineStore('account', () => {
  const userStore = useUserStore()
  const isLoading = ref(false)

  const authenticate = async () => {
    try {
      isLoading.value = true
      // Call backend API to authenticate and get/create user profile
      const response = await apiService.login()
      
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

  return {
    isLoading,
    authenticate,
    getUserProfile,
    updateProfile
  }
}) 