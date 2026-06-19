// src/lib/utils/validators.ts
// Zod schemas for all form inputs

import { z } from 'zod'

export const DietaryProfileSchema = z.object({
  dietType: z.enum([
    'VEGETARIAN',
    'NON_VEGETARIAN',
    'VEGAN',
    'EGGETARIAN',
    'PESCATARIAN',
    'JAIN',
    'GLUTEN_FREE',
    'LACTOSE_FREE',
  ]),
  mealsPerDay: z.number().min(1).max(6),
  eatsBreakfast: z.boolean(),
  eatsLunch: z.boolean(),
  eatsDinner: z.boolean(),
  frequentSnacking: z.boolean(),
  lateNightEating: z.boolean(),
  supplementsAllowed: z.boolean(),
})

export const MemberSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  age: z.number().min(10, 'Age must be at least 10').max(100),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  height: z.number().min(100, 'Height must be at least 100 cm').max(250),
  goal: z.enum(['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION', 'MAINTENANCE']),
  trainingLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  joinDate: z.string().or(z.date()),
  dietaryProfile: DietaryProfileSchema,
})

export const AssessmentSchema = z.object({
  memberId: z.string().min(1),
  date: z.string().or(z.date()),
  weight: z.number().min(20, 'Weight must be > 20 kg').max(300),
  bmi: z.number().min(10).max(60),
  bodyFat: z.number().min(1).max(60),
  musclePct: z.number().min(1).max(80),
  visceralFat: z.number().min(1).max(59),
  subcutaneousFat: z.number().min(0.1, 'Must be positive').optional().nullable(),
  bmr: z.number().min(500, 'Invalid BMR').max(5000, 'Invalid BMR'),
  metabolicAge: z.number().min(10, 'Invalid age').max(100, 'Invalid age'),
  bodyWater: z.number().min(1, 'Must be positive').max(100, 'Cannot exceed 100%').optional().nullable(),
  proteinPct: z.number().min(1).max(30).optional().nullable(),
  boneMass: z.number().min(0.5).max(10).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
})

export const GymSettingsSchema = z.object({
  gymName: z.string().min(1, 'Gym name is required'),
  tagline: z.string().max(200).optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color')
    .default('#1a56db'),
})

export type MemberFormData = z.infer<typeof MemberSchema>
export type AssessmentFormData = z.infer<typeof AssessmentSchema>
export type GymSettingsFormData = z.infer<typeof GymSettingsSchema>
