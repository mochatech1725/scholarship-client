import { defineStore } from 'pinia'
import { apiService } from 'src/services/api.service'

import type { Application } from 'src/types'

export const useApplicationStore = defineStore('application', {
  state: () => ({
    applications: [] as Application[]
  }),

  actions: {
    async getApplicationById(id: string) {
      try {
        return await apiService.getApplicationById(id)
      } catch (error) {
        console.error('Error fetching application by ID:', error)
        return null
      }
    },

    async createApplication(application: Omit<Application, '_id'>) {
      return await apiService.createApplication(application)
    },

    async updateApplication(id: string, application: Application) {
      return await apiService.updateApplication(id, application)
    },

    async getApplicationsByUserId(auth_user_id: string) {
      try {
        this.applications = await apiService.getApplicationsByUserId(auth_user_id)
        return this.applications
      } catch (error) {
        console.error('Error fetching applications:', error)
        return []
      }
    },

    async deleteApplication(id: string) {
      await apiService.deleteApplication(id)
    },
  }
}) 