'use client'
// src/components/members/AssessmentHistory.tsx
import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { AssessmentCard } from './AssessmentCard'
import { formatDate } from '@/lib/utils/formatters'
import type { Assessment } from '@/types'

interface AssessmentHistoryProps {
  assessments: Assessment[]
  memberId: string
}

export function AssessmentHistory({ assessments, memberId }: AssessmentHistoryProps) {
  if (assessments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm font-medium">No assessments yet</p>
        <p className="text-xs text-gray-400 mt-1">Record the first BCA to begin tracking progress</p>
      </div>
    )
  }

  // Chart data — chronological order (oldest first for chart)
  const chartData = [...assessments]
    .reverse()
    .map((a) => ({
      date: formatDate(a.date, 'dd MMM'),
      bodyFat: a.bodyFat,
      muscle: a.musclePct,
      weight: a.weight,
    }))

  return (
    <div>
      {/* Trend Chart */}
      {assessments.length >= 2 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Progress Trends</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#d1d5db" />
              <YAxis tick={{ fontSize: 11 }} stroke="#d1d5db" />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="bodyFat"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Body Fat %"
              />
              <Line
                type="monotone"
                dataKey="muscle"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Muscle %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Assessment List */}
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        Assessment History ({assessments.length})
      </h4>
      <div>
        {assessments.map((assessment, idx) => (
          <AssessmentCard
            key={assessment.id}
            assessment={assessment}
            memberId={memberId}
            isFirst={idx === 0}
          />
        ))}
      </div>
    </div>
  )
}
