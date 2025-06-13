import { defineStore } from 'pinia'
import { mockService } from 'src/services/mock.service'
import type { Essay } from 'src/types'

export const useEssayStore = defineStore('essay', {
  state: () => ({
    essays: [] as Essay[]
  }),

  actions: {
    async getEssaysByApplication(applicationId: string) {
      const essays = await mockService.getEssays()
      return essays.filter(e => e.applicationId === applicationId)
    },

    async getEssay(id: string) {
      return await mockService.getEssay(id)
    },

    async createEssay(essay: Omit<Essay, 'essayId'>) {
      return await mockService.createEssay(essay)
    },

    async updateEssay(id: string, essay: Omit<Essay, 'created'>) {
      return await mockService.updateEssay(id, essay)
    },

    async deleteEssay(id: string) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      const index = this.essays.findIndex(e => e.essayId === id)
      if (index !== -1) {
        this.essays.splice(index, 1)
      }
    }
  }
}) 