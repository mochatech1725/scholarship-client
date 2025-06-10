import { defineStore } from 'pinia'
import type { Essay } from 'src/types'

export const useEssayStore = defineStore('essay', {
  state: () => ({
    essays: [] as Essay[]
  }),

  actions: {
    // These methods are currently using in-memory storage as placeholders
    // They will be replaced with actual API calls in the future
    async createEssay(essay: Omit<Essay, 'essayId' | 'created'>) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      const newEssay: Essay = {
        ...essay,
        essayId: crypto.randomUUID(),
        created: new Date().toISOString()
      }
      this.essays.push(newEssay)
      return newEssay
    },

    async getEssays() {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      return this.essays
    },

    async getEssaysByScholarship(applicationId: string) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      return this.essays.filter(essay => essay.applicationId === applicationId)
    },

    async updateEssay(id: string, updates: Omit<Essay, 'essayId' | 'created'>) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      const index = this.essays.findIndex(e => e.essayId === id)
      if (index !== -1) {
        const existingEssay = this.essays[index]
        if (existingEssay) {
          this.essays[index] = {
            ...updates,
            essayId: existingEssay.essayId || crypto.randomUUID(),
            created: existingEssay.created
          }
        }
      }
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