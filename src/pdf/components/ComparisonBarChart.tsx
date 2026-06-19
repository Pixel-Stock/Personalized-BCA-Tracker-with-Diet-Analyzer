// src/pdf/components/ComparisonBarChart.tsx
// Custom horizontal bar chart built with react-pdf SVG primitives ONLY
// No Recharts, no Chart.js, no HTML — pure @react-pdf/renderer Svg elements

import React from 'react'
import { View, Svg, Rect, G, Text, Line } from '@react-pdf/renderer'

interface ChartMetric {
  label: string
  previous: number
  current: number
  maxValue: number
  unit: string
  isImprovement: boolean // true if decrease is good (bodyFat, visceralFat), false if increase is good (musclePct)
}

interface ComparisonBarChartProps {
  metrics: ChartMetric[]
  primaryColor?: string
}

const CHART_WIDTH = 460
const BAR_HEIGHT = 18
const BAR_GAP = 36
const LABEL_WIDTH = 100
const BAR_AREA_WIDTH = CHART_WIDTH - LABEL_WIDTH - 80 // 80 for value labels
const CHART_PADDING_TOP = 10

export function ComparisonBarChart({ metrics, primaryColor = '#1a56db' }: ComparisonBarChartProps) {
  const chartHeight = metrics.length * BAR_GAP + CHART_PADDING_TOP + 20

  return (
    <View style={{ marginBottom: 16 }}>
      <Svg width={CHART_WIDTH} height={chartHeight}>
        {metrics.map((metric, index) => {
          const y = CHART_PADDING_TOP + index * BAR_GAP

          const currentPct = Math.min(metric.current / metric.maxValue, 1)
          const previousPct = Math.min(metric.previous / metric.maxValue, 1)

          const currentBarWidth = Math.max(currentPct * BAR_AREA_WIDTH, 2)
          const previousBarWidth = Math.max(previousPct * BAR_AREA_WIDTH, 2)

          // Color logic: if improvement direction is "decrease", green = current < previous
          const isPositiveChange = metric.isImprovement
            ? metric.current <= metric.previous  // decrease is good
            : metric.current >= metric.previous  // increase is good

          const barColor = isPositiveChange ? '#16a34a' : '#dc2626'
          const ghostColor = '#e5e7eb'

          return (
            <G key={metric.label}>
              {/* Label */}
              <Text
                x={0}
                y={y + BAR_HEIGHT / 2 + 4}
                style={{ fontSize: 8, fill: '#374151', fontFamily: 'Helvetica' }}
              >
                {metric.label}
              </Text>

              {/* Ghost bar (previous value) */}
              <Rect
                x={LABEL_WIDTH}
                y={y}
                width={previousBarWidth}
                height={BAR_HEIGHT}
                fill={ghostColor}
                rx={3}
                ry={3}
              />

              {/* Current value bar */}
              <Rect
                x={LABEL_WIDTH}
                y={y + 4}
                width={currentBarWidth}
                height={BAR_HEIGHT - 8}
                fill={barColor}
                rx={2}
                ry={2}
              />

              {/* Current value label */}
              <Text
                x={LABEL_WIDTH + BAR_AREA_WIDTH + 8}
                y={y + BAR_HEIGHT / 2 + 4}
                style={{ fontSize: 9, fill: barColor, fontFamily: 'Helvetica-Bold' }}
              >
                {metric.current.toFixed(1)}{metric.unit}
              </Text>

              {/* Previous value label (smaller) */}
              <Text
                x={LABEL_WIDTH + BAR_AREA_WIDTH + 8}
                y={y + BAR_HEIGHT / 2 + 14}
                style={{ fontSize: 7, fill: '#9ca3af', fontFamily: 'Helvetica' }}
              >
                was {metric.previous.toFixed(1)}{metric.unit}
              </Text>

              {/* Separator line */}
              {index < metrics.length - 1 && (
                <Line
                  x1={0}
                  y1={y + BAR_GAP - 4}
                  x2={CHART_WIDTH}
                  y2={y + BAR_GAP - 4}
                  strokeWidth={0.5}
                  stroke="#f3f4f6"
                />
              )}
            </G>
          )
        })}
      </Svg>

      {/* Legend */}
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 4, paddingLeft: LABEL_WIDTH }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Svg width={16} height={10}>
            <Rect x={0} y={0} width={16} height={10} fill="#e5e7eb" rx={2} ry={2} />
          </Svg>
          {/* Can't use Text outside SVG easily in react-pdf, so we use a View/Text */}
        </View>
      </View>
    </View>
  )
}
