// src/lib/engines/comparisonEngine.ts
// Pure function: compares current vs previous assessment, returns deltas and interpretations

import type { Assessment, ComparisonResult, OverallStatus } from '@/types'
import { differenceInDays } from 'date-fns'

export function comparisonEngine(
  current: Assessment,
  previous: Assessment | null
): ComparisonResult {
  // No previous assessment — baseline mode
  if (!previous) {
    return {
      hasComparison: false,
      deltas: {
        weight: null,
        bmi: null,
        bodyFat: null,
        musclePct: null,
        visceralFat: null,
        subcutaneousFat: null,
      },
      interpretations: [],
      overallStatus: 'BASELINE',
      daysBetweenAssessments: null,
    }
  }

  const delta = (curr: number, prev: number) => parseFloat((curr - prev).toFixed(2))

  const deltas = {
    weight: delta(current.weight, previous.weight),
    bmi: delta(current.bmi, previous.bmi),
    bodyFat: delta(current.bodyFat, previous.bodyFat),
    musclePct: delta(current.musclePct, previous.musclePct),
    visceralFat: delta(current.visceralFat, previous.visceralFat),
    subcutaneousFat:
      current.subcutaneousFat != null && previous.subcutaneousFat != null
        ? delta(current.subcutaneousFat, previous.subcutaneousFat)
        : null,
  }

  const interpretations: string[] = []

  // Body recomposition rules
  if (deltas.bodyFat < 0 && deltas.musclePct > 0) {
    interpretations.push(
      'Excellent body recomposition — fat reduced while muscle mass improved.'
    )
  } else if (deltas.bodyFat < 0 && Math.abs(deltas.musclePct) <= 0.5) {
    interpretations.push('Successful fat loss with lean mass preserved.')
  } else if (deltas.bodyFat < 0 && deltas.musclePct < 0) {
    interpretations.push(
      'Fat loss achieved but lean mass also reduced. Consider increasing protein intake.'
    )
  }

  // Weight change rules
  if (deltas.weight < 0 && deltas.bodyFat < 0) {
    interpretations.push('Weight loss is attributed to fat reduction — positive progress.')
  } else if (deltas.weight < 0 && deltas.bodyFat > 0) {
    interpretations.push(
      'Weight reduced but body fat percentage increased. Focus on resistance training.'
    )
  }

  // Visceral fat rules
  if (deltas.visceralFat < 0) {
    interpretations.push(
      'Visceral fat reduced — excellent improvement in metabolic health.'
    )
  } else if (deltas.visceralFat > 0) {
    interpretations.push(
      'Visceral fat increased — prioritize cardiovascular exercise and reduce processed food intake.'
    )
  }

  // Significant muscle gain
  if (deltas.musclePct > 1.5) {
    interpretations.push(
      'Significant muscle gain recorded — training and nutrition are working well together.'
    )
  }

  // Determine overall status
  let overallStatus: OverallStatus

  const fatImproved = deltas.bodyFat < 0
  const muscleImproved = deltas.musclePct >= 0
  const muscleGained = deltas.musclePct > 0
  const visceralImproved = deltas.visceralFat < 0
  const fatWorsened = deltas.bodyFat > 0
  const visceralWorsened = deltas.visceralFat > 0

  if (fatImproved && muscleImproved && visceralImproved) {
    overallStatus = 'EXCELLENT'
  } else if (fatImproved || muscleGained) {
    overallStatus = 'GOOD'
  } else if (fatWorsened || visceralWorsened) {
    overallStatus = 'ATTENTION'
  } else {
    overallStatus = 'MODERATE'
  }

  const daysBetweenAssessments = differenceInDays(
    new Date(current.date),
    new Date(previous.date)
  )

  return {
    hasComparison: true,
    deltas,
    interpretations,
    overallStatus,
    daysBetweenAssessments,
  }
}
