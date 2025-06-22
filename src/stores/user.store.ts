import { defineStore } from 'pinia'
import type { User } from 'src/types'
import { apiService } from 'src/services/api.service'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null
  }),

  getters: {
    getUserFromStorage(): User | null {
      try {
        const userData = localStorage.getItem('user')
        if (userData) {
          return JSON.parse(userData) as User
        }
        return null
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error)
        return null
      }
    }
  },

  actions: {
    async loadUser(userId?: string) {
      try {
        console.log('loadUser called with userId:', userId)
        const user = await apiService.getUser(userId)
        this.user = user
        this.setUser(user)
        return user
      } catch (error) {
        console.error('Failed to load user from API:', error)
        // Fallback to localStorage
        const storedUser = this.getUserFromStorage
        if (storedUser) {
          this.user = storedUser
          console.log('Using user from localStorage as fallback')
          return storedUser
        }
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
        localStorage.setItem('user', JSON.stringify(user))
        return user
      } catch (error) {
        console.error('Failed to load user from backend:', error)
        throw error
      }
    },

    loadUserFromStorage() {
      const storedUser = this.getUserFromStorage
      if (storedUser) {
        this.user = storedUser
        return storedUser
      }
      return null
    },

    async updateProfile(profile: User['profile']) {
      try {
        const updatedUser = await apiService.updateProfile(profile)
        this.user = updatedUser
        // Update localStorage with new profile data
        localStorage.setItem('user', JSON.stringify(updatedUser))
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