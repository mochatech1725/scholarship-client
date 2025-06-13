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

    async getApplications() {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      return this.applications
    },

    async deleteApplication(id: string) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      const index = this.applications.findIndex(app => app.applicationId === id)
      if (index !== -1) {
        this.applications.splice(index, 1)
      }
    }
  }
}) 