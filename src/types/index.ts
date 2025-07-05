export const ethnicityOptions = [
  'Asian/Pacific Islander',
  'Black/African American',
  'Hispanic/Latino',
  'White/Caucasian',
  'Native American/Alaska Native',
  'Native Hawaiian/Pacific Islander',
  'Middle Eastern/North African',
  'South Asian',
  'East Asian',
  'Southeast Asian',
  'Other'
] as const

export const genderOptions = [  
  'Male',
  'Female',
  'Non-Binary'
] as const

export const academicLevelOptions = [
  'Undergraduate',
  'Graduate',
  'High School',
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

export const subjectAreaOptions = [
  'Agriculture',
  'Arts',
  'Architecture',
  'Athletics',
  'Aviation',
  'Biology',
  'Business',
  'Chemistry',
  'Communication',
  'Community Service',
  'Criminal Justice',
  'Culinary Arts',
  'Computer Science',
  'Dance',
  'Dentistry',
  'Disablity',
  'Design',
  'Drama',
  'Economics',
  'Education',
  'Engineering',
  'Environmental Science',
  'Healthcare',
  'Humanities',
  'Journalism',
  'Law',
  'Mathematics',
  'Medicine',
  'Music',
  'Military',
  'Nursing',
  'Physics',
  'Psychology',
  'Public Policy',
  'Religion',
  'Science',
  'Social Sciences',
  'STEM',
  'Writing'
] as const

export const recomendationOptions = [
  'Pending',
  'Submitted'
] as const 


export const submissionMethodOptions = [
  'DirectEmail',
  'StudentUpload',
  'DirectMail'
] as const

export const applicationStatusOptions = [
  'Not Started',
  'In Progress',
  'Submitted',
  'Awarded',
  'Not Awarded'
] as const

export const currentActionOptions = [
  'Waiting for Recommendations',
  'Waiting for Essay Review',
  'Ready to Submit',
  'N/A'
] as const

export type AcademicLevel = typeof academicLevelOptions[number]
export type TargetType = typeof targetTypeOptions[number]
export type SubjectArea = typeof subjectAreaOptions[number]
export type Gender = typeof genderOptions[number]
export type Ethnicity = typeof ethnicityOptions[number]
export type ApplicationStatus = typeof applicationStatusOptions[number]
export type RecommendationStatus = typeof recomendationOptions[number]
export type SubmissionMethod = typeof submissionMethodOptions[number]
export type CurrentAction = typeof currentActionOptions[number]

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
  submissionMethod: SubmissionMethod
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
  studentId: string
  scholarshipName: string
  targetType: TargetType
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
  currentAction: CurrentAction
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

export interface ScholarshipResult {
  title: string
  description: string
  organization: string
  amount: number
  deadline: string
  eligibility: string
  ethnicity: string
  educationLevel: string
  area: string
  academicGPA: number
  essay: boolean
  recommendation: boolean
  url: string
  isActive: boolean
  renewable: boolean
  geographicRestrictions: string
}

export interface UserPreferences {
  searchPreferences: SearchPreferences
}

export interface SearchPreferences {
  subjectAreas: SubjectArea[]
  academicLevel: AcademicLevel
  targetType: TargetType
  gender: Gender
  ethnicity: Ethnicity
  academicGPA: number
  essayRequired: boolean
  recommendationRequired: boolean
}

export interface SearchCriteria {
  keywords: string
  subjectAreas: string[]
  academicLevel: string | null
  targetType: string | null
  gender: string | null
  ethnicity: string | null
  academicGPA: number | null
  geographicRestrictions: string | null
  essayRequired: boolean | null
  recommendationRequired: boolean | null
  deadlineRange?: {
    startDate?: string  // ISO date string
    endDate?: string    // ISO date string
  }
  deadlineWithinDays?: number  // e.g., 30 for "due within 30 days"
}

