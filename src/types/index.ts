export interface Essay {
  essayId?: string
  applicationId: string
  studentId: string
  essayLink: string
  count: number
  units: string
  theme: string
  created: string
}

export interface Recommender {
  recommenderId?: string
  firstName: string
  lastName: string
  relationship: string
  emailAddress: string
  phoneNumber: string
  created: string
}

export interface Recommendation {
  recommendationId: string
  recommender?: Recommender
  applicationId: string
  studentId: string
  recommenderId: string
  dueDate: string
  status: RecommendationStatus
  submissionMethod: 'DirectEmail' | 'StudentUpload' | 'DirectMail'
  requestDate: string
  submissionDate: string | null
  created: string
}

export interface Application {
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
  documentInfoLink: string
  currentAction: string
  status: ApplicationStatus
  submissionDate: string
  openDate: string
  dueDate: string
  created: string
  essays: Essay[]
  recommendations: Recommendation[]
}

export interface Profile {
  firstName: string
  lastName: string
  emailAddress: string
  phoneNumber: string
}

export type EducationLevel = typeof educationLevelOptions[number]
export type TargetType = typeof targetTypeOptions[number]
export type Area = typeof areaOptions[number]

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
  createdAt: string
  updatedAt: string
} 