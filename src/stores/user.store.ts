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
        const user = await apiService.getUser(userId)
        this.user = user
        return user
      } catch (error) {
        console.error('Failed to load user:', error)
        throw error
      }
    },

    setUser(backendUser: User) {
      try {
        // Transform backend user data to match frontend User type
        const user: User = {
          userId: backendUser.userId || '',
          firstName: backendUser.firstName,
          lastName: backendUser.lastName,
          emailAddress: backendUser.emailAddress,
          phoneNumber: backendUser.phoneNumber,
          profile: backendUser.profile
        }
        
        this.user = user
        localStorage.setItem('user', JSON.stringify(user))
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
      localStorage.removeItem('user')
    }
  }
}) 