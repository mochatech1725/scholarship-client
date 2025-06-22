import type { Recommender, Profile, User, EducationLevel, TargetType, Area } from 'src/types'
import mockUserData from '../mocks/mockUserData.json'
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

  // Recommender methods
  async getRecommendersByUserId(userId: string): Promise<Recommender[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const recommenders = recommenderData.recommenders.filter(rec => rec.studentId === userId)
    return recommenders || []
  }

  async getRecommender(id: string): Promise<Recommender | null> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const recommender = recommenderData.recommenders.find(rec => rec._id === id)
    return recommender || null
  }

  async createRecommender(userId: string, recommender: Omit<Recommender, '_id'>): Promise<Recommender> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      ...recommender,
    }
  }

  async updateRecommender(id: string, recommender: Partial<Recommender>): Promise<Recommender> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const existingRec = recommenderData.recommenders.find(rec => rec._id === id)
    if (!existingRec) throw new Error('Recommender not found')
    
    // Ensure all required fields are present
    const updatedRecommender: Recommender = {
      _id: existingRec._id,
      studentId: existingRec.studentId,
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
      userPreferences: {
        searchPreferences: {
          educationLevel: castEducationLevel(mockUserData.profile.preferences.educationLevel),
          targetTypes: castTargetTypes(mockUserData.profile.preferences.targetTypes),
          areas: castAreas(mockUserData.profile.preferences.areas),
          minAmount: mockUserData.profile.preferences.minAmount
        }
      }
    }
  }

  async updateProfile(profile: Profile): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      userId: mockUserData.userId,
      firstName: mockUserData.firstName,
      lastName: mockUserData.lastName,
      emailAddress: mockUserData.emailAddress,
      phoneNumber: mockUserData.phoneNumber,
      profile
    }
  }

  async getUser(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      userId: mockUserData.userId,
      firstName: mockUserData.firstName,
      lastName: mockUserData.lastName,
      emailAddress: mockUserData.emailAddress,
      phoneNumber: mockUserData.phoneNumber,
      profile: {
        userPreferences: {
          searchPreferences: {
            educationLevel: castEducationLevel(mockUserData.profile.preferences.educationLevel),
            targetTypes: castTargetTypes(mockUserData.profile.preferences.targetTypes),
            areas: castAreas(mockUserData.profile.preferences.areas),
            minAmount: mockUserData.profile.preferences.minAmount
          }
        }
      }
    }
  }
}

export const mockService = new MockService() 