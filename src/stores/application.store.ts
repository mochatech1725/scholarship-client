import { defineStore } from 'pinia'
import type { Application } from 'src/types'

export const useApplicationStore = defineStore('application', {
  state: () => ({
    applications: [] as Application[]
  }),

  actions: {
    // These methods are currently using in-memory storage as placeholders
    // They will be replaced with actual API calls in the future
    async createApplication(application: Application) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      this.applications.push(application)
      return application
    },

    async getApplications() {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      return this.applications
    },

    async updateApplication(id: string, updates: Partial<Application>) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      const index = this.applications.findIndex(app => app.studentId === id)
      if (index !== -1) {
        const existingApplication = this.applications[index]
        if (existingApplication) {
          this.applications[index] = {
            ...existingApplication,
            ...updates
          }
        }
      }
    },

    async deleteApplication(id: string) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      const index = this.applications.findIndex(app => app.studentId === id)
      if (index !== -1) {
        this.applications.splice(index, 1)
      }
    }
  }
}) 