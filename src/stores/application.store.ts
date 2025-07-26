import { defineStore } from 'pinia'
import { apiService } from 'src/services/api.service'

import type { Application } from 'src/shared-types'

export const useApplicationStore = defineStore('application', {
  state: () => ({
    applications: [] as Application[]
  }),

  actions: {
    async getApplicationById(application_id: number) {
      try {
        return await apiService.getApplicationById(application_id)
      } catch (error) {
        console.error('Error getting application:', error)
        return null
      }
    },

    async createApplication(application: Omit<Application, '_id'>) {
      return await apiService.createApplication(application)
    },

    async updateApplication(application_id: number, application: Application) {
      try {
        return await apiService.updateApplication(application_id, application)
      } catch (error) {
        console.error('Error updating application:', error)
        return null
      }
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

    async getApplicationsByStudentId(student_id: number) {
      try {
        this.applications = await apiService.getApplicationsByStudentId(student_id)
        return this.applications
      } catch (error) {
        console.error('Error fetching applications:', error)
        return []
      }
    },

    async deleteApplication(application_id: number) {
      try {
        await apiService.deleteApplication(application_id)
      } catch (error) { 
        console.error('Error deleting application:', error)
        throw error
      }
    },
  }
}) 