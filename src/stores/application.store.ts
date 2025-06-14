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

    async updateApplication(id: string, application: Omit<Application, 'created'>) {
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
      await mockService.deleteRecommendation(id)
      // Update the application in the store if needed
      const application = this.applications.find(app => 
        app.recommendations.some(rec => rec.recommendationId === id)
      )
      if (application) {
        const index = application.recommendations.findIndex(rec => rec.recommendationId === id)
        if (index !== -1) {
          application.recommendations.splice(index, 1)
        }
      }
    }
  }
}) 