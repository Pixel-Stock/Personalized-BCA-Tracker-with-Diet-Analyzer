// src/pdf/components/DeltaBadge.tsx
import React from 'react'
import { Text } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'

interface DeltaBadgeProps {
  delta: number | null
  isImprovement: boolean
}

export function DeltaBadge({ delta, isImprovement }: DeltaBadgeProps) {
  if (delta === null) {
    return <Text style={pdfStyles.deltaNeutral}>—</Text>
  }

  const sign = delta > 0 ? '+' : ''
  const arrow = delta > 0 ? '▲' : delta < 0 ? '▼' : '—'
  const text = `${arrow} ${sign}${delta.toFixed(1)}`

  const style = isImprovement ? pdfStyles.deltaGood : pdfStyles.deltaBad

  return <Text style={style}>{text}</Text>
}
