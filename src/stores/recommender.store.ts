import { defineStore } from 'pinia'
import { apiService } from 'src/services/api.service'
import type { Recommender } from 'src/types'

export const useRecommenderStore = defineStore('recommender', {
  state: () => ({
    recommenders: [] as Recommender[]
  }),

  actions: {
    async createRecommender(recommender: Omit<Recommender, 'recommender_id'>) {
      try {
        const newRecommender = await apiService.createRecommender(recommender)
        this.recommenders.push(newRecommender)
        return newRecommender
      } catch (error) {
        console.error('Error creating recommender:', error)
        return null
      }
    },

    async getRecommenders() {
      try {
        this.recommenders = await apiService.getRecommenders()
        return this.recommenders || []
      } catch (error) {
        console.error('Error fetching recommenders:', error)
        return []
      }
    },

    async getRecommendersByUserId(auth_user_id: string) {
      this.recommenders = await apiService.getRecommendersByUserId(auth_user_id)
      return this.recommenders
    },

    async getRecommenderById(id: string) {
      try {
        return await apiService.getRecommenderById(id)
      } catch (error) {
        console.error('Error fetching recommender by ID:', error)
        return null
      }
    },

    async updateRecommender(id: string, updates: Omit<Recommender, 'recommender_id'>) {
      try {
        const updatedRecommender = await apiService.updateRecommender(id, updates)
        const index = this.recommenders.findIndex(r => r.recommender_id === id)
        if (index !== -1) {
          this.recommenders[index] = updatedRecommender
        }
        return updatedRecommender
      } catch (error) {
        console.error('Error updating recommender:', error)
        return null
      }
    },

    async deleteRecommender(id: string) {
      await apiService.deleteRecommender(id)
      const index = this.recommenders.findIndex(r => r.recommender_id === id)
      if (index !== -1) {
        this.recommenders.splice(index, 1)
      }
    }
  }
}) 