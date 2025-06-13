import { defineStore } from 'pinia'
import type { User } from 'src/types'
import { mockService } from 'src/services/mock.service'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null
  }),

  actions: {
    async loadUser(userId?: string) {
      try {
        const user = await mockService.getUser()
        if (userId) {
          user.userId = userId
          user.profile.userId = userId
        }
        this.user = user
        return user
      } catch (error) {
        console.error('Failed to load user:', error)
        throw error
      }
    },

    async updateProfile(profile: User['profile']) {
      try {
        const updatedUser = await mockService.updateProfile(profile)
        this.user = updatedUser
        return updatedUser
      } catch (error) {
        console.error('Failed to update profile:', error)
        throw error
      }
    }
  }
}) 