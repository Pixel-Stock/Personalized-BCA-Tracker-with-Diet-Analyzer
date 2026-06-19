// src/lib/utils/formatters.ts
// Display formatting helpers

import { format } from 'date-fns'
import type { Goal, TrainingLevel, Gender, DietType } from '@/types'

export function formatDate(date: Date | string, pattern = 'dd MMM yyyy'): string {
  return format(new Date(date), pattern)
}

export function formatDateShort(date: Date | string): string {
  return format(new Date(date), 'dd/MM/yyyy')
}

export function formatDatetime(date: Date | string): string {
  return format(new Date(date), 'dd MMM yyyy, hh:mm a')
}

export function formatGoal(goal: Goal): string {
  const map: Record<Goal, string> = {
    FAT_LOSS: 'Fat Loss',
    MUSCLE_GAIN: 'Muscle Gain',
    RECOMPOSITION: 'Body Recomposition',
    MAINTENANCE: 'Maintenance',
  }
  return map[goal]
}

export function formatTrainingLevel(level: TrainingLevel): string {
  const map: Record<TrainingLevel, string> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
  }
  return map[level]
}

export function formatGender(gender: Gender): string {
  const map: Record<Gender, string> = {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other',
  }
  return map[gender]
}

export function formatDietType(dietType: DietType): string {
  const map: Record<DietType, string> = {
    VEGETARIAN: 'Vegetarian',
    NON_VEGETARIAN: 'Non-Vegetarian',
    VEGAN: 'Vegan',
    EGGETARIAN: 'Eggetarian',
    PESCATARIAN: 'Pescatarian',
    JAIN: 'Jain',
    GLUTEN_FREE: 'Gluten-Free',
    LACTOSE_FREE: 'Lactose-Free',
  }
  return map[dietType]
}

export function formatDelta(value: number | null, unit = ''): string {
  if (value === null) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}${unit}`
}

export function formatValue(value: number | null | undefined, unit = '', decimals = 1): string {
  if (value == null) return '—'
  return `${value.toFixed(decimals)}${unit}`
}

export function formatMemberIdSuggestion(count: number): string {
  return `FT${String(count + 1).padStart(4, '0')}`
}
