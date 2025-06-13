import type { Application, Recommender, Essay, Recommendation, Profile, User, EducationLevel, TargetType, Area, ApplicationStatus } from 'src/types'
import mockUserData from '../mocks/mockUserData.json'
import applicationData from '../mocks/mockApplicationData.json'
import recommenderData from '../mocks/mockRecommenderData.json'
import essayData from '../mocks/mockEssayData.json'
import { educationLevelOptions, targetTypeOptions, areaOptions, statusOptions } from 'src/types'

function castEducationLevel(val: string): EducationLevel {
  return educationLevelOptions.find(opt => opt === val) as EducationLevel
}

function castTargetTypes(arr: string[]): TargetType[] {
  return arr.filter(val => targetTypeOptions.includes(val as TargetType)) as TargetType[]
}

function castAreas(arr: string[]): Area[] {
  return arr.filter(val => areaOptions.includes(val as Area)) as Area[]
}

function castApplicationStatus(status: string): ApplicationStatus {
  return statusOptions.find(opt => opt === status) as ApplicationStatus || 'Not Started'
}

// Type guards
function isValidTargetType(val: string): val is 'Merit' | 'Need' | 'Both' {
  return targetTypeOptions.includes(val as TargetType)
}

function isValidRecommendationStatus(val: string): val is 'Pending' | 'Submitted' {
  return val === 'Pending' || val === 'Submitted'
}

function isValidSubmissionMethod(val: string): val is 'DirectEmail' | 'StudentUpload' | 'DirectMail' {
  return ['DirectEmail', 'StudentUpload', 'DirectMail'].includes(val)
}

// Type for raw recommendation data from JSON
interface RawRecommendation {
  recommendationId: string
  applicationId: string
  studentId: string
  recommenderId: string
  recommender: {
    recommenderId: string
    firstName: string
    lastName: string
    emailAddress: string
    phoneNumber: string
    relationship: string
    created: string
  }
  status: string
  submissionMethod: string
  requestDate: string
  dueDate: string
  submissionDate: string | null
  created: string
}

function castRecommendation(rec: RawRecommendation): Recommendation {
  if (!rec.recommender || !rec.recommenderId || !rec.applicationId || !rec.studentId) {
    throw new Error('Invalid recommendation data')
  }

  const status = isValidRecommendationStatus(rec.status) ? rec.status : 'Pending'
  const submissionMethod = isValidSubmissionMethod(rec.submissionMethod) ? rec.submissionMethod : 'DirectEmail'

  return {
    recommendationId: rec.recommendationId,
    applicationId: rec.applicationId,
    studentId: rec.studentId,
    recommenderId: rec.recommenderId,
    recommender: {
      recommenderId: rec.recommender.recommenderId,
      firstName: rec.recommender.firstName,
      lastName: rec.recommender.lastName,
      emailAddress: rec.recommender.emailAddress,
      phoneNumber: rec.recommender.phoneNumber,
      relationship: rec.recommender.relationship,
      created: rec.recommender.created
    },
    status,
    submissionMethod,
    requestDate: rec.requestDate,
    dueDate: rec.dueDate,
    submissionDate: rec.submissionDate,
    created: rec.created
  }
}

// Helper to get only valid recommendations
function getValidRecommendations(recs: RawRecommendation[]): Recommendation[] {
  return recs
    .filter(r => r && r.status && isValidRecommendationStatus(r.status))
    .map(castRecommendation)
}

class MockService {
  // Application methods
  async getApplications(): Promise<Application[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const targetType = isValidTargetType(applicationData.targetType) 
      ? applicationData.targetType 
      : 'Merit'

    const app: Application = {
      ...applicationData,
      status: castApplicationStatus(applicationData.status),
      targetType,
      recommendations: getValidRecommendations(applicationData.recommendations)
    }
    return [app]
  }

  async getApplication(id: string): Promise<Application | null> {
    await new Promise(resolve => setTimeout(resolve, 100))
    if (applicationData.applicationId !== id) return null

    const targetType = isValidTargetType(applicationData.targetType) 
      ? applicationData.targetType 
      : 'Merit'

    const app: Application = {
      ...applicationData,
      status: castApplicationStatus(applicationData.status),
      targetType,
      recommendations: getValidRecommendations(applicationData.recommendations)
    }
    return app
  }

  async createApplication(application: Omit<Application, 'applicationId'>): Promise<Application> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const targetType = isValidTargetType(application.targetType) 
      ? application.targetType 
      : 'Merit'

    const newApp: Application = {
      ...application,
      applicationId: Math.random().toString(36).substr(2, 9),
      targetType,
      recommendations: getValidRecommendations(application.recommendations)
    }
    return newApp
  }

  async updateApplication(id: string, application: Partial<Application>): Promise<Application> {
    await new Promise(resolve => setTimeout(resolve, 100))
    if (applicationData.applicationId !== id) {
      throw new Error('Application not found')
    }

    const targetType = application.targetType 
      ? (isValidTargetType(application.targetType) ? application.targetType : 'Merit')
      : (isValidTargetType(applicationData.targetType) ? applicationData.targetType : 'Merit')

    const updatedApp: Application = {
      ...applicationData,
      ...application,
      status: application.status ? castApplicationStatus(application.status) : castApplicationStatus(applicationData.status),
      targetType,
      recommendations: application.recommendations
        ? getValidRecommendations(application.recommendations)
        : getValidRecommendations(applicationData.recommendations)
    }
    return updatedApp
  }

  async deleteApplication(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100))
    console.log('deleteApplication', id)
  }

  // Recommender methods
  async getRecommenders(): Promise<Recommender[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return recommenderData.recommenders
  }

  async getRecommender(id: string): Promise<Recommender | null> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const recommender = recommenderData.recommenders.find(rec => rec.recommenderId === id)
    return recommender || null
  }

  async createRecommender(recommender: Omit<Recommender, 'recommenderId'>): Promise<Recommender> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      ...recommender,
      recommenderId: Math.random().toString(36).substr(2, 9)
    }
  }

  async updateRecommender(id: string, recommender: Partial<Recommender>): Promise<Recommender> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const existingRec = recommenderData.recommenders.find(rec => rec.recommenderId === id)
    if (!existingRec) throw new Error('Recommender not found')
    return {
      ...existingRec,
      ...recommender
    }
  }

  async deleteRecommender(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100))
    console.log('deleteRecommender', id)
  }

  // Essay methods
  async getEssays(): Promise<Essay[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return essayData.essays as Essay[]
  }

  async getEssay(id: string): Promise<Essay | null> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const essay = essayData.essays.find(essay => essay.essayId === id)
    return essay as Essay | null
  }

  async createEssay(essay: Omit<Essay, 'essayId'>): Promise<Essay> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const newEssay = {
      ...essay,
      essayId: Math.random().toString(36).substr(2, 9)
    } as Essay
    essayData.essays.push(newEssay as typeof essayData.essays[0])
    return newEssay
  }

  async updateEssay(id: string, essay: Partial<Essay>): Promise<Essay> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const existingEssay = essayData.essays.find(essay => essay.essayId === id)
    if (!existingEssay) throw new Error('Essay not found')
    const updatedEssay = {
      ...existingEssay,
      ...essay,
      essayId: id // Ensure essayId is preserved
    } as Essay
    const index = essayData.essays.findIndex(essay => essay.essayId === id)
    if (index !== -1) {
      essayData.essays[index] = updatedEssay as typeof essayData.essays[0]
    }
    return updatedEssay
  }

  async deleteEssay(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const index = essayData.essays.findIndex(essay => essay.essayId === id)
    if (index !== -1) {
      essayData.essays.splice(index, 1)
    }
  }

  // Recommendation methods
  async getRecommendations(): Promise<Recommendation[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return getValidRecommendations(applicationData.recommendations)
  }

  async getRecommendation(id: string): Promise<Recommendation | null> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const rec = applicationData.recommendations.find(rec => rec.recommendationId === id)
    if (!rec) return null
    return castRecommendation(rec)
  }

  async createRecommendation(recommendation: Omit<Recommendation, 'recommendationId'>): Promise<Recommendation> {
    await new Promise(resolve => setTimeout(resolve, 100))
    if (!recommendation.recommender) {
      throw new Error('Recommender is required')
    }
    const newRec: Recommendation = {
      recommendationId: Math.random().toString(36).substr(2, 9),
      applicationId: recommendation.applicationId,
      studentId: recommendation.studentId,
      recommenderId: recommendation.recommender.recommenderId,
      recommender: {
        recommenderId: recommendation.recommender.recommenderId,
        firstName: recommendation.recommender.firstName,
        lastName: recommendation.recommender.lastName,
        emailAddress: recommendation.recommender.emailAddress,
        phoneNumber: recommendation.recommender.phoneNumber,
        relationship: recommendation.recommender.relationship,
        created: recommendation.recommender.created
      },
      status: recommendation.status,
      submissionMethod: recommendation.submissionMethod,
      requestDate: recommendation.requestDate,
      dueDate: recommendation.dueDate,
      submissionDate: recommendation.submissionDate,
      created: new Date().toISOString()
    }
    applicationData.recommendations.push(newRec)
    return newRec
  }

  async updateRecommendation(id: string, recommendation: Partial<Recommendation>): Promise<Recommendation> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const existingRec = applicationData.recommendations.find(rec => rec.recommendationId === id)
    if (!existingRec) throw new Error('Recommendation not found')
    
    const updatedRec: Recommendation = {
      recommendationId: existingRec.recommendationId,
      applicationId: recommendation.applicationId || existingRec.applicationId,
      studentId: recommendation.studentId || existingRec.studentId,
      recommenderId: recommendation.recommenderId || existingRec.recommenderId,
      recommender: recommendation.recommender ? {
        recommenderId: recommendation.recommender.recommenderId,
        firstName: recommendation.recommender.firstName,
        lastName: recommendation.recommender.lastName,
        emailAddress: recommendation.recommender.emailAddress,
        phoneNumber: recommendation.recommender.phoneNumber,
        relationship: recommendation.recommender.relationship,
        created: recommendation.recommender.created
      } : {
        recommenderId: existingRec.recommender.recommenderId,
        firstName: existingRec.recommender.firstName,
        lastName: existingRec.recommender.lastName,
        emailAddress: existingRec.recommender.emailAddress,
        phoneNumber: existingRec.recommender.phoneNumber,
        relationship: existingRec.recommender.relationship,
        created: existingRec.recommender.created
      },
      status: (recommendation.status || existingRec.status) as 'Pending' | 'Submitted',
      submissionMethod: (recommendation.submissionMethod || existingRec.submissionMethod) as 'DirectEmail' | 'StudentUpload' | 'DirectMail',
      requestDate: recommendation.requestDate || existingRec.requestDate,
      dueDate: recommendation.dueDate || existingRec.dueDate,
      submissionDate: recommendation.submissionDate || existingRec.submissionDate,
      created: existingRec.created
    }
    const index = applicationData.recommendations.findIndex(rec => rec.recommendationId === id)
    if (index !== -1) {
      applicationData.recommendations[index] = updatedRec
    }
    return updatedRec
  }

  async deleteRecommendation(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const index = applicationData.recommendations.findIndex(rec => rec.recommendationId === id)
    if (index !== -1) {
      applicationData.recommendations.splice(index, 1)
    }
  }

  // Profile methods
  async getProfile(): Promise<Profile> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      userId: mockUserData.profile.userId,
      userPreferences: {
        searchPreferences: {
          educationLevel: castEducationLevel(mockUserData.preferences.educationLevel),
          targetTypes: castTargetTypes(mockUserData.preferences.targetTypes),
          areas: castAreas(mockUserData.preferences.areas),
          minAmount: mockUserData.preferences.minAmount
        }
      }
    }
  }

  async updateProfile(profile: Profile): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      userId: mockUserData.profile.userId,
      firstName: mockUserData.profile.firstName,
      lastName: mockUserData.profile.lastName,
      emailAddress: mockUserData.profile.emailAddress,
      phoneNumber: mockUserData.profile.phoneNumber,
      profile
    }
  }

  async getUser(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      userId: mockUserData.profile.userId,
      firstName: mockUserData.profile.firstName,
      lastName: mockUserData.profile.lastName,
      emailAddress: mockUserData.profile.emailAddress,
      phoneNumber: mockUserData.profile.phoneNumber,
      profile: {
        userId: mockUserData.profile.userId,
        userPreferences: {
          searchPreferences: {
            educationLevel: castEducationLevel(mockUserData.preferences.educationLevel),
            targetTypes: castTargetTypes(mockUserData.preferences.targetTypes),
            areas: castAreas(mockUserData.preferences.areas),
            minAmount: mockUserData.preferences.minAmount
          }
        }
      }
    }
  }
}

export const mockService = new MockService() 