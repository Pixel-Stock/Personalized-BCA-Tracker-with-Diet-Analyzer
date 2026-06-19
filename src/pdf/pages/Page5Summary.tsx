// src/pdf/pages/Page5Summary.tsx
import React from 'react'
import { Page, View, Text } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { SectionHeader } from '../components/SectionHeader'
import { getStatus } from '@/lib/engines/healthRanges'
import type { ReportData } from '@/types'
import { addDays, format } from 'date-fns'

interface Page5SummaryProps {
  data: ReportData
}

export function Page5Summary({ data }: Page5SummaryProps) {
  const { member, currentAssessment, comparison, gymSettings } = data
  const a = currentAssessment
  const g = member.gender

  // Build priority recommendations based on current metrics
  const recommendations: string[] = []

  const visceralStatus = getStatus('visceralFat', a.visceralFat, g)
  const muscleStatus = getStatus('musclePct', a.musclePct, g)
  const bodyFatStatus = getStatus('bodyFat', a.bodyFat, g)
  const bodyWaterStatus = a.bodyWater != null ? getStatus('bodyWater', a.bodyWater, g) : 'HEALTHY'

  if (visceralStatus === 'ABOVE') {
    recommendations.push(
      'Prioritize 30 minutes of cardiovascular exercise 4× per week. Visceral fat responds strongly to aerobic activity and dietary changes.'
    )
  }

  if (muscleStatus === 'BELOW') {
    recommendations.push(
      'Increase resistance training frequency to at least 3 sessions per week. Focus on compound movements (squats, deadlifts, bench press) with progressive overload.'
    )
  }

  if (bodyFatStatus === 'ABOVE') {
    recommendations.push(
      `Maintain caloric deficit of 300–400 kcal/day as prescribed in your nutrition plan. Track food intake for at least 4 weeks for measurable results.`
    )
  }

  if (bodyWaterStatus === 'BELOW') {
    recommendations.push(
      `Increase daily water intake to ${data.nutrition.hydrationLitres} litres immediately. Dehydration reduces metabolism and impairs muscle recovery.`
    )
  }

  // If no specific issues, give general advice
  if (recommendations.length === 0) {
    recommendations.push(
      'Maintain your current training and nutrition consistency — your metrics are within healthy ranges.',
      'Consider progressive overload in your training — increase weights or reps every 2–3 weeks to continue progress.',
      `Keep your nutrition aligned with your ${member.goal === 'FAT_LOSS' ? 'fat loss' : member.goal === 'MUSCLE_GAIN' ? 'muscle gain' : 'body composition'} goal.`
    )
  }

  // Ensure max 3 recommendations
  const topRecs = recommendations.slice(0, 3)

  const nextAssessmentDate = format(
    addDays(new Date(a.date), 30),
    'dd MMMM yyyy'
  )

  const statusConfig = {
    EXCELLENT: { color: '#16a34a', label: 'Excellent — Keep it up!' },
    GOOD:      { color: '#15803d', label: 'Good — Solid progress!' },
    MODERATE:  { color: '#d97706', label: 'Moderate — Stay consistent!' },
    ATTENTION: { color: '#dc2626', label: 'Needs Attention — Refocus your routine.' },
    BASELINE:  { color: '#2563eb', label: 'Baseline Recorded — Your journey begins!' },
  }

  const sc = statusConfig[comparison.overallStatus]

  return (
    <Page size="A4" style={pdfStyles.page}>
      <SectionHeader
        title="Summary & Action Plan"
        backgroundColor={gymSettings.primaryColor}
      />

      {/* Overall Status */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 9, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase' }}>
          Overall Progress Status
        </Text>
        <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: sc.color }}>
          {sc.label}
        </Text>
      </View>

      {/* Priority Recommendations */}
      <SectionHeader title="Top Priority Recommendations" backgroundColor={gymSettings.primaryColor} />

      {topRecs.map((rec, i) => (
        <View key={i} style={pdfStyles.recommendationCard}>
          <View style={pdfStyles.recommendationNumber}>
            <Text style={pdfStyles.recommendationNumberText}>{i + 1}</Text>
          </View>
          <Text style={pdfStyles.recommendationText}>{rec}</Text>
        </View>
      ))}

      {/* Next Assessment */}
      <View style={{ marginTop: 20 }}>
        <View style={pdfStyles.nextAssessmentBox}>
          <Text style={pdfStyles.nextAssessmentLabel}>Recommended Next Assessment</Text>
          <Text style={pdfStyles.nextAssessmentDate}>{nextAssessmentDate}</Text>
          <Text style={{ fontSize: 9, color: '#2563eb', marginTop: 4 }}>
            Regular 30-day assessments provide the best tracking accuracy
          </Text>
        </View>
      </View>

      {/* Motivational Closing */}
      <Text style={pdfStyles.motivationalText}>
        "Consistency is the foundation of every transformation.{'\n'}
        See you at your next assessment."
      </Text>

      {/* Gym Contact Footer (larger) */}
      <View style={{
        borderTopWidth: 2,
        borderTopColor: gymSettings.primaryColor,
        paddingTop: 16,
        marginTop: 8,
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold', color: gymSettings.primaryColor, marginBottom: 4 }}>
          {gymSettings.gymName}
        </Text>
        {gymSettings.tagline && (
          <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>
            {gymSettings.tagline}
          </Text>
        )}
        {gymSettings.address && (
          <Text style={{ fontSize: 9, color: '#6b7280', marginBottom: 2 }}>{gymSettings.address}</Text>
        )}
        {gymSettings.phone && (
          <Text style={{ fontSize: 9, color: '#6b7280' }}>📞 {gymSettings.phone}</Text>
        )}
      </View>

      {/* Standard Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.footerText}>{member.name} — {member.memberId}</Text>
        <Text style={pdfStyles.footerBrand}>Generated by FitnessTouch</Text>
      </View>
    </Page>
  )
}
