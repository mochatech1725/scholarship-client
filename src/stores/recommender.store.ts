import { defineStore } from 'pinia'
import { apiService } from 'src/services/api.service'
import type { Recommender } from 'src/types'

export const useRecommenderStore = defineStore('recommender', {
  state: () => ({
    recommenders: [] as Recommender[]
  }),

  actions: {
    async createRecommender(recommender: Omit<Recommender, '_id'>) {
      const newRecommender = await apiService.createRecommender(recommender)
      this.recommenders.push(newRecommender)
      return newRecommender
    },

    async getRecommenders() {
      this.recommenders = await apiService.getRecommenders()
      return this.recommenders || []
    },

    async getRecommendersByUserId(auth_user_id: string) {
      this.recommenders = await apiService.getRecommendersByUserId(auth_user_id)
      return this.recommenders
    },

    async getRecommenderById(id: string) {
      return await apiService.getRecommenderById(id)
    },

    async updateRecommender(id: string, updates: Omit<Recommender, '_id'>) {
      const updatedRecommender = await apiService.updateRecommender(id, updates)
      const index = this.recommenders.findIndex(r => r._id === id)
      if (index !== -1) {
        this.recommenders[index] = updatedRecommender
      }
      return updatedRecommender
    },

    async deleteRecommender(id: string) {
      await apiService.deleteRecommender(id)
      const index = this.recommenders.findIndex(r => r._id === id)
      if (index !== -1) {
        this.recommenders.splice(index, 1)
      }
    }
  }
}) 