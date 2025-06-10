import { defineStore } from 'pinia'
import { mockService } from 'src/services/mock.service'
import type { Essay } from 'src/types'

export const useEssayStore = defineStore('essay', {
  state: () => ({
    essays: [] as Essay[]
  }),

  actions: {
    async createEssay(essay: Omit<Essay, 'essayId' | 'created'>) {
      return await mockService.createEssay(essay)
    },

    async getEssays() {
      return await mockService.getEssaysByApplication('') // TODO: Get all essays
    },

    async getEssaysByApplication(applicationId: string) {
      return await mockService.getEssaysByApplication(applicationId)
    },

    async getEssay(id: string) {
      return await mockService.getEssay(id)
    },

    async updateEssay(id: string, updates: Omit<Essay, 'essayId' | 'created'>) {
      return await mockService.updateEssay(id, updates)
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