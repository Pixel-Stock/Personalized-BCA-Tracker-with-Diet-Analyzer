// src/pdf/components/MetricRow.tsx
import React from 'react'
import { View, Text } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import type { HealthStatus } from '@/types'

interface MetricRowProps {
  label: string
  value: string
  range: string
  status: HealthStatus
}

export function MetricRow({ label, value, range, status }: MetricRowProps) {
  const badgeStyle =
    status === 'HEALTHY'
      ? pdfStyles.badgeHealthy
      : status === 'ABOVE'
      ? pdfStyles.badgeAbove
      : pdfStyles.badgeBelow

  const badgeTextStyle =
    status === 'HEALTHY'
      ? pdfStyles.badgeHealthyText
      : status === 'ABOVE'
      ? pdfStyles.badgeAboveText
      : pdfStyles.badgeBelowText

  const badgeLabel =
    status === 'HEALTHY' ? 'Healthy' : status === 'ABOVE' ? 'Above Range' : 'Below Range'

  return (
    <View style={pdfStyles.metricCard}>
      <Text style={pdfStyles.metricLabel}>{label}</Text>
      <Text style={pdfStyles.metricValue}>{value}</Text>
      <Text style={pdfStyles.metricRange}>Range: {range}</Text>
      <View style={badgeStyle}>
        <Text style={[pdfStyles.badgeText, badgeTextStyle]}>{badgeLabel}</Text>
      </View>
    </View>
  )
}
