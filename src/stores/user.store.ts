import { defineStore } from 'pinia'
import type { User } from 'src/types'
import { apiService } from 'src/services/api.service'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null
  }),

  actions: {
    async loadUser(userId?: string) {
      try {
        console.log('loadUser called with userId:', userId)
        const user = await apiService.getUser(userId)
        this.user = user
        return user
      } catch (error) {
        console.error('Failed to load user from API:', error)
        throw error
      }
    },

    setUser(backendUser: User) {
      try {
        console.log('setUser called with backendUser:', backendUser)
        
        const user: User = {
          ...backendUser
        }
        
        console.log('Transformed user object:', user)
        
        this.user = user
        return user
      } catch (error) {
        console.error('Failed to load user from backend:', error)
        throw error
      }
    },

    async updateProfile(profile: User['profile']) {
      try {
        const updatedUser = await apiService.updateProfile(profile)
        this.user = updatedUser
        return updatedUser
      } catch (error) {
        console.error('Failed to update profile:', error)
        throw error
      }
    },

    clearUser() {
      this.user = null
    }
  }
}) 