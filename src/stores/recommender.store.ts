import { defineStore } from 'pinia'
import { mockService } from 'src/services/mock.service'
import type { Recommender } from 'src/types'

export const useRecommenderStore = defineStore('recommender', {
  state: () => ({
    recommenders: [] as Recommender[]
  }),

  actions: {
    async createRecommender(recommender: Omit<Recommender, '_id' | 'created'>) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      const newRecommender: Recommender = {
        ...recommender,
        _id: crypto.randomUUID(),
        created: new Date().toISOString()
      }
      this.recommenders.push(newRecommender)
      return newRecommender
    },

    async getRecommenders() {
      const recommenders = await mockService.getRecommenders()
      return recommenders
    },

    async getRecommenderById(recommenderId: string) {
      const recommenders = await mockService.getRecommenders()
      return recommenders.find(r => r._id === recommenderId) || null
    },

    async updateRecommender(recommenderId: string, updates: Omit<Recommender, '_id' | 'created'>) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      const index = this.recommenders.findIndex(r => r._id === recommenderId)
      if (index !== -1) {
        const existingRecommender = this.recommenders[index]
        if (existingRecommender) {
          const updatedRecommender: Recommender = {
            ...updates,
            _id: existingRecommender._id || crypto.randomUUID(),
            created: existingRecommender.created || new Date().toISOString()
          }
          this.recommenders[index] = updatedRecommender
        }
      }
    },

    async deleteRecommender(recommenderId: string) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      const index = this.recommenders.findIndex(r => r._id === recommenderId)
      if (index !== -1) {
        this.recommenders.splice(index, 1)
      }
    }
  }
}) 