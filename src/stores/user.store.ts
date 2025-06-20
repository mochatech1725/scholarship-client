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

    loadUserFromBackend(userData: { id?: string; auth0Id?: string; firstName: string; lastName: string; emailAddress: string; phoneNumber: string; profile?: User['profile'] }) {
      try {
        // Transform backend user data to match frontend User type
        const user: User = {
          userId: userData.id || userData.auth0Id || '',
          firstName: userData.firstName,
          lastName: userData.lastName,
          emailAddress: userData.emailAddress,
          phoneNumber: userData.phoneNumber,
          profile: userData.profile || {
            userId: userData.id || userData.auth0Id || '',
            userPreferences: {
              searchPreferences: {
                educationLevel: 'High School Senior',
                targetTypes: ['Merit'],
                areas: ['STEM'],
                minAmount: 0
              }
            }
          }
        }
        
        this.user = user
        return user
      } catch (error) {
        console.error('Failed to load user from backend:', error)
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
    },

    clearUser() {
      this.user = null
    }
  }
}) 