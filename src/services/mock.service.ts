import type { Application, Recommender, Profile, User, EducationLevel, TargetType, Area } from 'src/types'
import mockUserData from '../mocks/mockUserData.json'
import applicationData from '../mocks/mockApplicationData.json'
import recommenderData from '../mocks/mockRecommenderData.json'
import { educationLevelOptions, targetTypeOptions, areaOptions } from 'src/types'

function castEducationLevel(val: string): EducationLevel {
  return educationLevelOptions.find(opt => opt === val) as EducationLevel
}

function castTargetTypes(arr: string[]): TargetType[] {
  return arr.filter(val => targetTypeOptions.includes(val as TargetType)) as TargetType[]
}

function castAreas(arr: string[]): Area[] {
  return arr.filter(val => areaOptions.includes(val as Area)) as Area[]
}

class MockService {
  // Application methods
  async getApplications(): Promise<Application[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return [applicationData as Application]
  }

  async getApplicationsByUserId(userId: string): Promise<Application[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // In a real service, we would filter by userId
    // For mock data, we'll just return the mock application if the userId matches the studentId
    if (applicationData.studentId === userId) {
      return [applicationData as Application]
    }
    return []
  }

  async getApplication(id: string): Promise<Application | null> {
    await new Promise(resolve => setTimeout(resolve, 100))
    if (applicationData.applicationId !== id) return null
    return applicationData as Application
  }

  async createApplication(application: Omit<Application, 'applicationId'>): Promise<Application> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const newApp = {
      ...application,
    } as Application
    return newApp
  }

  async updateApplication(id: string, application: Partial<Application>): Promise<Application> {
    await new Promise(resolve => setTimeout(resolve, 100))
    if (applicationData.applicationId !== id) {
      throw new Error('Application not found')
    }

    return {
      ...applicationData,
      ...application
    } as Application
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
    const recommender = recommenderData.recommenders.find(rec => rec._id === id)
    return recommender || null
  }

  async createRecommender(recommender: Omit<Recommender, '_id'>): Promise<Recommender> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      ...recommender,
      _id: Math.random().toString(36).substr(2, 9)
    }
  }

  async updateRecommender(id: string, recommender: Partial<Recommender>): Promise<Recommender> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const existingRec = recommenderData.recommenders.find(rec => rec._id === id)
    if (!existingRec) throw new Error('Recommender not found')
    
    // Ensure all required fields are present
    const updatedRecommender: Recommender = {
      _id: existingRec._id,
      firstName: recommender.firstName ?? existingRec.firstName,
      lastName: recommender.lastName ?? existingRec.lastName,
      relationship: recommender.relationship ?? existingRec.relationship,
      emailAddress: recommender.emailAddress ?? existingRec.emailAddress,
      phoneNumber: recommender.phoneNumber ?? existingRec.phoneNumber
    }
    
    return updatedRecommender
  }

  async deleteRecommender(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100))
    console.log('deleteRecommender', id)
  }

  // Essay methods - removed since essays are now nested in applications
  // Recommendation methods - removed since recommendations are now nested in applications

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