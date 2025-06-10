import applicationData from '../mocks/mockApplicationData.json'
import recommenderData from '../mocks/mockRecommenderData.json'
import essayData from '../mocks/mockEssayData.json'
import recommendationData from '../mocks/mockRecommendationData.json'
import type { Application, Recommender, Essay, Recommendation } from 'src/types'

type SubmissionMethod = 'DirectEmail' | 'StudentUpload' | 'DirectMail'

// Type assertion for recommendation data
const typedRecommendationData = recommendationData.recommendations.map(rec => ({
  ...rec,
  submissionMethod: rec.submissionMethod as SubmissionMethod
})) as Recommendation[]

export const mockService = {
  // Application methods
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getApplication: async (id: string): Promise<Application> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return applicationData as Application
  },

  createApplication: async (application: Omit<Application, 'created'>): Promise<Application> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      ...application,
      created: new Date().toISOString()
    } as Application
  },

  updateApplication: async (id: string, application: Omit<Application, 'created'>): Promise<Application> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      ...application,
      created: new Date().toISOString()
    } as Application
  },

  // Recommender methods
  getRecommenders: async (): Promise<Recommender[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return recommenderData.recommenders
  },

  // Essay methods
  getEssaysByApplication: async (applicationId: string): Promise<Essay[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return essayData.essays.filter(essay => essay.applicationId === applicationId)
  },

  getEssay: async (id: string): Promise<Essay> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const essay = essayData.essays.find(essay => essay.essayId === id)
    if (!essay) {
      throw new Error('Essay not found')
    }
    return essay
  },

  createEssay: async (essay: Omit<Essay, 'created'>): Promise<Essay> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      ...essay,
      created: new Date().toISOString()
    } as Essay
  },

  updateEssay: async (id: string, essay: Omit<Essay, 'created'>): Promise<Essay> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      ...essay,
      created: new Date().toISOString()
    } as Essay
  },

  // Recommendation methods
  getRecommendationsByApplication: async (applicationId: string): Promise<Recommendation[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const recommendations = typedRecommendationData.filter(rec => rec.applicationId === applicationId)
    
    // Load recommenders
    const recommenders = await mockService.getRecommenders()
    
    // Add recommender data to each recommendation
    return recommendations.map(rec => {
      const recommender = recommenders.find(r => r.recommenderId === rec.recommenderId)
      if (!recommender) {
        console.warn(`No recommender found for recommendation ${rec.recommendationId}`)
        return rec
      }
      return {
        ...rec,
        recommender
      }
    })
  },

  getRecommendation: async (id: string): Promise<Recommendation> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const recommendation = typedRecommendationData.find(rec => rec.recommendationId === id)
    if (!recommendation) {
      throw new Error('Recommendation not found')
    }
    return recommendation
  },

  createRecommendation: async (recommendation: Omit<Recommendation, 'created'>): Promise<Recommendation> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      ...recommendation,
      created: new Date().toISOString()
    } as Recommendation
  },

  updateRecommendation: async (id: string, recommendation: Omit<Recommendation, 'created'>): Promise<Recommendation> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      ...recommendation,
      created: new Date().toISOString()
    } as Recommendation
  }
} 