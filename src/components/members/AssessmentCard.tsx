'use client'
// src/components/members/AssessmentCard.tsx
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils/formatters'
import type { Assessment } from '@/types'

interface AssessmentCardProps {
  assessment: Assessment
  memberId: string
  isFirst?: boolean
}

export function AssessmentCard({ assessment, memberId, isFirst }: AssessmentCardProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Timeline dot */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full border-2 ${isFirst ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`} />
        <div className="w-0.5 h-8 bg-gray-200 mt-1" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-800">{formatDate(assessment.date)}</span>
          {isFirst && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              Latest
            </span>
          )}
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>Weight: <strong className="text-gray-700">{assessment.weight}kg</strong></span>
          <span>Body Fat: <strong className="text-gray-700">{assessment.bodyFat.toFixed(1)}%</strong></span>
          <span>Muscle: <strong className="text-gray-700">{assessment.musclePct.toFixed(1)}%</strong></span>
          <span>Visceral: <strong className="text-gray-700">{assessment.visceralFat}</strong></span>
        </div>
      </div>

      {/* Actions */}
      <Link href={`/members/${memberId}/report/${assessment.id}`}>
        <Button variant="outline" size="sm">
          View Report
        </Button>
      </Link>
    </div>
  )
}
