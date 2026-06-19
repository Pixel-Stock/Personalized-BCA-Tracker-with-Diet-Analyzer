// src/pdf/pages/Page2HealthMetrics.tsx
import React from 'react'
import { Page, View, Text } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { MetricRow } from '../components/MetricRow'
import { SectionHeader } from '../components/SectionHeader'
import { getStatus, getRangeText } from '@/lib/engines/healthRanges'
import type { ReportData } from '@/types'

interface Page2HealthMetricsProps {
  data: ReportData
}

export function Page2HealthMetrics({ data }: Page2HealthMetricsProps) {
  const { member, currentAssessment, gymSettings } = data
  const a = currentAssessment
  const g = member.gender

  const metrics = [
    {
      label: 'Body Mass Index (BMI)',
      value: `${a.bmi.toFixed(1)}`,
      unit: 'kg/m²',
      range: getRangeText('bmi', g),
      status: getStatus('bmi', a.bmi, g),
    },
    {
      label: 'Body Fat',
      value: `${a.bodyFat.toFixed(1)}%`,
      unit: '%',
      range: getRangeText('bodyFat', g),
      status: getStatus('bodyFat', a.bodyFat, g),
    },
    {
      label: 'Muscle Mass',
      value: `${a.musclePct.toFixed(1)}%`,
      unit: '%',
      range: getRangeText('musclePct', g),
      status: getStatus('musclePct', a.musclePct, g),
    },
    {
      label: 'Visceral Fat',
      value: `${a.visceralFat.toFixed(0)}`,
      unit: 'level',
      range: getRangeText('visceralFat', g),
      status: getStatus('visceralFat', a.visceralFat, g),
    },
    ...(a.bodyWater != null
      ? [{
          label: 'Body Water',
          value: `${a.bodyWater.toFixed(1)}%`,
          unit: '%',
          range: getRangeText('bodyWater', g),
          status: getStatus('bodyWater', a.bodyWater, g),
        }]
      : []),
    ...(a.metabolicAge != null
      ? [{
          label: 'Metabolic Age',
          value: `${a.metabolicAge} yrs`,
          unit: 'years',
          range: getRangeText('metabolicAge', g),
          status: getStatus('metabolicAge', a.metabolicAge, g, member.age),
        }]
      : []),
    ...(a.proteinPct != null
      ? [{
          label: 'Protein',
          value: `${a.proteinPct.toFixed(1)}%`,
          unit: '%',
          range: '16–20%',
          status: getStatus('bmi', a.proteinPct, g), // default healthy status
        }]
      : []),
    ...(a.boneMass != null
      ? [{
          label: 'Bone Mass',
          value: `${a.boneMass.toFixed(1)} kg`,
          unit: 'kg',
          range: g === 'MALE' ? '2.5–4.0 kg' : '1.8–3.2 kg',
          status: getStatus('bmi', a.boneMass, g),
        }]
      : []),
  ]

  return (
    <Page size="A4" style={pdfStyles.page}>
      <SectionHeader
        title="Health Metrics — Current Assessment"
        backgroundColor={gymSettings.primaryColor}
      />

      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 9, color: '#6b7280' }}>
          Assessment Date: {new Date(currentAssessment.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
          {'   '}|{'   '}Weight: {a.weight} kg
        </Text>
      </View>

      <View style={pdfStyles.metricGrid}>
        {metrics.map((m) => (
          <MetricRow
            key={m.label}
            label={m.label}
            value={m.value}
            range={m.range}
            status={m.status}
          />
        ))}
      </View>

      {/* Subcutaneous fat if available */}
      {a.subcutaneousFat != null && (
        <View style={{ marginTop: 16 }}>
          <SectionHeader title="Additional Metrics" backgroundColor={gymSettings.primaryColor} />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={[pdfStyles.metricCard, { width: '47%' }]}>
              <Text style={pdfStyles.metricLabel}>Subcutaneous Fat</Text>
              <Text style={pdfStyles.metricValue}>{a.subcutaneousFat.toFixed(1)}%</Text>
              <Text style={pdfStyles.metricRange}>External body fat layer</Text>
            </View>
            {a.bmr != null && (
              <View style={[pdfStyles.metricCard, { width: '47%' }]}>
                <Text style={pdfStyles.metricLabel}>Basal Metabolic Rate</Text>
                <Text style={pdfStyles.metricValue}>{Math.round(a.bmr)}</Text>
                <Text style={pdfStyles.metricRange}>kcal/day at rest</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.footerText}>
          {member.name} — {member.memberId}
        </Text>
        <Text style={pdfStyles.footerBrand}>{gymSettings.gymName}</Text>
      </View>
    </Page>
  )
}
