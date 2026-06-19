// src/pdf/pages/Page3Progress.tsx
import React from 'react'
import { Page, View, Text } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { SectionHeader } from '../components/SectionHeader'
import { DeltaBadge } from '../components/DeltaBadge'
import { ComparisonBarChart } from '../components/ComparisonBarChart'
import type { ReportData } from '@/types'
import { formatDate } from '@/lib/utils/formatters'

interface Page3ProgressProps {
  data: ReportData
}

export function Page3Progress({ data }: Page3ProgressProps) {
  const { comparison, currentAssessment, previousAssessment, gymSettings, member } = data

  const isWeightLossGoal = member.goal === 'FAT_LOSS' || member.goal === 'RECOMPOSITION'

  // Determine if weight delta is an improvement based on goal
  function isWeightImprovement(delta: number | null): boolean {
    if (delta === null) return false
    if (isWeightLossGoal) return delta < 0
    if (member.goal === 'MUSCLE_GAIN') return delta > 0
    return Math.abs(delta) <= 1 // maintenance
  }

  const statusConfig = {
    EXCELLENT: { style: pdfStyles.statusExcellent, color: '#16a34a', label: '🏆 Excellent Progress' },
    GOOD:      { style: pdfStyles.statusGood,      color: '#15803d', label: '✓ Good Progress' },
    MODERATE:  { style: pdfStyles.statusModerate,  color: '#d97706', label: '~ Moderate Progress' },
    ATTENTION: { style: pdfStyles.statusAttention, color: '#dc2626', label: '⚠ Needs Attention' },
    BASELINE:  { style: pdfStyles.statusExcellent, color: '#2563eb', label: 'Baseline Assessment' },
  }

  const sc = statusConfig[comparison.overallStatus]

  return (
    <Page size="A4" style={pdfStyles.page}>
      {/* ── Baseline mode ─────────────────────────────────────────────────── */}
      {!comparison.hasComparison && (
        <>
          <SectionHeader
            title="Progress Analysis"
            backgroundColor={gymSettings.primaryColor}
          />

          <View style={pdfStyles.baselineBanner}>
            <Text style={pdfStyles.baselineBannerTitle}>
              📋 Baseline Assessment — First Record
            </Text>
            <Text style={pdfStyles.baselineBannerText}>
              This is the first recorded assessment for {member.name}.{'\n'}
              Future reports will include progress comparison against this baseline.
            </Text>
          </View>

          {/* Still show current values */}
          <SectionHeader title="Current Metrics" backgroundColor={gymSettings.primaryColor} />
          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableHeader}>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.col1]}>Metric</Text>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.col2]}>Current Value</Text>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.col3]}>Healthy Range</Text>
            </View>
            {[
              { label: 'Weight', value: `${currentAssessment.weight} kg`, range: 'Based on BMI & height' },
              { label: 'BMI', value: `${currentAssessment.bmi.toFixed(1)} kg/m²`, range: '18.5–24.9' },
              { label: 'Body Fat', value: `${currentAssessment.bodyFat.toFixed(1)}%`, range: member.gender === 'MALE' ? '10–20%' : '18–28%' },
              { label: 'Muscle %', value: `${currentAssessment.musclePct.toFixed(1)}%`, range: member.gender === 'MALE' ? '40–55%' : '30–45%' },
              { label: 'Visceral Fat', value: `${currentAssessment.visceralFat.toFixed(0)} level`, range: '1–9' },
              ...(currentAssessment.bodyWater != null ? [{ label: 'Body Water', value: `${currentAssessment.bodyWater.toFixed(1)}%`, range: member.gender === 'MALE' ? '50–65%' : '45–60%' }] : []),
            ].map((row, i) => (
              <View key={row.label} style={i % 2 === 0 ? pdfStyles.tableRow : pdfStyles.tableRowAlt}>
                <Text style={[pdfStyles.tableCell, pdfStyles.col1]}>{row.label}</Text>
                <Text style={[pdfStyles.tableCell, pdfStyles.col2, { textAlign: 'center', fontFamily: 'Helvetica-Bold' }]}>{row.value}</Text>
                <Text style={[pdfStyles.tableCell, pdfStyles.col3, { textAlign: 'center', color: '#6b7280' }]}>{row.range}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* ── Comparison mode ───────────────────────────────────────────────── */}
      {comparison.hasComparison && previousAssessment && (
        <>
          <SectionHeader
            title={`Progress Since ${formatDate(previousAssessment.date)} (${comparison.daysBetweenAssessments} days)`}
            backgroundColor={gymSettings.primaryColor}
          />

          {/* Overall Status Badge */}
          <View style={sc.style}>
            <Text style={[pdfStyles.statusText, { color: sc.color }]}>{sc.label}</Text>
          </View>

          {/* Comparison Table */}
          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableHeader}>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.col1]}>Metric</Text>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.col2]}>Previous</Text>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.col3]}>Current</Text>
              <Text style={[pdfStyles.tableHeaderCell, pdfStyles.col4]}>Change</Text>
            </View>

            {/* Weight */}
            <View style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, pdfStyles.col1]}>Weight</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.col2, { textAlign: 'center' }]}>{previousAssessment.weight.toFixed(1)} kg</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.col3, { textAlign: 'center', fontFamily: 'Helvetica-Bold' }]}>{currentAssessment.weight.toFixed(1)} kg</Text>
              <View style={[{ flex: 2, alignItems: 'center' }]}>
                <DeltaBadge delta={comparison.deltas.weight} isImprovement={isWeightImprovement(comparison.deltas.weight)} />
              </View>
            </View>

            {/* BMI */}
            <View style={pdfStyles.tableRowAlt}>
              <Text style={[pdfStyles.tableCell, pdfStyles.col1]}>BMI</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.col2, { textAlign: 'center' }]}>{previousAssessment.bmi.toFixed(1)}</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.col3, { textAlign: 'center', fontFamily: 'Helvetica-Bold' }]}>{currentAssessment.bmi.toFixed(1)}</Text>
              <View style={[{ flex: 2, alignItems: 'center' }]}>
                <DeltaBadge delta={comparison.deltas.bmi} isImprovement={(comparison.deltas.bmi ?? 0) < 0} />
              </View>
            </View>

            {/* Body Fat */}
            <View style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, pdfStyles.col1]}>Body Fat %</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.col2, { textAlign: 'center' }]}>{previousAssessment.bodyFat.toFixed(1)}%</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.col3, { textAlign: 'center', fontFamily: 'Helvetica-Bold' }]}>{currentAssessment.bodyFat.toFixed(1)}%</Text>
              <View style={[{ flex: 2, alignItems: 'center' }]}>
                <DeltaBadge delta={comparison.deltas.bodyFat} isImprovement={(comparison.deltas.bodyFat ?? 0) < 0} />
              </View>
            </View>

            {/* Muscle */}
            <View style={pdfStyles.tableRowAlt}>
              <Text style={[pdfStyles.tableCell, pdfStyles.col1]}>Muscle %</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.col2, { textAlign: 'center' }]}>{previousAssessment.musclePct.toFixed(1)}%</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.col3, { textAlign: 'center', fontFamily: 'Helvetica-Bold' }]}>{currentAssessment.musclePct.toFixed(1)}%</Text>
              <View style={[{ flex: 2, alignItems: 'center' }]}>
                <DeltaBadge delta={comparison.deltas.musclePct} isImprovement={(comparison.deltas.musclePct ?? 0) > 0} />
              </View>
            </View>

            {/* Visceral Fat */}
            <View style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, pdfStyles.col1]}>Visceral Fat</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.col2, { textAlign: 'center' }]}>{previousAssessment.visceralFat.toFixed(0)}</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.col3, { textAlign: 'center', fontFamily: 'Helvetica-Bold' }]}>{currentAssessment.visceralFat.toFixed(0)}</Text>
              <View style={[{ flex: 2, alignItems: 'center' }]}>
                <DeltaBadge delta={comparison.deltas.visceralFat} isImprovement={(comparison.deltas.visceralFat ?? 0) < 0} />
              </View>
            </View>

            {/* Subcutaneous Fat (optional) */}
            {comparison.deltas.subcutaneousFat !== null && previousAssessment.subcutaneousFat != null && (
              <View style={pdfStyles.tableRowAlt}>
                <Text style={[pdfStyles.tableCell, pdfStyles.col1]}>Subcutaneous Fat</Text>
                <Text style={[pdfStyles.tableCell, pdfStyles.col2, { textAlign: 'center' }]}>{previousAssessment.subcutaneousFat.toFixed(1)}%</Text>
                <Text style={[pdfStyles.tableCell, pdfStyles.col3, { textAlign: 'center', fontFamily: 'Helvetica-Bold' }]}>{currentAssessment.subcutaneousFat?.toFixed(1)}%</Text>
                <View style={[{ flex: 2, alignItems: 'center' }]}>
                  <DeltaBadge delta={comparison.deltas.subcutaneousFat} isImprovement={(comparison.deltas.subcutaneousFat ?? 0) < 0} />
                </View>
              </View>
            )}
          </View>

          {/* Comparison Bar Chart */}
          <SectionHeader title="Visual Comparison" backgroundColor={gymSettings.primaryColor} />
          <ComparisonBarChart
            primaryColor={gymSettings.primaryColor}
            metrics={[
              {
                label: 'Body Fat %',
                previous: previousAssessment.bodyFat,
                current: currentAssessment.bodyFat,
                maxValue: Math.max(previousAssessment.bodyFat, currentAssessment.bodyFat, 35),
                unit: '%',
                isImprovement: true,
              },
              {
                label: 'Muscle %',
                previous: previousAssessment.musclePct,
                current: currentAssessment.musclePct,
                maxValue: Math.max(previousAssessment.musclePct, currentAssessment.musclePct, 60),
                unit: '%',
                isImprovement: false,
              },
              {
                label: 'Visceral Fat',
                previous: previousAssessment.visceralFat,
                current: currentAssessment.visceralFat,
                maxValue: Math.max(previousAssessment.visceralFat, currentAssessment.visceralFat, 15),
                unit: '',
                isImprovement: true,
              },
            ]}
          />

          {/* Interpretation block */}
          {comparison.interpretations.length > 0 && (
            <View style={pdfStyles.interpretationBlock}>
              <Text style={pdfStyles.interpretationTitle}>Analysis & Insights</Text>
              {comparison.interpretations.map((text, i) => (
                <View key={i} style={pdfStyles.interpretationItem}>
                  <Text style={pdfStyles.interpretationBullet}>•</Text>
                  <Text style={pdfStyles.interpretationText}>{text}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.footerText}>{member.name} — {member.memberId}</Text>
        <Text style={pdfStyles.footerBrand}>{gymSettings.gymName}</Text>
      </View>
    </Page>
  )
}
