import { defineStore } from 'pinia'
import { mockService } from 'src/services/mock.service'
import type { Application } from 'src/types'

export const useApplicationStore = defineStore('application', {
  state: () => ({
    applications: [] as Application[]
  }),

  actions: {
    async getApplication(id: string) {
      return await mockService.getApplication(id)
    },

    async createApplication(application: Omit<Application, 'applicationId'>) {
      return await mockService.createApplication(application)
    },

    async updateApplication(id: string, application: Application) {
      return await mockService.updateApplication(id, application)
    },

    async getApplicationsByUserId(userId: string) {
      this.applications = await mockService.getApplicationsByUserId(userId)
      return this.applications
    },

    async deleteApplication(id: string) {
      await mockService.deleteApplication(id)
      const index = this.applications.findIndex(app => app.applicationId === id)
      if (index !== -1) {
        this.applications.splice(index, 1)
      }
    },

    async deleteRecommendation(id: string) {
      // Since recommendations are now nested in applications, 
      // deletion should be handled through application updates
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate async operation
      console.log('deleteRecommendation', id)
    },

    // Essay and Recommendation methods removed since they are now nested documents
    // and handled through the application CRUD operations
  }
}) 