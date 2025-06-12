import { defineStore } from 'pinia'
import { mockService } from 'src/services/mock.service'
import type { Recommender } from 'src/types'

export const useRecommenderStore = defineStore('recommender', {
  state: () => ({
    recommenders: [] as Recommender[]
  }),

  actions: {
    async createRecommender(recommender: Omit<Recommender, 'recommenderId' | 'created'>) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      const newRecommender: Recommender = {
        ...recommender,
        recommenderId: crypto.randomUUID(),
        created: new Date().toISOString()
      }
      this.recommenders.push(newRecommender)
      return newRecommender
    },

    async getRecommenders() {
      return await mockService.getRecommenders()
    },

    async updateRecommender(recommenderId: string, updates: Omit<Recommender, 'recommenderId' | 'created'>) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      const index = this.recommenders.findIndex(r => r.recommenderId === recommenderId)
      if (index !== -1) {
        const existingRecommender = this.recommenders[index]
        if (existingRecommender) {
          const updatedRecommender: Recommender = {
            ...updates,
            recommenderId: existingRecommender.recommenderId || crypto.randomUUID(),
            created: existingRecommender.created
          }
          this.recommenders[index] = updatedRecommender
        }
      }
    },

    async deleteRecommender(recommenderId: string) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      const index = this.recommenders.findIndex(r => r.recommenderId === recommenderId)
      if (index !== -1) {
        this.recommenders.splice(index, 1)
      }
    }
  }
}) 