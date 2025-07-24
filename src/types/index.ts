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
  essay_id?: string
  essay_link: string
  count: number
  units: string
  theme: string
}

export interface Recommender {
  recommender_id?: string
  student_id: string
  first_name: string
  last_name: string
  relationship: string
  email_address: string
  phone_number: string
}

export interface Recommendation {
  recommendation_id?: string
  recommender: Recommender
  status: RecommendationStatus
  submission_method: SubmissionMethod
  request_date: string
  due_date: string
  submission_date: string | null
}

export interface User {
  user_id?: string
  auth_user_id: string
  first_name: string
  last_name: string
  email_address: string
  phone_number: string
  search_preferences: SearchPreferences
} 

export interface Application {
  application_id?: string
  student_id: string
  scholarship_name: string
  target_type: TargetType
  organization: string
  org_website: string
  platform: string
  application_link: string
  theme: string
  amount: number
  requirements: string
  renewable: boolean
  renewable_terms?: string
  current_action: CurrentAction
  status: ApplicationStatus
  essays: Essay[]
  recommendations: Recommendation[]
  submission_date: string
  open_date: string
  due_date: string
}

export interface RegisterData {
  register_id?: string
  email_address: string
}

export interface ScholarshipResult {
  title: string
  description: string
  organization: string
  amount: number
  deadline: string
  eligibility: string
  ethnicity: string
  education_level: string
  area: string
  academic_gpa: number
  essay: boolean
  recommendation: boolean
  url: string
  is_active: boolean
  renewable: boolean
  geographic_restrictions: string
}

export interface UserPreferences {
  search_preferences: SearchPreferences
}

export interface SearchPreferences {
  subject_areas: SubjectArea[]
  academic_level: AcademicLevel
  target_type: TargetType
  gender: Gender
  ethnicity: Ethnicity
  academic_gpa: number
  essay_required: boolean
  recommendation_required: boolean
}

export interface SearchCriteria {
  keywords: string
  subject_areas: string[]
  academic_level: string | null
  target_type: string | null
  gender: string | null
  ethnicity: string | null
  academic_gpa: number | null
  geographic_restrictions: string | null
  essay_required: boolean | null
  recommendation_required: boolean | null
  deadline_range?: {
    start_date?: string  // ISO date string
    end_date?: string    // ISO date string
  }
  deadline_within_days?: number  // e.g., 30 for "due within 30 days"
}

