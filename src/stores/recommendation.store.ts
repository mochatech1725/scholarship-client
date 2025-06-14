import { defineStore } from 'pinia'
import { mockService } from 'src/services/mock.service'
import type { Recommendation } from 'src/types'

export const useRecommendationStore = defineStore('recommendation', {
  state: () => ({
    recommendations: [] as Recommendation[]
  }),

  actions: {
    async getRecommendationsByApplication(applicationId: string) {
      const recommendations = await mockService.getRecommendations()
      return recommendations.filter(r => r.applicationId === applicationId)
    },

    async getRecommendation(recommendationId: string) {
      return await mockService.getRecommendation(recommendationId)
    },

    async createRecommendation(recommendation: Omit<Recommendation, 'recommendationId'>) {
      return await mockService.createRecommendation(recommendation)
    },

    async updateRecommendation(id: string, recommendation: Omit<Recommendation, 'created'>) {
      return await mockService.updateRecommendation(id, recommendation)
    },

    async deleteRecommendation(id: string) {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
      const index = this.recommendations.findIndex(r => r.recommendationId === id)
      if (index !== -1) {
        this.recommendations.splice(index, 1)
      }
    }
  }
}) 