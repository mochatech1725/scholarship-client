import type { Recommender, Profile, User, AcademicLevel, TargetType, SubjectArea } from 'src/types'
import mockUserData from '../mocks/mockUserData.json'
import recommenderData from '../mocks/mockRecommenderData.json'
import { academicLevelOptions, targetTypeOptions, subjectAreaOptions } from 'src/types'

function castAcademicLevel(val: string): AcademicLevel {
  return academicLevelOptions.find(opt => opt === val) as AcademicLevel
}

function castTargetType(val: string): TargetType {
  const found = targetTypeOptions.find(opt => opt === val)
  return found || 'Both'
}

function castSubjectAreas(arr: string[]): SubjectArea[] {
  return arr.filter(val => subjectAreaOptions.includes(val as SubjectArea)) as SubjectArea[]
}

class MockService {

  // Recommender methods
  async getRecommendersByAuth_user_id(auth_user_id: string): Promise<Recommender[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const recommenders = recommenderData.recommenders.filter(rec => rec.studentId === auth_user_id)
    return recommenders || []
  }

  async getRecommender(id: string): Promise<Recommender | null> {
    await new Promise(resolve => setTimeout(resolve, 100))
    const recommender = recommenderData.recommenders.find(rec => rec._id === id)
    return recommender || null
  }

  async createRecommender(auth_user_id: string, recommender: Omit<Recommender, '_id'>): Promise<Recommender> {
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
          academicLevel: castAcademicLevel(mockUserData.profile.preferences.academicLevel),
          targetType: castTargetType(mockUserData.profile.preferences.targetType),
          subjectAreas: castSubjectAreas(mockUserData.profile.preferences.subjectAreas),
          gender: 'Male',
          ethnicity: 'White/Caucasian',
          academicGPA: 3.0,
          essayRequired: false,
          recommendationRequired: false
        }
      }
    }
  }

  async updateProfile(profile: Profile): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      auth_user_id: mockUserData.userId,
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
      auth_user_id: mockUserData.userId,
      firstName: mockUserData.firstName,
      lastName: mockUserData.lastName,
      emailAddress: mockUserData.emailAddress,
      phoneNumber: mockUserData.phoneNumber,
              profile: {
          userPreferences: {
            searchPreferences: {
              academicLevel: castAcademicLevel(mockUserData.profile.preferences.academicLevel),
              targetType: castTargetType(mockUserData.profile.preferences.targetType),
              subjectAreas: castSubjectAreas(mockUserData.profile.preferences.subjectAreas),
              gender: 'Male',
              ethnicity: 'White/Caucasian',
              academicGPA: 3.0,
              essayRequired: false,
              recommendationRequired: false
            }
          }
        }
    }
  }
}

export const mockService = new MockService() 