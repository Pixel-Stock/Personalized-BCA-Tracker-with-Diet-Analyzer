'use client'
// src/components/members/MemberCard.tsx
import React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate, formatGoal } from '@/lib/utils/formatters'
import { differenceInDays } from 'date-fns'
import type { MemberListItem } from '@/types'

interface MemberCardProps {
  member: MemberListItem
}

const goalBadgeVariant = (goal: string) => {
  const map: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'neutral'> = {
    FAT_LOSS: 'warning',
    MUSCLE_GAIN: 'info',
    RECOMPOSITION: 'success',
    MAINTENANCE: 'neutral',
  }
  return map[goal] || 'neutral'
}

export function MemberCard({ member }: MemberCardProps) {
  const lastAssessment = member.assessments[0]
  const daysSinceLastAssessment = lastAssessment
    ? differenceInDays(new Date(), new Date(lastAssessment.date))
    : null
  const isDue = daysSinceLastAssessment === null || daysSinceLastAssessment > 30

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/members/${member.id}`}
              className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {member.name}
            </Link>
            {isDue && (
              <Badge variant="warning" className="text-xs">Due</Badge>
            )}
          </div>
          <span className="text-xs text-gray-500 font-mono">{member.memberId}</span>
        </div>
        <Badge variant={goalBadgeVariant(member.goal)}>
          {formatGoal(member.goal)}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-2.5">
          <span className="text-xs text-gray-500 block mb-0.5">Last Assessment</span>
          <span className="text-sm font-medium text-gray-800">
            {lastAssessment ? formatDate(lastAssessment.date) : 'None yet'}
          </span>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <span className="text-xs text-gray-500 block mb-0.5">Body Fat</span>
          <span className="text-sm font-medium text-gray-800">
            {lastAssessment ? `${lastAssessment.bodyFat.toFixed(1)}%` : '—'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={`/members/${member.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View Profile
          </Button>
        </Link>
        <Link href={`/members/${member.id}/assessment/new`} className="flex-1">
          <Button variant="primary" size="sm" className="w-full">
            + Assessment
          </Button>
        </Link>
      </div>
    </div>
  )
}
