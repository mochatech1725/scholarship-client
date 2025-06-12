import { defineStore } from 'pinia'
import type { Profile, SearchPreferences } from 'src/types'
import { mockService } from 'src/services/mock.service'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null as Profile | null,
    preferences: null as SearchPreferences | null
  }),

  actions: {
    async loadProfile() {
      try {
        const profile = await mockService.getProfile()
        this.profile = profile
        return profile
      } catch (error) {
        console.error('Failed to load profile:', error)
        throw error
      }
    },

    async loadPreferences() {
      try {
        const preferences = await mockService.getPreferences()
        this.preferences = preferences
        return preferences
      } catch (error) {
        console.error('Failed to load preferences:', error)
        throw error
      }
    },

    async updateProfile(profile: Profile) {
      try {
        const updatedProfile = await mockService.updateProfile(profile)
        this.profile = updatedProfile
        return updatedProfile
      } catch (error) {
        console.error('Failed to update profile:', error)
        throw error
      }
    },

    async updatePreferences(preferences: SearchPreferences) {
      try {
        const updatedPreferences = await mockService.updatePreferences(preferences)
        this.preferences = updatedPreferences
        return updatedPreferences
      } catch (error) {
        console.error('Failed to update preferences:', error)
        throw error
      }
    }
  }
}) 