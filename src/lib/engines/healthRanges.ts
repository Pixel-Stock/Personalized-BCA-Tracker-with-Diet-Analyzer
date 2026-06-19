// src/lib/engines/healthRanges.ts
// Healthy range constants and status evaluation for all BCA metrics

import type { Gender, HealthStatus } from '@/types'

export const HEALTHY_RANGES = {
  bmi: { low: 18.5, high: 24.9, unit: 'kg/m²' },
  bodyFat: {
    MALE: { low: 10, high: 20, unit: '%' },
    FEMALE: { low: 18, high: 28, unit: '%' },
    OTHER: { low: 14, high: 24, unit: '%' },
  },
  musclePct: {
    MALE: { low: 40, high: 55, unit: '%' },
    FEMALE: { low: 30, high: 45, unit: '%' },
    OTHER: { low: 35, high: 50, unit: '%' },
  },
  visceralFat: { low: 1, high: 9, unit: 'level' },
  bodyWater: {
    MALE: { low: 50, high: 65, unit: '%' },
    FEMALE: { low: 45, high: 60, unit: '%' },
    OTHER: { low: 47, high: 62, unit: '%' },
  },
  metabolicAge: {
    description: 'Should be ≤ chronological age',
    unit: 'years',
  },
  weight: {
    description: 'Based on BMI and height',
    unit: 'kg',
  },
}

export function getStatus(
  metric: string,
  value: number,
  gender: Gender = 'OTHER',
  chronologicalAge?: number
): HealthStatus {
  switch (metric) {
    case 'bmi': {
      const r = HEALTHY_RANGES.bmi
      if (value < r.low) return 'BELOW'
      if (value > r.high) return 'ABOVE'
      return 'HEALTHY'
    }
    case 'bodyFat': {
      const r = HEALTHY_RANGES.bodyFat[gender] ?? HEALTHY_RANGES.bodyFat.OTHER
      if (value < r.low) return 'BELOW'
      if (value > r.high) return 'ABOVE'
      return 'HEALTHY'
    }
    case 'musclePct': {
      const r = HEALTHY_RANGES.musclePct[gender] ?? HEALTHY_RANGES.musclePct.OTHER
      if (value < r.low) return 'BELOW'
      if (value > r.high) return 'ABOVE'
      return 'HEALTHY'
    }
    case 'visceralFat': {
      const r = HEALTHY_RANGES.visceralFat
      if (value < r.low) return 'BELOW'
      if (value > r.high) return 'ABOVE'
      return 'HEALTHY'
    }
    case 'bodyWater': {
      const r = HEALTHY_RANGES.bodyWater[gender] ?? HEALTHY_RANGES.bodyWater.OTHER
      if (value < r.low) return 'BELOW'
      if (value > r.high) return 'ABOVE'
      return 'HEALTHY'
    }
    case 'metabolicAge': {
      if (chronologicalAge == null) return 'HEALTHY'
      if (value <= chronologicalAge) return 'HEALTHY'
      return 'ABOVE'
    }
    default:
      return 'HEALTHY'
  }
}

export function getRangeText(metric: string, gender: Gender = 'OTHER'): string {
  switch (metric) {
    case 'bmi':
      return `${HEALTHY_RANGES.bmi.low}–${HEALTHY_RANGES.bmi.high} ${HEALTHY_RANGES.bmi.unit}`
    case 'bodyFat': {
      const r = HEALTHY_RANGES.bodyFat[gender] ?? HEALTHY_RANGES.bodyFat.OTHER
      return `${r.low}–${r.high}${r.unit}`
    }
    case 'musclePct': {
      const r = HEALTHY_RANGES.musclePct[gender] ?? HEALTHY_RANGES.musclePct.OTHER
      return `${r.low}–${r.high}${r.unit}`
    }
    case 'visceralFat':
      return `${HEALTHY_RANGES.visceralFat.low}–${HEALTHY_RANGES.visceralFat.high} ${HEALTHY_RANGES.visceralFat.unit}`
    case 'bodyWater': {
      const r = HEALTHY_RANGES.bodyWater[gender] ?? HEALTHY_RANGES.bodyWater.OTHER
      return `${r.low}–${r.high}${r.unit}`
    }
    case 'metabolicAge':
      return HEALTHY_RANGES.metabolicAge.description
    default:
      return '—'
  }
}
