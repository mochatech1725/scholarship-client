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

  // Recommendation methods
  getRecommendationsByApplication: async (applicationId: string): Promise<Recommendation[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return typedRecommendationData.filter(rec => rec.applicationId === applicationId)
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