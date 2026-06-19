// src/pdf/ReportDocument.tsx
// Root @react-pdf/renderer Document composing all 5 pages

import React from 'react'
import { Document } from '@react-pdf/renderer'
import { Page1Cover } from './pages/Page1Cover'
import { Page2HealthMetrics } from './pages/Page2HealthMetrics'
import { Page3Progress } from './pages/Page3Progress'
import { Page4Nutrition } from './pages/Page4Nutrition'
import { Page5Summary } from './pages/Page5Summary'
import type { ReportData } from '@/types'

interface ReportDocumentProps {
  data: ReportData
}

export function ReportDocument({ data }: ReportDocumentProps) {
  return (
    <Document
      title={`FitnessTouch Report — ${data.member.name}`}
      author={data.gymSettings.gymName}
      subject="Body Composition Assessment Report"
      creator="FitnessTouch"
      producer="FitnessTouch"
    >
      <Page1Cover data={data} />
      <Page2HealthMetrics data={data} />
      <Page3Progress data={data} />
      <Page4Nutrition data={data} />
      <Page5Summary data={data} />
    </Document>
  )
}
