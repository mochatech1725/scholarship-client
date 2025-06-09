export interface Essay {
  essayId?: string
  scholarshipId: string
  studentId: string
  essayLink: string
  count: string
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
  recommender?: Recommender
  scholarshipId: string
  studentId: string
  recommenderId: string
  relationship: string
  dueDate: string
  status: string
  created: string
}

export interface Application {
  studentId: string
  scholarshipId: string
  scholarshipName: string
  targetType: 'merit' | 'need' | 'both'
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
  status: string
  submissionDate: string
  openDate: string
  dueDate: string
  created: string
  essays: Essay[]
  recommendations: Recommendation[]
} 