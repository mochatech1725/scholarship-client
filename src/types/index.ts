export interface Auth0User {
  sub: string
  emailAddress: string
}

export interface Essay {
  _id?: string
  essayLink: string
  count: number
  units: string
  theme: string
}

export interface Recommender {
  _id?: string
  studentId: string
  firstName: string
  lastName: string
  relationship: string
  emailAddress: string
  phoneNumber: string
}

export interface Recommendation {
  _id?: string
  recommender: Recommender
  status: RecommendationStatus
  submissionMethod: 'DirectEmail' | 'StudentUpload' | 'DirectMail'
  requestDate: string
  dueDate: string
  submissionDate: string | null
}

export interface Profile {
  userPreferences: UserPreferences
}

export interface User {
  _id?: string
  userId: string
  firstName: string
  lastName: string
  emailAddress: string
  phoneNumber: string
  profile: Profile
} 

export interface Application {
  _id?: string
  applicationId: string
  studentId: string
  scholarshipName: string
  targetType: 'Merit' | 'Need' | 'Both'
  company: string
  companyWebsite: string
  platform: string
  applicationLink: string
  theme: string
  amount: number
  requirements: string
  renewable: boolean
  renewableTerms?: string
  documentInfoLink: string
  currentAction: string
  status: ApplicationStatus
  essays: Essay[]
  recommendations: Recommendation[]
  submissionDate: string
  openDate: string
  dueDate: string
}

export interface RegisterData {
  _id?: string
  emailAddress: string
}

export type EducationLevel = typeof educationLevelOptions[number]
export type TargetType = typeof targetTypeOptions[number]
export type Area = typeof areaOptions[number]

export interface UserPreferences {
  searchPreferences: SearchPreferences
}

export interface SearchPreferences {
  educationLevel: EducationLevel
  targetTypes: TargetType[]
  areas: Area[]
  minAmount: number
}

export const educationLevelOptions = [
  'High School Senior',
  'College Freshman',
  'College Sophomore',
  'College Junior',
  'College Senior',
  'Graduate Student'
] as const

export const targetTypeOptions = [
  'Merit',
  'Need',
  'Both',
] as const

export const areaOptions = [
  'STEM',
  'Humanities',
  'Social Sciences',
  'Business',
  'Arts',
  'Education',
  'Healthcare',
  'Law',
  'Public Policy',
  'Environmental Science',
  'Computer Science',
  'Engineering',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Medicine',
  'Psychology',
  'Economics',
  'Other'
] as const

export type ApplicationStatus = typeof statusOptions[number]

export const statusOptions = [
  'Not Started',
  'In Progress',
  'Submitted',
  'Awarded',
  'Not Awarded'
] as const 

export type RecommendationStatus = typeof recomendationOptions[number]

export const recomendationOptions = [
  'Pending',
  'Submitted'
] as const 

export interface Scholarship {
  scholarshipId: string
  name: string
  organization: string
  description: string
  amount: number
  deadline: string
  targetType: string
  theme: string
  requirements: string
  url: string
  isActive: boolean
}

