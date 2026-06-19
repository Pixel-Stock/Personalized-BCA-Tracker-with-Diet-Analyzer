// src/types/index.ts
// All shared TypeScript types for FitnessTouch

export type Goal = 'FAT_LOSS' | 'MUSCLE_GAIN' | 'RECOMPOSITION' | 'MAINTENANCE'
export type TrainingLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type DietType =
  | 'VEGETARIAN'
  | 'NON_VEGETARIAN'
  | 'VEGAN'
  | 'EGGETARIAN'
  | 'PESCATARIAN'
  | 'JAIN'
  | 'GLUTEN_FREE'
  | 'LACTOSE_FREE'

export type OverallStatus = 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'ATTENTION' | 'BASELINE'
export type HealthStatus = 'HEALTHY' | 'ABOVE' | 'BELOW'

export interface GymSettings {
  id: string
  gymName: string
  logoUrl: string | null
  address: string | null
  phone: string | null
  tagline: string | null
  primaryColor: string
  updatedAt: Date
}

export interface DietaryProfile {
  id: string
  memberId: string
  dietType: DietType
  mealsPerDay: number
  eatsBreakfast: boolean
  eatsLunch: boolean
  eatsDinner: boolean
  frequentSnacking: boolean
  lateNightEating: boolean
  supplementsAllowed: boolean
}

export interface Assessment {
  id: string
  memberId: string
  date: Date
  weight: number
  bmi: number
  bodyFat: number
  musclePct: number
  visceralFat: number
  subcutaneousFat: number | null
  bmr: number | null
  metabolicAge: number | null
  bodyWater: number | null
  proteinPct: number | null
  boneMass: number | null
  notes: string | null
  createdAt: Date
}

export interface Member {
  id: string
  memberId: string
  name: string
  phone: string | null
  email: string | null
  age: number
  gender: Gender
  height: number
  goal: Goal
  trainingLevel: TrainingLevel
  joinDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface MemberWithRelations extends Member {
  dietaryProfile: DietaryProfile | null
  assessments: Assessment[]
}

export interface AssessmentWithMember extends Assessment {
  member: Member
}

export interface ComparisonResult {
  hasComparison: boolean
  deltas: {
    weight: number | null
    bmi: number | null
    bodyFat: number | null
    musclePct: number | null
    visceralFat: number | null
    subcutaneousFat: number | null
  }
  interpretations: string[]
  overallStatus: OverallStatus
  daysBetweenAssessments: number | null
}

export interface NutritionPlan {
  dailyCalories: number
  proteinGrams: number
  carbGrams: number
  fatGrams: number
  mealSuggestions: string[]
  supplementSuggestions: string[]
  hydrationLitres: number
}

export interface ReportData {
  member: MemberWithRelations
  currentAssessment: Assessment
  previousAssessment: Assessment | null
  comparison: ComparisonResult
  nutrition: NutritionPlan
  gymSettings: GymSettings
}

export interface DashboardStats {
  totalMembers: number
  assessmentsThisMonth: number
  dueForReassessment: number
  latestReportDate: string | null
}

export interface MemberListItem extends Member {
  dietaryProfile: DietaryProfile | null
  assessments: Pick<Assessment, 'id' | 'date' | 'weight' | 'bodyFat' | 'musclePct'>[]
}
