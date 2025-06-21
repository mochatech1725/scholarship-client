import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from 'src/types'
import { useUserStore } from 'src/stores/user.store'
import { apiService } from 'src/services/api.service'

export const useAccountStore = defineStore('account', () => {
  const userStore = useUserStore()
  const isLoading = ref(false)

  const getUserProfile = async () => {
    try {
      isLoading.value = true
      // Call backend API to get/create user profile
      const response = await apiService.getProfile()
      
      const userData = userStore.setUser(response.user)
      
      console.log('User loaded from server:', userData)
      return userData
    } catch (err) {
      console.error('Failed to load user from server:', err)
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
    getUserProfile,
    updateProfile
  }
}) 